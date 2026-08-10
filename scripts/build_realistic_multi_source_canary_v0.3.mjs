import crypto from 'node:crypto';
import fs from 'node:fs';

const input = 'workflows/n8n/prd-genie-realistic-multi-source-canary-v0.2.json';
const output = 'workflows/n8n/prd-genie-realistic-multi-source-canary-v0.3.json';
const childId = process.argv[2];
if (!childId) throw new Error('Child v1.4 workflow ID is required');

const workflow = JSON.parse(fs.readFileSync(input, 'utf8'));
workflow.name = 'PRD Genie - Realistic Multi-Source Requirement Extraction Canary v0.3';
workflow.versionId = crypto.randomUUID();
const child = workflow.nodes.find((node) => node.type === 'n8n-nodes-base.executeWorkflow');
child.name = 'Execute Requirement Extractor Child v1.4';
child.parameters.workflowId.value = childId;
child.parameters.workflowId.cachedResultName = 'PRD Genie - Requirement Extractor Child v1.4';

const oldConnection = workflow.connections['Execute Requirement Extractor Child v1.3'];
delete workflow.connections['Execute Requirement Extractor Child v1.3'];
workflow.connections['Execute Requirement Extractor Child v1.4'] = oldConnection;
workflow.connections['Load Approved Realistic PB MT SN Packet'].main[0][0].node = child.name;

fs.writeFileSync(output, JSON.stringify(workflow, null, 2) + '\n');
console.log(`Wrote ${output} for child ${childId}`);
