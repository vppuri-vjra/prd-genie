import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const base = 'evaluation/fixtures/multi-source/realistic-v1';
const packetV1 = JSON.parse(fs.readFileSync(path.join(base, 'source-packet.json'), 'utf8'));
const sourceById = Object.fromEntries(packetV1.sources.map((source) => [source.source_id, source]));

const definitions = [
  {gap:'GAP-001',category:'scope',text:'Fixed dashboard layout for the first release.',items:['FR-001'],refs:[['SRC-REALISTIC-PB-001',29]]},
  {gap:'GAP-002',category:'scope',text:'Defer churn-threshold alerting; reconsider only after defining the churn metric/calculation, measurement period, threshold, recipients, and notification channel.',items:['FR-002'],refs:[['SRC-REALISTIC-PB-001',30]]},
  {gap:'GAP-003',category:'performance',text:'Dashboard pages must load in under 3 seconds.',items:['FR-001'],refs:[['SRC-REALISTIC-PB-001',31]]},
  {gap:'GAP-004',category:'data',text:'Use precomputed warehouse data for dashboard reporting.',items:['FR-007','DEP-001','DEP-002'],refs:[['SRC-REALISTIC-MT-001',26],['SRC-REALISTIC-MT-001',28]]},
  {gap:'GAP-005',category:'scope',text:'Defer the undefined AI capability to a later discovery phase.',items:[],refs:[['SRC-REALISTIC-MT-001',40],['SRC-REALISTIC-MT-001',42],['SRC-REALISTIC-MT-001',44]]},
  {gap:'GAP-006',category:'output_format',text:'Generate XLSX with formula preservation and label the action “Export to Excel”; this supersedes the earlier proposed “Export to CSV” label.',items:['FR-011','AC-002','CON-004'],refs:[['SRC-REALISTIC-MT-001',74],['SRC-REALISTIC-MT-001',76],['SRC-REALISTIC-MT-001',80],['SRC-REALISTIC-MT-001',82]],supersedes:[['SRC-REALISTIC-MT-001',82,'The approved 2026-08-07 decision changes the user-facing action label to “Export to Excel”.']]},
  {gap:'GAP-007',category:'scope',text:'Hybrid refresh: 15-minute automatic refresh plus manual refresh of the latest available precomputed warehouse data, a last-updated timestamp, and protection against excessive repeated requests; no direct live-database query.',items:['FR-004','FR-009','FR-010','CON-003','RSK-001'],refs:[['SRC-REALISTIC-PB-001',18],['SRC-REALISTIC-MT-001',52],['SRC-REALISTIC-MT-001',56],['SRC-REALISTIC-MT-001',58],['SRC-REALISTIC-MT-001',62],['SRC-REALISTIC-MT-001',64],['SRC-REALISTIC-MT-001',90],['SRC-REALISTIC-MT-001',91]],supersedes:[['SRC-REALISTIC-MT-001',52,'The approved hybrid policy replaces five-second automatic polling.'],['SRC-REALISTIC-MT-001',58,'The approved hybrid policy does not authorize direct real-time database queries.'],['SRC-REALISTIC-MT-001',62,'The approved hybrid policy replaces the provisional five-second refresh choice.']]},
  {gap:'GAP-008',category:'budget',text:'Budget remains a controlled TBD; owner Sarah; decision deadline 2026-08-31.',items:[],refs:[['SRC-REALISTIC-MT-001',92]]},
  {gap:'GAP-009',category:'ownership',text:'Sarah owns design follow-up; Lisa remains responsible for providing designs.',items:['DDL-002'],refs:[['SRC-REALISTIC-MT-001',24],['SRC-REALISTIC-MT-001',94]]},
  {gap:'GAP-010',category:'deadline',text:'Designs complete 2026-08-21; internal basic version 2026-09-04; launch 2026-09-30. These supersede expired/general milestone wording.',items:['DDL-001','DDL-002','DDL-003'],refs:[['SRC-REALISTIC-SN-001',34],['SRC-REALISTIC-MT-001',24],['SRC-REALISTIC-PB-001',26]],supersedes:[['SRC-REALISTIC-SN-001',34,'The month-only end-of-March request is replaced by the approved 2026-09-04 internal basic-version date.'],['SRC-REALISTIC-MT-001',24,'The general end-of-Q3 and end-of-April wording is replaced by exact approved dates.'],['SRC-REALISTIC-PB-001',26,'The quarter-level Q3 2026 launch target is replaced by the exact approved 2026-09-30 launch date.']]},
  {gap:'GAP-011',category:'data',text:'Defer churn prediction to a later discovery phase until inputs, users, outputs, feasibility, and minimum accuracy are defined.',items:['FR-014'],refs:[['SRC-REALISTIC-SN-001',40],['SRC-REALISTIC-SN-001',42]]},
  {gap:'GAP-012',category:'scope',text:'Defer white-labeling to a later release.',items:['FR-016'],refs:[['SRC-REALISTIC-SN-001',50]]},
  {gap:'GAP-013',category:'scope',text:'Deliverable mapping approved: 2026-08-21 completed dashboard designs; 2026-09-04 internal basic version with fixed layout, five core metrics, precomputed warehouse data, 15-minute auto-refresh, manual refresh, and last-updated timestamp; 2026-09-30 first production release with all approved first-release requirements.',items:['DDL-001','DDL-002','DDL-003'],refs:[['SRC-REALISTIC-SN-001',34],['SRC-REALISTIC-MT-001',24],['SRC-REALISTIC-PB-001',26],['SRC-REALISTIC-SN-001',36]]},
  {gap:'GAP-014',category:'decision_status',text:'Defer SPA versus server-rendered pages to a technical evaluation owned by Raj, due 2026-08-14.',items:['CON-009','CON-010'],refs:[['SRC-REALISTIC-SN-001',24]]},
];

