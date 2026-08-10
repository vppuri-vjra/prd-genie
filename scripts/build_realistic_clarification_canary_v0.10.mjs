import crypto from 'node:crypto';
import fs from 'node:fs';

const input='workflows/n8n/prd-genie-realistic-clarification-v4-canary-v0.9.json';
const output='workflows/n8n/prd-genie-realistic-clarification-v4-canary-v0.10.json';
const workflow=JSON.parse(fs.readFileSync(input,'utf8'));

workflow.name='PRD Genie - Realistic Clarification v4 Deterministic Gate Canary v0.10';
workflow.versionId=crypto.randomUUID();

const validate=workflow.nodes.find(node=>node.name==='Validate Six-Source Extraction');
if(!validate)throw new Error('Validate Six-Source Extraction node is missing');
validate.parameters.jsCode=validate.parameters.jsCode
  .replace("$('Load Approved Five-Source Packet v3')","$('Load Approved Six-Source Packet v4')")
  .replace("(stage.source_packet?.sources||[]).length!==5","(stage.source_packet?.sources||[]).length!==6")
  .replace('Four-source extraction acceptance failed','Six-source extraction acceptance failed');

const serialized=JSON.stringify(workflow);
for(const forbidden of ['Load Approved Five-Source Packet v3','Five-Source','five-source','Four-source','four-source']){
  if(serialized.includes(forbidden))throw new Error(`Inherited identifier remains: ${forbidden}`);
}

fs.writeFileSync(output,JSON.stringify(workflow,null,2)+'\n');
console.log(`Wrote ${output}`);
