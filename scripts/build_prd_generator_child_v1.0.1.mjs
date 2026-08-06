import fs from 'node:fs';
import crypto from 'node:crypto';

const sourcePath = 'workflows/n8n/prd-genie-prd-generator-child-v1.0.json';
const outputPath = 'workflows/n8n/prd-genie-prd-generator-child-v1.0.1.json';
const workflow = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

workflow.name = 'PRD Genie - PRD Generator Child v1.0.1';
workflow.versionId = crypto.randomUUID();

const validator = workflow.nodes.find((node) => node.name === 'Parse and Validate PRD');
const marker = "let p;try{p=JSON.parse(s)}catch(e){throw new Error('PRD output is not JSON: '+e.message)}const c=";
const replacement = "let p;try{p=JSON.parse(s)}catch(e){throw new Error('PRD output is not JSON: '+e.message)}if(p?.goals_and_objectives?.business_goal?.status==='tbd'&&p.goals_and_objectives.business_goal.value==='TBD')p.goals_and_objectives.business_goal.value='TBD - stakeholder input required';const c=";
if (!validator?.parameters?.jsCode?.includes(marker)) throw new Error('PRD validator insertion point not found');
validator.parameters.jsCode = validator.parameters.jsCode.replace(marker, replacement);

fs.writeFileSync(outputPath, `${JSON.stringify(workflow, null, 2)}\n`);