const citationAt = (sourceId, line) => {
  const source = sourceById[sourceId];
  const location = `line:${line}`;
  const citation = source.citations.find((candidate) => candidate.location === location);
  if (!citation) throw new Error(`Missing approved citation ${sourceId} ${location}`);
  return {source_id:sourceId,source_name:source.source_name,location,quote:citation.quote,content_hash:source.content_hash};
};

const documentLines = [
  '# Stakeholder Clarifications — Realistic PB + MT + SN',
  '',
  'Decision maker: Vipin',
  'Decision date: 2026-08-07',
  'Context: Clarification decisions for Gap Analysis execution 9667.',
  'Runtime status: Pending n8n verification; these decisions do not claim runtime resolution.',
  '',
  '## Decisions',
  '',
  ...definitions.map((definition) => `- DEC-2026-08-07-${definition.gap}: ${definition.text}`),
  '',
  '## Source preservation and supersession policy',
  '',
  'The original Product Brief, Meeting Transcripts, and Stakeholder Notes remain immutable evidence. Superseded statements are retained with their original source IDs, locations, and text. This clarification source records later stakeholder decisions without erasing history.',
  '',
];
const humanText = documentLines.join('\n');
const humanPath = path.join(base, 'stakeholder-clarifications-2026-08-07.md');
fs.writeFileSync(humanPath, humanText, 'utf8');
const humanHash = crypto.createHash('sha256').update(Buffer.from(humanText, 'utf8')).digest('hex');
const decisionLineByGap = Object.fromEntries(definitions.map((definition, index) => [definition.gap, 10 + index]));

const decisions = definitions.map((definition) => {
  const line = decisionLineByGap[definition.gap];
  const quote = documentLines[line - 1];
  return {
    decision_id:`DEC-2026-08-07-${definition.gap}`,
    gap_id:definition.gap,
    category:definition.category,
    decision_maker:'Vipin',
    decision_date:'2026-08-07',
    decision_status:'approved_clarification',
    decision_text:definition.text,
    downstream_item_ids:definition.items,
    original_evidence:definition.refs.map(([sourceId, sourceLine]) => citationAt(sourceId, sourceLine)),
    clarification_source_citation:{source_id:'SRC-REALISTIC-CLAR-001',source_name:'stakeholder-clarifications-2026-08-07.md',location:`line:${line}`,quote,content_hash:`sha256:${humanHash}`},
    supersedes:(definition.supersedes || []).map(([sourceId, sourceLine, reason]) => ({...citationAt(sourceId, sourceLine),reason})),
    runtime_status:'pending_n8n_verification',
  };
});

const common = {
  schema_version:'1.0.0',
  source_packet_id:'SP-REALISTIC-PB-MT-SN-CLAR-V2',
  decision_maker:'Vipin',
  decision_date:'2026-08-07',
  runtime_status:'pending_n8n_verification',
  decisions,
  validation:{decision_coverage:'14/14',groundedness_percent:100,unsupported_decisions:0,runtime_claimed:false},
};
const canonical = {...common,artifact_type:'stakeholder_clarification_decisions',artifact_id:'CLAR-REALISTIC-2026-08-07-V1'};
const expected = {...common,artifact_type:'expected_clarification_resolution',artifact_id:'EXPECTED-CLARIFICATION-RESOLUTION-REALISTIC-V1'};
fs.writeFileSync(path.join(base, 'stakeholder-clarification-decisions-2026-08-07.json'), JSON.stringify(canonical, null, 2) + '\n');
fs.writeFileSync(path.join(base, 'expected-clarification-resolution.json'), JSON.stringify(expected, null, 2) + '\n');

const clarificationSource = {
  source_id:'SRC-REALISTIC-CLAR-001',
  source_type:'stakeholder_clarification',
  source_name:'stakeholder-clarifications-2026-08-07.md',
  raw_text:humanText,
  provenance:{origin:'submitted_text',fixture_path:'evaluation/fixtures/multi-source/realistic-v1/stakeholder-clarifications-2026-08-07.md'},
  citations:definitions.map((definition) => {
    const line = decisionLineByGap[definition.gap];
    return {quote:documentLines[line - 1],location:`line:${line}`,speaker:'Vipin'};
  }),
  metadata:{document_version:'stakeholder-clarification-v1',language:'en',meeting_date:'2026-08-07'},
  content_hash:`sha256:${humanHash}`,
};
const packetV2 = {
  ...packetV1,
  packet_id:'SP-REALISTIC-PB-MT-SN-CLAR-V2',
  run_id:'RUN-REALISTIC-MULTI-SOURCE-V2',
  submitted_at:'2026-08-07T00:00:00-07:00',
  sources:[...packetV1.sources,clarificationSource],
};
fs.writeFileSync(path.join(base, 'source-packet-v2.json'), JSON.stringify(packetV2, null, 2) + '\n');

console.log(`Built clarification source, 14 decisions and packet v2; clarification SHA-256 ${humanHash}`);
