#!/usr/bin/env python3
"""Validate the controlled T1 PB+MT+SN parity foundation and negative cases."""

from __future__ import annotations

import copy
import hashlib
import json
import sys
from pathlib import Path

from jsonschema import Draft202012Validator, FormatChecker


ROOT = Path(__file__).resolve().parents[1]
FIXTURE_DIR = ROOT / "evaluation" / "fixtures" / "multi-source" / "t1"
PACKET_PATH = FIXTURE_DIR / "source-packet.json"
EXPECTED_PATH = FIXTURE_DIR / "expected-requirement-extraction.json"
SCHEMA_PATH = ROOT / "schemas" / "source-packet.schema.json"
EXTRACTION_SCHEMA_PATH = ROOT / "schemas" / "requirement-extraction.schema.json"
CONTROL_PATH = ROOT / "evaluation" / "fixtures" / "t01-t10-extractor-cases.json"

REQUIRED_SOURCE_TYPES = {"product_brief", "meeting_transcript", "stakeholder_notes"}
APPROVED_FACTS = {
    "FR-001": "Users should be able to filter reports by date range, category, and status.",
    "NFR-001": "Results must load in under 2 seconds.",
    "STK-001": "Sarah is the PM.",
    "DDL-001": "The deadline is Q3.",
}
CONTROL_EXACT_VALUES = {"date range", "category", "status", "under 2 seconds", "Sarah", "Q3"}


class ValidationFailure(ValueError):
    pass


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def sha256_text(value: str) -> str:
    return "sha256:" + hashlib.sha256(value.encode("utf-8")).hexdigest()


def schema_errors(instance: dict, schema_path: Path) -> list[str]:
    validator = Draft202012Validator(load_json(schema_path), format_checker=FormatChecker())
    return [error.message for error in validator.iter_errors(instance)]


def validate_packet(packet: dict) -> None:
    errors = schema_errors(packet, SCHEMA_PATH)
    if errors:
        raise ValidationFailure("schema: " + "; ".join(errors))

    sources = packet["sources"]
    source_ids = [source["source_id"] for source in sources]
    if len(source_ids) != len(set(source_ids)):
        raise ValidationFailure("duplicate source IDs")
    source_types = {source["source_type"] for source in sources}
    missing_types = REQUIRED_SOURCE_TYPES - source_types
    if missing_types:
        raise ValidationFailure(f"missing sources: {sorted(missing_types)}")
    if source_types != REQUIRED_SOURCE_TYPES:
        raise ValidationFailure("production packet must contain only PB, MT and SN")
    if packet["producer"] != "production_multi_source":
        raise ValidationFailure("T1 parity packet must use the production multi-source route")

    for source in sources:
        fixture_path = ROOT / source["provenance"]["fixture_path"]
        raw_bytes = fixture_path.read_bytes()
        if raw_bytes.decode("utf-8") != source["raw_text"]:
            raise ValidationFailure(f"raw text mismatch for {source['source_id']}")
        actual_hash = "sha256:" + hashlib.sha256(raw_bytes).hexdigest()
        if actual_hash != source["content_hash"] or sha256_text(source["raw_text"]) != source["content_hash"]:
            raise ValidationFailure(f"content/hash mismatch for {source['source_id']}")
        lines = source["raw_text"].splitlines()
        for citation in source["citations"]:
            line_number = int(citation["location"].split(":", 1)[1])
            if line_number > len(lines) or lines[line_number - 1] != citation["quote"]:
                raise ValidationFailure(f"citation preservation failed for {source['source_id']}")


def validate_extraction(packet: dict, extraction: dict) -> None:
    errors = schema_errors(extraction, EXTRACTION_SCHEMA_PATH)
    if errors:
        raise ValidationFailure("extraction schema: " + "; ".join(errors))
    actual = {item["id"]: item["statement"] for item in extraction["items"]}
    if actual != APPROVED_FACTS:
        raise ValidationFailure(f"approved fact parity failed: {actual}")

    sources = {source["source_id"]: source for source in packet["sources"]}
    for item in extraction["items"]:
        for evidence in item["evidence"]:
            source = sources.get(evidence.get("source_id"))
            if source is None:
                raise ValidationFailure(f"unknown source ID in {item['id']}")
            if evidence.get("source_type") != source["source_type"]:
                raise ValidationFailure(f"source type not preserved for {item['id']}")
            if evidence.get("source_name") != source["source_name"]:
                raise ValidationFailure(f"source name not preserved for {item['id']}")
            if evidence.get("content_hash") != source["content_hash"]:
                raise ValidationFailure(f"source hash not preserved for {item['id']}")
            matching = [
                citation
                for citation in source["citations"]
                if citation["quote"] == evidence["quote"]
                and citation["location"] == evidence["location"]
            ]
            if not matching:
                raise ValidationFailure(f"citation not preserved for {item['id']}")


def expect_failure(label: str, packet: dict, extraction: dict, expected: str) -> None:
    try:
        validate_packet(packet)
        validate_extraction(packet, extraction)
    except ValidationFailure as error:
        if expected not in str(error):
            raise ValidationFailure(f"{label} failed for wrong reason: {error}") from error
        print(f"NEGATIVE OK {label}: {error}")
        return
    raise ValidationFailure(f"{label} was not rejected")


def main() -> int:
    try:
        packet = load_json(PACKET_PATH)
        extraction = load_json(EXPECTED_PATH)
        validate_packet(packet)
        validate_extraction(packet, extraction)

        control_cases = load_json(CONTROL_PATH)["cases"]
        control_t1 = next(case for case in control_cases if case["test_id"] == "T1")
        if set(control_t1["required_exact_values"]) != CONTROL_EXACT_VALUES:
            raise ValidationFailure("evaluation control does not preserve T1 logical values")
        if any(source["source_type"] == "evaluation_test" for source in packet["sources"]):
            raise ValidationFailure("evaluation control was combined with production sources")

        missing = copy.deepcopy(packet)
        missing["sources"] = missing["sources"][:-1]
        expect_failure("missing source", missing, extraction, "missing sources")

        duplicate = copy.deepcopy(packet)
        duplicate["sources"][1]["source_id"] = duplicate["sources"][0]["source_id"]
        expect_failure("duplicate source ID", duplicate, extraction, "duplicate source IDs")

        altered = copy.deepcopy(packet)
        altered["sources"][0]["raw_text"] += "Altered.\n"
        expect_failure("altered content/hash", altered, extraction, "raw text mismatch")

        broken_citation = copy.deepcopy(extraction)
        broken_citation["items"][0]["evidence"][0]["location"] = "line:2"
        expect_failure("citation preservation", packet, broken_citation, "citation not preserved")

        print("POSITIVE OK T1 PB+MT+SN packet and unified extraction preserve all four approved facts.")
        print("GROUNDING OK 100%; unsupported claims: 0")
        return 0
    except (OSError, KeyError, StopIteration, ValidationFailure, json.JSONDecodeError) as error:
        print(f"T1 MULTI-SOURCE PARITY VALIDATION FAILED: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
