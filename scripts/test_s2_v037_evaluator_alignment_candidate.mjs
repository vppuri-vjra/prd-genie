import assert from 'node:assert/strict';
import fs from 'node:fs';

const load = file => JSON.parse(fs.readFileSync(`workflows/n8n/${file}`, 'utf8'));
const node = (workflow, name) => workflow.nodes.find(candidate => candidate.name === name);
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
const compile = workflow => workflow.nodes.forEach(candidate => {
  if (candidate.parameters?.jsCode) assert.doesNotThrow(() => new AsyncFunction(candidate.parameters.jsCode), `${workflow.name}: ${candidate.name}`);
});

const prd = load('prd-genie-s2-production-prd-v0.2.3-approved-namespace-candidate.json');
const story = load('prd-genie-s2-story-breakdown-v0.2.7-evaluator-alignment-candidate.json');
compile(prd);
compile(story);

const prdCode = node(prd, 'Generate Dynamic Grounded PRD').parameters.jsCode;
for (const expected of [
  "title:'Controlled Data Refresh',prd_source_ids:['FR-003']",
  "title:'Role-Based Access',prd_source_ids:['FR-004']",
  "title:'Responsive Web Access',prd_source_ids:['FR-007']",
  "title:'PDF Reporting',prd_source_ids:['FR-005','AC-001']",
  "title:'Excel Export',prd_source_ids:['FR-006','AC-002']",
  "criterion:'Reports can be filtered using the approved preset and custom date ranges.'",
  "markdown=lines.join('\\n').replace(/## 5\\. Acceptance Criteria",
]) assert.ok(prdCode.includes(expected), `Stage 5 missing ${expected}`);
assert.ok(!prdCode.includes("title:'Responsive Web Access',prd_source_ids:['NFR-003']"));
assert.ok(!prdCode.includes("markdown=canonicalPrdTemplate.replace('{{RUN_DATE}}'"));

const storyCode = node(story, 'Generate Dynamic Delivery Hierarchy').parameters.jsCode;
for (const expected of [
  "'Preset and custom date-range filtering':'filter reports using preset and custom date ranges'",
  "'15-minute automatic refresh':'have dashboard data refresh automatically every 15 minutes'",
  "'Executive access to all data':'access all approved dashboard data'",
  "sourceItems.find(item=>item.type==='functional_requirement')",
  "priority:priorityOf(priorityStatement)",
]) assert.ok(storyCode.includes(expected), `Stage 6 missing ${expected}`);
assert.ok(!storyCode.includes('priority:priorityOf(f.statement)'));

console.log('v0.3.7 evaluator-alignment checks passed.');
