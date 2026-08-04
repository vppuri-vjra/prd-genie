#!/usr/bin/env python3
"""Convert an n8n Record Gap Analysis Result table export to Gap Analysis JSON."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


def field(text: str, name: str) -> str:
    match = re.search(rf"^{re.escape(name)}:(.*)$", text, flags=re.MULTILINE)
    if not match:
        raise ValueError(f"Missing field: {name}")
    return match.group(1).strip()


def list_field(block: str, name: str) -> list[str]:
    match = re.search(
        rf"^{re.escape(name)}\n(.*?)(?=^(?:source_missing_information_ids|source_risk_ids|related_item_ids)(?::\[empty array\])?$|^(?:id|category|description|severity|clarification_question):|\Z)",
        block,
        flags=re.MULTILINE | re.DOTALL,
    )
    if not match:
        return []
    return [value.strip() for value in re.findall(r"^\d+:(.+)$", match.group(1), flags=re.MULTILINE)]


def object_blocks(section: str, prefix: str) -> list[str]:
    if section.splitlines()[0].endswith(":[empty array]"):
        return []
    pattern = rf"(?:^|\n)\d+\nid:({prefix}-\d{{3}})\n"
    matches = list(re.finditer(pattern, section))
    blocks = []
    for index, match in enumerate(matches):
        end = matches[index + 1].start() if index + 1 < len(matches) else len(section)
        blocks.append("id:" + match.group(1) + "\n" + section[match.end():end].strip())
    return blocks


def parse_gap(block: str) -> dict:
    return {
        "id": field(block, "id"),
        "category": field(block, "category"),
        "description": field(block, "description"),
        "severity": field(block, "severity"),
        "clarification_question": field(block, "clarification_question"),
        "related_item_ids": list_field(block, "related_item_ids"),
        "source_missing_information_ids": list_field(block, "source_missing_information_ids"),
    }


def parse_issue(block: str) -> dict:
    return {
        "id": field(block, "id"),
        "description": field(block, "description"),
        "severity": field(block, "severity"),
        "related_item_ids": list_field(block, "related_item_ids"),
    }


def parse_risk(block: str) -> dict:
    item = parse_issue(block)
    item["source_risk_ids"] = list_field(block, "source_risk_ids")
    return item


def section(body: str, name: str, next_name: str | None) -> str:
    start = re.search(rf"^{name}(?::\[empty array\])?$", body, flags=re.MULTILINE)
    if not start:
        raise ValueError(f"Missing collection: {name}")
    if next_name:
        end = re.search(rf"^{next_name}(?::\[empty array\])?$", body[start.end():], flags=re.MULTILINE)
        if not end:
            raise ValueError(f"Missing following collection: {next_name}")
        return body[start.start():start.end() + end.start()]
    return body[start.start():]


def parse(text: str) -> dict:
    start = text.index("\nschema_version:1.0.0\nrun_id:") + 1
    end = text.index("\n\t\nschema_version:1.0.0\nstructurally_valid", start)
    body = text[start:end]
    gaps_text = section(body, "gaps", "contradictions")
    contradictions_text = section(body, "contradictions", "risks")
    risks_text = section(body, "risks", None)
    return {
        "schema_version": field(body, "schema_version"),
        "run_id": field(body, "run_id"),
        "information_sufficiency": field(body, "information_sufficiency"),
        "generation_allowed": field(body, "generation_allowed") == "true",
        "recommended_action": field(body, "recommended_action"),
        "decision_reason": field(body, "decision_reason"),
        "gaps": [parse_gap(item) for item in object_blocks(gaps_text, "GAP")],
        "contradictions": [parse_issue(item) for item in object_blocks(contradictions_text, "CTR")],
        "risks": [parse_risk(item) for item in object_blocks(risks_text, "RSK")],
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    result = parse(args.input.read_text(encoding="utf-8"))
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
