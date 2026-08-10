import crypto from 'node:crypto';
import fs from 'node:fs';

const input='workflows/n8n/prd-genie-realistic-clarification-v4-canary-v0.10.json';
const output='workflows/n8n/prd-genie-realistic-clarification-v4-canary-v0.11.json';
const workflow=JSON.parse(fs.readFileSync(input,'utf8'));
workflow.name='PRD Genie - Realistic Clarification v4 Deterministic Gate Canary v0.11';
workflow.versionId=crypto.randomUUID();

const validate=workflow.nodes.find(node=>node.name==='Validate Six-Source Extraction');
if(!validate)throw new Error('Validate Six-Source Extraction node is missing');
validate.parameters.jsCode=validate.parameters.jsCode.replace(
  'clarification_contract:original.clarification_contract',
  'clarification_contract:original.clarification_contract,original_packet:original'
).replace(
  "if(errors.length)throw new Error('Six-source extraction acceptance failed: '+[...new Set(errors)].join('; ')); return",
  "if(errors.length)throw new Error('Six-source extraction acceptance failed: '+[...new Set(errors)].join('; ')); const immutableOriginal=JSON.parse(JSON.stringify(original)); const immutableContext=JSON.parse(JSON.stringify(original.orchestration_context)); return"
).replace(
  'orchestration_context:original.orchestration_context,requirement_extraction_stage:stage,clarification_contract:original.clarification_contract,original_packet:original',
  'orchestration_context:immutableContext,requirement_extraction_stage:stage,clarification_contract:immutableOriginal.clarification_contract,original_packet:immutableOriginal'
);

const gate=workflow.nodes.find(node=>node.name==='Deterministic Clarification Resolution and Gate');
if(!gate)throw new Error('Deterministic gate node is missing');
gate.parameters.jsCode=gate.parameters.jsCode.replace(
  'const input=prior.workflow_input||prior;\nif(input.packet_id',
  "const input=prior.original_packet;\nif(!input)errors.push('missing original_packet');\nif(input?.run_id!==prior.run_id)errors.push('original packet run_id');\nif(input?.orchestration_context?.parent_trace_id!==prior.orchestration_context.parent_trace_id)errors.push('original packet parent trace');\nif(input?.packet_id"
).replace(
  "const sourceMap=Object.fromEntries((input.sources||[]).map(s=>[s.source_id,s]));",
  "const sourceMap=Object.fromEntries((input?.sources||[]).map(s=>[s.source_id,s]));\nconst extractedMap=new Map((prior.requirement_extraction_stage?.source_packet?.sources||[]).map(s=>[s.source_id,s.content_hash]));\nfor(const source of input?.sources||[])if(extractedMap.get(source.source_id)!==source.content_hash)errors.push('mutated original source '+source.source_id);\nconst decisionIds=new Set(input?.clarification_contract?.decision_ids||[]);\nif(!Array.isArray(input?.clarification_contract?.supersessions)||!input.clarification_contract.supersessions.length)errors.push('missing supersessions');"
).replace(
  "for(const [id,sid,loc] of required){const source=sourceMap[sid]",
  "for(const [id,sid,loc] of required){if(!decisionIds.has(id))errors.push('missing decision ID '+id);const source=sourceMap[sid]"
);

const serialized=JSON.stringify(workflow);
if(!serialized.includes('original_packet'))throw new Error('original_packet contract was not installed');
fs.writeFileSync(output,JSON.stringify(workflow,null,2)+'\n');
console.log(`Wrote ${output}`);
