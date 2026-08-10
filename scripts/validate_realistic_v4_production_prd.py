#!/usr/bin/env python3
import copy, hashlib, json, pathlib, subprocess
from jsonschema import Draft202012Validator, FormatChecker

ROOT=pathlib.Path(__file__).resolve().parents[1]
FIX=ROOT/'evaluation/fixtures/multi-source/realistic-v1'
artifact=json.loads((FIX/'realistic-v4-production-prd.json').read_text())
packet=json.loads((FIX/'source-packet-v4.json').read_text())
matrix=json.loads((FIX/'decision-to-prd-disposition-v4.json').read_text())
workflow=json.loads((ROOT/'workflows/n8n/prd-genie-realistic-v4-production-prd-generator-v0.1.json').read_text())
schema=json.loads((ROOT/'schemas/prd-output.schema.json').read_text())
Draft202012Validator(schema,format_checker=FormatChecker()).validate(artifact['prd'])

assert artifact['packet_id']=='SP-REALISTIC-PB-MT-SN-CLAR-V4'
assert artifact['run_id']=='RUN-REALISTIC-MULTI-SOURCE-V4'
assert artifact['parent_trace_id']=='26c7466f817aa1511f4a4e239bb52a62'
assert artifact['human_approval']=={'execution_id':9724,'trace_id':'f4e298e120d6503b5dfac4688adae1db','reviewer':'Vipin','decision_date':'2026-08-07','review_status':'approved'}
ledger=artifact['provenance_ledger']
assert len(ledger['approved_item_coverage'])==19 and {x['item_id'] for x in ledger['approved_item_coverage']}==set(matrix['approved_first_release_item_ids'])
assert len(ledger['decision_dispositions'])==17 and len({x['decision_id'] for x in ledger['decision_dispositions']})==17
assert sum(x['disposition']=='superseded' for x in ledger['decision_dispositions'])==2
assert set(matrix['effective_decision_ids'])=={x['decision_id'] for x in ledger['decision_dispositions'] if x['disposition']!='superseded'}
assert len(ledger['source_manifest'])==6
for source in packet['sources']:
    raw_hash='sha256:'+hashlib.sha256(source['raw_text'].encode()).hexdigest()
    assert raw_hash==source['content_hash']
    assert any(x['source_id']==source['source_id'] and x['content_hash']==source['content_hash'] for x in ledger['source_manifest'])
for d in ledger['decision_dispositions']:
    assert d['decision_id'] in artifact['markdown']
    assert d['required_prd_citation_label'] in artifact['markdown']
    assert d['decision_citation']['content_hash'].startswith('sha256:')

active=json.dumps(artifact['prd'],ensure_ascii=False)
for stale in ('every 5 seconds for now','user-facing export label as “Export to CSV.”','mobile as a fast follow','decision deadline 2026-08-31','due 2026-08-14'):
    assert stale not in active
for deferred in ('churn-threshold alerting','undefined AI capability','churn prediction','white-labeling'):
    assert not any(deferred.lower() in x['requirement'].lower() for x in artifact['prd']['functional_requirements'])
    assert any(deferred.lower() in x['value'].lower() for x in artifact['prd']['out_of_scope'])
assert artifact['validation']=={'approved_item_coverage':'19/19','disposition_coverage':'17/17','effective_decision_coverage':'15/15','superseded_audit_coverage':'2/2','source_coverage':'6/6','json_markdown_synchronized':True,'groundedness_percent':100,'unsupported_claims':0,'story_breakdown_invoked':False}

assert workflow['name']=='PRD Genie - Realistic v4 Production PRD Generator v0.1'
assert len(workflow['nodes'])==7 and len(workflow['connections'])==6 and workflow['active'] is False
assert not any('Story Breakdown' in n['name'] and n['name']!='Return PRD and Stop Before Story Breakdown' for n in workflow['nodes'])
for n in workflow['nodes']:
    code=n.get('parameters',{}).get('jsCode')
    if code: subprocess.run(['node','-e','new Function('+json.dumps(code)+');'],check=True,capture_output=True,text=True)

def check(bad):
    l=bad['provenance_ledger']; assert len(l['approved_item_coverage'])==19; assert len({x['item_id'] for x in l['approved_item_coverage']})==19
    assert len(l['decision_dispositions'])==17; assert len({x['decision_id'] for x in l['decision_dispositions']})==17
    assert all(x.get('decision_citation') for x in l['decision_dispositions']); assert len(l['source_manifest'])==6
    assert bad['validation']['unsupported_claims']==0 and bad['validation']['groundedness_percent']==100
for mode in ('item_drop','decision_duplicate','citation_drop','source_drop','grounding'):
    bad=copy.deepcopy(artifact)
    if mode=='item_drop': bad['provenance_ledger']['approved_item_coverage'].pop()
    elif mode=='decision_duplicate': bad['provenance_ledger']['decision_dispositions'][-1]['decision_id']=bad['provenance_ledger']['decision_dispositions'][0]['decision_id']
    elif mode=='citation_drop': bad['provenance_ledger']['decision_dispositions'][0]['decision_citation']=None
    elif mode=='source_drop': bad['provenance_ledger']['source_manifest'].pop()
    else: bad['validation']['unsupported_claims']=1
    try: check(bad)
    except AssertionError: pass
    else: raise AssertionError('negative mutation accepted: '+mode)

sha=hashlib.sha256((ROOT/'workflows/n8n/prd-genie-realistic-v4-production-prd-generator-v0.1.json').read_bytes()).hexdigest()
print(f'REALISTIC V4 PRD VALID: 19/19 items, 17/17 dispositions, 15/15 effective, 2/2 superseded, 6/6 sources, 100% groundedness, 0 unsupported; sha256={sha}')
