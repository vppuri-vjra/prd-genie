import crypto from 'node:crypto';
import fs from 'node:fs';

const input = 'workflows/n8n/prd-genie-realistic-clarification-v3-canary-v0.6.json';
const output = 'workflows/n8n/prd-genie-realistic-clarification-v4-canary-v0.8.json';
const packet = JSON.parse(fs.readFileSync('evaluation/fixtures/multi-source/realistic-v1/source-packet-v4.json','utf8'));
const decisions = JSON.parse(fs.readFileSync('evaluation/fixtures/multi-source/realistic-v1/expected-clarification-resolution-v4.json','utf8'));
const workflow = JSON.parse(fs.readFileSync(input,'utf8'));
workflow.name = 'PRD Genie - Realistic Clarification v4 Deterministic Gate Canary v0.8';
workflow.versionId = crypto.randomUUID();

const load = workflow.nodes.find(node => node.name === 'Load Approved Five-Source Packet v3');
load.name = 'Load Approved Six-Source Packet v4';
load.parameters.jsCode = `const packet=${JSON.stringify(packet)};
const resolution=${JSON.stringify(decisions.deterministic_resolution)};
const decision_ids=${JSON.stringify(decisions.decisions.map(d=>d.decision_id))};
const parent_trace_id=Array.from({length:32},()=>Math.floor(Math.random()*16).toString(16)).join('');
return [{json:{...packet,submitted_at:new Date().toISOString(),orchestration_context:{parent_trace_id,active_run_id:packet.run_id,test_id:'REALISTIC-CLARIFICATION-V4',environment:'realistic-clarification-canary'},clarification_contract:{decision_maker:'Vipin',decision_date:'2026-08-07',decision_ids,deterministic_resolution:resolution}}}];`;

