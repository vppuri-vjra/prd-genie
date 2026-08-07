import crypto from 'node:crypto';
import fs from 'node:fs';

const input = 'workflows/n8n/prd-genie-requirement-extractor-child-v1.4.1.json';
const output = 'workflows/n8n/prd-genie-requirement-extractor-child-v1.4.2.json';
const workflow = JSON.parse(fs.readFileSync(input, 'utf8'));

workflow.name = 'PRD Genie - Requirement Extractor Child v1.4.2';
workflow.versionId = crypto.randomUUID();

const trace = workflow.nodes.find((node) => node.name === 'Create Trace Context');
trace.parameters.jsCode = trace.parameters.jsCode.replace('child-v1.4.1', 'child-v1.4.2');

const extractor = workflow.nodes.find((node) => node.name === 'Requirement Extractor');
extractor.parameters.messages.messageValues[0].message += `

v1.9.2 conflict-evidence completeness audit: A direct decision or instruction that selects product behavior, including a temporary or qualified decision such as "for now", remains a grounded requirement item even when it conflicts with other evidence. Do not represent that citation only in the coverage ledger or only in a contradiction record. Before returning JSON, audit every CONFLICT ledger row: the exact source_id, location, and quote must appear in the evidence array of at least one emitted conflicting item named in that row; the row must also name the corresponding unresolved CTR ID; and that contradiction must include the evidence-backed item ID. If any link is absent, repair the item, evidence, bidirectional item relationships, contradiction item_ids, and ledger targets before returning. Never invent an item merely to satisfy this audit.`;

const model = workflow.nodes.find((node) => node.name === 'OpenAI - Extractor Model');
model.parameters.modelName = "={{ 'gpt-5.6-terra' }}";
model.parameters.options = {};

fs.writeFileSync(output, JSON.stringify(workflow, null, 2) + '\n');
console.log(`Wrote ${output}`);
