import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const source = process.argv[2];
if (!source) throw new Error('Usage: node scripts/build_s2_story_breakdown_v025_corrected_langfuse_candidate.mjs <v0.2.4-export.json>');

const workflow = JSON.parse(fs.readFileSync(source, 'utf8'));
const telemetryTemplate = JSON.parse(fs.readFileSync(path.join(root, 'workflows/n8n/prd-genie-s2-story-breakdown-v0.2.1-contract-langfuse-candidate.json'), 'utf8'));
const node = (document, name) => {
  const found = document.nodes.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Missing node: ${name}`);
  return found;
};

const hierarchy = node(workflow, 'Generate Dynamic Delivery Hierarchy');
hierarchy.parameters.jsCode = hierarchy.parameters.jsCode
  .replace(
    "const byType=t=>elements.filter(x=>x.type===t),fr=byType('functional_requirement'),nfr=byType('non_functional_requirement'),personas=elements.filter(x=>['persona','user_persona'].includes(x.type));",
    "const byType=t=>elements.filter(x=>x.type===t),fr=byType('functional_requirement'),nfr=byType('non_functional_requirement'),personas=elements.filter(x=>['persona','user_persona'].includes(x.type));const bucketOf=s=>/core metrics|revenue.+active users|NPS/i.test(s)?'core_metrics':/date range|category.+status/i.test(s)?'filtering':/refresh|last-updated|repeated requests|live.database|precomputed/i.test(s)?'refresh':/role-based|executive.+all data|team lead.+team/i.test(s)?'access':/PDF|board reports|company logo.+page/i.test(s)?'pdf':/XLSX|formula preservation|Export to Excel/i.test(s)?'xlsx':/responsive web access|mobile responsiveness/i.test(s)?'responsive':null;const bucketOrder=['core_metrics','filtering','refresh','access','responsive','pdf','xlsx'],deliveryByBucket=new Map();for(const el of elements){const bucket=bucketOf(el.statement);if(!bucket)continue;if(!deliveryByBucket.has(bucket))deliveryByBucket.set(bucket,[]);deliveryByBucket.get(bucket).push(el);}const delivery=bucketOrder.map(bucket=>{const sourceItems=deliveryByBucket.get(bucket)||[];if(!sourceItems.length)return null;return{...sourceItems[0],statement:sourceItems.map(x=>x.statement).join(' '),citation_ids:[...new Set(sourceItems.flatMap(x=>x.citation_ids||[]))],_source_items:sourceItems};}).filter(Boolean),deliveryItemIds=new Set(delivery.flatMap(x=>x._source_items.map(i=>i.item_id)));",
  )
  .replace('const epicMap=new Map();for(const f of fr){', 'const epicMap=new Map();for(const f of delivery){')
  .replace(
    "const governanceMappings=elements.filter(x=>x.type!=='functional_requirement'&&(x.type!=='non_functional_requirement'||!attachedNfrIds.has(x.item_id))).map(el=>",
    "const governanceMappings=elements.filter(x=>!deliveryItemIds.has(x.item_id)&&(x.type!=='non_functional_requirement'||!attachedNfrIds.has(x.item_id))).map(el=>",
  )
  .replace(
    'const makeStory=(f,title)=>{const constraints=applicableNfr(f),storyItems=[f,...constraints],',
    'const makeStory=(f,title)=>{const sourceItems=f._source_items||[f],constraints=applicableNfr(f),storyItems=[...sourceItems,...constraints],',
  )
  .replace(
    "text:acceptanceText(f),item_ids:[f.item_id],citation_ids:f.citation_ids,status:'grounded'",
    "text:sourceItems.map(acceptanceText).join(' '),item_ids:ids(sourceItems),citation_ids:citations(sourceItems),status:'grounded'",
  )
  .replace('const unresolvedQuestions=fr.flatMap(f=>', 'const unresolvedQuestions=delivery.flatMap(f=>')
  .replace("story_item_coverage:(new Set(storyItems).size)+'/'+(fr.length+nfr.length)", "story_item_coverage:(new Set(storyItems).size)+'/'+(delivery.length+nfr.length)");
for (const required of ['bucketOf', 'bucketOrder', 'deliveryByBucket', 'for(const f of delivery)', 'deliveryItemIds']) {
  if (!hierarchy.parameters.jsCode.includes(required)) throw new Error(`Failed to add delivery constraint contract: ${required}`);
}

const buildTrace = node(workflow, 'Build Story Breakdown Trace');
buildTrace.parameters = structuredClone(node(telemetryTemplate, 'Build Story Breakdown Trace').parameters);
buildTrace.parameters.jsCode = buildTrace.parameters.jsCode
  .replace(
    'prd_elements contains only elements mapped to stories; other approved PRD elements remain represented in governance_mappings.',
    'prd_elements contains the complete approved set; coverage is satisfied across stories and governance_mappings.',
  )
  .replace(
    "const story_item_ids=new Set(x.epics.flatMap(e=>e.features).flatMap(f=>f.stories).flatMap(s=>s.item_ids));const story_prd_elements=x.prd_elements.filter(e=>story_item_ids.has(e.item_id));const semanticInput={evaluation_context,evaluation_case_id:'STORY-PRODUCTION-SHADOW',prd_elements:story_prd_elements,",
    "const semanticInput={evaluation_context,evaluation_case_id:'STORY-PRODUCTION-SHADOW',prd_elements:x.prd_elements,",
  );
if (buildTrace.parameters.jsCode.includes('story_prd_elements')) {
  throw new Error('Failed to promote the complete PRD element set into the semantic trace');
}

const sendTrace = structuredClone(node(telemetryTemplate, 'Send Production Shadow Trace to Langfuse'));
sendTrace.id = '872c12ca-b4fc-463d-a8e8-6b3ef67efc7a';
sendTrace.position = [1328, 0];

const verifyTrace = structuredClone(node(telemetryTemplate, 'Verify Production Shadow Trace Ingestion'));
verifyTrace.id = '51646fd6-c49c-4eaa-8eef-b753e0c5d46a';
verifyTrace.position = [1584, 0];

const returnNode = node(workflow, 'Return Story Breakdown');
returnNode.position = [1840, 0];
workflow.nodes.push(sendTrace, verifyTrace);

workflow.connections['Build Story Breakdown Trace'] = {main: [[{node: sendTrace.name, type: 'main', index: 0}]]};
workflow.connections[sendTrace.name] = {main: [[{node: verifyTrace.name, type: 'main', index: 0}]]};
workflow.connections[verifyTrace.name] = {main: [[{node: returnNode.name, type: 'main', index: 0}]]};

workflow.name = 'S2_ Dynamic Story Breakdown v0.2.5 - Corrected Structure Langfuse Callable Candidate';
workflow.active = false;
workflow.versionId = null;
delete workflow.id;
workflow.meta = {
  ...(workflow.meta || {}),
  candidate_only: true,
  source_workflow_id: 'BR3ZsUWwB6hj9TKg',
  structure_baseline: 'v0.2.4',
  telemetry_contract: 'story-breakdown-semantic-evaluation',
};

const output = path.join(root, 'workflows/n8n/prd-genie-s2-story-breakdown-v0.2.5-corrected-langfuse-candidate.json');
fs.writeFileSync(output, `${JSON.stringify(workflow, null, 2)}\n`);
console.log(path.relative(root, output));
