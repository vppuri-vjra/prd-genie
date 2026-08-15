import assert from 'node:assert/strict';
import fs from 'node:fs';

const workflow = JSON.parse(fs.readFileSync('workflows/n8n/prd-genie-s2-production-prd-v0.2.4-dynamic-display-ids-candidate.json', 'utf8'));
const code = workflow.nodes.find(node => node.name === 'Generate Dynamic Grounded PRD').parameters.jsCode;
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
for (const node of workflow.nodes) if (node.parameters?.jsCode) assert.doesNotThrow(() => new AsyncFunction(node.parameters.jsCode), node.name);

assert.ok(code.includes("approvedSourceItems=sourceItems.filter(item=>['functional_requirement','non_functional_requirement','acceptance_criterion'].includes(item.type))"));
assert.ok(code.includes('prd_requirement_ids:[...new Set(approvedSourceItems.map(item=>item.item_id))]'));
assert.ok(code.includes('prd_requirement_ids:[...new Set(criteria.flatMap(criterion=>criterion.prd_requirement_ids))]'));
assert.ok(code.includes('approved preset and custom date ranges, category, and status'));
assert.ok(!code.includes('prd_source_ids:['), 'Fixed display-ID maps remain');
for (const stale of ["['FR-003']","['FR-004']","['FR-005','AC-001']","['FR-006','AC-002']","['FR-007']"]) {
  assert.ok(!code.includes(`prd_source_ids:${stale}`), `Stale map remains: ${stale}`);
}

console.log('v0.3.7 dynamic display-ID checks passed.');
