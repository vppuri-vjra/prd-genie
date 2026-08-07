#!/usr/bin/env python3
import copy, hashlib, json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / 'evaluation/fixtures/multi-source/realistic-v1'
V3 = json.loads((BASE / 'source-packet-v3.json').read_text())
V4 = json.loads((BASE / 'source-packet-v4.json').read_text())
ART = json.loads((BASE / 'stakeholder-clarification-mobile-release-2026-08-07.json').read_text())
EXP = json.loads((BASE / 'expected-clarification-resolution-v4.json').read_text())
RAW = (BASE / 'stakeholder-clarification-mobile-release-2026-08-07.md').read_text()
DIGEST = 'sha256:' + hashlib.sha256(RAW.encode()).hexdigest()

def validate(packet=V4, artifact=ART, expected=EXP):
    assert packet['sources'][:5] == V3['sources'] and len(packet['sources']) == 6
    assert packet['packet_id'] == 'SP-REALISTIC-PB-MT-SN-CLAR-V4'
    source = packet['sources'][5]
    assert source['source_id'] == 'SRC-REALISTIC-CLAR-MOBILE-001'
    assert source['raw_text'] == RAW and source['content_hash'] == DIGEST
    decision = artifact['decisions'][0]
    assert decision['decision_id'] == 'DEC-2026-08-07-MOBILE-LAUNCH-001'
    assert decision['decision_maker'] == 'Vipin' and decision['decision_date'] == '2026-08-07'
    assert decision['downstream_item_ids'] == ['NFR-002', 'CON-011', 'DDL-001']
    assert decision['resolution'] == {'classification':'resolved','release_date':'2026-09-30','required_at_launch':True,'desktop_first_sequence_allowed':True,'post_launch_fast_follow_allowed':False}
    by_source = {s['source_id']: s for s in packet['sources']}
    for evidence in decision['original_evidence']:
        src = by_source[evidence['source_id']]
        citation = next(c for c in src['citations'] if c['location'] == evidence['location'])
        assert evidence['quote'] == citation['quote'] and evidence['content_hash'] == src['content_hash']
    clarification = decision['clarification_source_citation']
    assert clarification['content_hash'] == DIGEST and clarification['quote'] == RAW.splitlines()[8]
    assert decision['supersedes'][0]['location'] == 'line:26'
    classes = {x['key']: x for x in expected['deterministic_resolution']['classifications']}
    assert classes == {
      'churn_threshold_alerting': {'key':'churn_threshold_alerting','decision_id':'DEC-2026-08-07-GAP-002','status':'deferred','blocking':False},
      'undefined_ai_capability': {'key':'undefined_ai_capability','decision_id':'DEC-2026-08-07-GAP-005','status':'deferred','blocking':False},
      'churn_prediction': {'key':'churn_prediction','decision_id':'DEC-2026-08-07-GAP-011','status':'deferred','blocking':False},
      'mobile_responsiveness': {'key':'mobile_responsiveness','decision_id':'DEC-2026-08-07-MOBILE-LAUNCH-001','status':'resolved','blocking':False,'required_release_date':'2026-09-30'},
    }
    audit = expected['deterministic_resolution']['retained_audit_records'][0]
    assert audit['status'] == 'resolved_by_authoritative_clarification'
    assert audit['source_ids'] == ['SRC-REALISTIC-PB-001','SRC-REALISTIC-SN-001']
    assert expected['deterministic_resolution']['gate_status'] == 'eligible_for_human_approval'
    assert artifact['validation']['groundedness_percent'] == 100 and artifact['validation']['unsupported_decisions'] == 0

validate()
for mutation in ('hash','citation','decision_id','release','supersession'):
    packet, artifact, expected = copy.deepcopy(V4), copy.deepcopy(ART), copy.deepcopy(EXP)
    if mutation == 'hash': packet['sources'][5]['content_hash'] = 'sha256:' + '0'*64
    elif mutation == 'citation': artifact['decisions'][0]['original_evidence'][0]['quote'] += ' altered'
    elif mutation == 'decision_id': artifact['decisions'][0]['decision_id'] = 'DEC-INVALID'
    elif mutation == 'release': artifact['decisions'][0]['resolution']['release_date'] = '2026-10-01'
    else: artifact['decisions'][0]['supersedes'] = []
    try: validate(packet, artifact, expected)
    except (AssertionError, StopIteration, IndexError): pass
    else: raise AssertionError(f'negative mutation was accepted: {mutation}')
print('V4 MOBILE CLARIFICATION OK: 6 sources; prior five sources immutable.')
print('SEMANTIC CONSISTENCY OK: deferred/deferred/deferred/resolved => eligible_for_human_approval.')
print('NEGATIVE TESTS OK: hash, citation, ID, release, and supersession mutations rejected.')
print('GROUNDING: 100%; unsupported decisions/claims: 0; runtime clearance not claimed.')
