#!/usr/bin/env python3
"""Fail-closed validation for the 2026-08-07 realistic stakeholder clarifications."""

from __future__ import annotations

import copy
import hashlib
import json
from pathlib import Path

from jsonschema import Draft202012Validator, FormatChecker


ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "evaluation/fixtures/multi-source/realistic-v1"
CANONICAL_PATH = BASE / "stakeholder-clarification-decisions-2026-08-07.json"
EXPECTED_PATH = BASE / "expected-clarification-resolution.json"
HUMAN_PATH = BASE / "stakeholder-clarifications-2026-08-07.md"
PACKET_V1_PATH = BASE / "source-packet.json"
PACKET_V2_PATH = BASE / "source-packet-v2.json"
DECISION_SCHEMA_PATH = ROOT / "schemas/clarification-decisions.schema.json"
PACKET_SCHEMA_PATH = ROOT / "schemas/source-packet.schema.json"

EXPECTED_TEXT = {
    "GAP-001": "Fixed dashboard layout for the first release.",
    "GAP-002": "Defer churn-threshold alerting; reconsider only after defining the churn metric/calculation, measurement period, threshold, recipients, and notification channel.",
    "GAP-003": "Dashboard pages must load in under 3 seconds.",
    "GAP-004": "Use precomputed warehouse data for dashboard reporting.",
    "GAP-005": "Defer the undefined AI capability to a later discovery phase.",
    "GAP-006": "Generate XLSX with formula preservation and label the action “Export to Excel”; this supersedes the earlier proposed “Export to CSV” label.",
    "GAP-007": "Hybrid refresh: 15-minute automatic refresh plus manual refresh of the latest available precomputed warehouse data, a last-updated timestamp, and protection against excessive repeated requests; no direct live-database query.",
    "GAP-008": "Budget remains a controlled TBD; owner Sarah; decision deadline 2026-08-31.",
    "GAP-009": "Sarah owns design follow-up; Lisa remains responsible for providing designs.",
    "GAP-010": "Designs complete 2026-08-21; internal basic version 2026-09-04; launch 2026-09-30. These supersede expired/general milestone wording.",
    "GAP-011": "Defer churn prediction to a later discovery phase until inputs, users, outputs, feasibility, and minimum accuracy are defined.",
    "GAP-012": "Defer white-labeling to a later release.",
    "GAP-013": "Deliverable mapping approved: 2026-08-21 completed dashboard designs; 2026-09-04 internal basic version with fixed layout, five core metrics, precomputed warehouse data, 15-minute auto-refresh, manual refresh, and last-updated timestamp; 2026-09-30 first production release with all approved first-release requirements.",
    "GAP-014": "Defer SPA versus server-rendered pages to a technical evaluation owned by Raj, due 2026-08-14.",
}

EXPECTED_SUPERSESSIONS = {
    "GAP-006": {("SRC-REALISTIC-MT-001", "line:82")},
    "GAP-007": {
        ("SRC-REALISTIC-MT-001", "line:52"),
        ("SRC-REALISTIC-MT-001", "line:58"),
        ("SRC-REALISTIC-MT-001", "line:62"),
    },
    "GAP-010": {
        ("SRC-REALISTIC-SN-001", "line:34"),
        ("SRC-REALISTIC-MT-001", "line:24"),
        ("SRC-REALISTIC-PB-001", "line:26"),
    },
}


