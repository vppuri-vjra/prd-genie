#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CANDIDATE = ROOT / "workflows/n8n/prd-genie-s2-production-prd-v0.2.1-template-langfuse-candidate.json"
data = json.loads(CANDIDATE.read_text())

assert data["active"] is False
assert data["meta"]["candidate_only"] is True
assert data["meta"]["baseline_parent"] == "v0.3.3-unchanged"
assert data["pinData"]["When Executed by Connected Parent"][0]["json"]["test_id"] == "T11-S2"

nodes = {node["name"]: node for node in data["nodes"]}
assert len(nodes) == 8
for name in (
    "Generate Dynamic Grounded PRD",
    "Validate Approval to PRD Coverage",
    "Validate PRD Citation Grounding",
    "Send Production Shadow Trace to Langfuse",
    "Verify Production Shadow Trace Ingestion",
):
    assert name in nodes

send = nodes["Send Production Shadow Trace to Langfuse"]
assert send["type"] == "n8n-nodes-base.httpRequest"
assert "langfuse" in send["parameters"]["url"]
assert send.get("credentials"), "Langfuse credential reference missing"
verify = nodes["Verify Production Shadow Trace Ingestion"]["parameters"]["jsCode"]
assert "ingestion" in verify.lower()
generation = nodes["Generate Dynamic Grounded PRD"]["parameters"]["jsCode"]
assert "official-prd-template-v1" in generation
assert "No approved personas were supplied." in generation
assert "No dependencies were specified in the approved inputs." in generation

print("S2 PRD TEMPLATE LANGFUSE CANDIDATE PASS: inactive eight-node candidate; approved template logic; pinned T11-S2 fixture; proven credential-bound ingestion and verification nodes retained.")
