#!/usr/bin/env python3
"""Validate PRD Genie schemas and all contract examples."""

from __future__ import annotations

import json
import sys
from pathlib import Path

from jsonschema import Draft202012Validator, FormatChecker


ROOT = Path(__file__).resolve().parents[1]
SCHEMA_DIR = ROOT / "schemas"
EXAMPLE_DIR = ROOT / "examples" / "contracts"

EXAMPLE_TO_SCHEMA = {
    "workflow-input": "workflow-input.schema.json",
    "requirement-extraction": "requirement-extraction.schema.json",
    "gap-analysis": "gap-analysis.schema.json",
    "human-review": "human-review.schema.json",
    "prd-output": "prd-output.schema.json",
    "story-breakdown": "story-breakdown.schema.json",
    "evaluation-result": "evaluation-result.schema.json",
}

EXACT_EXAMPLE_TO_SCHEMA = {
    "t1-orchestration-stage-result.json": "orchestration-stage-result.schema.json",
    "t1-requirement-extractor-child-input.json": "workflow-input.schema.json",
}


def load_json(path: Path) -> dict:
    with path.open(encoding="utf-8") as stream:
        return json.load(stream)


def schema_for_example(path: Path) -> Path:
    if path.name in EXACT_EXAMPLE_TO_SCHEMA:
        return SCHEMA_DIR / EXACT_EXAMPLE_TO_SCHEMA[path.name]
    for suffix, schema_name in EXAMPLE_TO_SCHEMA.items():
        if path.stem.endswith(suffix):
            return SCHEMA_DIR / schema_name
    raise ValueError(f"No schema mapping for {path.name}")


def main() -> int:
    failures: list[str] = []
    schema_paths = sorted(SCHEMA_DIR.glob("*.schema.json"))
    example_paths = sorted(EXAMPLE_DIR.glob("*.json"))

    if len(schema_paths) != 11:
        failures.append(f"Expected 11 schemas, found {len(schema_paths)}")

    for schema_path in schema_paths:
        try:
            Draft202012Validator.check_schema(load_json(schema_path))
            print(f"SCHEMA OK  {schema_path.relative_to(ROOT)}")
        except Exception as error:  # validation output must include the file
            failures.append(f"{schema_path.name}: invalid schema: {error}")

    for example_path in example_paths:
        try:
            schema_path = schema_for_example(example_path)
            validator = Draft202012Validator(
                load_json(schema_path), format_checker=FormatChecker()
            )
            errors = sorted(
                validator.iter_errors(load_json(example_path)),
                key=lambda error: list(error.absolute_path),
            )
            if errors:
                details = "; ".join(
                    f"{'/'.join(map(str, error.absolute_path)) or '<root>'}: {error.message}"
                    for error in errors
                )
                failures.append(f"{example_path.name}: {details}")
            else:
                print(
                    f"EXAMPLE OK {example_path.relative_to(ROOT)}"
                    f" -> {schema_path.name}"
                )
        except Exception as error:
            failures.append(f"{example_path.name}: {error}")

    if failures:
        print("\nVALIDATION FAILED", file=sys.stderr)
        for failure in failures:
            print(f"- {failure}", file=sys.stderr)
        return 1

    print(f"\nValidated {len(schema_paths)} schemas and {len(example_paths)} examples.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
