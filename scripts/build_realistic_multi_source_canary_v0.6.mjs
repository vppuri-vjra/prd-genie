import crypto from 'node:crypto';
import fs from 'node:fs';

const input = 'workflows/n8n/prd-genie-realistic-multi-source-canary-v0.5.json';
const output = 'workflows/n8n/prd-genie-realistic-multi-source-canary-v0.6.json';
const childId = process.argv[2];
if (!childId) throw new Error('Child v1.5 workflow ID is required');

const workflow = JSON.parse(fs.readFileSync(input, 'utf8'));
workflow.name = 'PRD Genie - Realistic Multi-Source Requirement Extraction Canary v0.6';
workflow.versionId = crypto.randomUUID();
const child = workflow.nodes.find((node) => node.type === 'n8n-nodes-base.executeWorkflow');
const oldName = child.name;
child.name = 'Execute Requirement Extractor Child v1.5';
child.parameters.workflowId.value = childId;
child.parameters.workflowId.cachedResultName = 'PRD Genie - Requirement Extractor Child v1.5';
workflow.connections[child.name] = workflow.connections[oldName];
delete workflow.connections[oldName];
workflow.connections['Load Approved Realistic PB MT SN Packet'].main[0][0].node = child.name;

fs.writeFileSync(output, JSON.stringify(workflow, null, 2) + '\n');
console.log(`Wrote ${output} for child ${childId}`);
