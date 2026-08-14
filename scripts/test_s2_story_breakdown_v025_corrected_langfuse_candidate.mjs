import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const workflow = JSON.parse(fs.readFileSync(path.join(root, 'workflows/n8n/prd-genie-s2-story-breakdown-v0.2.5-corrected-langfuse-candidate.json'), 'utf8'));
const node = name => workflow.nodes.find(candidate => candidate.name === name);

assert.equal(workflow.id, undefined);
assert.equal(workflow.active, false);
assert.equal(workflow.versionId, null);
assert.equal(workflow.nodes.length, 8);
for (const name of [
  'Generate Dynamic Delivery Hierarchy',
  'Validate PRD to Story Coverage',
  'Validate Delivery Citation Grounding',
  'Build Story Breakdown Trace',
  'Send Production Shadow Trace to Langfuse',
  'Verify Production Shadow Trace Ingestion',
  'Return Story Breakdown',
]) assert.ok(node(name), `Missing ${name}`);

const traceCode = node('Build Story Breakdown Trace').parameters.jsCode;
for (const expected of ['story-breakdown-semantic-evaluation', 'production-agreement-shadow', 'otlp_payload']) {
  assert.ok(traceCode.includes(expected), `Missing trace contract: ${expected}`);
}
assert.ok(traceCode.includes('prd_elements:x.prd_elements'), 'Trace must evaluate the complete approved PRD element set');
assert.ok(!traceCode.includes('story_prd_elements'), 'Trace must not filter out governance-only PRD elements');
assert.equal(node('Send Production Shadow Trace to Langfuse').credentials.httpBasicAuth.id, 'trc3KgAB4Nacxjj3');
assert.equal(workflow.connections['Build Story Breakdown Trace'].main[0][0].node, 'Send Production Shadow Trace to Langfuse');
assert.equal(workflow.connections['Send Production Shadow Trace to Langfuse'].main[0][0].node, 'Verify Production Shadow Trace Ingestion');
assert.equal(workflow.connections['Verify Production Shadow Trace Ingestion'].main[0][0].node, 'Return Story Breakdown');
const hierarchyCode = node('Generate Dynamic Delivery Hierarchy').parameters.jsCode;
for (const expected of ['bucketOf', 'bucketOrder', 'deliveryByBucket', 'for(const f of delivery)', 'deliveryItemIds', 'responsive web access']) {
  assert.ok(hierarchyCode.includes(expected), `Missing delivery constraint contract: ${expected}`);
}

console.log(JSON.stringify({
  result: 'PASS',
  structure_baseline: 'v0.2.4',
  semantic_observation: 'story-breakdown-semantic-evaluation',
  callable_candidate: true,
}, null, 2));