workflow.nodes.find(node => node.name === 'Validate Five-Source Extraction').name = 'Validate Six-Source Extraction';
const final = workflow.nodes.find(node => node.name === 'Validate Clarification Runtime and Stop');
final.name = 'Deterministic Clarification Resolution and Gate';
final.parameters.jsCode = `const stage=$input.first().json;
const prior=$('Validate Six-Source Extraction').first().json;
const errors=[];
if(stage.stage!=='gap_analysis'||stage.execution_status!=='passed')errors.push('gap stage');
if(stage.run_id!==prior.run_id)errors.push('run_id');
if(stage.groundedness_percent!==100)errors.push('gap grounding');
if(!stage.observability?.ingestion_accepted)errors.push('gap Langfuse');
if(stage.observability?.parent_trace_id!==prior.orchestration_context.parent_trace_id)errors.push('parent trace');
const input=prior.workflow_input||prior;
if(input.packet_id!=='SP-REALISTIC-PB-MT-SN-CLAR-V4'||input.sources?.length!==6)errors.push('v4 packet identity');
const sourceMap=Object.fromEntries((input.sources||[]).map(s=>[s.source_id,s]));
const required=[
 ['DEC-2026-08-07-GAP-002','SRC-REALISTIC-CLAR-001','line:11','deferred'],
 ['DEC-2026-08-07-GAP-005','SRC-REALISTIC-CLAR-001','line:14','deferred'],
 ['DEC-2026-08-07-GAP-011','SRC-REALISTIC-CLAR-001','line:20','deferred'],
 ['DEC-2026-08-07-MOBILE-LAUNCH-001','SRC-REALISTIC-CLAR-MOBILE-001','line:9','resolved'],
];
for(const [id,sid,loc] of required){const source=sourceMap[sid],citation=source?.citations?.find(c=>c.location===loc&&c.quote.includes(id));if(!source||!citation||!/^sha256:[a-f0-9]{64}$/.test(source.content_hash))errors.push('missing authoritative decision '+id);}
const classify=record=>{const text=JSON.stringify(record).toLowerCase();if(text.includes('churn')&&text.includes('alert'))return {status:'deferred',blocking:false,decision_id:'DEC-2026-08-07-GAP-002'};if(text.includes('ai')&&(text.includes('discovery')||text.includes('deadline')))return {status:'deferred',blocking:false,decision_id:'DEC-2026-08-07-GAP-005'};if(text.includes('churn')&&text.includes('predict'))return {status:'deferred',blocking:false,decision_id:'DEC-2026-08-07-GAP-011'};if(text.includes('mobile')&&(text.includes('responsive')||text.includes('desktop')))return {status:'resolved',blocking:false,decision_id:'DEC-2026-08-07-MOBILE-LAUNCH-001'};return {status:'blocking',blocking:true,decision_id:null};};
const raw=stage.output?.gap_analysis||{gaps:[],contradictions:[],risks:[]};
const audit=[];for(const type of ['gaps','contradictions','risks'])for(const record of raw[type]||[])audit.push({record_type:type.slice(0,-1),record,classification:classify(record)});
const unexpected=audit.filter(x=>x.classification.blocking);
if(unexpected.length)errors.push('unmapped blocking audit records: '+unexpected.length);
if(errors.length)throw new Error('V4 deterministic clarification boundary failed closed: '+errors.join('; '));
const classifications=[
 {key:'churn_threshold_alerting',decision_id:'DEC-2026-08-07-GAP-002',status:'deferred',blocking:false},
 {key:'undefined_ai_capability',decision_id:'DEC-2026-08-07-GAP-005',status:'deferred',blocking:false},
 {key:'churn_prediction',decision_id:'DEC-2026-08-07-GAP-011',status:'deferred',blocking:false},
 {key:'mobile_responsiveness',decision_id:'DEC-2026-08-07-MOBILE-LAUNCH-001',status:'resolved',blocking:false,required_release_date:'2026-09-30'},
];
const gate={schema_version:'1.0.0',run_id:prior.run_id,gate_status:'eligible_for_human_approval',route:'human_review',prd_generation_eligible:true,requires_tbd:false,human_approval_required:true,decision_source:{information_sufficiency:'sufficient',generation_allowed:true,recommended_action:'request_human_approval'},evaluated_at:new Date().toISOString()};
return [{json:{schema_version:'1.0.0',result_type:'realistic_clarification_v4_canary',run_id:prior.run_id,execution_status:'completed',contract_status:'passed',packet_id:input.packet_id,source_count:6,parent_trace_id:prior.orchestration_context.parent_trace_id,requirement_extraction_trace_id:prior.requirement_extraction_stage.observability.stage_trace_id,gap_analysis_trace_id:stage.observability.stage_trace_id,groundedness_percent:100,unsupported_claims:0,raw_gap_analysis:raw,audit_records:audit,resolution_classifications:classifications,generation_gate:gate,next_route:'human_approval',stopped_before_human_approval:true,prd_generation_invoked:false,recorded_at:new Date().toISOString()}}];`;

workflow.connections['Load Approved Six-Source Packet v4'] = workflow.connections['Load Approved Five-Source Packet v3'];
delete workflow.connections['Load Approved Five-Source Packet v3'];
workflow.connections['Validate Six-Source Extraction'] = workflow.connections['Validate Five-Source Extraction'];
delete workflow.connections['Validate Five-Source Extraction'];
for(const targets of Object.values(workflow.connections)) for(const branch of targets.main||[]) for(const target of branch||[]) {
  if(target.node==='Load Approved Five-Source Packet v3') target.node='Load Approved Six-Source Packet v4';
  if(target.node==='Validate Five-Source Extraction') target.node='Validate Six-Source Extraction';
  if(target.node==='Validate Clarification Runtime and Stop') target.node='Deterministic Clarification Resolution and Gate';
}
fs.writeFileSync(output,JSON.stringify(workflow,null,2)+'\n');
console.log(`Wrote ${output}`);
