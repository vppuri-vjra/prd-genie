import crypto from 'node:crypto';
import fs from 'node:fs';

const extractorId=process.argv[2];
if(!extractorId)throw new Error('Extractor workflow ID is required');
const input='workflows/n8n/prd-genie-realistic-clarification-v2-canary-v0.1.json';
const output='workflows/n8n/prd-genie-realistic-clarification-v2-canary-v0.2.json';
const workflow=JSON.parse(fs.readFileSync(input,'utf8'));
workflow.name='PRD Genie - Realistic Clarification v2 Canary v0.2';
workflow.versionId=crypto.randomUUID();
const node=workflow.nodes.find(n=>n.name==='Execute Requirement Extractor Child v1.6');
node.name='Execute Requirement Extractor Child v1.6.1';
node.parameters.workflowId.value=extractorId;
node.parameters.workflowId.cachedResultName='PRD Genie - Requirement Extractor Child v1.6.1';
workflow.connections['Load Approved Four-Source Packet v2'].main[0][0].node=node.name;
workflow.connections[node.name]=workflow.connections['Execute Requirement Extractor Child v1.6'];
delete workflow.connections['Execute Requirement Extractor Child v1.6'];
fs.writeFileSync(output,JSON.stringify(workflow,null,2)+'\n');
console.log(`Wrote ${output}`);
