#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WF = ROOT / "workflows" / "n8n"

FILES = {
    "gate": "prd-genie-s2-clarification-deterministic-gate-v0.1.json",
    "final": "prd-genie-s2-final-validator-export-v0.1.json",
    "gap": "prd-genie-s2-gap-analyzer-child-v0.1.json",
    "approval": "prd-genie-s2-human-approval-v0.1.json",
    "prd": "prd-genie-s2-production-prd-v0.1.json",
    "parent": "prd-genie-s2-realistic-six-source-main-orchestrator-v0.1.json",
    "extractor": "prd-genie-s2-requirement-extractor-child-v0.1.json",
    "story": "prd-genie-s2-story-breakdown-v0.1.json",
}

IDS = {
    "gate": "CQoNtd5ZcVYV6hlG",
    "extractor": "IiXGaUC7gCHwZmzI",
    "gap": "rDKD7Vnb1BIOLVJB",
    "approval": "yhA4MJhCkn6tpH96",
    "prd": "IisHTFOM9TAK1l0l",
    "story": "ZTzLknRbkro5n4yE",
    "final": "BedDap8PQoauQcbw",
}


def load(key):
    return json.loads((WF / FILES[key]).read_text())


def code(workflow, name):
    return next(node["parameters"]["jsCode"] for node in workflow["nodes"] if node["name"] == name)


workflows = {key: load(key) for key in FILES}
for key, workflow in workflows.items():
    assert workflow["active"] is False, key
    assert workflow["name"].startswith("S2_ "), key
    assert workflow["meta"]["s2_contract"] == "dynamic-citation-bidirectional-v1", key
    raw = json.dumps(workflow)
    assert "Product Brief: Advanced Analytics Dashboard" not in raw, key
    assert "citationCount!==88" not in raw, key
    assert "execution_id:972" not in raw and "execution_id\":972" not in raw, key

gate = workflows["gate"]
gate_refs = {node["parameters"]["workflowId"]["value"] for node in gate["nodes"] if node["type"] == "n8n-nodes-base.executeWorkflow"}
assert gate_refs == {IDS["extractor"], IDS["gap"]}
packet_code = code(gate, "Build Dynamic Drive Packet and Citation Inventory")
for required in ("drive_file_id", "content_hash", "citation_id", "quote_hash", "citation_inventory_count"):
    assert required in packet_code
gate_code = code(gate, "Reconcile Dynamic Gate Output")
assert "citation classification set mismatch" in gate_code

parent = workflows["parent"]
parent_refs = {node["parameters"]["workflowId"]["value"] for node in parent["nodes"] if node["type"] == "n8n-nodes-base.executeWorkflow"}
assert parent_refs == {IDS["gate"], IDS["approval"], IDS["prd"], IDS["story"], IDS["final"]}
assert "citationCount!==88" not in code(parent, "Prepare Validated Drive Exports")

approval_code = code(workflows["approval"], "Validate Complete Citation Dispositions")
assert "citation dispositions" in approval_code and "item dispositions" in approval_code
prd_code = code(workflows["prd"], "Validate Approval to PRD Coverage")
assert "approved item coverage" in prd_code
story_code = code(workflows["story"], "Validate PRD to Story Coverage")
assert "PRD/story item set" in story_code
final_code = code(workflows["final"], "Validate Bidirectional Traceability")
assert "citation disposition set" in final_code and "PRD delivery set" in final_code

print("S2 STATIC CONTRACT PASS: 8/8 unpublished exports; dynamic Drive citations; S2-only calls; bidirectional fail-closed gates present.")
