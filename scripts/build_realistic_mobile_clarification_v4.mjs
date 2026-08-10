import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const base = 'evaluation/fixtures/multi-source/realistic-v1';
const packetV3 = JSON.parse(fs.readFileSync(path.join(base, 'source-packet-v3.json'), 'utf8'));
const prior = JSON.parse(fs.readFileSync(path.join(base, 'expected-clarification-resolution.json'), 'utf8'));
const sourceId = 'SRC-REALISTIC-CLAR-MOBILE-001';
const sourceName = 'stakeholder-clarification-mobile-release-2026-08-07.md';
const decisionId = 'DEC-2026-08-07-MOBILE-LAUNCH-001';
const lines = [
  '# Stakeholder Clarification — Responsive Web at Production Launch',
  '',
  'Decision maker: Vipin',
  'Decision date: 2026-08-07',
  'Runtime status: Pending n8n verification; this decision does not claim runtime clearance.',
  '',
  '## Decision',
  '',
  `- ${decisionId}: The September 30, 2026 first production release must include responsive web access. The team may use a desktop-first design and implementation sequence, but mobile responsiveness must be completed before production launch. There will not be a separate post-launch mobile fast-follow for this requirement.`,
  '',
  '## Supersession and preservation',
  '',
  'This decision supersedes the interpretation of stakeholder-notes.txt line 26 that mobile responsiveness could be delivered after production launch. It does not erase or rewrite product-brief.txt line 25 or stakeholder-notes.txt line 26; both remain immutable audit evidence.',
  '',
];
const rawText = lines.join('\n');
const digest = crypto.createHash('sha256').update(rawText, 'utf8').digest('hex');
const findSource = id => packetV3.sources.find(source => source.source_id === id);
const cite = (sourceIdValue, line) => {
  const source = findSource(sourceIdValue);
  const citation = source.citations.find(entry => entry.location === `line:${line}`);
  return { source_id: source.source_id, source_name: source.source_name, location: citation.location, quote: citation.quote, content_hash: source.content_hash };
};
const originalEvidence = [cite('SRC-REALISTIC-PB-001', 25), cite('SRC-REALISTIC-SN-001', 26)];
const clarificationCitation = { source_id: sourceId, source_name: sourceName, location: 'line:9', quote: lines[8], content_hash: `sha256:${digest}` };
const decision = {
  decision_id: decisionId,
  gap_id: 'GAP-MOBILE-LAUNCH-001',
  category: 'release_scope',
  decision_maker: 'Vipin',
  decision_date: '2026-08-07',
  decision_status: 'approved_clarification',
  decision_text: 'The September 30, 2026 first production release must include responsive web access. The team may use a desktop-first design and implementation sequence, but mobile responsiveness must be completed before production launch. There will not be a separate post-launch mobile fast-follow for this requirement.',
  downstream_item_ids: ['NFR-002', 'CON-011', 'DDL-001'],
  original_evidence: originalEvidence,
  clarification_source_citation: clarificationCitation,
  supersedes: [{ source_id: 'SRC-REALISTIC-SN-001', source_name: 'stakeholder-notes.txt', location: 'line:26', quote: originalEvidence[1].quote, content_hash: originalEvidence[1].content_hash, superseded_interpretation: 'Mobile responsiveness may be delivered after production launch.' }],
  resolution: { classification: 'resolved', release_date: '2026-09-30', required_at_launch: true, desktop_first_sequence_allowed: true, post_launch_fast_follow_allowed: false },
  runtime_status: 'pending_n8n_verification',
};
const artifact = { schema_version: '1.0.0', artifact_type: 'stakeholder_clarification_decision', artifact_id: 'CLAR-REALISTIC-2026-08-07-MOBILE-V1', source_packet_id: 'SP-REALISTIC-PB-MT-SN-CLAR-V4', decision_maker: 'Vipin', decision_date: '2026-08-07', runtime_status: 'pending_n8n_verification', decisions: [decision], validation: { coverage: '1/1', groundedness_percent: 100, unsupported_decisions: 0, runtime_claimed: false } };
const source = { source_id: sourceId, source_type: 'stakeholder_clarification', source_name: sourceName, raw_text: rawText, provenance: { origin: 'submitted_text', fixture_path: `${base}/${sourceName}` }, citations: [{ quote: lines[8], location: 'line:9', speaker: 'Vipin' }, { quote: lines[12], location: 'line:13', speaker: 'Vipin' }], metadata: { document_version: 'stakeholder-clarification-mobile-v1', language: 'en', meeting_date: '2026-08-07' }, content_hash: `sha256:${digest}` };
const packetV4 = { ...packetV3, packet_id: 'SP-REALISTIC-PB-MT-SN-CLAR-V4', run_id: 'RUN-REALISTIC-MULTI-SOURCE-V4', submitted_at: '2026-08-07T00:00:00-07:00', sources: [...packetV3.sources, source] };
const expected = {
  ...prior,
  artifact_id: 'CLAR-REALISTIC-2026-08-07-V4',
  source_packet_id: packetV4.packet_id,
  decisions: [...prior.decisions, decision],
  deterministic_resolution: {
    schema_version: '1.0.0',
    audit_policy: 'preserve_original_records_and_classify_authoritative_resolution',
    classifications: [
      { key: 'churn_threshold_alerting', decision_id: 'DEC-2026-08-07-GAP-002', status: 'deferred', blocking: false },
      { key: 'undefined_ai_capability', decision_id: 'DEC-2026-08-07-GAP-005', status: 'deferred', blocking: false },
      { key: 'churn_prediction', decision_id: 'DEC-2026-08-07-GAP-011', status: 'deferred', blocking: false },
      { key: 'mobile_responsiveness', decision_id: decisionId, status: 'resolved', blocking: false, required_release_date: '2026-09-30' },
    ],
    retained_audit_records: [{ type: 'contradiction', source_ids: ['SRC-REALISTIC-PB-001', 'SRC-REALISTIC-SN-001'], locations: ['line:25', 'line:26'], status: 'resolved_by_authoritative_clarification', resolution_decision_id: decisionId }],
    gate_status: 'eligible_for_human_approval',
    route: 'human_review',
  },
  validation: { decision_coverage: '15/15 plus 2 prior amendments', groundedness_percent: 100, unsupported_decisions: 0, runtime_claimed: false },
};

fs.writeFileSync(path.join(base, sourceName), rawText, 'utf8');
fs.writeFileSync(path.join(base, 'stakeholder-clarification-mobile-release-2026-08-07.json'), JSON.stringify(artifact, null, 2) + '\n');
fs.writeFileSync(path.join(base, 'source-packet-v4.json'), JSON.stringify(packetV4, null, 2) + '\n');
fs.writeFileSync(path.join(base, 'expected-clarification-resolution-v4.json'), JSON.stringify(expected, null, 2) + '\n');
console.log(`Built packet v4 with mobile decision ${decisionId}; SHA-256 ${digest}`);
