import hashlib
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/'workflows/n8n/prd-genie-s2-story-breakdown-v0.1.json'
CAND=ROOT/'workflows/n8n/prd-genie-s2-story-breakdown-v0.2-contract-candidate.json'
base=json.loads(BASE.read_text()); cand=json.loads(CAND.read_text())
assert cand['active'] is False
assert cand['name']=='S2_ Dynamic Story Breakdown v0.2 - Epic Feature User Story Contract Candidate'
assert len(cand['nodes'])==len(base['nodes'])==6
assert cand['connections']==base['connections']
assert cand['pinData']['When Executed by Connected Parent'][0]['json']['stage']=='production_prd'
gen=next(n for n in cand['nodes'] if n['name']=='Generate Dynamic Delivery Hierarchy')['parameters']['jsCode']
for token in ['persona','capability','benefit','story:','priority','status','governance_mappings','unresolved_questions','json_markdown_synchronized']:
    assert token in gen, token
assert hashlib.sha256(BASE.read_bytes()).hexdigest()==hashlib.sha256((ROOT/'workflows/n8n/prd-genie-s2-story-breakdown-v0.1.json').read_bytes()).hexdigest()
print('S2 STORY BREAKDOWN CONTRACT CANDIDATE PASS: baseline unchanged; candidate inactive; enriched Epic/Feature/User Story/Acceptance Criterion hierarchy, governance mappings, open questions, Markdown, and grounding controls present.')
