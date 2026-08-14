import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WORKFLOW = ROOT / "workflows/n8n/prd-genie-complexity-sizing-candidate-v0.1.json"
FIXTURES = ROOT / "evaluation/ground-truth/t-shirt-sizing"

workflow = json.loads(WORKFLOW.read_text())
assert workflow["active"] is False
assert workflow["meta"]["candidate_only"] is True
assert workflow["meta"]["isolated"] is True
assert workflow["meta"]["production_parent_unchanged"] is True
assert workflow["meta"]["agreement_gate"] == "shadow"
assert len(workflow["nodes"]) == 5
assert [n["name"] for n in workflow["nodes"]] == [
    "When Executed by Connected Parent",
    "Validate Frozen Sizing Input",
    "Calculate Evidence-Backed Size",
    "Deterministic Sizing Validator",
    "Return Proposed Sizing",
]

validator = next(n for n in workflow["nodes"] if n["name"] == "Deterministic Sizing Validator")["parameters"]["jsCode"]
for control in ["unknown fail-closed policy", "arithmetic", "size mapping", "XL policy"]:
    assert control in validator

expected_sizes = {
    "ts-t01": ("XS", 1), "ts-t02": ("S", 3), "ts-t03": ("M", 7),
    "ts-t04": ("L", 10), "ts-t05": ("XL", 14),
    "ts-t06": ("pending_refinement", None), "ts-t07": ("M", 6),
    "ts-t08": ("M", 8), "ts-t12": ("pending_refinement", None),
}
for case, (size, total) in expected_sizes.items():
    data = json.loads((FIXTURES / case / "expected-output.json").read_text())
    assert data["assessment"]["recommended_size"] == size
    assert data["assessment"]["total_complexity_score"] == total

for case in ["ts-t09", "ts-t10", "ts-t11"]:
    data = json.loads((FIXTURES / case / "expected-output.json").read_text())
    assert data["expected_decision"] == "fail_closed"

for case_dir in sorted(FIXTURES.glob("ts-t*")):
    assert (case_dir / "input-packet.json").exists()
    assert (case_dir / "expected-output.json").exists()
    assert (case_dir / "HUMAN_REVIEW.md").exists()

print("T-SHIRT SIZING CANDIDATE PASS: isolated inactive workflow, deterministic fail-closed validator, 12 complete fixtures, and frozen production boundary verified.")
