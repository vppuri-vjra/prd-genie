import crypto from 'node:crypto';
import fs from 'node:fs';

const input = 'workflows/n8n/prd-genie-requirement-extractor-child-v1.4.json';
const output = 'workflows/n8n/prd-genie-requirement-extractor-child-v1.4.1.json';
const workflow = JSON.parse(fs.readFileSync(input, 'utf8'));

workflow.name = 'PRD Genie - Requirement Extractor Child v1.4.1';
workflow.versionId = crypto.randomUUID();

const trace = workflow.nodes.find((node) => node.name === 'Create Trace Context');
trace.parameters.jsCode = trace.parameters.jsCode.replace('child-v1.4.0', 'child-v1.4.1');

const extractor = workflow.nodes.find((node) => node.name === 'Requirement Extractor');
extractor.parameters.messages.messageValues[0].message += `

v1.9.1 conversational-context boundary: Meeting-management language, acknowledgements, transitions, and deferrals such as "okay", "we'll discuss this offline", "moving on", greetings, and closing remarks are CONTEXT with target NONE unless that same approved citation independently states a product item, missing information, or a material conflict. Do not classify a transition as CONFLICT merely because it follows conflicting statements. Conflict classification requires the citation itself to provide evidence for at least one conflicting emitted item.`;

const model = workflow.nodes.find((node) => node.name === 'OpenAI - Extractor Model');
model.parameters.modelName = "={{ 'gpt-5.6-terra' }}";
model.parameters.options = {};

fs.writeFileSync(output, JSON.stringify(workflow, null, 2) + '\n');
console.log(`Wrote ${output}`);
