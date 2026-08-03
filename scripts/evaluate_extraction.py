#!/usr/bin/env python3
"""Deterministically compare Requirement Extractor JSON with approved ground truth."""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from jsonschema import Draft202012Validator


ROOT = Path(__file__).resolve().parents[1]
GROUND_TRUTH_ROOT = ROOT / "evaluation" / "ground-truth" / "requirement-extraction"
EXTRACTION_SCHEMA = ROOT / "schemas" / "requirement-extraction.schema.json"
EVALUATION_SCHEMA = ROOT / "schemas" / "evaluation-result.schema.json"
OFFICIAL_FIXTURE = ROOT / "evaluation" / "fixtures" / "t01-t10-extractor-cases.json"
DEFAULT_REPORT_ROOT = ROOT / "evaluation" / "reports" / "requirement-extraction"

STOP_WORDS = {
    "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has",
    "have", "in", "is", "it", "of", "on", "or", "that", "the", "to", "with",
}


@dataclass
class Check:
    description: str
    passed: bool
    evidence: str
    review_required: bool = False

    def contract_value(self) -> dict[str, Any]:
        return {
            "description": self.description,
            "passed": self.passed,
            "evidence": self.evidence,
        }


def load_json(path: Path) -> Any:
    with path.open(encoding="utf-8") as stream:
        return json.load(stream)


def normalized_words(value: str) -> set[str]:
    words = {
        token
        for token in re.findall(r"[a-z0-9]+", value.lower().replace("_", " "))
        if token not in STOP_WORDS and len(token) > 1
    }
    aliases = {
        "contains": "contain",
        "containing": "contain",
        "contained": "contain",
        "provide": "request",
        "provided": "request",
        "providing": "request",
    }
    return {aliases.get(word, word) for word in words}


def json_text(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True)


def schema_check(actual: dict[str, Any]) -> Check:
    errors = sorted(
        Draft202012Validator(load_json(EXTRACTION_SCHEMA)).iter_errors(actual),
        key=lambda error: list(error.absolute_path),
    )
    if not errors:
        return Check("Actual output conforms to the extraction schema.", True, "Schema valid")
    detail = "; ".join(
        f"{'/'.join(map(str, error.absolute_path)) or '<root>'}: {error.message}"
        for error in errors
    )
    return Check("Actual output conforms to the extraction schema.", False, detail)


def item_match_score(expected: dict[str, Any], actual: dict[str, Any]) -> int:
    if expected.get("type") != actual.get("type"):
        return -1
    score = 1
    expected_quotes = {entry.get("quote") for entry in expected.get("evidence", [])}
    actual_quotes = {entry.get("quote") for entry in actual.get("evidence", [])}
    score += 10 * len(expected_quotes & actual_quotes)
    expected_target = expected.get("target")
    if expected_target and expected_target in json_text(actual):
        score += 4
    statement_words = normalized_words(expected.get("statement", ""))
    actual_words = normalized_words(actual.get("statement", ""))
    score += len(statement_words & actual_words)
    return score


def map_canonical_items(
    expected_items: list[dict[str, Any]], actual_items: list[dict[str, Any]]
) -> tuple[dict[str, str], list[str]]:
    mapping: dict[str, str] = {}
    used_actual: set[str] = set()
    unmatched: list[str] = []
    for expected in expected_items:
        candidates = [
            (item_match_score(expected, actual), actual)
            for actual in actual_items
            if actual.get("id") not in used_actual
        ]
        candidates = [candidate for candidate in candidates if candidate[0] > 1]
        if not candidates:
            unmatched.append(expected["id"])
            continue
        _, best = max(candidates, key=lambda candidate: candidate[0])
        mapping[expected["id"]] = best["id"]
        used_actual.add(best["id"])
    return mapping, unmatched


def evidence_grounding_check(actual: dict[str, Any], source_text: str) -> Check:
    failures: list[str] = []
    for item in actual.get("items", []):
        evidence = item.get("evidence", [])
        if not evidence:
            failures.append(f"{item.get('id', '<unknown>')} has no evidence")
            continue
        for entry in evidence:
            quote = entry.get("quote", "")
            if quote not in source_text:
                failures.append(f"{item.get('id')}: quote not found verbatim: {quote!r}")
    return Check(
        "Every extracted item has verbatim evidence in the source.",
        not failures,
        "All evidence quotes found in source" if not failures else "; ".join(failures),
    )


