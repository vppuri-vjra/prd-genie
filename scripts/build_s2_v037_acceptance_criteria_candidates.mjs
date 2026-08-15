import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const workflowDir = path.join(root, 'workflows/n8n');
const read = name => JSON.parse(fs.readFileSync(path.join(workflowDir, name), 'utf8'));
const write = (name, value) => fs.writeFileSync(path.join(workflowDir, name), `${JSON.stringify(value, null, 2)}\n`);
const node = (workflow, name) => {
  const found = workflow.nodes.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Missing node: ${name}`);
  return found;
};
const replaceOnce = (text, before, after, label) => {
  const occurrences = text.split(before).length - 1;
  if (occurrences === 0) throw new Error(`Missing replacement anchor: ${label}`);
  if (occurrences !== 1) throw new Error(`Replacement anchor is not unique: ${label}`);
  const result = text.replace(before, after);
  if (result === text) throw new Error(`Replacement failed: ${label}`);
  return result;
};

// Stage 5: retain the accepted v0.3.6 PRD contract and replace only Section 5
// with deterministic feature-grouped acceptance criteria.
const prd = read('prd-genie-s2-production-prd-v0.2.1-template-langfuse-candidate.json');
const generatePrd = node(prd, 'Generate Dynamic Grounded PRD');
let prdCode = generatePrd.parameters.jsCode;
const featureContract = `
const featureDefinitions=[
  {feature_id:'FEAT-001',title:'Dashboard Insights',prd_source_ids:['FR-001'],stories:[{title:'Display five core metrics',criterion:'The dashboard displays revenue, active users, churn rate, NPS score, and support ticket volume.',pattern:/core metrics|revenue.+active users|NPS/i}]},
  {feature_id:'FEAT-002',title:'Report Filtering',prd_source_ids:['FR-002'],stories:[{title:'Preset and custom date-range filtering',criterion:'Reports can be filtered by date range, category, and status, including the approved preset and custom date ranges.',pattern:/date range|category.+status/i}]},
  {feature_id:'FEAT-003',title:'Controlled Data Refresh',prd_source_ids:['FR-006'],stories:[
    {title:'15-minute automatic refresh',criterion:'Approved precomputed dashboard data refreshes automatically every 15 minutes.',pattern:/refresh|precomputed|last-updated/i},
    {title:'Manual refresh of latest precomputed data',criterion:'A user can manually refresh the latest available precomputed warehouse data without querying the live database.',pattern:/refresh|precomputed|live.database/i},
    {title:'Display last-updated timestamp',criterion:'The dashboard displays the timestamp of the most recent completed data refresh.',pattern:/refresh|last-updated/i},
    {title:'Protect against excessive repeated requests',criterion:'The refresh control protects the system from excessive repeated requests.',pattern:/refresh|repeated requests/i}
  ]},
  {feature_id:'FEAT-004',title:'Role-Based Access',prd_source_ids:['FR-003'],stories:[
    {title:'Executive access to all data',criterion:'Executives can access all approved dashboard data.',pattern:/role-based|executives see all data/i},
    {title:'Team-lead access to team data only',criterion:'Team leads can access only data for their own team.',pattern:/role-based|team leads see their team/i}
  ]},
  {feature_id:'FEAT-005',title:'Responsive Web Access',prd_source_ids:['NFR-003'],stories:[{title:'Responsive web access completed before production launch',criterion:'Responsive web access is completed before the September 30, 2026 production launch.',pattern:/responsive web access|mobile responsiveness/i}]},
  {feature_id:'FEAT-006',title:'PDF Reporting',prd_source_ids:['FR-004','AC-001'],stories:[{title:'Export monthly board reports to PDF',criterion:'Monthly board reports can be exported to PDF with the company logo at the top of every page.',pattern:/PDF|board reports|company logo.+page/i,required_evidence_patterns:[/PDF|board reports/i,/company logo.+page/i]}]},
  {feature_id:'FEAT-007',title:'Excel Export',prd_source_ids:['FR-005'],stories:[{title:'Export XLSX with formulas preserved and approved label',criterion:'The approved “Export to Excel” action produces an XLSX file with formulas preserved.',pattern:/XLSX|formula preservation|Export to Excel/i}]}
];
let facN=0;const featureAcceptanceCriteria=featureDefinitions.map(feature=>{const criteria=feature.stories.map(story=>{const sourceItems=elements.filter(element=>story.pattern.test(String(element.statement||'')));if(!sourceItems.length)throw new Error('Missing approved source for '+feature.feature_id+' / '+story.title);for(const requiredPattern of story.required_evidence_patterns||[])if(!sourceItems.some(element=>requiredPattern.test(String(element.statement||''))))throw new Error('Missing required acceptance evidence for '+feature.feature_id+' / '+story.title);facN++;return{id:'FAC-'+String(facN).padStart(3,'0'),feature_id:feature.feature_id,feature_title:feature.title,story_scope:story.title,criterion:story.criterion,prd_requirement_ids:feature.prd_source_ids,source_requirement_ids:[...new Set(sourceItems.map(item=>item.item_id))],citation_ids:[...new Set(sourceItems.flatMap(item=>item.citation_ids||[]))],status:'grounded_controlled_restatement'};});return{feature_id:feature.feature_id,feature_title:feature.title,prd_requirement_ids:feature.prd_source_ids,criteria};});
const featureCriteriaMarkdown=featureAcceptanceCriteria.flatMap((feature,index)=>['### 5.'+(index+1)+' '+feature.feature_id+' — '+feature.feature_title,'',...feature.criteria.map(criterion=>'- [ ] **'+criterion.id+':** '+criterion.criterion+'\\n  - Story scope: '+criterion.story_scope+'\\n  - PRD requirement: '+criterion.prd_requirement_ids.join(', ')+'\\n  - Evidence: '+criterion.citation_ids.join(', ')),'']).join('\\n');
`;
prdCode = replaceOnce(
  prdCode,
  "const prd_document={schema_version:'1.2.0'",
  `${featureContract}\nconst prd_document={schema_version:'1.3.0'`,
  'insert feature acceptance contract',
);
prdCode = replaceOnce(
  prdCode,
  'acceptance_criteria:criteria,out_of_scope:exclusions',
  'acceptance_criteria:criteria,feature_acceptance_criteria:featureAcceptanceCriteria,out_of_scope:exclusions',
  'add structured feature acceptance criteria',
);
prdCode = replaceOnce(
  prdCode,
  "markdown=canonicalPrdTemplate.replace('{{RUN_DATE}}',new Date().toISOString().slice(0,10))",
  "markdown=canonicalPrdTemplate.replace('{{RUN_DATE}}',new Date().toISOString().slice(0,10)).replace(/## 5\\. Acceptance Criteria[\\s\\S]*?(?=\\n## 6\\. Out of Scope)/,'## 5. Acceptance Criteria\\n\\n'+featureCriteriaMarkdown+'\\n')",
  'render feature-grouped Section 5',
);
prdCode = replaceOnce(
  prdCode,
  "artifact.validation.canonical_prd_contract=true;",
  "artifact.feature_acceptance_criteria=featureAcceptanceCriteria;artifact.validation.feature_acceptance_criteria_contract=true;artifact.validation.feature_acceptance_criteria_count=featureAcceptanceCriteria.flatMap(feature=>feature.criteria).length;artifact.validation.feature_acceptance_feature_count=featureAcceptanceCriteria.length;artifact.validation.canonical_prd_contract=true;",
  'publish feature acceptance validation',
);
generatePrd.parameters.jsCode = prdCode;

const validatePrd = node(prd, 'Validate Approval to PRD Coverage');
validatePrd.parameters.jsCode = replaceOnce(
  validatePrd.parameters.jsCode,
  "if(!x.validation?.canonical_prd_contract||!/^sha256:[a-f0-9]{64}$/.test(x.prd_content_fingerprint||''))e.push('canonical PRD fingerprint');",
  "const fac=(d.feature_acceptance_criteria||[]),flatFac=fac.flatMap(feature=>feature.criteria||[]),knownItems=new Set(x.prd_elements.map(item=>item.item_id));if(fac.length!==7||flatFac.length!==11||new Set(fac.map(feature=>feature.feature_id)).size!==7)e.push('feature acceptance counts');if(flatFac.some(criterion=>!(criterion.source_requirement_ids||[]).length||(criterion.source_requirement_ids||[]).some(id=>!knownItems.has(id))))e.push('feature acceptance grounding');if(flatFac.some(criterion=>!x.markdown.includes('**'+criterion.id+':**')||!x.markdown.includes('### 5.'+String(fac.findIndex(feature=>feature.feature_id===criterion.feature_id)+1)+' '+criterion.feature_id+' — ')))e.push('feature acceptance Markdown synchronization');if(!x.validation?.canonical_prd_contract||!x.validation?.feature_acceptance_criteria_contract||!/^sha256:[a-f0-9]{64}$/.test(x.prd_content_fingerprint||''))e.push('canonical PRD fingerprint');",
  'validate feature acceptance contract',
);
prd.name = 'S2_ Dynamic Production PRD v0.2.2 - Feature Acceptance Criteria Candidate';
prd.active = false;
prd.versionId = null;
delete prd.id;
prd.meta = {...(prd.meta||{}),candidate_only:true,baseline:'v0.3.6-stage-5',v037_delta:'feature-grouped acceptance criteria'};
write('prd-genie-s2-production-prd-v0.2.2-feature-acceptance-candidate.json', prd);

// Stage 6: preserve all existing story criteria and add explicit FAC linkage.
const story = read('prd-genie-s2-story-breakdown-v0.2.5-corrected-langfuse-candidate.json');
const hierarchy = node(story, 'Generate Dynamic Delivery Hierarchy');
let storyCode = hierarchy.parameters.jsCode;
storyCode = replaceOnce(
  storyCode,
  "const makeStory=(f,title)=>{",
  "const facByScope=new Map((p.prd_document?.feature_acceptance_criteria||[]).flatMap(feature=>(feature.criteria||[]).map(criterion=>[criterion.story_scope,{...criterion,parent_feature_id:feature.feature_id}])));const makeStory=(f,title,parentFeatureId)=>{",
  'create FAC lookup',
);
storyCode = replaceOnce(
  storyCode,
  "criterion_id:'SBAC-'+String(criterionN).padStart(3,'0'),text:sourceItems.map(acceptanceText).join(' '),item_ids:ids(sourceItems),citation_ids:citations(sourceItems),status:'grounded'",
  "criterion_id:'SBAC-'+String(criterionN).padStart(3,'0'),text:facByScope.get(title)?.criterion||sourceItems.map(acceptanceText).join(' '),item_ids:ids(sourceItems),citation_ids:citations(sourceItems),display_source_ids:facByScope.get(title)?.prd_requirement_ids||[],parent_feature_id:parentFeatureId,feature_acceptance_criteria_ids:[facByScope.get(title)?.id].filter(Boolean),status:'grounded'",
  'link story criteria to FAC',
);
storyCode = replaceOnce(storyCode, 'makeStory(f,title)', 'makeStory(f,title,feature.feature_id)', 'pass parent feature ID');
storyCode = replaceOnce(storyCode, "s.item_ids[0]+' |'", "s.acceptance_criteria[0].display_source_ids.join(', ')+' |'", 'use canonical PRD IDs in summary');
storyCode = replaceOnce(
  storyCode,
  "prd_hash:p.prd_hash,prd_markdown:p.prd_markdown||p.markdown",
  "prd_hash:p.prd_hash,prd_document:p.prd_document,feature_acceptance_criteria:p.prd_document?.feature_acceptance_criteria||[],prd_markdown:p.prd_markdown||p.markdown",
  'preserve PRD acceptance contract',
);
storyCode = replaceOnce(
  storyCode,
  "json_markdown_synchronized:true,prd_markdown_preserved",
  "feature_acceptance_linkage:true,json_markdown_synchronized:true,prd_markdown_preserved",
  'publish linkage validation',
);
storyCode = replaceOnce(
  storyCode,
  "'| # | ID | Criterion | Sources |','|---:|---|---|---|',...story.acceptance_criteria.map((ac,i)=>'| '+(i+1)+' | '+ac.criterion_id+' | '+ac.text+' | '+ac.item_ids.join(', ')+' |')",
  "'| # | ID | Criterion | Feature criteria | PRD requirement |','|---:|---|---|---|---|',...story.acceptance_criteria.map((ac,i)=>'| '+(i+1)+' | '+ac.criterion_id+' | '+ac.text+' | '+ac.feature_acceptance_criteria_ids.join(', ')+' | '+ac.display_source_ids.join(', ')+' |')",
  'expose FAC linkage in Story Markdown',
);
hierarchy.parameters.jsCode = storyCode;

const validateStory = node(story, 'Validate PRD to Story Coverage');
validateStory.parameters.jsCode = replaceOnce(
  validateStory.parameters.jsCode,
  "if(!x.markdown||!x.story_markdown||x.markdown!==x.story_markdown||!x.validation.json_markdown_synchronized)e.push('Story Markdown synchronization');",
  "const fac=(x.feature_acceptance_criteria||[]).flatMap(feature=>feature.criteria||[]),facById=new Map(fac.map(criterion=>[criterion.id,criterion]));for(const epic of x.epics)for(const feature of epic.features)for(const story of feature.stories)for(const ac of story.acceptance_criteria){if(ac.parent_feature_id!==feature.feature_id)e.push('story parent feature '+story.story_id);if(!(ac.feature_acceptance_criteria_ids||[]).length)e.push('missing feature acceptance link '+story.story_id);for(const id of ac.feature_acceptance_criteria_ids||[])if(!facById.has(id)||facById.get(id).feature_id!==feature.feature_id)e.push('invalid feature acceptance link '+story.story_id);if(!(ac.display_source_ids||[]).length)e.push('missing canonical PRD source '+story.story_id);if(!(ac.feature_acceptance_criteria_ids||[]).every(id=>x.story_markdown.includes(id)))e.push('feature acceptance link absent from Markdown '+story.story_id);}if(fac.some(criterion=>!x.epics.flatMap(epic=>epic.features).flatMap(feature=>feature.stories).flatMap(story=>story.acceptance_criteria).some(ac=>(ac.feature_acceptance_criteria_ids||[]).includes(criterion.id))))e.push('unused feature acceptance criterion');if(!x.markdown||!x.story_markdown||x.markdown!==x.story_markdown||!x.validation.json_markdown_synchronized)e.push('Story Markdown synchronization');",
  'validate PRD-to-story acceptance linkage',
);
story.name = 'S2_ Dynamic Story Breakdown v0.2.6 - Feature Acceptance Linkage Candidate';
story.active = false;
story.versionId = null;
delete story.id;
story.meta = {...(story.meta||{}),candidate_only:true,baseline:'v0.3.6-stage-6',v037_delta:'preserve story criteria and link to Stage 5 FAC identifiers'};
write('prd-genie-s2-story-breakdown-v0.2.6-feature-acceptance-linkage-candidate.json', story);

// Stage 7: retain the full-Markdown export and fail closed on the new linkage.
const validator = read('prd-genie-s2-final-validator-export-v0.3-full-markdown-candidate.json');
const traceability = node(validator, 'Validate Bidirectional Traceability');
traceability.parameters.jsCode = replaceOnce(
  traceability.parameters.jsCode,
  "if(e.length)throw new Error('S2 bidirectional validation failed: '+e.join('; '));",
  "const features=x.epics.flatMap(epic=>epic.features),fac=(x.feature_acceptance_criteria||[]).flatMap(feature=>feature.criteria||[]),facById=new Map(fac.map(criterion=>[criterion.id,criterion])),linked=new Set();if((x.feature_acceptance_criteria||[]).length!==features.length)e.push('feature acceptance coverage');for(const feature of features){const featureCriteria=fac.filter(criterion=>criterion.feature_id===feature.feature_id);if(!featureCriteria.length)e.push('missing feature acceptance '+feature.feature_id);for(const story of feature.stories){if(!(story.acceptance_criteria||[]).length)e.push('missing story acceptance '+story.story_id);for(const criterion of story.acceptance_criteria||[]){if(criterion.parent_feature_id!==feature.feature_id)e.push('story feature mismatch '+story.story_id);for(const id of criterion.feature_acceptance_criteria_ids||[]){linked.add(id);if(!facById.has(id)||facById.get(id).feature_id!==feature.feature_id)e.push('invalid criterion link '+story.story_id);}}}}if(fac.some(criterion=>!linked.has(criterion.id)))e.push('unused feature acceptance criterion');if(e.length)throw new Error('S2 bidirectional validation failed: '+e.join('; '));",
  'add fail-closed acceptance alignment',
);
const exportNode = node(validator, 'Build Dynamic Final Export');
exportNode.parameters.jsCode = replaceOnce(
  exportNode.parameters.jsCode,
  "required_prd_sections:10,groundedness_percent:100",
  "required_prd_sections:10,feature_acceptance_criteria:fac.length,feature_acceptance_coverage:true,story_acceptance_linkage:true,groundedness_percent:100",
  'report acceptance validation',
).replace(
  "const x=$input.first().json,stories=x.epics.flatMap(e=>e.features).flatMap(f=>f.stories),criteria=stories.flatMap(s=>s.acceptance_criteria),",
  "const x=$input.first().json,stories=x.epics.flatMap(e=>e.features).flatMap(f=>f.stories),criteria=stories.flatMap(s=>s.acceptance_criteria),fac=(x.feature_acceptance_criteria||[]).flatMap(feature=>feature.criteria||[]),",
);
validator.name = 'S2_ Dynamic Final Validator and Export v0.4 - Acceptance Alignment Candidate';
validator.active = false;
validator.versionId = null;
delete validator.id;
validator.meta = {...(validator.meta||{}),candidate_only:true,baseline:'v0.3.6-stage-7',v037_delta:'fail-closed feature and story acceptance alignment'};
write('prd-genie-s2-final-validator-export-v0.4-acceptance-alignment-candidate.json', validator);

// Isolated parent: preserve the complete accepted v0.3.6 orchestration and sizing
// path, changing only the Stage 5-7 workflow references.
const parent = read('prd-genie-s2-main-orchestrator-v0.3.6-sizing-candidate.json');
const replacements = {
  'Execute Production PRD v0.1': {id:'FszzWnuH2GEljqsC',name:prd.name},
  'Execute Story Breakdown v0.2': {id:'F146WpcfZZVomhq0',name:story.name},
  'Execute Final Validator v0.1': {id:'GotMdQ0eX6zbYwki',name:validator.name},
};
for (const [nodeName, replacement] of Object.entries(replacements)) {
  const reference = node(parent, nodeName).parameters.workflowId;
  reference.value = replacement.id;
  reference.cachedResultUrl = `/workflow/${replacement.id}`;
  reference.cachedResultName = replacement.name;
}
parent.name = 'S2_ Dynamic Realistic Six-Source Main Orchestrator v0.3.7 - Acceptance Alignment Candidate';
parent.active = false;
parent.versionId = null;
delete parent.id;
parent.meta = {...(parent.meta||{}),candidate_only:true,baseline:'v0.3.6-parent',v037_delta:'Stage 5-7 acceptance alignment references only',sizing_included:true,sizing_policy:'unchanged advisory non-blocking'};
write('prd-genie-s2-main-orchestrator-v0.3.7-acceptance-alignment-candidate.json', parent);

console.log('Built v0.3.7 Stage 5, Stage 6, Stage 7, and isolated parent candidates.');
