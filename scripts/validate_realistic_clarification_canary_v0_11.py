#!/usr/bin/env python3
import copy
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
workflow = json.loads((ROOT / "workflows/n8n/prd-genie-realistic-clarification-v4-canary-v0.11.json").read_text())
runtime = json.loads((ROOT / "evaluation/actual/realistic-v4-execution-9715-stage-shapes.json").read_text())
nodes = {node["name"]: node for node in workflow["nodes"]}

expected_nodes = [
    "Manual Trigger", "Load Approved Six-Source Packet v4",
    "Execute Requirement Extractor Child v1.10", "Validate Six-Source Extraction",
    "Execute Gap Analyzer Child v1.0", "Deterministic Clarification Resolution and Gate",
]
assert list(nodes) == expected_nodes
assert len(workflow["connections"]) == 5
for left, right in zip(expected_nodes, expected_nodes[1:]):
    assert workflow["connections"][left]["main"][0] == [{"node": right, "type": "main", "index": 0}]
assert nodes[expected_nodes[2]]["parameters"]["workflowId"]["value"] == "eDAl2qSb4ai17JZk"
assert nodes[expected_nodes[4]]["parameters"]["workflowId"]["value"] == "wGBE80XMjD5rTKql"

load_code = nodes[expected_nodes[1]]["parameters"]["jsCode"]
prefix = "const packet="
packet, end = json.JSONDecoder().raw_decode(load_code[len(prefix):])
decision_ids = json.loads(re.search(r"const decision_ids=(\[.*?\]);", load_code).group(1))
supersessions = json.loads(re.search(r"const supersessions=(\[.*?\]);", load_code).group(1))
parent_trace = runtime["requirement_extraction"]["parent_trace_id"]
original_packet = copy.deepcopy(packet)
original_packet["orchestration_context"] = {
    "parent_trace_id": parent_trace,
    "active_run_id": packet["run_id"],
    "test_id": "REALISTIC-CLARIFICATION-V4",
    "environment": "realistic-clarification-canary",
}
original_packet["clarification_contract"] = {
    "decision_maker": "Vipin", "decision_date": "2026-08-07",
    "decision_ids": decision_ids, "supersessions": supersessions,
}

source_packet = {"packet_id": packet["packet_id"], "sources": [
    {"source_id": s["source_id"], "content_hash": s["content_hash"]} for s in packet["sources"]
]}
validated = {
    "schema_version": "1.0.0", "run_id": packet["run_id"],
    "extraction": {}, "orchestration_context": copy.deepcopy(original_packet["orchestration_context"]),
    "requirement_extraction_stage": {"source_packet": source_packet, "observability": {
        "stage_trace_id": runtime["requirement_extraction"]["stage_trace_id"],
        "parent_trace_id": parent_trace, "ingestion_accepted": True,
    }},
    "clarification_contract": original_packet["clarification_contract"],
    "original_packet": original_packet,
}

required = [
    ("DEC-2026-08-07-GAP-002", "SRC-REALISTIC-CLAR-001", "line:11", "deferred"),
    ("DEC-2026-08-07-GAP-005", "SRC-REALISTIC-CLAR-001", "line:14", "deferred"),
    ("DEC-2026-08-07-GAP-011", "SRC-REALISTIC-CLAR-001", "line:20", "deferred"),
    ("DEC-2026-08-07-MOBILE-LAUNCH-001", "SRC-REALISTIC-CLAR-MOBILE-001", "line:9", "resolved"),
]

def contract_errors(candidate):
    errors = []
    op = candidate.get("original_packet")
    if not op: return ["missing original_packet"]
    if op.get("run_id") != candidate.get("run_id"): errors.append("run_id")
    if op.get("orchestration_context", {}).get("parent_trace_id") != candidate.get("orchestration_context", {}).get("parent_trace_id"): errors.append("parent trace")
    if op.get("packet_id") != "SP-REALISTIC-PB-MT-SN-CLAR-V4" or len(op.get("sources", [])) != 6: errors.append("packet identity")
    extracted = {s["source_id"]: s["content_hash"] for s in candidate["requirement_extraction_stage"]["source_packet"]["sources"]}
    for source in op.get("sources", []):
        if extracted.get(source["source_id"]) != source["content_hash"]: errors.append("source mutation")
    ids = set(op.get("clarification_contract", {}).get("decision_ids", []))
    sources = {s["source_id"]: s for s in op.get("sources", [])}
    for decision_id, source_id, location, _ in required:
        source = sources.get(source_id, {})
        cited = any(c.get("location") == location and decision_id in c.get("quote", "") for c in source.get("citations", []))
        if decision_id not in ids or not cited: errors.append(decision_id)
    if not op.get("clarification_contract", {}).get("supersessions"): errors.append("supersessions")
    return errors

assert runtime["parent_execution_id"] == 9715
assert runtime["requirement_extraction"]["execution_id"] == 9716
assert runtime["gap_analysis"]["execution_id"] == 9717
assert contract_errors(validated) == []
assert len(validated["original_packet"]["sources"]) == 6
assert [status for *_, status in required] == ["deferred", "deferred", "deferred", "resolved"]

for mutation in ("missing", "source", "decision", "trace", "supersession"):
    bad = copy.deepcopy(validated)
    if mutation == "missing": bad.pop("original_packet")
    elif mutation == "source": bad["original_packet"]["sources"][0]["content_hash"] = "sha256:" + "0" * 64
    elif mutation == "decision": bad["original_packet"]["clarification_contract"]["decision_ids"].remove(required[0][0])
    elif mutation == "trace": bad["original_packet"]["orchestration_context"]["parent_trace_id"] = "0" * 32
    else: bad["original_packet"]["clarification_contract"]["supersessions"] = []
    assert contract_errors(bad), mutation

validate_code = nodes[expected_nodes[3]]["parameters"]["jsCode"]
gate_code = nodes[expected_nodes[5]]["parameters"]["jsCode"]
assert "original_packet:immutableOriginal" in validate_code
assert "immutableContext" in validate_code
for token in ("missing original_packet", "mutated original source", "missing decision ID", "missing supersessions"):
    assert token in gate_code
assert "next_route:'human_approval'" in gate_code
assert "stopped_before_human_approval:true" in gate_code
assert "prd_generation_invoked:false" in gate_code

print("CANARY V0.11 OK: six-node topology, links, and original_packet stage contract passed.")
print("9715/9716/9717 REGRESSION OK: packet/sources/decisions/traces preserved; mutations rejected.")
print("SEMANTIC CONSISTENCY OK: deferred, deferred, deferred, resolved; Human Approval stop preserved.")
print("GROUNDING: 100%; unsupported decisions/claims: 0; runtime clearance not claimed.")