def relationships_check(
    expected_items: list[dict[str, Any]],
    actual_items: list[dict[str, Any]],
    mapping: dict[str, str],
) -> Check:
    actual_by_id = {item["id"]: item for item in actual_items}
    failures: list[str] = []
    checked = 0
    for expected in expected_items:
        expected_id = expected["id"]
        if expected_id not in mapping:
            continue
        for related_expected_id in expected.get("related_item_ids", []):
            if related_expected_id not in mapping:
                failures.append(f"{expected_id} relation target {related_expected_id} is unmatched")
                continue
            checked += 1
            actual_id = mapping[expected_id]
            related_actual_id = mapping[related_expected_id]
            if related_actual_id not in actual_by_id[actual_id].get("related_item_ids", []):
                failures.append(f"{actual_id} does not link to {related_actual_id}")
    return Check(
        "Canonical item relationships are preserved after ID mapping.",
        not failures,
        f"Verified {checked} directed links" if not failures else "; ".join(failures),
    )


def contradictions_check(
    expected: dict[str, Any], actual: dict[str, Any], mapping: dict[str, str]
) -> Check:
    failures: list[str] = []
    for canonical in expected.get("contradictions", []):
        mapped_ids = {mapping.get(item_id) for item_id in canonical["item_ids"]}
        if None in mapped_ids:
            failures.append(f"{canonical['id']} contains an unmatched canonical item")
            continue
        match = next(
            (
                candidate
                for candidate in actual.get("contradictions", [])
                if mapped_ids.issubset(set(candidate.get("item_ids", [])))
                and candidate.get("resolution_status") == "unresolved"
            ),
            None,
        )
        if match is None:
            failures.append(f"No unresolved contradiction links {sorted(mapped_ids)}")
    if not expected.get("contradictions") and actual.get("contradictions"):
        failures.append("Actual output introduced contradiction records absent from ground truth")
    return Check(
        "Required contradiction handling is preserved.",
        not failures,
        "Contradiction expectations satisfied" if not failures else "; ".join(failures),
    )


def missing_information_check(metadata: dict[str, Any], actual: dict[str, Any]) -> Check:
    required = metadata.get("required_expectations", {}).get("required_missing_information", [])
    if not required:
        return Check("Required missing-information coverage is present.", True, "No mandatory gaps")
    actual_text = json_text(actual.get("missing_information", [])).lower().replace("_", " ")
    failures: list[str] = []
    uncertain: list[str] = []
    actual_words = normalized_words(actual_text)
    for requirement in required:
        required_words = normalized_words(requirement)
        overlap = required_words & actual_words
        coverage = len(overlap) / len(required_words) if required_words else 1.0
        if coverage >= 0.75:
            continue
        if coverage >= 0.5:
            uncertain.append(requirement)
        else:
            failures.append(requirement)
    if failures:
        return Check(
            "Required missing-information coverage is present.",
            False,
            f"Not found: {', '.join(failures)}",
        )
    if uncertain:
        return Check(
            "Required missing-information coverage is present.",
            True,
            f"Semantic review required for: {', '.join(uncertain)}",
            review_required=True,
        )
    return Check(
        "Required missing-information coverage is present.",
        True,
        f"Covered: {', '.join(required)}",
    )


def prohibited_literal_checks(test_id: str, actual: dict[str, Any]) -> list[Check]:
    actual_text = json_text(actual).lower()
    checks: list[Check] = []
    fixture = load_json(OFFICIAL_FIXTURE)
    case = next(case for case in fixture["cases"] if case["test_id"] == test_id)
    for literal in case.get("prohibited_content", []):
        present = literal.lower() in actual_text
        checks.append(
            Check(
                f"Prohibited literal is absent: {literal}",
                not present,
                "Absent" if not present else f"Found {literal!r}",
            )
        )
    return checks


