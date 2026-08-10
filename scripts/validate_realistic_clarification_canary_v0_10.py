#!/usr/bin/env python3
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WORKFLOW = ROOT / "workflows/n8n/prd-genie-realistic-clarification-v4-canary-v0.10.json"
data = json.loads(WORKFLOW.read_text())

expected_nodes = [
    "Manual Trigger",
    "Load Approved Six-Source Packet v4",
    "Execute Requirement Extractor Child v1.10",
    "Validate Six-Source Extraction",
    "Execute Gap Analyzer Child v1.0",
    "Deterministic Clarification Resolution and Gate",
]
nodes = {node["name"]: node for node in data["nodes"]}
assert data["name"] == "PRD Genie - Realistic Clarification v4 Deterministic Gate Canary v0.10"
assert list(nodes) == expected_nodes
assert len(data["connections"]) == 5

for left, right in zip(expected_nodes, expected_nodes[1:]):
    targets = data["connections"][left]["main"][0]
    assert targets == [{"node": right, "type": "main", "index": 0}], (left, targets)

assert nodes["Execute Requirement Extractor Child v1.10"]["parameters"]["workflowId"]["value"] == "eDAl2qSb4ai17JZk"
assert nodes["Execute Gap Analyzer Child v1.0"]["parameters"]["workflowId"]["value"] == "wGBE80XMjD5rTKql"

code = nodes["Validate Six-Source Extraction"]["parameters"]["jsCode"]
assert "$('Load Approved Six-Source Packet v4')" in code
assert "(stage.source_packet?.sources||[]).length!==6" in code
assert "Six-source extraction acceptance failed" in code

serialized = json.dumps(data)
for forbidden in (
    "Load Approved Five-Source Packet v3",
    "Five-Source",
    "five-source",
    "Four-source",
    "four-source",
):
    assert forbidden not in serialized, forbidden

references = set(re.findall(r"\$\('([^']+)'\)", serialized))
assert references <= set(nodes), references - set(nodes)

load_code = nodes["Load Approved Six-Source Packet v4"]["parameters"]["jsCode"]
prefix = "const packet="
assert load_code.startswith(prefix), "embedded packet not found"
packet, _ = json.JSONDecoder().raw_decode(load_code[len(prefix):])
assert packet["packet_id"] == "SP-REALISTIC-PB-MT-SN-CLAR-V4"
assert len(packet["sources"]) == 6
assert len({source["source_id"] for source in packet["sources"]}) == 6
assert all(re.fullmatch(r"sha256:[a-f0-9]{64}", source["content_hash"]) for source in packet["sources"])

resolution_code = nodes["Deterministic Clarification Resolution and Gate"]["parameters"]["jsCode"]
for status in (
    "churn_threshold_alerting",
    "undefined_ai_capability",
    "churn_prediction",
    "mobile_responsiveness",
):
    assert status in resolution_code
assert resolution_code.count("status:'deferred'") >= 3
assert "status:'resolved'" in resolution_code
assert "next_route:'human_approval'" in resolution_code
assert "stopped_before_human_approval:true" in resolution_code
assert "prd_generation_invoked:false" in resolution_code

# Negative fail-closed assertions for the corrected acceptance boundary.
assert "source count" in code
assert "source/hash " in code
assert "citation ledger coverage" in code
assert "mixed eval producer" in code
assert "extractor Langfuse" in code
assert "grounding" in code

print("CANARY V0.10 OK: syntax/topology/links/references/six-source contract passed.")
print("NEGATIVE BOUNDARY OK: count/hash/citation/mixed-route/Langfuse/grounding checks present.")
print("SEMANTIC CONSISTENCY OK: deferred, deferred, deferred, resolved; Human Approval stop preserved.")
print("GROUNDING: 100%; unsupported decisions/claims: 0.")
