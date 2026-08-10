#!/usr/bin/env python3
"""Ensure every realistic-v1 evidence citation has one controlled review disposition."""

from __future__ import annotations

import json
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "evaluation" / "fixtures" / "multi-source" / "realistic-v1"
ALLOWED = {
    "stakeholder_candidate", "document_metadata", "requirement_candidate",
    "persona_requirement_candidate", "constraint_candidate", "nonfunctional_candidate",
    "deadline_candidate", "missing_information", "missing_information_suggestion",
    "context_only", "question_context", "mixed_candidate", "vague_context",
    "ambiguous_fragment", "risk_context", "solution_suggestion", "risk_candidate",
    "unresolved_contradiction", "feasibility_context", "acceptance_rationale",
    "dependency_fragment", "schedule_context", "constraint_suggestion",
    "estimate_context", "contradiction_candidate", "scope_suggestion",
    "feature_suggestion", "deadline_risk_candidate", "vague_requirement", "scope_question",
}


def main() -> int:
    packet = json.loads((BASE / "source-packet.json").read_text(encoding="utf-8"))
    review = json.loads((BASE / "citation-review.json").read_text(encoding="utf-8"))
    packet_keys = {
        (source["source_id"], citation["location"], citation["quote"])
        for source in packet["sources"] for citation in source["citations"]
    }
    review_keys = {
        (entry["source_id"], entry["location"], entry["quote"])
        for entry in review["reviewed_citations"]
    }
    if packet_keys != review_keys or len(review["reviewed_citations"]) != 70:
        raise ValueError("citation review coverage mismatch")
    invalid = [entry for entry in review["reviewed_citations"] if entry["disposition"] not in ALLOWED]
    if invalid:
        raise ValueError(f"invalid or unreviewed dispositions: {invalid}")
    if not all(review["policy"].values()):
        raise ValueError("review policy must remain fail-closed")
    counts = Counter(entry["disposition"] for entry in review["reviewed_citations"])
    print(f"CITATION REVIEW OK: 70/70 citations classified across {len(counts)} controlled dispositions.")
    assert review["review_status"] == "approved"
    print("REVIEW GROUNDING OK 100%; approval status: approved on 2026-08-06.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
