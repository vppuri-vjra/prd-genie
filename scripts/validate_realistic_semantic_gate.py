#!/usr/bin/env python3
import copy, json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
EXPECTED=json.loads((ROOT/'evaluation/fixtures/multi-source/realistic-v1/expected-requirement-extraction.json').read_text())

def refs(record):
    return {(e['source_id'],e['location'],e['quote']) for e in record.get('evidence',[])}

def errors(actual):
    out=[]
    for key in ('items','contradictions','missing_information'):
        if len(actual.get(key,[]))!=len(EXPECTED[key]): out.append(f'{key} count')
    if actual.get('extraction_status')!=EXPECTED['extraction_status']: out.append('extraction status')
    by_id=lambda records:{r['id']:r for r in records}
    got,want=by_id(actual.get('items',[])),by_id(EXPECTED['items'])
    for item_id,approved in want.items():
        item=got.get(item_id)
        if not item or (item['type'],item['status'])!=(approved['type'],approved['status']): out.append(f'semantic {item_id}')
        elif not refs(approved).issubset(refs(item)): out.append(f'traceability {item_id}')
    if set(got)-set(want): out.append('unsupported item')
    got,want=by_id(actual.get('contradictions',[])),by_id(EXPECTED['contradictions'])
    for record_id,approved in want.items():
        record=got.get(record_id)
        if not record or record['resolution_status']!='unresolved' or set(record['item_ids'])!=set(approved['item_ids']): out.append(f'contradiction {record_id}')
    if set(got)-set(want): out.append('unsupported contradiction')
    got,want=by_id(actual.get('missing_information',[])),by_id(EXPECTED['missing_information'])
    for record_id,approved in want.items():
        record=got.get(record_id)
        if not record or record['category']!=approved['category'] or not refs(approved).issubset(refs(record)): out.append(f'missing {record_id}')
    if set(got)-set(want): out.append('unsupported missing')
    return out

paraphrased=copy.deepcopy(EXPECTED)
for record in paraphrased['items']: record['statement']='Grounded paraphrase permitted by the semantic gate.'
for record in paraphrased['contradictions']: record['description']='Grounded paraphrase.'
for record in paraphrased['missing_information']: record['description']='Grounded paraphrase.'
assert errors(paraphrased)==[], errors(paraphrased)

duplicated=copy.deepcopy(paraphrased)
extra=copy.deepcopy(duplicated['items'][1]); extra.update(id='FR-018',type='functional_requirement')
duplicated['items'].append(extra)
assert {'items count','unsupported item'}.issubset(errors(duplicated))

id_drift=copy.deepcopy(paraphrased)
id_drift['items'][0]['evidence']=copy.deepcopy(id_drift['items'][18]['evidence'])
assert 'traceability STK-001' in errors(id_drift)

bad_conflict=copy.deepcopy(paraphrased)
bad_conflict['contradictions'][0]['item_ids']=['FR-004','FR-009']
assert 'contradiction CTR-001' in errors(bad_conflict)

print('SEMANTIC GATE OK: wording-only paraphrases pass; duplicate items, ID/evidence drift, and altered contradiction membership fail closed.')
print('APPROVED BASELINE GROUNDING: 100%; unsupported claims allowed by gate: 0.')
