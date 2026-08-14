import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = name => JSON.parse(fs.readFileSync(path.join(root, 'workflows/n8n', name), 'utf8'));
const baseline = read('prd-genie-s2-main-orchestrator-v0.3.4-score-poll-candidate.json');
const candidate = read('prd-genie-s2-main-orchestrator-v0.3.5-corrected-document-candidate.json');
const byName = (workflow, name) => workflow.nodes.find(node => node.name === name);

const expected = {
  'Execute Production PRD v0.1': '1WXsLji7nKcZ9h19',
  'Execute Story Breakdown v0.2': 'L9fOL3BCH5hpsVGv',
  'Execute Final Validator v0.1': '9mWVW58xe4mxcYZg',
};

assert.equal(candidate.active, false);
assert.equal(candidate.versionId, null);
assert.equal(candidate.id, undefined, 'Candidate must import as a new workflow');
assert.equal(candidate.meta.sizing_included, false);
assert.ok(byName(candidate, 'Prepare Validated Drive Exports').parameters.jsCode.includes('prd_review_export'));
assert.ok(byName(candidate, 'Prepare Validated Drive Exports').parameters.jsCode.includes('story_review_export'));
assert.ok(byName(candidate, 'Confirm Validated Drive Delivery').parameters.jsCode.includes('uploaded.length!==6'));
assert.ok(byName(candidate, 'Validate Dynamic Story Output').parameters.jsCode.includes('canonical counts'));
assert.ok(byName(candidate, 'Validate Dynamic Story Output').parameters.jsCode.includes('stories.length!==11'));

for (const node of baseline.nodes) {
  const next = byName(candidate, node.name);
  assert.ok(next, `Missing inherited node: ${node.name}`);
  if (expected[node.name]) {
    assert.equal(next.parameters.workflowId.value, expected[node.name]);
    const normalized = structuredClone(next);
    normalized.parameters.workflowId = node.parameters.workflowId;
    assert.deepEqual(normalized, node, `Non-reference change in ${node.name}`);
  } else if (['Validate Dynamic Story Output', 'Prepare Validated Drive Exports', 'Confirm Validated Drive Delivery'].includes(node.name)) {
    const normalized = structuredClone(next);
    normalized.parameters.jsCode = node.parameters.jsCode;
    assert.deepEqual(normalized, node, `Unexpected non-export change in ${node.name}`);
  } else {
    assert.deepEqual(next, node, `Unexpected change in ${node.name}`);
  }
}

assert.deepEqual(candidate.connections, baseline.connections, 'Connections changed');
assert.equal(candidate.nodes.length, baseline.nodes.length, 'Node count changed');
assert.deepEqual(candidate.settings, baseline.settings, 'Settings changed');

console.log(JSON.stringify({
  result: 'PASS',
  baseline: 'v0.3.4',
  candidate: 'v0.3.5',
  changed_stages: [5, 6, 7, 'delivery-export'],
  delivered_files: 6,
  sizing_included: false,
  production_state_changed: false,
}, null, 2));
