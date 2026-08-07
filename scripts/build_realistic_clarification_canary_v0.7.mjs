import crypto from 'node:crypto';
import fs from 'node:fs';

const input = 'workflows/n8n/prd-genie-realistic-clarification-v3-canary-v0.6.json';
const output = 'workflows/n8n/prd-genie-realistic-clarification-v3-canary-v0.7.json';
const workflow = JSON.parse(fs.readFileSync(input, 'utf8'));

workflow.name = 'PRD Genie - Realistic Clarification v3 Human Approval Canary v0.7';
workflow.versionId = crypto.randomUUID();

const finalNode = workflow.nodes.find(node => node.name === 'Validate Clarification Runtime and Stop');
finalNode.name = 'Validate Gate and Map Human Approval Input';
finalNode.parameters.jsCode = `const gap=$input.first().json;
const prior=$('Validate Five-Source Extraction').first().json;
const errors=[];
if(gap.stage!=='gap_analysis'||gap.execution_status!=='passed')errors.push('gap stage');
if(gap.run_id!==prior.run_id)errors.push('run_id');
if(gap.groundedness_percent!==100)errors.push('gap grounding');
if(!gap.observability?.ingestion_accepted)errors.push('gap Langfuse');
if(gap.observability?.parent_trace_id!==prior.orchestration_context.parent_trace_id)errors.push('gap parent trace');
const gate=gap.output?.generation_gate;
if(gate?.gate_status!=='eligible_for_human_approval'||gate?.route!=='human_review'||gate?.prd_generation_eligible!==true||gate?.human_approval_required!==true)errors.push('gate not eligible');
if((gap.output?.gap_analysis?.gaps||[]).length||(gap.output?.gap_analysis?.contradictions||[]).length||(gap.output?.gap_analysis?.risks||[]).length)errors.push('unresolved gap records');
if(errors.length)throw new Error('Five-source approval entry failed: '+errors.join('; '));
return [{json:{schema_version:'1.0.0',run_id:prior.run_id,extraction:prior.requirement_extraction_stage.output,gap_analysis:gap.output.gap_analysis,generation_gate:gate,orchestration_context:prior.orchestration_context,approval_evidence:{packet_id:'SP-REALISTIC-PB-MT-SN-CLAR-V3',source_count:5,requirement_extraction_trace_id:prior.requirement_extraction_stage.observability.stage_trace_id,gap_analysis_trace_id:gap.observability.stage_trace_id,groundedness_percent:100,unsupported_claims:0}}}];`;
finalNode.position = [560, 0];

workflow.nodes.push({
  parameters: {
    source: 'database',
    workflowId: { __rl: true, value: 'lx7vCf4zxBlBjveh', mode: 'list', cachedResultName: 'PRD Genie - Human Approval Checkpoint Child v1.0.1' },
    mode: 'once',
    options: { waitForSubWorkflow: true },
  },
  id: crypto.randomUUID(),
  name: 'Execute Human Approval Checkpoint Child v1.0.1',
  type: 'n8n-nodes-base.executeWorkflow',
  typeVersion: 1.3,
  position: [840, 0],
});

workflow.nodes.push({
  parameters: {
    jsCode: `const stage=$input.first().json;
const mapped=$('Validate Gate and Map Human Approval Input').first().json;
const errors=[];
if(stage.schema_version!=='1.0.0'||stage.run_id!==mapped.run_id)errors.push('identity');
if(stage.stage!=='human_approval'||stage.execution_status!=='passed')errors.push('approval stage');
if(stage.decision!=='continue'||stage.next_route!=='prd_generation')errors.push('approval route');
if(stage.groundedness_percent!==100)errors.push('grounding');
if(stage.observability?.parent_trace_id!==mapped.orchestration_context.parent_trace_id)errors.push('parent trace');
if(!stage.observability?.ingestion_accepted)errors.push('approval Langfuse');
if(stage.output?.human_review?.review_status!=='approved')errors.push('review status');
const expected=(mapped.extraction.items||[]).map(x=>x.id).sort();
const approved=[...(stage.output?.human_review?.approved_item_ids||[])].sort();
if(JSON.stringify(expected)!==JSON.stringify(approved))errors.push('approved item coverage');
if((stage.output?.human_review?.rejected_item_ids||[]).length)errors.push('rejected items');
if(errors.length)throw new Error('Five-source Human Approval acceptance failed: '+errors.join('; '));
return [{json:{schema_version:'1.0.0',result_type:'realistic_clarification_v3_human_approval_canary',run_id:mapped.run_id,execution_status:'completed',contract_status:'passed',packet_id:mapped.approval_evidence.packet_id,parent_trace_id:mapped.orchestration_context.parent_trace_id,requirement_extraction_trace_id:mapped.approval_evidence.requirement_extraction_trace_id,gap_analysis_trace_id:mapped.approval_evidence.gap_analysis_trace_id,human_approval_trace_id:stage.observability.stage_trace_id,groundedness_percent:100,unsupported_claims:0,current_stage:'human_approval',next_route:'prd_generation',prd_generation_invoked:false,human_approval:stage,recorded_at:new Date().toISOString()}}];`,
  },
  id: crypto.randomUUID(),
  name: 'Validate Human Approval and Stop',
  type: 'n8n-nodes-base.code',
  typeVersion: 2,
  position: [1120, 0],
});

workflow.connections['Validate Gate and Map Human Approval Input'] = { main: [[{ node: 'Execute Human Approval Checkpoint Child v1.0.1', type: 'main', index: 0 }]] };
workflow.connections['Execute Human Approval Checkpoint Child v1.0.1'] = { main: [[{ node: 'Validate Human Approval and Stop', type: 'main', index: 0 }]] };

fs.writeFileSync(output, JSON.stringify(workflow, null, 2) + '\n');
console.log(`Wrote ${output}`);
