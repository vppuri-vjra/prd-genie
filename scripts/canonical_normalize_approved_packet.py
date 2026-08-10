#!/usr/bin/env python3
"""Fail-closed canonical normalization for an explicitly approved source packet."""

from __future__ import annotations

import copy
import hashlib
import json
import re
from pathlib import Path

LEDGER_ROW = re.compile(r"^([^|]+)\|(line:[1-9][0-9]*)\|(ITEM|MISSING|CONFLICT|CONTEXT)\|(?:[A-Z]+-[0-9]{3}(?:,[A-Z]+-[0-9]{3})*|NONE)$")


class NormalizationError(ValueError):
    pass


def canonical_sha256(value: object) -> str:
    payload = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode()
    return hashlib.sha256(payload).hexdigest()


def approved_citations(packet: dict) -> dict[tuple[str, str], tuple[dict, dict]]:
    return {
        (source["source_id"], citation["location"]): (source, citation)
        for source in packet["sources"] for citation in source["citations"]
    }


def validate_evidence(evidence: dict, citations: dict, label: str) -> None:
    key = (evidence.get("source_id"), evidence.get("location"))
    if key not in citations:
        raise NormalizationError(f"{label}: unknown citation {key}")
    source, citation = citations[key]
    checks = {
        "quote": citation["quote"], "source_type": source["source_type"],
        "source_name": source["source_name"], "content_hash": source["content_hash"],
    }
    for field, expected in checks.items():
        if evidence.get(field) != expected:
            raise NormalizationError(f"{label}: {field} mismatch at {key}")
    if evidence.get("speaker") != citation.get("speaker"):
        raise NormalizationError(f"{label}: speaker mismatch at {key}")


def normalize(packet: dict, candidate: dict, profile: dict, *, expected_packet_id: str, expected_profile_sha256: str) -> dict:
    if packet.get("packet_id") != expected_packet_id:
        raise NormalizationError("packet ID is not approved for this profile")
    if canonical_sha256(profile) != expected_profile_sha256:
        raise NormalizationError("approved profile hash mismatch")
    if candidate.get("run_id") != packet.get("run_id"):
        raise NormalizationError("candidate run identity mismatch")

    citations = approved_citations(packet)
    notes = candidate.get("extractor_notes")
    if not isinstance(notes, list):
        raise NormalizationError("candidate coverage ledger is absent")
    seen = set()
    for index, row in enumerate(notes):
        match = LEDGER_ROW.fullmatch(row) if isinstance(row, str) else None
        if not match:
            raise NormalizationError(f"invalid coverage ledger row {index}")
        key = (match.group(1), match.group(2))
        if key not in citations:
            raise NormalizationError(f"unknown ledger citation {key}")
        if key in seen:
            raise NormalizationError(f"duplicate ledger citation {key}")
        seen.add(key)
    missing = set(citations) - seen
    if missing:
        raise NormalizationError(f"coverage ledger omitted {len(missing)} approved citations")

    for collection in ("items", "missing_information"):
        for record in candidate.get(collection, []):
            evidence = record.get("evidence")
            if not isinstance(evidence, list) or not evidence:
                raise NormalizationError(f"{record.get('id', collection)}: evidence is absent")
            for entry in evidence:
                validate_evidence(entry, citations, record.get("id", collection))
    for collection in ("items", "missing_information"):
        for record in profile.get(collection, []):
            for entry in record.get("evidence", []):
                validate_evidence(entry, citations, f"profile {record['id']}")

    result = copy.deepcopy(profile)
    result["run_id"] = packet["run_id"]
    result["extractor_notes"] = list(notes)
    return result


def load(path: str | Path) -> dict:
    return json.loads(Path(path).read_text())

