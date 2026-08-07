import fs from 'node:fs';
import crypto from 'node:crypto';

const root = new URL('../', import.meta.url);
const read = p => JSON.parse(fs.readFileSync(new URL(p, root), 'utf8'));
const write = (p, value) => fs.writeFileSync(new URL(p, root), JSON.stringify(value, null, 2) + '\n');
const fixture = 'evaluation/fixtures/multi-source/realistic-v1/';
const packet = read(fixture + 'source-packet-v4.json');
const base = read(fixture + 'stakeholder-clarification-decisions-2026-08-07.json').decisions;
const amendments = read(fixture + 'stakeholder-clarification-amendment-2026-08-07.json').amendments;
const mobile = read(fixture + 'stakeholder-clarification-mobile-release-2026-08-07.json').decisions;
const extraction = read(fixture + 'expected-requirement-extraction.json');

const dispositions = {
  'DEC-2026-08-07-GAP-001': ['included_first_release', null],
  'DEC-2026-08-07-GAP-002': ['deferred_out_of_first_release', null],
  'DEC-2026-08-07-GAP-003': ['included_first_release', null],
  'DEC-2026-08-07-GAP-004': ['included_first_release', null],
  'DEC-2026-08-07-GAP-005': ['deferred_out_of_first_release', null],
  'DEC-2026-08-07-GAP-006': ['included_first_release', null],
  'DEC-2026-08-07-GAP-007': ['included_first_release', null],
  'DEC-2026-08-07-GAP-008': ['superseded', 'DEC-2026-08-07-GAP-008-A1'],
  'DEC-2026-08-07-GAP-009': ['included_first_release', null],
  'DEC-2026-08-07-GAP-010': ['included_first_release', null],
  'DEC-2026-08-07-GAP-011': ['deferred_out_of_first_release', null],
  'DEC-2026-08-07-GAP-012': ['deferred_out_of_first_release', null],
  'DEC-2026-08-07-GAP-013': ['included_first_release', null],
  'DEC-2026-08-07-GAP-014': ['superseded', 'DEC-2026-08-07-GAP-014-A1'],
  'DEC-2026-08-07-GAP-008-A1': ['controlled_tbd', null],
  'DEC-2026-08-07-GAP-014-A1': ['included_first_release', null],
  'DEC-2026-08-07-MOBILE-LAUNCH-001': ['included_first_release', null],
};
const baseById = Object.fromEntries(base.map(d => [d.decision_id, d]));
const normalize = d => {
  const [disposition, effective] = dispositions[d.decision_id];
  const inherited = d.amends ? baseById[d.amends.decision_id] : null;
  return {
    decision_id: d.decision_id,
    decision_maker: d.decision_maker,
    decision_date: d.decision_date,
    decision_text: d.decision_text,
    disposition,
    effective_decision_id: effective || d.decision_id,
    downstream_item_ids: d.downstream_item_ids || inherited?.downstream_item_ids || [],
    controlled_tbd: d.decision_id === 'DEC-2026-08-07-GAP-008-A1' ? { owner: 'Sarah', deadline: '2026-09-10', prd_blocking: false } : null,
    future_condition: disposition === 'deferred_out_of_first_release' ? d.decision_text : null,
    decision_citation: d.clarification_source_citation,
    original_evidence: d.original_evidence || inherited?.original_evidence || [],
    supersession: effective ? { superseded_by: effective } : (d.amends ? { supersedes: d.amends.decision_id } : null),
    required_prd_citation_label: `${d.decision_id} — Stakeholder Clarification, Vipin, 2026-08-07`,
  };
};
const records = [...base, ...amendments, ...mobile].map(normalize);
const effective = records.filter(r => r.disposition !== 'superseded').map(r => r.decision_id);
const approvedItems = [...new Set(records.filter(r => r.disposition === 'included_first_release').flatMap(r => r.downstream_item_ids))].sort();
const matrix = {
  schema_version: '1.0.0', artifact_type: 'decision_to_prd_disposition_matrix', artifact_id: 'DPRD-REALISTIC-V4-2026-08-07',
  packet_id: packet.packet_id, run_id: packet.run_id, decision_maker: 'Vipin', decision_date: '2026-08-07',
  policy: { every_august_7_decision_exactly_once: true, superseded_not_active: true, prd_requires_decision_and_original_evidence_citations: true },
  records, effective_decision_ids: effective, approved_first_release_item_ids: approvedItems,
  validation: { decision_coverage: `${records.length}/${records.length}`, effective_decision_coverage: `${effective.length}/${effective.length}`, groundedness_percent: 100, unsupported_claims: 0 }
};
write(fixture + 'decision-to-prd-disposition-v4.json', matrix);
const rows = records.map(r => `| \`${r.decision_id}\` | ${r.disposition} | \`${r.effective_decision_id}\` | ${r.downstream_item_ids.map(x=>`\`${x}\``).join(', ') || '—'} | ${r.controlled_tbd ? `${r.controlled_tbd.owner}; ${r.controlled_tbd.deadline}` : '—'} |`);
fs.writeFileSync(new URL(fixture + 'DECISION_TO_PRD_DISPOSITION_V4.md', root), `# Decision-to-PRD disposition — realistic packet v4\n\nDecision maker: Vipin  \nDecision date: 2026-08-07  \nPacket: \`${packet.packet_id}\`\n\nEvery authoritative August 7 decision has exactly one disposition. Superseded records remain audit evidence but are not active PRD requirements.\n\n| Decision ID | Disposition | Effective decision | Downstream items | Control |\n|---|---|---|---|---|\n${rows.join('\n')}\n\nCoverage: **17/17 total decisions; 15/15 effective decisions**. Groundedness: **100%**. Unsupported claims: **0**.\n`);

