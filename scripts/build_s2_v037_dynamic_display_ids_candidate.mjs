import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const dir = path.join(root, 'workflows/n8n');
const input = 'prd-genie-s2-production-prd-v0.2.3-approved-namespace-candidate.json';
const output = 'prd-genie-s2-production-prd-v0.2.4-dynamic-display-ids-candidate.json';
const workflow = JSON.parse(fs.readFileSync(path.join(dir, input), 'utf8'));
const generate = workflow.nodes.find(node => node.name === 'Generate Dynamic Grounded PRD');
let code = generate.parameters.jsCode;

const replace = (before, after, label) => {
  if (!code.includes(before)) throw new Error(`Missing ${label}`);
  code = code.replace(before, after);
};

for (const [fixed, label] of [
  ["prd_source_ids:['FR-001'],", 'metrics IDs'],
  ["prd_source_ids:['FR-002'],", 'filter IDs'],
  ["prd_source_ids:['FR-003'],", 'refresh IDs'],
  ["prd_source_ids:['FR-004'],", 'access IDs'],
  ["prd_source_ids:['FR-007'],", 'responsive IDs'],
  ["prd_source_ids:['FR-005','AC-001'],", 'PDF IDs'],
  ["prd_source_ids:['FR-006','AC-002'],", 'Excel IDs'],
]) replace(fixed, '', label);

replace(
  "criterion:'Reports can be filtered using the approved preset and custom date ranges.'",
  "criterion:'Reports can be filtered using the approved preset and custom date ranges, category, and status.'",
  'complete approved filtering scope',
);
replace(
  "facN++;return{id:'FAC-'",
  "const approvedSourceItems=sourceItems.filter(item=>['functional_requirement','non_functional_requirement','acceptance_criterion'].includes(item.type));if(!approvedSourceItems.length)throw new Error('Missing approved requirement source for '+feature.feature_id+' / '+story.title);facN++;return{id:'FAC-'",
  'approved source selection',
);
replace(
  "prd_requirement_ids:feature.prd_source_ids,source_requirement_ids:[...new Set(sourceItems.map(item=>item.item_id))]",
  "prd_requirement_ids:[...new Set(approvedSourceItems.map(item=>item.item_id))],source_requirement_ids:[...new Set(sourceItems.map(item=>item.item_id))]",
  'dynamic criterion IDs',
);
replace(
  "return{feature_id:feature.feature_id,feature_title:feature.title,prd_requirement_ids:feature.prd_source_ids,criteria};",
  "return{feature_id:feature.feature_id,feature_title:feature.title,prd_requirement_ids:[...new Set(criteria.flatMap(criterion=>criterion.prd_requirement_ids))],criteria};",
  'dynamic feature IDs',
);

generate.parameters.jsCode = code;
workflow.name = 'S2_ Dynamic Production PRD v0.2.4 - Dynamic Display IDs Candidate';
workflow.versionId = null;
delete workflow.id;
workflow.meta = {...workflow.meta, candidate_only:true, v037_delta:'derive FAC and Story display IDs from current approved semantic matches'};
fs.writeFileSync(path.join(dir, output), `${JSON.stringify(workflow, null, 2)}\n`);
console.log(output);
