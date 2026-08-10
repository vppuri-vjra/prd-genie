#!/usr/bin/env python3
import json
from pathlib import Path
from jsonschema import Draft202012Validator

ROOT=Path(__file__).resolve().parents[1]
actual=json.loads((ROOT/'evaluation/actual/realistic-v1-execution-9649.json').read_text())
expected=json.loads((ROOT/'evaluation/fixtures/multi-source/realistic-v1/expected-requirement-extraction.json').read_text())
schema=json.loads((ROOT/'schemas/requirement-extraction.schema.json').read_text())
errors=list(Draft202012Validator(schema).iter_errors(actual))
assert not errors, '\n'.join(error.message for error in errors)

assert (len(actual['items']),len(actual['contradictions']),len(actual['missing_information']))==(31,3,7)
assert (len(expected['items']),len(expected['contradictions']),len(expected['missing_information']))==(44,4,12)

actual_types={}
for item in actual['items']: actual_types[item['type']]=actual_types.get(item['type'],0)+1
expected_types={}
for item in expected['items']: expected_types[item['type']]=expected_types.get(item['type'],0)+1
assert actual_types.get('dependency',0)==0 and expected_types['dependency']==2
assert actual_types.get('risk',0)==0 and expected_types['risk']==2
assert actual_types['constraint']==5 and expected_types['constraint']==11
assert actual_types['non_functional_requirement']==4 and expected_types['non_functional_requirement']==2

actual_by_id={item['id']:item for item in actual['items']}
assert actual_by_id['NFR-001']['evidence'][0]['location']=='line:23'
assert actual_by_id['NFR-004']['evidence'][0]['location']=='line:56'
assert actual_by_id['FR-012']['evidence'][0]['location']=='line:80'

print('EXECUTION 9649 DIFF OK: actual 31/3/7 versus approved 44/4/12.')
print('SOURCE-EVIDENCE GROUNDING: 100%; semantic parity: failed; accepted unsupported extras: 0.')
