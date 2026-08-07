#!/usr/bin/env python3
import copy, hashlib, json, pathlib, subprocess
from jsonschema import Draft202012Validator

ROOT=pathlib.Path(__file__).resolve().parents[1]
BASE=ROOT/'evaluation/fixtures/multi-source/realistic-v1'
artifact=json.loads((BASE/'realistic-v4-story-breakdown.json').read_text())
prd=json.loads((BASE/'realistic-v4-production-prd.json').read_text())
schema=json.loads((ROOT/'schemas/realistic-story-breakdown.schema.json').read_text())
workflow_path=ROOT/'workflows/n8n/prd-genie-realistic-v4-story-breakdown-child-v0.1.json'
workflow=json.loads(workflow_path.read_text())
Draft202012Validator(schema).validate(artifact)

assert artifact['lineage']=={
 'packet_id':'SP-REALISTIC-PB-MT-SN-CLAR-V4','run_id':'RUN-REALISTIC-MULTI-SOURCE-V4',
 'parent_trace_id':'26c7466f817aa1511f4a4e239bb52a62','approval_execution_id':9724,
 'approval_trace_id':'f4e298e120d6503b5dfac4688adae1db','prd_execution_id':9725,
 'prd_trace_id':'f8879ebe22d888152a77f892230c62ba'}
epics=artifact['epics']; features=[f for e in epics for f in e['features']]; stories=[s for f in features for s in f['stories']]; criteria=[a for s in stories for a in s['acceptance_criteria']]
assert (len(epics),len(features),len(stories),len(criteria))==(3,4,7,12)
assert len({x['id'] for x in epics+features+stories+criteria})==26
approved={x['item_id'] for x in prd['provenance_ledger']['approved_item_coverage']}
coverage=artifact['coverage_ledger']
assert len(coverage)==19 and {x['approved_item_id'] for x in coverage}==approved
active_refs={r for e in epics for r in e['source_refs']}
for e in epics:
 for f in e['features']:
  assert set(f['source_refs']) <= set(e['source_refs']) | approved | {x['decision_id'] for x in prd['provenance_ledger']['decision_dispositions']}
  for s in f['stories']:
   assert s['source_refs'] and s['acceptance_criteria']
   for a in s['acceptance_criteria']: assert set(a['source_refs']) <= set(s['source_refs'])
all_known=approved|{x['decision_id'] for x in prd['provenance_ledger']['decision_dispositions']}
for e in epics:
 for f in e['features']:
  for s in f['stories']:
   assert set(s['source_refs'])<=all_known
deferred={x['decision_id'] for x in prd['provenance_ledger']['decision_dispositions'] if x['disposition']!='included_first_release'}
story_refs={r for s in stories for r in s['source_refs']}
assert not deferred & story_refs
assert len(artifact['scope_dispositions'])==7 and all(not x['active_delivery_scope'] for x in artifact['scope_dispositions'])
assert artifact['provenance_ledger']['source_manifest']==prd['provenance_ledger']['source_manifest']
assert artifact['provenance_ledger']['decision_dispositions']==prd['provenance_ledger']['decision_dispositions']
assert artifact['markdown']==(BASE/'realistic-v4-story-breakdown.md').read_text()
for e in epics:
 assert e['id'] in artifact['markdown']
 for f in e['features']:
  assert f['id'] in artifact['markdown']
  for s in f['stories']:
   assert s['id'] in artifact['markdown'] and s['story'] in artifact['markdown']
assert artifact['validation']=={'approved_scope_coverage':'19/19','orphan_items':0,'active_deferred_items':0,'active_superseded_items':0,'controlled_tbd_active_items':0,'json_markdown_synchronized':True,'groundedness_percent':100,'unsupported_claims':0}

assert workflow['name']=='PRD Genie - Realistic v4 Story Breakdown Child v0.1'
assert len(workflow['nodes'])==7 and len(workflow['connections'])==6 and workflow['active'] is False
assert workflow['nodes'][0]['type']=='n8n-nodes-base.executeWorkflowTrigger'
assert workflow['nodes'][0]['parameters']=={'inputSource':'passthrough'}
assert not any('Final Validation' in n['name'] for n in workflow['nodes'])
send=next(n for n in workflow['nodes'] if n['name']=='Send Story Trace to Langfuse')
assert send['parameters']['authentication']=='genericCredentialType' and send['parameters']['genericAuthType']=='httpBasicAuth'
for node in workflow['nodes']:
 code=node.get('parameters',{}).get('jsCode')
 if code: subprocess.run(['node','-e','new Function('+json.dumps(code)+');'],check=True,capture_output=True,text=True)

def validate(candidate):
 Draft202012Validator(schema).validate(candidate)
 assert len(candidate['coverage_ledger'])==19
 assert len({x['approved_item_id'] for x in candidate['coverage_ledger']})==19
 assert not any(x['active_delivery_scope'] for x in candidate['scope_dispositions'])
 assert candidate['validation']['groundedness_percent']==100 and candidate['validation']['unsupported_claims']==0
 assert candidate['provenance_ledger']['source_manifest']==prd['provenance_ledger']['source_manifest']

for mode in ('drop_coverage','duplicate_coverage','activate_deferred','tamper_hash','unsupported','orphan'):
 bad=copy.deepcopy(artifact)
 if mode=='drop_coverage': bad['coverage_ledger'].pop()
 elif mode=='duplicate_coverage': bad['coverage_ledger'][-1]['approved_item_id']=bad['coverage_ledger'][0]['approved_item_id']
 elif mode=='activate_deferred': bad['scope_dispositions'][0]['active_delivery_scope']=True
 elif mode=='tamper_hash': bad['provenance_ledger']['source_manifest'][0]['content_hash']='sha256:'+'0'*64
 elif mode=='unsupported': bad['validation']['unsupported_claims']=1
 else: bad['validation']['orphan_items']=1
 try: validate(bad)
 except Exception: pass
 else: raise AssertionError('negative mutation accepted: '+mode)

sha=hashlib.sha256(workflow_path.read_bytes()).hexdigest()
print(f'REALISTIC V4 STORY BREAKDOWN VALID: 3 epics, 4 features, 7 stories, 12 criteria, 19/19 approved coverage, 0 orphans, 100% groundedness, 0 unsupported; sha256={sha}')
