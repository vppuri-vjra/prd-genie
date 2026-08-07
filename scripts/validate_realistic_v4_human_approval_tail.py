#!/usr/bin/env python3
import copy, hashlib, json, pathlib, subprocess, tempfile

ROOT = pathlib.Path(__file__).resolve().parents[1]
FIX = ROOT / "evaluation/fixtures/multi-source/realistic-v1"
matrix = json.loads((FIX / "decision-to-prd-disposition-v4.json").read_text())
envelope = json.loads((FIX / "human-approval-v4-input.json").read_text())
workflow = json.loads((ROOT / "workflows/n8n/prd-genie-realistic-v4-human-approval-tail-v0.1.json").read_text())

allowed = {"included_first_release", "deferred_out_of_first_release", "controlled_tbd", "superseded"}
assert len(matrix["records"]) == 17
assert len({r["decision_id"] for r in matrix["records"]}) == 17
assert len(matrix["effective_decision_ids"]) == 15
assert all(r["disposition"] in allowed for r in matrix["records"])
assert sum(r["disposition"] == "superseded" for r in matrix["records"]) == 2
assert {r["decision_id"] for r in matrix["records"] if r["disposition"] == "superseded"} == {
    "DEC-2026-08-07-GAP-008", "DEC-2026-08-07-GAP-014"
}
assert all(r["decision_citation"]["content_hash"].startswith("sha256:") for r in matrix["records"])
assert all("Stakeholder Clarification, Vipin, 2026-08-07" in r["required_prd_citation_label"] for r in matrix["records"])
assert matrix["validation"] == {"decision_coverage":"17/17","effective_decision_coverage":"15/15","groundedness_percent":100,"unsupported_claims":0}
assert envelope["accepted_runtime_evidence"]["parent_trace_id"] == "26c7466f817aa1511f4a4e239bb52a62"
assert envelope["accepted_runtime_evidence"]["groundedness_percent"] == 100
assert envelope["accepted_runtime_evidence"]["unsupported_claims"] == 0
assert envelope["original_packet"]["packet_id"] == "SP-REALISTIC-PB-MT-SN-CLAR-V4"
assert len(envelope["original_packet"]["sources"]) == 6
assert envelope["approval_allowlist"]["effective_decision_ids"] == matrix["effective_decision_ids"]
assert envelope["approval_allowlist"]["approved_item_ids"] == matrix["approved_first_release_item_ids"]

nodes = workflow["nodes"]
assert workflow["name"] == "PRD Genie - Realistic v4 Human Approval Tail v0.1"
assert len(nodes) == 9 and len(workflow["connections"]) == 8
assert not workflow["active"]
assert not any("PRD Generator" in n["name"] for n in nodes)
assert nodes[-1]["name"] == "Return Approved Package and Stop Before PRD"
assert nodes[-1]["parameters"]["jsCode"].find("prd_generation_invoked:false") >= 0
assert nodes[-1]["parameters"]["jsCode"].find("decision_disposition_matrix") >= 0
send = next(n for n in nodes if n["name"] == "Send Signed Approval Trace to Langfuse")
assert send["parameters"]["authentication"] == "genericCredentialType"
assert send["parameters"]["genericAuthType"] == "httpBasicAuth"

for node in nodes:
    code = node.get("parameters", {}).get("jsCode")
    if code:
        wrapped = "new Function(" + json.dumps(code) + ");"
        subprocess.run(["node", "-e", wrapped], check=True, capture_output=True, text=True)

# Fail-closed negative cases mirror runtime checks.
def check(obj):
    records = obj["disposition_matrix"]["records"]
    assert len(records) == 17
    assert len({r["decision_id"] for r in records}) == 17
    assert len(obj["disposition_matrix"]["effective_decision_ids"]) == 15
    assert all(r.get("decision_citation") and r["decision_maker"] == "Vipin" and r["decision_date"] == "2026-08-07" for r in records)
    assert all(r.get("supersession", {}).get("superseded_by") for r in records if r["disposition"] == "superseded")

for mutate in ("drop", "duplicate", "citation", "supersession"):
    bad = copy.deepcopy(envelope)
    rs = bad["disposition_matrix"]["records"]
    if mutate == "drop": rs.pop()
    elif mutate == "duplicate": rs[-1]["decision_id"] = rs[0]["decision_id"]
    elif mutate == "citation": rs[0]["decision_citation"] = None
    else: next(r for r in rs if r["disposition"] == "superseded")["supersession"] = None
    try:
        check(bad)
    except (AssertionError, AttributeError):
        pass
    else:
        raise AssertionError(f"negative mutation accepted: {mutate}")

sha = hashlib.sha256((ROOT / "workflows/n8n/prd-genie-realistic-v4-human-approval-tail-v0.1.json").read_bytes()).hexdigest()
print(f"HUMAN APPROVAL TAIL VALID: 17/17 decisions, 15/15 effective, 100% groundedness, 0 unsupported; sha256={sha}")
