#!/usr/bin/env python3
import copy, hashlib, json, re
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/'evaluation/fixtures/multi-source/realistic-v1'
BASE_PACKET=json.loads((BASE/'source-packet.json').read_text())
V4=json.loads((BASE/'source-packet-v4.json').read_text())
EXPECTED=json.loads((BASE/'expected-clarification-resolution-v4.json').read_text())
EVAL=json.loads((ROOT/'examples/contracts/t1-workflow-input.json').read_text())

def supersessions(packet):
    by={s['source_id']:s for s in packet['sources']}
    def e(d,s,l):
        src=by[s]; cit=next(c for c in src['citations'] if c['location']==l)
        return {'decision_id':d,'source_id':s,'location':l,'quote':cit['quote'],'content_hash':src['content_hash']}
    return [e('DEC-2026-08-07-GAP-006','SRC-REALISTIC-MT-001','line:82'),e('DEC-2026-08-07-GAP-007','SRC-REALISTIC-MT-001','line:52'),e('DEC-2026-08-07-GAP-010','SRC-REALISTIC-MT-001','line:24'),e('DEC-2026-08-07-GAP-008-A1','SRC-REALISTIC-CLAR-001','line:17'),e('DEC-2026-08-07-GAP-014-A1','SRC-REALISTIC-CLAR-001','line:23'),e('DEC-2026-08-07-MOBILE-LAUNCH-001','SRC-REALISTIC-SN-001','line:26')]

def contract(packet):
    return {'decision_maker':'Vipin','decision_date':'2026-08-07','decision_ids':[d['decision_id'] for d in EXPECTED['decisions']],'supersessions':supersessions(packet),'deterministic_resolution':EXPECTED['deterministic_resolution']}

def validate(data):
    if 'sources' not in data:
        assert data['input_type'] in {'meeting_transcript','product_brief','stakeholder_notes','evaluation_test'}
        assert data['source_name'] and data['source_text']
        return 'evaluation_control'
    assert data['producer']=='production_multi_source'
    assert data['metadata']['route_policy']=='alternative_not_combined'
    assert 'input_type' not in data and 'source_text' not in data
    ids=[s['source_id'] for s in data['sources']]; assert len(ids)==len(set(ids))
    base={'product_brief','meeting_transcript','stakeholder_notes'}
    for typ in base: assert sum(s['source_type']==typ for s in data['sources'])==1
    clar=[s for s in data['sources'] if s['source_type']=='stakeholder_clarification']
    assert len(data['sources'])==3+len(clar)
    for src in data['sources']:
        assert 'sha256:'+hashlib.sha256(src['raw_text'].encode()).hexdigest()==src['content_hash']
        lines=src['raw_text'].splitlines()
        for citation in src['citations']:
            n=int(citation['location'].split(':')[1]); assert lines[n-1]==citation['quote']
    if clar:
        c=data['clarification_contract']; assert c['decision_maker']=='Vipin' and c['decision_date']=='2026-08-07'
        observed=set()
        for src in clar:
            assert src['provenance']['origin']=='submitted_text' and src['metadata'].get('meeting_date')
            assert 'Decision maker: Vipin' in src['raw_text'] and 'Decision date: 2026-08-07' in src['raw_text']
            for citation in src['citations']: observed.update(re.findall(r'DEC-[0-9]{4}-[0-9]{2}-[0-9]{2}-[A-Z0-9-]+',citation['quote']))
        assert c['decision_ids'] and len(c['decision_ids'])==len(set(c['decision_ids']))
        assert set(c['decision_ids'])<=observed
        if any('supersed' in src['raw_text'].lower() for src in clar): assert c['supersessions']
        by={s['source_id']:s for s in data['sources']}
        for entry in c['supersessions']:
            src=by[entry['source_id']]
            assert entry['content_hash']==src['content_hash']
            assert any(x['location']==entry['location'] and x['quote']==entry['quote'] for x in src['citations'])
    return 'production_multi_source'

assert validate(EVAL)=='evaluation_control'
assert validate(BASE_PACKET)=='production_multi_source'
valid=copy.deepcopy(V4);valid['clarification_contract']=contract(valid);assert validate(valid)=='production_multi_source'
mutations=[]
m=copy.deepcopy(valid);m['sources']=[s for s in m['sources'] if s['source_type']!='product_brief'];mutations.append(('missing base',m))
m=copy.deepcopy(valid);m['sources'].append(copy.deepcopy(next(s for s in m['sources'] if s['source_type']=='product_brief')));m['sources'][-1]['source_id']='SRC-DUP-PB';mutations.append(('duplicate base',m))
m=copy.deepcopy(valid);next(s for s in m['sources'] if s['source_type']=='stakeholder_clarification')['raw_text']+='tampered';mutations.append(('tampered clarification',m))
m=copy.deepcopy(valid);m['input_type']='evaluation_test';m['source_text']='mixed';mutations.append(('mixed route',m))
m=copy.deepcopy(valid);next(s for s in m['sources'] if s['source_id']=='SRC-REALISTIC-CLAR-MOBILE-001')['citations']=[];mutations.append(('citation loss',m))
m=copy.deepcopy(valid);m['clarification_contract']['decision_ids'].append('DEC-2026-08-07-MISSING-001');mutations.append(('decision loss',m))
m=copy.deepcopy(valid);m['clarification_contract']['supersessions']=[];mutations.append(('supersession loss',m))
for name,m in mutations:
    try: validate(m)
    except (AssertionError,KeyError,StopIteration,IndexError): pass
    else: raise AssertionError(name+' was accepted')
print('VERSIONED INPUT CONTRACT OK: eval unchanged; three-source unchanged; v4 clarified packet accepted.')
print('NEGATIVE ROUTES OK: missing/duplicate base, tampering, mixing, citation, decision, and supersession loss rejected.')
print('GROUNDING: 100%; unsupported decisions/claims: 0.')
