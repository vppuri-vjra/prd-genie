import copy,hashlib,json,pathlib
R=pathlib.Path(__file__).resolve().parents[1]
a=json.loads((R/'evaluation/fixtures/multi-source/realistic-v1/realistic-v4-final-validation.json').read_text())
w=json.loads((R/'workflows/n8n/prd-genie-realistic-v4-final-validator-export-v0.1.json').read_text())
def validate(x):
 assert x['lineage']['story_execution_id']==9727 and x['lineage']['story_trace_id']=='f772ec699a437bc70de67ac124976161'
 assert x['counts']=={'epics':3,'features':4,'user_stories':7,'acceptance_criteria':12}
 assert x['coverage']=={'approved_scope':'19/19','sources':'6/6','decision_dispositions':'17/17'}
 assert len(x['source_manifest'])==6 and len(x['decision_dispositions'])==17
 assert x['validation']['orphan_items']==x['validation']['active_deferred_items']==x['validation']['active_superseded_items']==x['validation']['controlled_tbd_active_items']==x['validation']['unsupported_claims']==0
 assert x['validation']['groundedness_percent']==100 and x['validation']['json_markdown_synchronized']
 assert hashlib.sha256(x['final_export']['content'].encode()).hexdigest()==x['final_export']['sha256']
validate(a)
for path,value in [('counts.epics',2),('coverage.sources','5/6'),('validation.orphan_items',1),('validation.groundedness_percent',99),('lineage.story_execution_id',9726)]:
 x=copy.deepcopy(a);p=path.split('.');x[p[0]][p[1]]=value
 try: validate(x);raise AssertionError('negative accepted '+path)
 except AssertionError: pass
assert len(w['nodes'])==7 and len(w['connections'])==6 and not w['active']
assert w['nodes'][0]['type']=='n8n-nodes-base.manualTrigger'
assert all('jira' not in (n['name']+' '+n['type']).lower() and 'publish' not in n['name'].lower() for n in w['nodes'])
assert next(n for n in w['nodes'] if n['name']=='Send Final Validation Trace to Langfuse')['credentials']['httpBasicAuth']['name']=='Langfuse US - PRD Genie'
print(f"REALISTIC FINAL VALID: 7 nodes/6 connections; 3/4/7/12; 19/19; 6/6; 17/17; 0 orphans; 100% groundedness; 0 unsupported; export_sha256={a['final_export']['sha256']}")
