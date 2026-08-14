import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const load = name => JSON.parse(fs.readFileSync(path.join(root, 'workflows/n8n', name), 'utf8'));
const find = (workflow, name) => workflow.nodes.find(node => node.name === name);
const compileCodeNodes = workflow => {
  for (const node of workflow.nodes) {
    if (node.parameters?.jsCode) assert.doesNotThrow(() => new Function(node.parameters.jsCode), `${workflow.name}: ${node.name}`);
  }
};
const credentials = workflow => workflow.nodes.flatMap(node => Object.entries(node.credentials || {}).map(([type, value]) => [node.name, type, value.id, value.name]));

const prdBase = load('prd-genie-s2-production-prd-v0.2.1-template-langfuse-candidate.json');
const prd = load('prd-genie-s2-production-prd-v0.2.2-feature-acceptance-candidate.json');
const storyBase = load('prd-genie-s2-story-breakdown-v0.2.5-corrected-langfuse-candidate.json');
const story = load('prd-genie-s2-story-breakdown-v0.2.6-feature-acceptance-linkage-candidate.json');
const validatorBase = load('prd-genie-s2-final-validator-export-v0.3-full-markdown-candidate.json');
const validator = load('prd-genie-s2-final-validator-export-v0.4-acceptance-alignment-candidate.json');

for (const workflow of [prd, story, validator]) {
  assert.equal(workflow.active, false);
  assert.equal(workflow.meta.candidate_only, true);
  compileCodeNodes(workflow);
}

assert.deepEqual(credentials(prd), credentials(prdBase), 'Stage 5 credentials changed');
assert.deepEqual(credentials(story), credentials(storyBase), 'Stage 6 credentials changed');
assert.deepEqual(credentials(validator), credentials(validatorBase), 'Stage 7 credentials changed');

const prdCode = find(prd, 'Generate Dynamic Grounded PRD').parameters.jsCode;
for (const required of [
  "feature_id:'FEAT-001'",
  "feature_id:'FEAT-007'",
  "id:'FAC-'",
  'featureAcceptanceCriteria',
  'featureCriteriaMarkdown',
  'artifact.validation.feature_acceptance_criteria_contract=true',
  "replace(/## 5\\. Acceptance Criteria",
]) assert.ok(prdCode.includes(required), `Stage 5 missing ${required}`);
assert.equal((prdCode.match(/feature_id:'FEAT-/g) || []).length, 7, 'Stage 5 must define seven features');
assert.equal((prdCode.match(/title:'(?:Display five|Preset and|15-minute|Manual refresh|Display last|Protect against|Executive access|Team-lead access|Responsive web|Export monthly|Export XLSX)/g) || []).length, 11, 'Stage 5 must define eleven story scopes');

const storyCode = find(story, 'Generate Dynamic Delivery Hierarchy').parameters.jsCode;
for (const required of ['facByScope', 'parent_feature_id:parentFeatureId', 'feature_acceptance_criteria_ids', 'makeStory(f,title,feature.feature_id)', 'feature_acceptance_linkage:true']) {
  assert.ok(storyCode.includes(required), `Stage 6 missing ${required}`);
}
assert.ok(storyCode.includes("criterion_id:'SBAC-'"), 'Stage 6 story acceptance criteria were removed');

const storyValidation = find(story, 'Validate PRD to Story Coverage').parameters.jsCode;
for (const required of ['missing feature acceptance link', 'invalid feature acceptance link', 'unused feature acceptance criterion']) {
  assert.ok(storyValidation.includes(required), `Stage 6 validation missing ${required}`);
}

const finalValidation = find(validator, 'Validate Bidirectional Traceability').parameters.jsCode;
for (const required of ['feature acceptance coverage', 'missing story acceptance', 'story feature mismatch', 'unused feature acceptance criterion']) {
  assert.ok(finalValidation.includes(required), `Stage 7 validation missing ${required}`);
}
const finalExport = find(validator, 'Build Dynamic Final Export').parameters.jsCode;
assert.ok(finalExport.includes('feature_acceptance_coverage:true'));
assert.ok(finalExport.includes('story_acceptance_linkage:true'));

console.log('v0.3.7 acceptance-criteria candidate contract checks passed.');