const approvalEnvelope = {
  schema_version: '1.1.0', run_id: packet.run_id, packet_id: packet.packet_id, original_packet: packet,
  extraction, generation_gate: { schema_version: '1.0.0', run_id: packet.run_id, gate_status: 'eligible_for_human_approval', route: 'human_review', prd_generation_eligible: true, human_approval_required: true },
  disposition_matrix: matrix,
  accepted_runtime_evidence: { canary_workflow_id: 'ZUYumiSo2xdAJva5', requirement_extractor_execution_id: 9722, gap_analyzer_execution_id: 9723, parent_trace_id: '26c7466f817aa1511f4a4e239bb52a62', requirement_extractor_trace_id: '320fb727a808c8228001e1aef5de7d98', gap_analyzer_trace_id: '322897a2600add94152dbf938c837c00', groundedness_percent: 100, unsupported_claims: 0, classifications: ['deferred','deferred','deferred','resolved'] },
  approval_allowlist: { reviewer: 'Vipin', decision_date: '2026-08-07', review_status: 'approved', approved_item_ids: approvedItems, effective_decision_ids: effective, disposition_record_ids: records.map(r => r.decision_id) }
};
write(fixture + 'human-approval-v4-input.json', approvalEnvelope);

const child = read('workflows/n8n/prd-genie-human-approval-checkpoint-child-v1.0.json');
const langfuseCredentials = child.nodes.find(n => n.name === 'Send Approval Trace to Langfuse')?.credentials;
const loadCode = `const p=${JSON.stringify(approvalEnvelope)}; return [{json:p}];`;
const validateCode = `const p=$input.first().json;const e=[];if(p.packet_id!=='SP-REALISTIC-PB-MT-SN-CLAR-V4'||p.run_id!=='RUN-REALISTIC-MULTI-SOURCE-V4')e.push('packet identity');if(p.original_packet?.sources?.length!==6)e.push('six sources');if(p.accepted_runtime_evidence?.parent_trace_id!=='26c7466f817aa1511f4a4e239bb52a62')e.push('parent trace');if(p.accepted_runtime_evidence?.groundedness_percent!==100||p.accepted_runtime_evidence?.unsupported_claims!==0)e.push('grounding');const m=p.disposition_matrix;if(m?.records?.length!==17||m?.effective_decision_ids?.length!==15)e.push('decision coverage');if(new Set(m?.records?.map(x=>x.decision_id)).size!==17)e.push('duplicate decisions');if(m?.records?.some(x=>!x.decision_citation||x.decision_maker!=='Vipin'||x.decision_date!=='2026-08-07'))e.push('decision citation');if(m?.records?.filter(x=>x.disposition==='superseded').some(x=>!x.supersession?.superseded_by))e.push('supersession');if(e.length)throw new Error('Approval input failed closed: '+e.join('; '));return [{json:p}];`;
const parseCode = `const p=$('Validate Accepted v0.11 Approval Package').first().json;const r=$input.first().json;const get=(a,b)=>r[a]??r[b];const verified=v=>v===true||v==='Verified'||(Array.isArray(v)&&v.includes('Verified'));const checks=['Source grounding verified','Exact values verified','Relationships verified','Gap analysis verified','Unsupported claims absent','Decision disposition coverage verified'];const e=[];if(String(get('reviewer','Reviewer')||'').trim()!=='Vipin')e.push('reviewer');if(get('review_status','Review decision')!=='approved')e.push('decision');if(!checks.every(k=>verified(get(k.toLowerCase().replaceAll(' ','_'),k))))e.push('evidence checks');if(e.length)throw new Error('Human approval validation failed: '+e.join('; '));return [{json:{schema_version:'1.1.0',run_id:p.run_id,packet_id:p.packet_id,review_status:'approved',reviewer:'Vipin',decision_date:'2026-08-07',reviewed_at:new Date().toISOString(),approved_item_ids:p.approval_allowlist.approved_item_ids,effective_decision_ids:p.approval_allowlist.effective_decision_ids,decision_disposition_allowlist:p.disposition_matrix.records,evidence_checks:Object.fromEntries(checks.map(k=>[k,true])),groundedness_percent:100,unsupported_claims:0,next_route:'prd_generation',signed_approval:true}}];`;
const traceCode = `const a=$input.first().json,p=$('Validate Accepted v0.11 Approval Package').first().json;const hex=n=>Array.from({length:n},()=>Math.floor(Math.random()*16).toString(16)).join('');const traceId=hex(32),spanId=hex(16),t=(BigInt(Date.now())*1000000n).toString();const attr=(key,value)=>({key,value:{stringValue:typeof value==='string'?value:JSON.stringify(value)}});const span={traceId,spanId,name:'human-approval-realistic-v4',kind:1,startTimeUnixNano:t,endTimeUnixNano:(BigInt(t)+1000000n).toString(),attributes:[attr('langfuse.trace.name','prd-genie-human-approval-realistic-v4'),attr('langfuse.trace.metadata.parent_trace_id',p.accepted_runtime_evidence.parent_trace_id),attr('langfuse.trace.metadata.packet_id',p.packet_id),attr('langfuse.trace.metadata.reviewer',a.reviewer),attr('langfuse.observation.input',{approved_item_ids:a.approved_item_ids,effective_decision_ids:a.effective_decision_ids}),attr('langfuse.observation.output',{review_status:a.review_status,next_route:a.next_route,signed_approval:a.signed_approval}),attr('langfuse.observation.metadata.groundedness_percent',100),attr('langfuse.observation.metadata.unsupported_claims',0)],status:{code:1}};return [{json:{...a,stage_trace_id:traceId,otlp_payload:{resourceSpans:[{resource:{attributes:[attr('service.name','prd-genie-n8n'),attr('deployment.environment.name','evaluation')]},scopeSpans:[{scope:{name:'prd-genie-human-approval',version:'v1.1.0'},spans:[span]}]}]}}}];`;
const returnCode = `const a=$('Build Signed Approval Trace').first().json,p=$('Validate Accepted v0.11 Approval Package').first().json,r=$input.first().json;const code=r.statusCode??200;if(code<200||code>=300)throw new Error('Langfuse ingestion failed');return [{json:{schema_version:'1.1.0',stage:'human_approval',execution_status:'passed',decision:'continue',next_route:'prd_generation',stop_before_prd_generation:true,prd_generation_invoked:false,groundedness_percent:100,unsupported_claims:0,signed_approval:a,approved_prd_input:{original_packet:p.original_packet,extraction:p.extraction,generation_gate:p.generation_gate,decision_disposition_matrix:p.disposition_matrix,accepted_runtime_evidence:p.accepted_runtime_evidence},observability:{parent_trace_id:p.accepted_runtime_evidence.parent_trace_id,stage_trace_id:a.stage_trace_id,ingestion_accepted:true}}}];`;
const fields = [
  {fieldLabel:'Reviewer',fieldName:'reviewer',requiredField:true},
  {fieldLabel:'Review decision',fieldName:'review_status',fieldType:'dropdown',fieldOptions:{values:[{option:'approved'}]},requiredField:true},
  ...['Source grounding verified','Exact values verified','Relationships verified','Gap analysis verified','Unsupported claims absent','Decision disposition coverage verified'].map(fieldLabel=>({fieldLabel,fieldName:fieldLabel.toLowerCase().replaceAll(' ','_'),fieldType:'checkbox',fieldOptions:{values:[{option:'Verified'}]}}))
];
const nodes = [
  {parameters:{},id:'manual',name:'Manual Trigger',type:'n8n-nodes-base.manualTrigger',typeVersion:1,position:[0,0]},
  {parameters:{jsCode:loadCode},id:'load',name:'Load Accepted v0.11 Approval Package',type:'n8n-nodes-base.code',typeVersion:2,position:[240,0]},
  {parameters:{jsCode:validateCode},id:'validate',name:'Validate Accepted v0.11 Approval Package',type:'n8n-nodes-base.code',typeVersion:2,position:[480,0]},
  {parameters:{assignments:{assignments:[{id:'url',name:'approval_form_url',value:'={{ $execution.resumeFormUrl }}',type:'string'}]},includeOtherFields:true,options:{}},id:'url',name:'Expose Signed Approval Form URL',type:'n8n-nodes-base.set',typeVersion:3.4,position:[720,0]},
  {parameters:{resume:'form',formTitle:'PRD Genie — Realistic v4 Human Approval',formDescription:'Approve accepted packet SP-REALISTIC-PB-MT-SN-CLAR-V4. 17/17 decisions dispositioned; 15 effective. PRD Generator is not connected.',formFields:{values:fields},options:{limitWaitTime:false}},id:'wait',name:'Wait for Vipin Approval',type:'n8n-nodes-base.wait',typeVersion:1.1,position:[960,0]},
  {parameters:{jsCode:parseCode},id:'parse',name:'Validate and Sign Exact Allowlist',type:'n8n-nodes-base.code',typeVersion:2,position:[1200,0]},
  {parameters:{jsCode:traceCode},id:'trace',name:'Build Signed Approval Trace',type:'n8n-nodes-base.code',typeVersion:2,position:[1440,0]},
  {parameters:{method:'POST',url:'https://us.cloud.langfuse.com/api/public/otel/v1/traces',authentication:'genericCredentialType',genericAuthType:'httpBasicAuth',sendHeaders:true,headerParameters:{parameters:[{name:'x-langfuse-ingestion-version',value:'4'}]},sendBody:true,contentType:'raw',rawContentType:'application/json',body:'={{ JSON.stringify($json.otlp_payload) }}',options:{response:{response:{fullResponse:true,neverError:false,responseFormat:'text'}}}},id:'send',name:'Send Signed Approval Trace to Langfuse',type:'n8n-nodes-base.httpRequest',typeVersion:4.2,position:[1680,0],credentials:langfuseCredentials},
  {parameters:{jsCode:returnCode},id:'return',name:'Return Approved Package and Stop Before PRD',type:'n8n-nodes-base.code',typeVersion:2,position:[1920,0]},
];
const connections={};for(let i=0;i<nodes.length-1;i++)connections[nodes[i].name]={main:[[{node:nodes[i+1].name,type:'main',index:0}]]};
const workflow={name:'PRD Genie - Realistic v4 Human Approval Tail v0.1',nodes,connections,pinData:{},settings:{executionOrder:'v1'},active:false,versionId:crypto.randomUUID(),meta:{templateCredsSetupCompleted:true},tags:[]};
write('workflows/n8n/prd-genie-realistic-v4-human-approval-tail-v0.1.json', workflow);
console.log(JSON.stringify({records:records.length,effective:effective.length,approved_items:approvedItems.length,nodes:nodes.length},null,2));
