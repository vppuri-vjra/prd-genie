import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const base='evaluation/fixtures/multi-source/realistic-v1';
const packetV2=JSON.parse(fs.readFileSync(path.join(base,'source-packet-v2.json'),'utf8'));
const prior=JSON.parse(fs.readFileSync(path.join(base,'stakeholder-clarification-decisions-2026-08-07.json'),'utf8'));
const byGap=Object.fromEntries(prior.decisions.map(d=>[d.gap_id,d]));
const lines=[
  '# Stakeholder Clarification Amendment — GAP-008 and GAP-014',
  '',
  'Decision maker: Vipin',
  'Decision date: 2026-08-07',
  'Context: Final decisions following accepted clarification execution 9684.',
  'Runtime status: Pending n8n verification; these amendments do not claim runtime clearance.',
  '',
  '## Amendments',
  '',
  '- DEC-2026-08-07-GAP-008-A1: Budget approval is not required to complete the PRD. Sarah will manage the budget separately by September 10, 2026. Product scope must continue to respect the existing cost constraints.',
  '- DEC-2026-08-07-GAP-014-A1: Use a single-page application (SPA) for the analytics dashboard.',
  '',
  '## Preservation policy',
  '',
  'The original PB, MT, SN, and stakeholder clarification source remain immutable. These amendments supersede only the earlier GAP-008 deadline/blocking treatment and GAP-014 deferred technical-choice decision.',
  '',
];
const rawText=lines.join('\n');
const hash=crypto.createHash('sha256').update(rawText,'utf8').digest('hex');
const sourceId='SRC-REALISTIC-CLAR-AMEND-001';
const sourceName='stakeholder-clarification-amendment-2026-08-07.md';
const decision=(gap,line,text,supersedes)=>({
  decision_id:`DEC-2026-08-07-${gap}-A1`,gap_id:gap,decision_maker:'Vipin',decision_date:'2026-08-07',decision_status:'approved_amendment',decision_text:text,
  clarification_source_citation:{source_id:sourceId,source_name:sourceName,location:`line:${line}`,quote:lines[line-1],content_hash:`sha256:${hash}`},
  amends:{decision_id:byGap[gap].decision_id,source_id:byGap[gap].clarification_source_citation.source_id,location:byGap[gap].clarification_source_citation.location,quote:byGap[gap].clarification_source_citation.quote,content_hash:byGap[gap].clarification_source_citation.content_hash},
  supersession_reason:supersedes,runtime_status:'pending_n8n_verification',
});
const amendments=[
  decision('GAP-008',10,'Budget approval is not required to complete the PRD. Sarah will manage the budget separately by September 10, 2026. Product scope must continue to respect the existing cost constraints.','Replaces the earlier August 31 budget deadline and removes budget approval as a PRD-generation prerequisite.'),
  decision('GAP-014',11,'Use a single-page application (SPA) for the analytics dashboard.','Replaces the deferred SPA-versus-server-rendered technical evaluation with the approved SPA choice.'),
];
const artifact={schema_version:'1.0.0',artifact_type:'stakeholder_clarification_amendment',artifact_id:'CLAR-REALISTIC-2026-08-07-A1',source_packet_id:'SP-REALISTIC-PB-MT-SN-CLAR-V3',decision_maker:'Vipin',decision_date:'2026-08-07',runtime_status:'pending_n8n_verification',amendments,validation:{coverage:'2/2',groundedness_percent:100,unsupported_decisions:0,runtime_claimed:false}};
const source={source_id:sourceId,source_type:'stakeholder_clarification',source_name:sourceName,raw_text:rawText,provenance:{origin:'submitted_text',fixture_path:`evaluation/fixtures/multi-source/realistic-v1/${sourceName}`},citations:[10,11].map(line=>({quote:lines[line-1],location:`line:${line}`,speaker:'Vipin'})),metadata:{document_version:'stakeholder-clarification-amendment-v1',language:'en',meeting_date:'2026-08-07'},content_hash:`sha256:${hash}`};
const packetV3={...packetV2,packet_id:'SP-REALISTIC-PB-MT-SN-CLAR-V3',run_id:'RUN-REALISTIC-MULTI-SOURCE-V3',submitted_at:'2026-08-07T00:00:00-07:00',sources:[...packetV2.sources,source]};
fs.writeFileSync(path.join(base,sourceName),rawText,'utf8');
fs.writeFileSync(path.join(base,'stakeholder-clarification-amendment-2026-08-07.json'),JSON.stringify(artifact,null,2)+'\n');
fs.writeFileSync(path.join(base,'source-packet-v3.json'),JSON.stringify(packetV3,null,2)+'\n');
console.log(`Built two amendments and packet v3; amendment SHA-256 ${hash}`);
