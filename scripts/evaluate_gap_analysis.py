#!/usr/bin/env python3
"""Deterministically evaluate Gap Analyzer JSON against approved ground truth."""

from __future__ import annotations

import argparse
import json
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from jsonschema import Draft202012Validator, FormatChecker


ROOT = Path(__file__).resolve().parents[1]
SCHEMA_PATH = ROOT / "schemas" / "gap-analysis.schema.json"
GROUND_ROOT = ROOT / "evaluation" / "ground-truth" / "gap-analysis"
DEFAULT_REPORT_ROOT = ROOT / "evaluation" / "reports" / "gap-analysis"
CASES = tuple(f"GA-T{number}" for number in range(1, 11))
CASE_DIR = {
    "GA-T1": "ga-t01",
    "GA-T2": "ga-t02",
    "GA-T3": "ga-t03",
    "GA-T4": "ga-t04",
    "GA-T5": "ga-t05",
    "GA-T6": "ga-t06",
    "GA-T7": "ga-t07",
    "GA-T8": "ga-t08",
    "GA-T9": "ga-t09",
    "GA-T10": "ga-t10",
}


@dataclass
class Check:
    name: str
    result: str
    evidence: str
    mandatory: bool = True


def load_json(path: Path) -> dict[str, Any]:
    with path.open(encoding="utf-8") as stream:
        return json.load(stream)


def normalize(value: str) -> str:
    return " ".join(value.lower().split())


def check(condition: bool, name: str, passed: str, failed: str, *, mandatory: bool = True) -> Check:
    return Check(name, "pass" if condition else "fail", passed if condition else failed, mandatory)


def gap_key(gap: dict[str, Any]) -> tuple[tuple[str, ...], str]:
    return tuple(sorted(gap.get("source_missing_information_ids", []))), normalize(gap.get("category", ""))


def issue_key(issue: dict[str, Any]) -> tuple[str, tuple[str, ...]]:
    return issue.get("id", ""), tuple(sorted(issue.get("related_item_ids", [])))


def evaluate(case_id: str, actual: dict[str, Any], trace_id: str | None = None) -> dict[str, Any]:
    expected_path = GROUND_ROOT / CASE_DIR[case_id] / "expected-output.json"
    expected = load_json(expected_path)
    schema = load_json(SCHEMA_PATH)
    validator = Draft202012Validator(schema, format_checker=FormatChecker())
    schema_errors = sorted(validator.iter_errors(actual), key=lambda err: list(err.path))
    checks: list[Check] = []

    checks.append(check(
        not schema_errors,
        "Actual output conforms to the Gap Analysis schema.",
        "Schema valid",
        "; ".join(f"{'/'.join(map(str, err.path)) or '<root>'}: {err.message}" for err in schema_errors),
    ))

    for field in ("information_sufficiency", "generation_allowed", "recommended_action"):
        checks.append(check(
            actual.get(field) == expected.get(field),
            f"{field} matches the approved decision.",
            f"Actual: {actual.get(field)!r}",
            f"Expected {expected.get(field)!r}; actual {actual.get(field)!r}",
        ))

    checks.append(check(
        bool(str(actual.get("decision_reason", "")).strip()),
        "A grounded decision reason is present.",
        "Decision reason present",
        "Decision reason missing or empty",
    ))

    expected_gaps = {gap_key(item): item for item in expected.get("gaps", [])}
    actual_gaps = {gap_key(item): item for item in actual.get("gaps", [])}
    checks.append(check(
        set(expected_gaps) <= set(actual_gaps),
        "All approved gaps are present.",
        f"Covered {len(expected_gaps)} approved gaps",
        f"Missing gap keys: {sorted(set(expected_gaps) - set(actual_gaps))}",
    ))
    checks.append(check(
        set(actual_gaps) <= set(expected_gaps),
        "No unsupported or duplicate gap is introduced.",
        "No extra gaps",
        f"Unexpected gap keys: {sorted(set(actual_gaps) - set(expected_gaps))}",
    ))

    gap_links_ok = True
    gap_links_notes: list[str] = []
    severity_ok = True
    questions_ok = True
    for key, canonical in expected_gaps.items():
        candidate = actual_gaps.get(key)
        if not candidate:
            continue
        if sorted(candidate.get("related_item_ids", [])) != sorted(canonical.get("related_item_ids", [])):
            gap_links_ok = False
            gap_links_notes.append(f"{candidate.get('id')}: related item IDs differ")
        if candidate.get("severity") != canonical.get("severity"):
            severity_ok = False
            gap_links_notes.append(f"{candidate.get('id')}: severity {candidate.get('severity')!r} != {canonical.get('severity')!r}")
        question = normalize(candidate.get("clarification_question", ""))
        if not question or question in {"can you provide more details?", "please clarify."}:
            questions_ok = False

    checks.append(check(
        gap_links_ok,
        "Gap item and source-record traceability is preserved.",
        "Gap links match approved sources",
        "; ".join(gap_links_notes) or "Gap links differ",
    ))
    checks.append(check(
        severity_ok,
        "Gap severity matches documentation-readiness impact.",
        "Severity matches",
        "; ".join(gap_links_notes) or "Severity differs",
        mandatory=False,
    ))
    checks.append(check(
        questions_ok,
        "Clarification questions are specific and actionable.",
        "Questions are bounded and non-empty",
        "A question is empty or impermissibly broad",
        mandatory=False,
    ))

    for collection, label in (("contradictions", "contradictions"), ("risks", "risks")):
        expected_issues = {issue_key(item): item for item in expected.get(collection, [])}
        actual_issues = {issue_key(item): item for item in actual.get(collection, [])}
        checks.append(check(
            set(actual_issues) == set(expected_issues),
            f"Approved {label} are preserved without invention.",
            f"Matched {len(expected_issues)} {label}",
            f"Expected keys {sorted(expected_issues)}; actual keys {sorted(actual_issues)}",
        ))
        if collection == "risks":
            source_ids_ok = all(
                sorted(actual_issues[key].get("source_risk_ids", []))
                == sorted(expected_issues[key].get("source_risk_ids", []))
                for key in set(actual_issues) & set(expected_issues)
            )
            checks.append(check(
                source_ids_ok,
                "Risk source traceability is preserved.",
                "Risk source IDs match",
                "Risk source IDs differ",
            ))

    supported_claims = sum(item.result == "pass" for item in checks)
    total_claims = len(checks)
    groundedness = round((supported_claims / total_claims) * 100, 2) if total_claims else 100.0
    mandatory_fail = any(item.mandatory and item.result == "fail" for item in checks)
    review_fail = any(not item.mandatory and item.result == "fail" for item in checks)
    result = "fail" if mandatory_fail else "needs_review" if review_fail else "pass"

    return {
        "schema_version": "1.0.0",
        "case_id": case_id,
        "run_id": actual.get("run_id"),
        "result": result,
        "groundedness_percentage": groundedness,
        "supported_claims": supported_claims,
        "total_evaluated_claims": total_claims,
        "langfuse_trace_id": trace_id,
        "evaluated_at": datetime.now(timezone.utc).isoformat(),
        "checks": [item.__dict__ for item in checks],
    }


