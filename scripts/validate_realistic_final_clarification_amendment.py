#!/usr/bin/env python3
import hashlib,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; BASE=ROOT/'evaluation/fixtures/multi-source/realistic-v1'
artifact=json.loads((BASE/'stakeholder-clarification-amendment-2026-08-07.json').read_text())
p2=json.loads((BASE/'source-packet-v2.json').read_text()); p3=json.loads((BASE/'source-packet-v3.json').read_text())
raw=(BASE/'stakeholder-clarification-amendment-2026-08-07.md').read_text(); digest=hashlib.sha256(raw.encode()).hexdigest(); lines=raw.splitlines()
assert artifact['decision_maker']=='Vipin' and artifact['decision_date']=='2026-08-07'
assert artifact['runtime_status']=='pending_n8n_verification' and len(artifact['amendments'])==2
by={a['gap_id']:a for a in artifact['amendments']}; assert set(by)=={'GAP-008','GAP-014'}
assert by['GAP-008']['decision_text']=='Budget approval is not required to complete the PRD. Sarah will manage the budget separately by September 10, 2026. Product scope must continue to respect the existing cost constraints.'
assert by['GAP-014']['decision_text']=='Use a single-page application (SPA) for the analytics dashboard.'
for a in artifact['amendments']:
 c=a['clarification_source_citation']; n=int(c['location'].split(':')[1]); assert c['quote']==lines[n-1] and c['content_hash']==f'sha256:{digest}'
 assert c['quote']==f"- {a['decision_id']}: {a['decision_text']}" and a['runtime_status']=='pending_n8n_verification'
assert p3['sources'][:4]==p2['sources'] and len(p3['sources'])==5
s=p3['sources'][4]; assert s['raw_text']==raw and s['content_hash']==f'sha256:{digest}' and len(s['citations'])==2
mut=json.loads(json.dumps(p3)); mut['sources'][4]['raw_text']+=' altered'; assert hashlib.sha256(mut['sources'][4]['raw_text'].encode()).hexdigest()!=digest
print('FINAL AMENDMENT OK: GAP-008 and GAP-014 recorded; prior decisions preserved.')
print('BUDGET: Sarah; September 10, 2026; not a PRD-generation prerequisite.')
print('ARCHITECTURE: SPA selected.')
print(f'PACKET V3 OK: 5 sources; amendment SHA-256 {digest}.')
print('GROUNDING: 100%; unsupported decisions: 0; runtime clearance not claimed.')