def evaluate_case(
    test_id: str,
    actual_path: Path,
    workflow_version: str,
    prompt_version: str,
    model: str,
    trace_id: str | None,
) -> dict[str, Any]:
    case_dir = GROUND_TRUTH_ROOT / test_id.lower().replace("t", "t0", 1) if len(test_id) == 2 else GROUND_TRUTH_ROOT / test_id.lower()
    # Normalize T1 -> t01 while retaining T10 -> t10.
    case_dir = GROUND_TRUTH_ROOT / f"t{int(test_id[1:]):02d}"
    expected = load_json(case_dir / "expected-output.json")
    metadata = load_json(case_dir / "case-metadata.json")
    actual = load_json(actual_path)
    source_text = metadata["source"]["input_text"]

    checks: list[Check] = [schema_check(actual)]
    checks.append(
        Check(
            f"Extraction status equals {metadata['required_expectations']['extraction_status']}.",
            actual.get("extraction_status") == metadata["required_expectations"]["extraction_status"],
            f"Actual: {actual.get('extraction_status')!r}",
        )
    )

    actual_text = json_text(actual)
    missing_values = [
        value
        for value in metadata["required_expectations"].get("required_exact_values", [])
        if value not in actual_text
    ]
    checks.append(
        Check(
            "All required exact values are preserved.",
            not missing_values,
            "All exact values found" if not missing_values else f"Missing: {missing_values}",
        )
    )

    actual_types = {item.get("type") for item in actual.get("items", [])}
    required_types = set(metadata["required_expectations"].get("required_item_types", []))
    checks.append(
        Check(
            "All required item types are present.",
            required_types.issubset(actual_types),
            f"Required: {sorted(required_types)}; actual: {sorted(actual_types - {None})}",
        )
    )
    checks.append(evidence_grounding_check(actual, source_text))

    mapping, unmatched = map_canonical_items(expected.get("items", []), actual.get("items", []))
    checks.append(
        Check(
            "Every canonical item has a deterministic actual-item match.",
            not unmatched,
            f"Mapping: {mapping}" if not unmatched else f"Unmatched: {unmatched}; mapping: {mapping}",
        )
    )
    checks.append(relationships_check(expected.get("items", []), actual.get("items", []), mapping))
    checks.append(contradictions_check(expected, actual, mapping))
    checks.append(missing_information_check(metadata, actual))
    checks.extend(prohibited_literal_checks(test_id, actual))

    matched_actual_ids = set(mapping.values())
    extra_ids = [
        item.get("id") for item in actual.get("items", []) if item.get("id") not in matched_actual_ids
    ]
    if extra_ids:
        checks.append(
            Check(
                "Additional actual items require semantic review.",
                True,
                f"Additional item IDs: {extra_ids}",
                review_required=True,
            )
        )

    mandatory_failed = any(not check.passed for check in checks)
    review_required = any(check.review_required for check in checks)
    result = "fail" if mandatory_failed else "needs_review" if review_required else "pass"
    unsupported_claims = [
        check.evidence
        for check in checks
        if not check.passed and ("evidence" in check.description.lower() or "additional" in check.description.lower())
    ]

    report = {
        "schema_version": "1.0.0",
        "run_id": actual.get("run_id", f"RUN-{test_id}-EVALUATION"),
        "test_id": test_id,
        "workflow_version": workflow_version,
        "prompt_versions": {"requirement_extractor": prompt_version},
        "result": result,
        "expected_elements": [check.contract_value() for check in checks],
        "prohibited_behaviors": [],
        "unsupported_claims": unsupported_claims,
        "validation": {
            "schema_valid": checks[0].passed,
            "exact_values_preserved": checks[2].passed,
            "traceability_complete": checks[3].passed and checks[4].passed and checks[5].passed,
        },
        "observability": {
            "langfuse_trace_id": trace_id,
            "model": model,
            "latency_ms": 0,
            "input_tokens": 0,
            "output_tokens": 0,
            "estimated_cost_usd": 0,
        },
        "reviewer_notes": (
            "Deterministic evaluation generated "
            + datetime.now(timezone.utc).isoformat()
            + ". Token, cost, or latency values remain zero when they were not supplied to this local evaluator."
        ),
    }
    evaluation_errors = list(Draft202012Validator(load_json(EVALUATION_SCHEMA)).iter_errors(report))
    if evaluation_errors:
        raise ValueError("Generated invalid evaluation report: " + "; ".join(e.message for e in evaluation_errors))
    return report


def markdown_report(report: dict[str, Any]) -> str:
    lines = [
        f"# {report['test_id']} Requirement Extraction Evaluation",
        "",
        f"- Result: **{report['result']}**",
        f"- Run ID: `{report['run_id']}`",
        f"- Workflow version: `{report['workflow_version']}`",
        f"- Prompt version: `{report['prompt_versions']['requirement_extractor']}`",
        f"- Langfuse trace: `{report['observability']['langfuse_trace_id'] or 'not supplied'}`",
        "",
        "| Check | Result | Evidence |",
        "|---|---|---|",
    ]
    for check in report["expected_elements"]:
        evidence = check["evidence"].replace("|", "\\|").replace("\n", " ")
        lines.append(f"| {check['description']} | {'Pass' if check['passed'] else 'Fail'} | {evidence} |")
    lines.extend(["", report["reviewer_notes"], ""])
    return "\n".join(lines)