def write_case_report(report_root: Path, result: dict[str, Any]) -> None:
    case_dir = report_root / "cases" / result["case_id"].lower()
    case_dir.mkdir(parents=True, exist_ok=True)
    with (case_dir / "evaluation.json").open("w", encoding="utf-8") as stream:
        json.dump(result, stream, indent=2)
        stream.write("\n")
    lines = [
        f"# {result['case_id']} Gap Analysis Evaluation",
        "",
        f"- Result: **{result['result']}**",
        f"- Run ID: `{result['run_id']}`",
        f"- Groundedness: **{result['groundedness_percentage']}%**",
        f"- Supported claims: {result['supported_claims']}/{result['total_evaluated_claims']}",
        f"- Langfuse trace: `{result['langfuse_trace_id'] or 'not supplied'}`",
        "",
        "| Check | Result | Evidence |",
        "|---|---|---|",
    ]
    for item in result["checks"]:
        lines.append(f"| {item['name']} | {item['result'].title()} | {item['evidence'].replace('|', '/')} |")
    (case_dir / "evaluation.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--test", choices=CASES)
    group.add_argument("--all", action="store_true")
    parser.add_argument("--actual", type=Path)
    parser.add_argument("--actual-root", type=Path)
    parser.add_argument("--report-root", type=Path, default=DEFAULT_REPORT_ROOT)
    parser.add_argument("--trace-id")
    parser.add_argument("--self-check-ground-truth", action="store_true")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    cases = CASES if args.all else (args.test,)
    results = []
    for case_id in cases:
        if args.self_check_ground_truth:
            actual_path = GROUND_ROOT / CASE_DIR[case_id] / "expected-output.json"
        elif args.test and args.actual:
            actual_path = args.actual
        elif args.actual_root:
            actual_path = args.actual_root / CASE_DIR[case_id] / "output.json"
        else:
            raise SystemExit("Supply --actual, --actual-root, or --self-check-ground-truth")
        result = evaluate(case_id, load_json(actual_path), args.trace_id)
        write_case_report(args.report_root, result)
        results.append(result)
        print(f"{case_id}: {result['result']} ({result['groundedness_percentage']}%)")

    if len(results) > 1:
        summary = {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "total": len(results),
            "pass": sum(item["result"] == "pass" for item in results),
            "needs_review": sum(item["result"] == "needs_review" for item in results),
            "fail": sum(item["result"] == "fail" for item in results),
            "average_groundedness_percentage": round(sum(item["groundedness_percentage"] for item in results) / len(results), 2),
            "cases": [{key: item[key] for key in ("case_id", "result", "groundedness_percentage")} for item in results],
        }
        args.report_root.mkdir(parents=True, exist_ok=True)
        (args.report_root / "latest-scorecard.json").write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")
        rows = ["# Gap Analyzer Scorecard", "", f"Average groundedness: **{summary['average_groundedness_percentage']}%**", "", "| Case | Result | Groundedness |", "|---|---|---:|"]
        rows.extend(f"| {item['case_id']} | {item['result']} | {item['groundedness_percentage']}% |" for item in results)
        (args.report_root / "latest-scorecard.md").write_text("\n".join(rows) + "\n", encoding="utf-8")

    return 1 if any(item["result"] == "fail" for item in results) else 0


if __name__ == "__main__":
    raise SystemExit(main())
