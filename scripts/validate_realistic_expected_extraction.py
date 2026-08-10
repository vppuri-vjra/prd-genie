#!/usr/bin/env python3
import hashlib, json
from pathlib import Path
from jsonschema import Draft202012Validator

ROOT=Path(__file__).resolve().parents[1]
FIXTURE=ROOT/'evaluation/fixtures/multi-source/realistic-v1'
packet=json.loads((FIXTURE/'source-packet.json').read_text())
output=json.loads((FIXTURE/'expected-requirement-extraction.json').read_text())
schema=json.loads((ROOT/'schemas/requirement-extraction.schema.json').read_text())
errors=sorted(Draft202012Validator(schema).iter_errors(output),key=lambda e:list(e.path))
if errors: raise SystemExit('Schema errors:\n'+'\n'.join(f"- {'/'.join(map(str,e.path))}: {e.message}" for e in errors))
sources={s['source_id']:s for s in packet['sources']}
citations={(s['source_id'],c['location']):c for s in packet['sources'] for c in s['citations']}
evidence=[ev for record in [*output['items'],*output['missing_information']] for ev in record.get('evidence',[])]
for x in evidence:
 s=sources.get(x.get('source_id')); assert s, f"unknown source {x.get('source_id')}"
 c=citations.get((x['source_id'],x['location'])); assert c, f"unknown citation {x['source_id']} {x['location']}"
 assert x['quote']==c['quote'] and x['source_name']==s['source_name'] and x['source_type']==s['source_type']
 assert x['content_hash']==s['content_hash']=='sha256:'+hashlib.sha256(s['raw_text'].encode()).hexdigest()
 if c.get('speaker'): assert x.get('speaker')==c['speaker']
ids=[x['id'] for x in output['items']]
assert len(ids)==len(set(ids)) and output['run_id']==packet['run_id'] and output['extraction_status']=='partial'
for c in output['contradictions']:
 assert c['resolution_status']=='unresolved' and set(c['item_ids']).issubset(ids)
assert (len(output['items']),len(output['contradictions']),len(output['missing_information']))==(44,4,12)
print(f"EXPECTED EXTRACTION OK: {len(output['items'])} items, {len(output['contradictions'])} unresolved contradictions, {len(output['missing_information'])} open-information entries.")
print(f"GROUNDING OK: {len(evidence)}/{len(evidence)} evidence references exactly preserve approved source citations and hashes (100%).")
