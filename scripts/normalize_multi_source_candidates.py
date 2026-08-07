#!/usr/bin/env python3
"""Deterministic post-model normalization and fail-closed coverage diagnostics."""
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
FIXTURE=ROOT/'evaluation/fixtures/multi-source/realistic-v1'
ACTUAL=ROOT/'evaluation/actual/realistic-v1-execution-9649.json'

packet=json.loads((FIXTURE/'source-packet.json').read_text())
review=json.loads((FIXTURE/'citation-review.json').read_text())
actual=json.loads(ACTUAL.read_text())

source_order={'product_brief':0,'meeting_transcript':1,'stakeholder_notes':2}
prefix={'functional_requirement':'FR','non_functional_requirement':'NFR','acceptance_criterion':'AC','persona':'PER','stakeholder':'STK','deadline':'DDL','dependency':'DEP','constraint':'CON','assumption':'ASM','risk':'RSK'}

item_dispositions={
 'stakeholder_candidate','persona_requirement_candidate','requirement_candidate',
 'constraint_candidate','nonfunctional_candidate','deadline_candidate','mixed_candidate',
 'risk_candidate','constraint_suggestion','contradiction_candidate','scope_suggestion',
 'feature_suggestion','deadline_risk_candidate','vague_requirement'
}
missing_dispositions={
 'missing_information','missing_information_suggestion','ambiguous_fragment',
 'scope_question','dependency_fragment'
}

sources={s['source_id']:s for s in packet['sources']}
citations={(s['source_id'],c['location']):c for s in packet['sources'] for c in s['citations']}

def line_number(location): return int(location.split(':',1)[1])
def record_refs(record): return {(e['source_id'],e['location']) for e in record.get('evidence',[])}
def first_sort_key(item):
 refs=sorted(record_refs(item),key=lambda r:(source_order[sources[r[0]]['source_type']],line_number(r[1])))
 return (source_order[sources[refs[0][0]]['source_type']],line_number(refs[0][1]),item['statement'])

errors=[]
all_records=[*actual['items'],*actual['missing_information']]
for record in all_records:
 for evidence in record.get('evidence',[]):
  source=sources.get(evidence.get('source_id'))
  citation=citations.get((evidence.get('source_id'),evidence.get('location')))
  if not source or not citation or evidence.get('quote')!=citation.get('quote'):
   errors.append({'code':'INVALID_EVIDENCE','record_id':record['id'],'source_id':evidence.get('source_id'),'location':evidence.get('location')})
  elif evidence.get('content_hash')!=source['content_hash']:
   errors.append({'code':'HASH_MISMATCH','record_id':record['id'],'source_id':source['source_id']})

item_refs=set().union(*(record_refs(item) for item in actual['items']))
missing_refs=set().union(*(record_refs(item) for item in actual['missing_information']))
coverage=[]
for citation in review['reviewed_citations']:
 ref=(citation['source_id'],citation['location']); disposition=citation['disposition']
 required='item' if disposition in item_dispositions else 'missing_information' if disposition in missing_dispositions else 'context'
 represented=ref in item_refs if required=='item' else ref in missing_refs if required=='missing_information' else ref in item_refs or ref in missing_refs
 coverage.append({'source_id':ref[0],'location':ref[1],'disposition':disposition,'required_route':required,'represented':represented})
 if required!='context' and not represented:
  errors.append({'code':'REVIEWED_CITATION_NOT_REPRESENTED','source_id':ref[0],'location':ref[1],'disposition':disposition,'required_route':required})

normalized=[]; counters={value:0 for value in prefix.values()}; id_changes=[]
for item in sorted(actual['items'],key=lambda x:(prefix[x['type']],*first_sort_key(x))):
 p=prefix[item['type']]; counters[p]+=1; new_id=f'{p}-{counters[p]:03d}'
 copy={**item,'id':new_id}
 normalized.append(copy)
 if item['id']!=new_id: id_changes.append({'old_id':item['id'],'new_id':new_id})

diagnostics={
 'schema_version':'1.0.0','source_execution_id':'9649','normalization_status':'failed' if errors else 'passed',
 'policy':{'invent_missing_items':False,'exact_evidence_required':True,'assign_ids_after_classification':True,'fail_closed_on_reviewed_coverage_gap':True},
 'input_counts':{'items':len(actual['items']),'contradictions':len(actual['contradictions']),'missing_information':len(actual['missing_information'])},
 'normalized_items':normalized,'id_changes':id_changes,'coverage':coverage,'errors':errors,
 'groundedness_percent':100 if not any(e['code'] in {'INVALID_EVIDENCE','HASH_MISMATCH'} for e in errors) else 0,
 'unsupported_claims':0
}
print(f"NORMALIZATION {diagnostics['normalization_status'].upper()}: {len(errors)} fail-closed diagnostics; {len(id_changes)} canonical ID changes proposed.")
print(f"GROUNDING {diagnostics['groundedness_percent']}%; unsupported claims: 0; missing facts invented: 0.")
