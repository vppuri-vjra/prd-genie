import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const load = name => JSON.parse(fs.readFileSync(path.join(root, 'workflows/n8n', name), 'utf8'));
const find = (workflow, name) => workflow.nodes.find(node => node.name === name);
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
const compileCodeNodes = workflow => {
  for (const node of workflow.nodes) {
    if (node.parameters?.jsCode) assert.doesNotThrow(() => new AsyncFunction(node.parameters.jsCode), `${workflow.name}: ${node.name}`);
  }
};
const credentials = workflow => workflow.nodes.flatMap(node => Object.entries(node.credentials || {}).map(([type, value]) => [node.name, type, value.id, value.name]));

const prdBase = load('prd-genie-s2-production-prd-v0.2.1-template-langfuse-candidate.json');
const prd = load('prd-genie-s2-production-prd-v0.2.2-feature-acceptance-candidate.json');
const storyBase = load('prd-genie-s2-story-breakdown-v0.2.5-corrected-langfuse-candidate.json');
const story = load('prd-genie-s2-story-breakdown-v0.2.6-feature-acceptance-linkage-candidate.json');
const validatorBase = load('prd-genie-s2-final-validator-export-v0.3-full-markdown-candidate.json');
const validator = load('prd-genie-s2-final-validator-export-v0.4-acceptance-alignment-candidate.json');
const parentBase = load('prd-genie-s2-main-orchestrator-v0.3.6-sizing-candidate.json');
const parent = load('prd-genie-s2-main-orchestrator-v0.3.7-acceptance-alignment-candidate.json');

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
  "prd_source_ids:['FR-001']",
  "prd_source_ids:['NFR-003']",
  "prd_source_ids:['FR-004','AC-001']",
  'company logo at the top of every page',
  'Missing required acceptance evidence',
  'artifact.validation.feature_acceptance_criteria_contract=true',
  "replace(/## 5\\. Acceptance Criteria",
]) assert.ok(prdCode.includes(required), `Stage 5 missing ${required}`);
assert.equal((prdCode.match(/feature_id:'FEAT-/g) || []).length, 7, 'Stage 5 must define seven features');
assert.equal((prdCode.match(/title:'(?:Display five|Preset and|15-minute|Manual refresh|Display last|Protect against|Executive access|Team-lead access|Responsive web|Export monthly|Export XLSX)/g) || []).length, 11, 'Stage 5 must define eleven story scopes');

const storyCode = find(story, 'Generate Dynamic Delivery Hierarchy').parameters.jsCode;
for (const required of ['facByScope', 'parent_feature_id:parentFeatureId', 'feature_acceptance_criteria_ids', 'display_source_ids', 'feature.display_source_ids', 'epic.display_source_ids', "'Sources: '+epic.display_source_ids", "'Sources: '+feature.display_source_ids", "'- **Source:** '+story.display_source_ids", 'Feature criteria', 'makeStory(f,title,feature.feature_id)', 'feature_acceptance_linkage:true']) {
  assert.ok(storyCode.includes(required), `Stage 6 missing ${required}`);
}
assert.ok(storyCode.includes("criterion_id:'SBAC-'"), 'Stage 6 story acceptance criteria were removed');

const storyValidation = find(story, 'Validate PRD to Story Coverage').parameters.jsCode;
for (const required of ['epic display source synchronization', 'feature display source synchronization', 'story display source synchronization', 'canonical PRD source mismatch', 'missing feature acceptance link', 'invalid feature acceptance link', 'feature acceptance link absent from Markdown', 'unused feature acceptance criterion']) {
  assert.ok(storyValidation.includes(required), `Stage 6 validation missing ${required}`);
}

const finalValidation = find(validator, 'Validate Bidirectional Traceability').parameters.jsCode;
for (const required of ['feature acceptance coverage', 'missing story acceptance', 'story feature mismatch', 'unused feature acceptance criterion']) {
  assert.ok(finalValidation.includes(required), `Stage 7 validation missing ${required}`);
}
const finalExport = find(validator, 'Build Dynamic Final Export').parameters.jsCode;
assert.ok(finalExport.includes('feature_acceptance_coverage:true'));
assert.ok(finalExport.includes('story_acceptance_linkage:true'));

compileCodeNodes(parent);
assert.deepEqual(credentials(parent), credentials(parentBase), 'Parent credentials changed');
const references = Object.fromEntries(parent.nodes.filter(node=>node.parameters?.workflowId?.value).map(node=>[node.name,node.parameters.workflowId.value]));
assert.equal(references['Execute Production PRD v0.1'], 'FszzWnuH2GEljqsC');
assert.equal(references['Execute Story Breakdown v0.2'], 'F146WpcfZZVomhq0');
assert.equal(references['Execute Final Validator v0.1'], 'GotMdQ0eX6zbYwki');
assert.equal(references['Execute Non-Blocking Sizing v0.2'], 'vlLpeCD9szPEA400', 'Sizing reference changed');
for (const unchanged of ['Execute Google Drive Clarification Gate v0.12.0','Execute Human Approval Tail v0.1']) {
  assert.equal(references[unchanged], Object.fromEntries(parentBase.nodes.filter(node=>node.parameters?.workflowId?.value).map(node=>[node.name,node.parameters.workflowId.value]))[unchanged], `${unchanged} changed`);
}

const releaseRouter = find(parent, 'Release Authorized Path');
assert.equal(releaseRouter.type, 'n8n-nodes-base.if', 'Release routing must use an explicit true/false branch');
assert.equal(releaseRouter.parameters.conditions.conditions[0].leftValue, '={{ $json.production_loop.release_authorized }}');
assert.equal(releaseRouter.parameters.conditions.conditions[0].operator.type, 'boolean');
assert.equal(releaseRouter.parameters.conditions.conditions[0].operator.operation, 'true');
assert.deepEqual(parent.connections['Production Agreement Gate v0.3 - Enforced'].main[0].map(edge => edge.node), ['Release Authorized Path']);
assert.deepEqual(parent.connections['Release Authorized Path'].main[0].map(edge => edge.node), ['Execute Final Validator v0.1']);
assert.deepEqual(parent.connections['Release Authorized Path'].main[1].map(edge => edge.node), ['Hold for Human Review Path']);

console.log('v0.3.7 acceptance-criteria candidate contract checks passed.');
