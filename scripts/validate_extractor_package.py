#!/usr/bin/env python3
"""Offline integrity checks for the Requirement Extractor package."""

from __future__ import annotations

import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PROMPT = ROOT / "prompts" / "requirement-extractor-v0.8.md"
FIXTURES = ROOT / "evaluation" / "fixtures" / "t01-t10-extractor-cases.json"

REQUIRED_PROMPT_PHRASES = [
    "Every extracted item must include at least one verbatim quote",
    "Preserve names, numbers, dates, deadlines, API versions, thresholds, units",
    "Do not add requirements",
    "Unspecified",
    "stated",
    "suggested",
    "ambiguous",
    "contradictory",
    "Do not resolve contradictions",
    "no_requirements",
    "Return JSON only",
    "requirement-extraction.schema.json",
    "{{run_id}}",
    "{{source_name}}",
    "{{source_location}}",
    "{{input_type}}",
    "{{source_text}}",
    "extraction_status` must be exactly `complete`, `partial`, or `no_requirements`",
    "FR-001`, never `FR001`",
    "confidence` must be a JSON number from `0` through `1`",
    "MISS-001",
    "extract the capability as a `functional_requirement`",
    "missing information must not replace the risk",
    "Do not return `partial` solely because",
]


def main() -> int:
    failures: list[str] = []
    prompt_text = PROMPT.read_text(encoding="utf-8")
    fixture_data = json.loads(FIXTURES.read_text(encoding="utf-8"))

    for phrase in REQUIRED_PROMPT_PHRASES:
        if phrase not in prompt_text:
            failures.append(f"Prompt is missing required phrase: {phrase}")

    cases = fixture_data.get("cases", [])
    expected_ids = [f"T{number}" for number in range(1, 11)]
    actual_ids = [case.get("test_id") for case in cases]
    if actual_ids != expected_ids:
        failures.append(f"Expected ordered test IDs {expected_ids}, found {actual_ids}")

    required_case_fields = {
        "test_id",
        "input",
        "expected_status",
        "required_exact_values",
        "required_item_types",
        "required_behaviors",
        "prohibited_content",
    }
    valid_statuses = {"complete", "partial", "no_requirements"}
    for case in cases:
        missing = required_case_fields - case.keys()
        if missing:
            failures.append(f"{case.get('test_id', '<unknown>')} missing fields: {sorted(missing)}")
        if case.get("expected_status") not in valid_statuses:
            failures.append(f"{case.get('test_id')} has invalid expected_status")
        if not case.get("input", "").strip():
            failures.append(f"{case.get('test_id')} has empty input")
        if not case.get("required_behaviors"):
            failures.append(f"{case.get('test_id')} has no required behaviors")
        if not case.get("prohibited_content"):
            failures.append(f"{case.get('test_id')} has no prohibited-content checks")

    if failures:
        print("EXTRACTOR PACKAGE VALIDATION FAILED", file=sys.stderr)
        for failure in failures:
            print(f"- {failure}", file=sys.stderr)
        return 1

    print(f"Prompt coverage OK: {len(REQUIRED_PROMPT_PHRASES)} required controls found.")
    print(f"Fixture coverage OK: {len(cases)} ordered cases cover T1-T10.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
