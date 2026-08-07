#!/usr/bin/env python3
import copy, hashlib, json, pathlib, subprocess
from jsonschema import Draft202012Validator

ROOT=pathlib.Path(__file__).resolve().parents[1]
BASE=ROOT/'evaluation/fixtures/multi-source/realistic-v1'
artifact=json.loads((BASE/'realistic-v4-story-breakdown.json').read_text())
schema=json.loads((ROOT/'schemas/realistic-story-breakdown.schema.json').read_text())
path=ROOT/'workflows/n8n/prd-genie-realistic-v4-story-breakdown-child-v0.2.json'
workflow=json.loads(path.read_text())
Draft202012Validator(schema).validate(artifact)

def hierarchy(candidate):
 epics=candidate['epics']
 features=[f for e in epics for f in e['features']]
 stories=[s for f in features for s in f['stories']]
 criteria=[a for s in stories for a in s['acceptance_criteria']]
 return epics,features,stories,criteria

def check(candidate):
 Draft202012Validator(schema).validate(candidate)
 levels=hierarchy(candidate)
 expected=(3,4,7,12)
 assert tuple(map(len,levels))==expected
 for level in levels:
  ids=[x['id'] for x in level]
  assert len(ids)==len(set(ids))
 # Repeated parent references are valid: a parent appears once in its own level,
 # independently of the number of child stories beneath it.
 assert len(levels[0][0]['features'][0]['stories'])==3
 assert len(levels[0])==len({x['id'] for x in levels[0]})
 assert len(candidate['coverage_ledger'])==19
 assert len({x['approved_item_id'] for x in candidate['coverage_ledger']})==19
 assert all(not x['active_delivery_scope'] for x in candidate['scope_dispositions'])
 assert candidate['validation']=={'approved_scope_coverage':'19/19','orphan_items':0,'active_deferred_items':0,'active_superseded_items':0,'controlled_tbd_active_items':0,'json_markdown_synchronized':True,'groundedness_percent':100,'unsupported_claims':0}

check(artifact)
for index,label in enumerate(('Epic','Feature','User Story','Acceptance Criterion')):
 bad=copy.deepcopy(artifact)
 levels=hierarchy(bad)
 levels[index][1]['id']=levels[index][0]['id']
 try: check(bad)
 except Exception: pass
 else: raise AssertionError(f'true duplicate {label} accepted')

assert workflow['name']=='PRD Genie - Realistic v4 Story Breakdown Child v0.2'
assert len(workflow['nodes'])==7 and len(workflow['connections'])==6 and workflow['active'] is False
assert workflow['nodes'][0]['parameters']=={'inputSource':'passthrough'}
assert not any(any(term in n['name'].lower() for term in ('jira','publish stor','create issue')) for n in workflow['nodes'])
send=next(n for n in workflow['nodes'] if n['name']=='Send Story Trace to Langfuse')
assert send['parameters']['authentication']=='genericCredentialType'
assert send['parameters']['genericAuthType']=='httpBasicAuth'
code=next(n for n in workflow['nodes'] if n['name']=='Build and Validate Deterministic Breakdown')['parameters']['jsCode']
for required in ('epicIds','featureIds','storyIds','criterionIds','duplicate Epic IDs','duplicate Feature IDs','duplicate User Story IDs','duplicate Acceptance Criterion IDs'):
 assert required in code
for node in workflow['nodes']:
 js=node.get('parameters',{}).get('jsCode')
 if js: subprocess.run(['node','-e','new Function('+json.dumps(js)+');'],check=True,capture_output=True,text=True)

sha=hashlib.sha256(path.read_bytes()).hexdigest()
print(f'REALISTIC STORY v0.2 VALID: 3 epics, 4 features, 7 stories, 12 criteria; true duplicates rejected at 4/4 levels; repeated parent references accepted; 19/19 coverage; 0 orphans; 100% groundedness; 0 unsupported; sha256={sha}')