def load(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def schema_errors(instance: dict, schema: dict) -> list[str]:
    validator = Draft202012Validator(schema, format_checker=FormatChecker())
    return [error.message for error in validator.iter_errors(instance)]


def citation_index(packet: dict) -> dict[tuple[str, str], dict]:
    result = {}
    for source in packet["sources"]:
        for citation in source["citations"]:
            result[(source["source_id"], citation["location"])] = {
                "source_id": source["source_id"],
                "source_name": source["source_name"],
                "location": citation["location"],
                "quote": citation["quote"],
                "content_hash": source["content_hash"],
            }
    return result


def validate(
    canonical: dict,
    expected: dict,
    packet_v1: dict,
    packet_v2: dict,
    human_bytes: bytes,
) -> None:
    decision_schema = load(DECISION_SCHEMA_PATH)
    packet_schema = load(PACKET_SCHEMA_PATH)
    errors = schema_errors(canonical, decision_schema)
    errors += schema_errors(expected, decision_schema)
    errors += schema_errors(packet_v2, packet_schema)
    if errors:
        raise ValueError("schema failure: " + "; ".join(errors))

    if canonical["artifact_type"] != "stakeholder_clarification_decisions":
        raise ValueError("canonical artifact type")
    if expected["artifact_type"] != "expected_clarification_resolution":
        raise ValueError("expected artifact type")
    if canonical["decisions"] != expected["decisions"]:
        raise ValueError("expected resolution diverges from canonical decisions")

    decisions = canonical["decisions"]
    by_gap = {decision["gap_id"]: decision for decision in decisions}
    if len(by_gap) != 14 or set(by_gap) != set(EXPECTED_TEXT):
        raise ValueError("decision coverage must be exactly GAP-001 through GAP-014")
    for gap_id, text in EXPECTED_TEXT.items():
        decision = by_gap[gap_id]
        expected_id = f"DEC-2026-08-07-{gap_id}"
        if decision["decision_id"] != expected_id:
            raise ValueError(f"stable ID mismatch for {gap_id}")
        if decision["decision_maker"] != "Vipin" or decision["decision_date"] != "2026-08-07":
            raise ValueError(f"decision authority mismatch for {gap_id}")
        if decision["decision_text"] != text:
            raise ValueError(f"unsupported or altered decision for {gap_id}")
        if decision["runtime_status"] != "pending_n8n_verification":
            raise ValueError(f"runtime resolution claimed for {gap_id}")
        actual_supersessions = {
            (entry["source_id"], entry["location"])
            for entry in decision["supersedes"]
        }
        if actual_supersessions != EXPECTED_SUPERSESSIONS.get(gap_id, set()):
            raise ValueError(f"supersession mismatch for {gap_id}")

    v1_index = citation_index(packet_v1)
    human_hash = hashlib.sha256(human_bytes).hexdigest()
    human_text = human_bytes.decode("utf-8")
    human_lines = human_text.splitlines()
    for decision in decisions:
        for evidence in decision["original_evidence"]:
            key = (evidence["source_id"], evidence["location"])
            if key not in v1_index or evidence != v1_index[key]:
                raise ValueError(f"original citation mismatch for {decision['gap_id']} {key}")
        for superseded in decision["supersedes"]:
            key = (superseded["source_id"], superseded["location"])
            original = {key_name: superseded[key_name] for key_name in ("source_id", "source_name", "location", "quote")}
            expected_original = {key_name: v1_index[key][key_name] for key_name in ("source_id", "source_name", "location", "quote")}
            if original != expected_original:
                raise ValueError(f"superseded citation mismatch for {decision['gap_id']} {key}")
        citation = decision["clarification_source_citation"]
        line_number = int(citation["location"].split(":", 1)[1])
        if citation["content_hash"] != f"sha256:{human_hash}" or human_lines[line_number - 1] != citation["quote"]:
            raise ValueError(f"clarification citation/hash mismatch for {decision['gap_id']}")
        if citation["quote"] != f"- {decision['decision_id']}: {decision['decision_text']}":
            raise ValueError(f"clarification source text mismatch for {decision['gap_id']}")

    if packet_v2["packet_id"] != "SP-REALISTIC-PB-MT-SN-CLAR-V2" or packet_v2["run_id"] != "RUN-REALISTIC-MULTI-SOURCE-V2":
        raise ValueError("packet v2 identity")
    if packet_v2["sources"][:3] != packet_v1["sources"]:
        raise ValueError("original PB/MT/SN packet content changed")
    if len(packet_v2["sources"]) != 4:
        raise ValueError("packet v2 source count")
    clarification = packet_v2["sources"][3]
    if clarification["source_id"] != "SRC-REALISTIC-CLAR-001" or clarification["source_type"] != "stakeholder_clarification":
        raise ValueError("clarification source identity")
    if clarification["raw_text"] != human_text or clarification["content_hash"] != f"sha256:{human_hash}":
        raise ValueError("clarification source content/hash mismatch")
    if len(clarification["citations"]) != 14:
        raise ValueError("clarification source citation coverage")


def must_fail(label: str, mutate) -> None:
    canonical = load(CANONICAL_PATH)
    expected = load(EXPECTED_PATH)
    packet_v1 = load(PACKET_V1_PATH)
    packet_v2 = load(PACKET_V2_PATH)
    human_bytes = HUMAN_PATH.read_bytes()
    canonical, expected, packet_v1, packet_v2, human_bytes = mutate(
        canonical, expected, packet_v1, packet_v2, human_bytes
    )
    try:
        validate(canonical, expected, packet_v1, packet_v2, human_bytes)
    except ValueError:
        return
    raise AssertionError(f"negative test did not fail closed: {label}")


def main() -> int:
    canonical = load(CANONICAL_PATH)
    expected = load(EXPECTED_PATH)
    packet_v1 = load(PACKET_V1_PATH)
    packet_v2 = load(PACKET_V2_PATH)
    human_bytes = HUMAN_PATH.read_bytes()
    validate(canonical, expected, packet_v1, packet_v2, human_bytes)

    def missing_decision(c, e, p1, p2, h):
        c["decisions"].pop()
        return c, e, p1, p2, h

    def bad_id(c, e, p1, p2, h):
        c["decisions"][0]["decision_id"] = "DEC-BAD"
        return c, e, p1, p2, h

    def bad_date(c, e, p1, p2, h):
        c["decisions"][0]["decision_date"] = "2026-08-08"
        return c, e, p1, p2, h

    def bad_maker(c, e, p1, p2, h):
        c["decisions"][0]["decision_maker"] = "Unknown"
        return c, e, p1, p2, h

    def altered_citation(c, e, p1, p2, h):
        c["decisions"][0]["original_evidence"][0]["quote"] += " altered"
        return c, e, p1, p2, h

    def missing_supersession(c, e, p1, p2, h):
        next(d for d in c["decisions"] if d["gap_id"] == "GAP-006")["supersedes"] = []
        return c, e, p1, p2, h

    def altered_hash(c, e, p1, p2, h):
        p2["sources"][3]["content_hash"] = "sha256:" + "0" * 64
        return c, e, p1, p2, h

    def unsupported_decision(c, e, p1, p2, h):
        c["decisions"][0]["decision_text"] = "Invented alternative."
        return c, e, p1, p2, h

    for label, mutation in (
        ("missing decision", missing_decision),
        ("bad stable ID", bad_id),
        ("bad date", bad_date),
        ("bad decision maker", bad_maker),
        ("altered citation", altered_citation),
        ("missing supersession", missing_supersession),
        ("hash mismatch", altered_hash),
        ("unsupported decision", unsupported_decision),
    ):
        must_fail(label, mutation)

    digest = hashlib.sha256(human_bytes).hexdigest()
    print("CLARIFICATION ARTIFACT OK: 14/14 decisions, stable IDs, Vipin, 2026-08-07.")
    print("CITATIONS OK: original PB/MT/SN evidence and exact locations preserved.")
    print("SUPERSESSION OK: GAP-006, GAP-007 and GAP-010 retain superseded source history.")
    print(f"PACKET V2 OK: 4 sources; clarification SHA-256 {digest}.")
    print("FAIL-CLOSED OK: coverage, ID, date, maker, citation, supersession, hash and unsupported-decision mutations rejected.")
    print("GROUNDING: 100%; unsupported decisions: 0; runtime status: pending n8n verification.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
