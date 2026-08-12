#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASELINE = ROOT / "workflows/n8n/prd-genie-s2-production-prd-v0.1.json"
CANDIDATE = ROOT / "workflows/n8n/prd-genie-s2-production-prd-v0.2-template-candidate.json"
TEMPLATE = ROOT / "resources/prd_template.md"

baseline = json.loads(BASELINE.read_text())
candidate = json.loads(CANDIDATE.read_text())

assert baseline["name"] == "S2_ Dynamic Production PRD Generator v0.1"
assert candidate["name"] == "S2_ Dynamic Production PRD v0.2 - Official Template Candidate"
assert baseline["active"] is False and candidate["active"] is False
assert candidate["meta"]["baseline_parent"] == "v0.3.3-unchanged"
assert candidate["meta"]["candidate_only"] is True
assert candidate["pinData"]["When Executed by Connected Parent"][0]["json"]["test_id"] == "T11-S2"
assert TEMPLATE.exists()

def node_code(workflow, name):
    return next(node["parameters"]["jsCode"] for node in workflow["nodes"] if node["name"] == name)

generation = node_code(candidate, "Generate Dynamic Grounded PRD")
coverage = node_code(candidate, "Validate Approval to PRD Coverage")
grounding = node_code(candidate, "Validate PRD Citation Grounding")

for heading in (
    "## 1. Product Overview",
    "## 2. Goals and Objectives",
    "## 3. User Personas",
    "## 4. Feature Requirements",
    "### 4.1 Functional Requirements",
    "### 4.2 Non-Functional Requirements",
    "## 5. Acceptance Criteria",
    "## 6. Out of Scope",
    "## 7. Dependencies",
    "## 8. Assumptions",
    "## 9. Open Questions",
    "## 10. Timeline",
):
    assert heading in generation
    assert heading in coverage

for compatibility_field in (
    "stage:'production_prd'",
    "approved_item_ids:a.approved_item_ids",
    "prd_elements:elements",
    "source_packet:a.source_packet",
    "citation_dispositions:a.citation_dispositions",
    "item_dispositions:a.item_dispositions",
    "next_route:'story_breakdown'",
):
    assert compatibility_field in json.dumps(candidate)

assert "TBD - stakeholder input required" in generation
assert "json_markdown_synchronized:true" in generation
assert "template_compliant:true" in generation
assert "unapproved PRD reference" in grounding
assert baseline == json.loads(BASELINE.read_text()), "baseline export changed during candidate validation"

print("S2 PRD TEMPLATE CANDIDATE PASS: baseline unchanged; candidate inactive; exact official headings, downstream envelope, TBD policy, coverage, synchronization, and grounding controls present.")
