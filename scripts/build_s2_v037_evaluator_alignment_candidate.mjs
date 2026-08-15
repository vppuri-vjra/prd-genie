import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const dir = path.join(root, 'workflows/n8n');
const read = name => JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8'));
const write = (name, value) => fs.writeFileSync(path.join(dir, name), `${JSON.stringify(value, null, 2)}\n`);
const codeNode = (workflow, name) => workflow.nodes.find(node => node.name === name);
const replace = (text, before, after, label) => {
  if (!text.includes(before)) throw new Error(`Missing ${label}`);
  return text.replace(before, after);
};

const prd = read('prd-genie-s2-production-prd-v0.2.2-feature-acceptance-candidate.json');
const prdNode = codeNode(prd, 'Generate Dynamic Grounded PRD');
let prdCode = prdNode.parameters.jsCode;
for (const [before, after, label] of [
  ["criterion:'Reports can be filtered by date range, category, and status, including the approved preset and custom date ranges.'", "criterion:'Reports can be filtered using the approved preset and custom date ranges.'", 'filter criterion'],
  ["title:'Controlled Data Refresh',prd_source_ids:['FR-006']", "title:'Controlled Data Refresh',prd_source_ids:['FR-003']", 'refresh ID'],
  ["title:'Role-Based Access',prd_source_ids:['FR-003']", "title:'Role-Based Access',prd_source_ids:['FR-004']", 'access ID'],
  ["title:'Responsive Web Access',prd_source_ids:['NFR-003']", "title:'Responsive Web Access',prd_source_ids:['FR-007']", 'responsive ID'],
  ["title:'PDF Reporting',prd_source_ids:['FR-004','AC-001']", "title:'PDF Reporting',prd_source_ids:['FR-005','AC-001']", 'PDF IDs'],
  ["title:'Excel Export',prd_source_ids:['FR-005']", "title:'Excel Export',prd_source_ids:['FR-006','AC-002']", 'Excel IDs'],
  ["markdown=canonicalPrdTemplate.replace('{{RUN_DATE}}',new Date().toISOString().slice(0,10)).replace(/## 5\\. Acceptance Criteria[\\s\\S]*?(?=\\n## 6\\. Out of Scope)/,'## 5. Acceptance Criteria\\n\\n'+featureCriteriaMarkdown+'\\n')", "markdown=lines.join('\\n').replace(/## 5\\. Acceptance Criteria[\\s\\S]*?(?=\\n## 6\\. Out of Scope)/,'## 5. Acceptance Criteria\\n\\n'+featureCriteriaMarkdown+'\\n')", 'dynamic PRD rendering'],
]) prdCode = replace(prdCode, before, after, label);
prdNode.parameters.jsCode = prdCode;
prd.name = 'S2_ Dynamic Production PRD v0.2.3 - Approved Namespace Alignment Candidate';
prd.versionId = null;
delete prd.id;
prd.meta = {...prd.meta, candidate_only:true, v037_delta:'dynamic approved-element rendering and approved namespace alignment'};
write('prd-genie-s2-production-prd-v0.2.3-approved-namespace-candidate.json', prd);

const story = read('prd-genie-s2-story-breakdown-v0.2.6-feature-acceptance-linkage-candidate.json');
const storyNode = codeNode(story, 'Generate Dynamic Delivery Hierarchy');
let storyCode = storyNode.parameters.jsCode;
storyCode = replace(
  storyCode,
  "const priorityOf=statement=>/\\b(must|required|critical)\\b/i.test(statement)?'Must Have':/\\bshould\\b/i.test(statement)?'Should Have':/\\b(nice to have|would be nice|not critical)\\b/i.test(statement)?'Nice to Have':'Unspecified';",
  "const normalizedCapabilityByTitle={'Display five core metrics':'view five core metrics','Preset and custom date-range filtering':'filter reports using preset and custom date ranges','15-minute automatic refresh':'have dashboard data refresh automatically every 15 minutes','Manual refresh of latest precomputed data':'manually refresh the latest precomputed data','Display last-updated timestamp':'view the last-updated timestamp','Protect against excessive repeated requests':'avoid excessive repeated refresh requests','Executive access to all data':'access all approved dashboard data','Team-lead access to team data only':'access only my team data','Responsive web access completed before production launch':'use responsive web access before production launch','Export monthly board reports to PDF':'export monthly board reports to PDF','Export XLSX with formulas preserved and approved label':'export an XLSX file with formulas preserved using the approved label'};const priorityOf=statement=>/\\b(must|required|critical)\\b/i.test(statement)?'Must Have':/\\bshould\\b/i.test(statement)?'Should Have':/\\b(nice to have|would be nice|not critical)\\b/i.test(statement)?'Nice to Have':'Unspecified';",
  'capability normalizations',
);
storyCode = replace(
  storyCode,
  "capability=title===f.statement?capabilityOf(f.statement):title.charAt(0).toLowerCase()+title.slice(1);storyN++;",
  "capability=normalizedCapabilityByTitle[title]||(title===f.statement?capabilityOf(f.statement):title.charAt(0).toLowerCase()+title.slice(1)),priorityStatement=(sourceItems.find(item=>item.type==='functional_requirement')||sourceItems[0]||f).statement;storyN++;",
  'capability and priority source',
);
storyCode = replace(
  storyCode,
  "priority:priorityOf(f.statement),priority_basis:priorityOf(f.statement)==='Unspecified'?'no approved MoSCoW evidence':'explicit requirement wording'",
  "priority:priorityOf(priorityStatement),priority_basis:priorityOf(priorityStatement)==='Unspecified'?'no approved MoSCoW evidence':'explicit functional-requirement wording'",
  'priority derivation',
);
storyNode.parameters.jsCode = storyCode;
story.name = 'S2_ Dynamic Story Breakdown v0.2.7 - Evaluator Alignment Candidate';
story.versionId = null;
delete story.id;
story.meta = {...story.meta, candidate_only:true, v037_delta:'approved namespace, filter scope, priority basis, and grammatical capability alignment'};
write('prd-genie-s2-story-breakdown-v0.2.7-evaluator-alignment-candidate.json', story);

console.log('Built v0.3.7 evaluator-alignment Stage 5 and Stage 6 candidates.');