def write_report(report: dict[str, Any], report_root: Path) -> None:
    case_dir = report_root / "cases" / report["test_id"].lower()
    case_dir.mkdir(parents=True, exist_ok=True)
    (case_dir / "evaluation.json").write_text(
        json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    (case_dir / "evaluation.md").write_text(markdown_report(report), encoding="utf-8")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    target = parser.add_mutually_exclusive_group(required=True)
    target.add_argument("--test", choices=[f"T{i}" for i in range(1, 11)])
    target.add_argument("--all", action="store_true")
    parser.add_argument("--actual", type=Path, help="Actual JSON for --test")
    parser.add_argument(
        "--actual-root",
        type=Path,
        default=ROOT / "evaluation" / "actual" / "requirement-extraction",
        help="Root containing t01/output.json through t10/output.json for --all",
    )
    parser.add_argument("--report-root", type=Path, default=DEFAULT_REPORT_ROOT)
    parser.add_argument("--workflow-version", default="v0.2.0")
    parser.add_argument("--prompt-version", default="extractor-v0.8-dependency-risk-fix")
    parser.add_argument("--model", default="not-supplied")
    parser.add_argument("--trace-id")
    parser.add_argument(
        "--self-check-ground-truth",
        action="store_true",
        help="Use each canonical expected output as actual input; useful for evaluator regression tests.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    test_ids = [args.test] if args.test else [f"T{i}" for i in range(1, 11)]
    reports: list[dict[str, Any]] = []
    for test_id in test_ids:
        case_name = f"t{int(test_id[1:]):02d}"
        case_trace_id = args.trace_id
        case_model = args.model
        if args.self_check_ground_truth:
            actual_path = GROUND_TRUTH_ROOT / case_name / "expected-output.json"
        elif args.test:
            if args.actual is None:
                raise SystemExit("--actual is required with --test unless --self-check-ground-truth is used")
            actual_path = args.actual
        else:
            actual_path = args.actual_root / case_name / "output.json"
        run_metadata_path = actual_path.parent / "run-metadata.json"
        if not args.self_check_ground_truth and run_metadata_path.exists():
            run_metadata = load_json(run_metadata_path)
            case_trace_id = case_trace_id or run_metadata.get("trace_id")
            if case_model == "not-supplied":
                case_model = run_metadata.get("model", case_model)
        if not actual_path.exists():
            print(f"Missing actual output: {actual_path}", file=sys.stderr)
            return 2
        report = evaluate_case(
            test_id,
            actual_path,
            args.workflow_version,
            args.prompt_version,
            case_model,
            case_trace_id,
        )
        write_report(report, args.report_root)
        reports.append(report)
        print(f"{test_id}: {report['result']} -> {args.report_root / 'cases' / test_id.lower()}")

    counts = {result: sum(report["result"] == result for report in reports) for result in ("pass", "fail", "needs_review")}
    summary = {
        "dataset_version": "0.1.1",
        "capability": "requirement_extraction",
        "tests": len(reports),
        "counts": counts,
        "release_gate_passed": counts["fail"] == 0 and counts["needs_review"] == 0,
        "results": [{"test_id": report["test_id"], "result": report["result"]} for report in reports],
    }
    args.report_root.mkdir(parents=True, exist_ok=True)
    (args.report_root / "latest-scorecard.json").write_text(
        json.dumps(summary, indent=2) + "\n", encoding="utf-8"
    )
    markdown = [
        "# Requirement Extraction Scorecard",
        "",
        f"- Dataset version: `{summary['dataset_version']}`",
        f"- Tests: {summary['tests']}",
        f"- Pass: {counts['pass']}",
        f"- Fail: {counts['fail']}",
        f"- Needs review: {counts['needs_review']}",
        f"- Release gate: **{'PASS' if summary['release_gate_passed'] else 'NOT PASSED'}**",
        "",
        "| Test | Result |",
        "|---|---|",
        *[f"| {result['test_id']} | {result['result']} |" for result in summary["results"]],
        "",
    ]
    (args.report_root / "latest-scorecard.md").write_text("\n".join(markdown), encoding="utf-8")
    return 1 if counts["fail"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
