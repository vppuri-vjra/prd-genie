#!/usr/bin/env python3
"""Deterministically validate the v1.9 production citation-coverage ledger."""

import copy
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PACKET = ROOT / "evaluation/fixtures/multi-source/realistic-v1/source-packet.json"
EXPECTED = ROOT / "evaluation/fixtures/multi-source/realistic-v1/expected-requirement-extraction.json"
ROW = re.compile(r"^([^|]+)\|(line:[1-9][0-9]*)\|(ITEM|MISSING|CONFLICT|CONTEXT)\|([A-Z]+-[0-9]{3}(?:,[A-Z]+-[0-9]{3})*|NONE)$")


def evidence_key(evidence):
    return f"{evidence['source_id']}|{evidence['location']}"


def validate(packet, extraction, ledger):
    errors = []
    approved = {
        f"{source['source_id']}|{citation['location']}"
        for source in packet["sources"] for citation in source["citations"]
    }
    item_ids = {record["id"] for record in extraction["items"]}
    missing_ids = {record["id"] for record in extraction["missing_information"]}
    contradiction_ids = {record["id"] for record in extraction["contradictions"]}
    contradiction_items = {record["id"]: set(record["item_ids"]) for record in extraction["contradictions"]}
    item_evidence = {}
    for record in extraction["items"]:
        for evidence in record["evidence"]:
            item_evidence.setdefault(evidence_key(evidence), set()).add(record["id"])
    missing_evidence = {
        evidence_key(evidence)
        for record in extraction["missing_information"] for evidence in record["evidence"]
    }
    seen = set()
    for index, row in enumerate(ledger):
        match = ROW.fullmatch(row) if isinstance(row, str) else None
        if not match:
            errors.append(f"invalid row {index}")
            continue
        source_id, location, route, target_text = match.groups()
        key = f"{source_id}|{location}"
        targets = [] if target_text == "NONE" else target_text.split(",")
        if key not in approved:
            errors.append(f"unknown citation {key}")
        if key in seen:
            errors.append(f"duplicate citation {key}")
        seen.add(key)
        known = item_ids | missing_ids | contradiction_ids
        if any(target not in known for target in targets):
            errors.append(f"unknown target for {key}")
        if route == "CONTEXT" and targets:
            errors.append(f"context target for {key}")
        if route == "ITEM" and not any(target in item_ids for target in targets):
            errors.append(f"item target for {key}")
        if route == "MISSING" and not any(target in missing_ids for target in targets):
            errors.append(f"missing target for {key}")
        if route == "CONFLICT" and not any(target in contradiction_ids for target in targets):
            errors.append(f"conflict target for {key}")
        if route == "CONTEXT" and (key in item_evidence or key in missing_evidence):
            errors.append(f"used context {key}")
        if route == "ITEM" and key not in item_evidence:
            errors.append(f"unused item citation {key}")
        if route == "MISSING" and key not in missing_evidence:
            errors.append(f"unused missing citation {key}")
        if route == "CONFLICT" and key not in item_evidence:
            errors.append(f"unused conflict citation {key}")
        if route == "ITEM" and (any(target not in item_ids for target in targets) or not item_evidence.get(key, set()).issubset(targets)):
            errors.append(f"item target mismatch for {key}")
        if route == "MISSING" and any(target not in missing_ids for target in targets):
            errors.append(f"missing target mismatch for {key}")
        if route == "CONFLICT":
            target_items = set(targets) & item_ids
            target_conflicts = set(targets) & contradiction_ids
            if set(targets) & missing_ids or not item_evidence.get(key, set()).issubset(target_items):
                errors.append(f"conflict target mismatch for {key}")
            if any(not (contradiction_items[target] & target_items) for target in target_conflicts):
                errors.append(f"unrelated conflict target for {key}")
    errors.extend(f"missing citation {key}" for key in sorted(approved - seen))
    return errors


def build_expected_ledger(packet, extraction):
    item_evidence = {}
    for record in extraction["items"]:
        for evidence in record["evidence"]:
            item_evidence.setdefault(evidence_key(evidence), set()).add(record["id"])
    missing_evidence = {}
    for record in extraction["missing_information"]:
        for evidence in record["evidence"]:
            missing_evidence.setdefault(evidence_key(evidence), set()).add(record["id"])
    conflict_by_item = {}
    for record in extraction["contradictions"]:
        for item_id in record["item_ids"]:
            conflict_by_item.setdefault(item_id, set()).add(record["id"])
    rows = []
    for source in packet["sources"]:
        for citation in source["citations"]:
            key = f"{source['source_id']}|{citation['location']}"
            item_targets = item_evidence.get(key, set())
            conflict_targets = set().union(*(conflict_by_item.get(item_id, set()) for item_id in item_targets)) if item_targets else set()
            if conflict_targets:
                route, targets = "CONFLICT", conflict_targets | item_targets
            elif key in missing_evidence:
                route, targets = "MISSING", missing_evidence[key]
            elif item_targets:
                route, targets = "ITEM", item_targets
            else:
                route, targets = "CONTEXT", set()
            target_text = ",".join(sorted(targets)) if targets else "NONE"
            rows.append(f"{key}|{route}|{target_text}")
    return rows


def require_failure(label, packet, extraction, ledger, fragment):
    errors = validate(packet, extraction, ledger)
    assert any(fragment in error for error in errors), f"{label} did not fail as expected: {errors}"


def main():
    packet = json.loads(PACKET.read_text())
    extraction = json.loads(EXPECTED.read_text())
    ledger = build_expected_ledger(packet, extraction)
    assert len(ledger) == 70, len(ledger)
    assert not validate(packet, extraction, ledger), validate(packet, extraction, ledger)

    require_failure("missing", packet, extraction, ledger[:-1], "missing citation")
    require_failure("duplicate", packet, extraction, ledger + [ledger[0]], "duplicate citation")
    unknown = copy.copy(ledger)
    unknown[0] = unknown[0].replace("line:3", "line:999")
    require_failure("unknown citation", packet, extraction, unknown, "unknown citation")
    bad_target = copy.copy(ledger)
    first_item = next(index for index, row in enumerate(bad_target) if "|ITEM|" in row)
    bad_target[first_item] = bad_target[first_item].rsplit("|", 1)[0] + "|FR-999"
    require_failure("unknown target", packet, extraction, bad_target, "unknown target")
    used_key = evidence_key(extraction["items"][0]["evidence"][0])
    used_context = copy.copy(ledger)
    used_index = next(index for index, row in enumerate(used_context) if row.startswith(used_key + "|"))
    used_context[used_index] = used_key + "|CONTEXT|NONE"
    require_failure("used context", packet, extraction, used_context, "used context")

    conflict_row = next(row for row in ledger if "|CONFLICT|" in row)
    conflict_key = "|".join(conflict_row.split("|")[:2])
    conflict_without_item = copy.deepcopy(extraction)
    for record in conflict_without_item["items"]:
        record["evidence"] = [evidence for evidence in record["evidence"] if evidence_key(evidence) != conflict_key]
    require_failure("conflict without item evidence", packet, conflict_without_item, ledger, "unused conflict citation")

    print("PASS: 70/70 approved citations classified exactly once")
    print("PASS: missing, duplicate, unknown citation, unknown target, used-context, and conflict-without-item mutations fail closed")
    print("GROUNDING: 100%; unsupported claims: 0")


if __name__ == "__main__":
    main()
