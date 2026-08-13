import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=path.resolve(import.meta.dirname,'..');
const workflow=JSON.parse(fs.readFileSync(path.join(root,'workflows/n8n/prd-genie-s2-story-breakdown-v0.2-contract-candidate.json'),'utf8'));
const input=JSON.parse(fs.readFileSync(path.join(root,'evaluation/ground-truth/story-breakdown/t12-s2/input-packet.json'),'utf8')).source_prd;
const code=name=>workflow.nodes.find(n=>n.name===name).parameters.jsCode;
let current=input;
for(const name of ['Generate Dynamic Delivery Hierarchy','Validate PRD to Story Coverage','Validate Delivery Citation Grounding']){
 const result=await new vm.Script(`(async()=>{${code(name)}})()`).runInNewContext({$input:{first:()=>({json:current})},console});current=result[0].json;
}
const stories=current.epics.flatMap(e=>e.features).flatMap(f=>f.stories),criteria=stories.flatMap(s=>s.acceptance_criteria);
if(current.epics.length!==1||current.epics[0].features.length!==1||stories.length!==1||criteria.length!==1)throw new Error('T12-S2 hierarchy counts changed');
if(current.governance_mappings.length!==3||current.unresolved_questions.length!==2)throw new Error('T12-S2 governance/question counts changed');
if(stories[0].persona!=='product user'||stories[0].persona_status!=='pending stakeholder confirmation'||stories[0].benefit!=='[benefit pending stakeholder confirmation]'||stories[0].benefit_status!=='pending stakeholder confirmation'||stories[0].status!=='partially_grounded')throw new Error('Controlled story fields changed');
if(stories[0].story!=='As a product user, I want to preset and custom date-range filtering so that [benefit pending stakeholder confirmation].')throw new Error('User-story capability was not derived from current content');
if(stories[0].title!=='Preset and custom date-range filtering')throw new Error('Testable story title was not derived from the approved requirement');
if(current.epics[0].title===current.epics[0].features[0].title||current.epics[0].features[0].title===stories[0].title)throw new Error('Hierarchy is not progressively detailed');
if(current.epics[0].title!=='Analytics Insights and Discovery'||current.epics[0].features[0].title!=='Report Filtering')throw new Error('Content-driven filtering classification changed');
if(/search|access/i.test(current.epics[0].title+' '+current.epics[0].features[0].title))throw new Error('Unsupported hierarchy term introduced');
if(!criteria.every(c=>c.criterion_id.startsWith('SBAC-')))throw new Error('Story acceptance criteria must use the SBAC namespace');
if(!current.unresolved_questions.some(q=>q.missing_field==='persona mapping'&&q.item_ids.includes('FR-001')))throw new Error('Unlinked stakeholder was incorrectly treated as a story persona');
if(criteria.some(c=>c.text.startsWith('The implementation satisfies:')))throw new Error('Acceptance criteria remain generic requirement restatements');
if(criteria[0].text!==input.prd_elements.find(x=>x.type==='functional_requirement').statement)throw new Error('Acceptance criterion did not preserve the approved source statement');
if(current.governance_mappings.find(g=>g.type==='non_functional_requirement')?.statement!==input.prd_elements.find(x=>x.type==='non_functional_requirement').statement)throw new Error('Unrelated NFR was not preserved as a quality mapping');
if(current.validation.approved_item_coverage!=='4/4'||current.validation.unsupported_claims!==0||current.validation.groundedness_percent!==100)throw new Error('Validation metrics failed');
if(!current.markdown.includes('- Approved-item coverage: '+current.validation.approved_item_coverage))throw new Error('Markdown coverage is not synchronized with dynamic validation coverage');
if(!current.markdown.includes('| Epic # | Epic | Feature | User-story scope | Priority | Source |')||!current.markdown.includes('| 1 | Analytics Insights and Discovery |'))throw new Error('Dynamic Epic number is missing from the scope summary');
if(current.markdown.includes('| Field | Value |'))throw new Error('Verbose per-story field/value table remains in reviewer Markdown');
for(const label of ['- **Priority:**','- **Grounding status:**','- **Pending confirmation:**','- **Source:**'])if(!current.markdown.includes(label))throw new Error('Compact story metadata is missing: '+label);
if(current.prd_markdown!==input.markdown)throw new Error('Upstream PRD Markdown was not preserved exactly');
if(current.story_markdown!==current.markdown)throw new Error('Story Markdown alias is not synchronized');
if(!current.validation.prd_markdown_preserved)throw new Error('PRD Markdown preservation was not validated');
if(current.markdown.includes('Governance Mappings')||current.markdown.includes('Open Questions'))throw new Error('Internal governance sections leaked into reader-facing Markdown');
if(!current.markdown.includes('## Delivery Summary')||!current.markdown.includes('## Scope and Priority Summary')||!current.markdown.includes('## Detailed Delivery Hierarchy'))throw new Error('Professional reader-facing structure missing');
const secondFr={...input.prd_elements.find(x=>x.type==='functional_requirement'),item_id:'FR-002',prd_element_id:'PRD-FR-002',statement:'Users should be able to export filtered reports.',citation_ids:['CIT-T11-01']};
const multiInput={...input,approved_item_ids:[...input.approved_item_ids,'FR-002'],prd_elements:[...input.prd_elements,secondFr]};
let multi=multiInput;
for(const name of ['Generate Dynamic Delivery Hierarchy','Validate PRD to Story Coverage','Validate Delivery Citation Grounding']){
 const result=await new vm.Script(`(async()=>{${code(name)}})()`).runInNewContext({$input:{first:()=>({json:multi})},console});multi=result[0].json;
}
const multiStories=multi.epics.flatMap(e=>e.features).flatMap(f=>f.stories);
if(multiStories.length!==2)throw new Error('Multi-story hierarchy count changed');
if(multi.epics.some(e=>e.features.some(f=>f.stories.some(s=>e.title===f.title||f.title===s.title||e.title===s.title))))throw new Error('Multi-story hierarchy contains duplicate level labels');
if(multiStories[1].story!=='As a product user, I want to export filtered reports so that [benefit pending stakeholder confirmation].')throw new Error('Second user-story capability was not normalized grammatically');
if(multi.unresolved_questions.filter(q=>q.missing_field==='user-story benefit').length!==2)throw new Error('Each TBD benefit must have a clarification question');
if(!multiStories.every(s=>multi.unresolved_questions.some(q=>q.missing_field==='user-story benefit'&&q.item_ids.includes(s.item_ids[0]))))throw new Error('Story benefit clarification linkage failed');
const persona={prd_element_id:'PRD-PER-001',item_id:'PER-001',type:'persona',statement:'Reporting analyst',citation_ids:['CIT-T11-01'],related_item_ids:['FR-001']};
const personaInput={...input,approved_item_ids:[...input.approved_item_ids,'PER-001'],prd_elements:[...input.prd_elements,persona]};
let personaResult=personaInput;
for(const name of ['Generate Dynamic Delivery Hierarchy','Validate PRD to Story Coverage','Validate Delivery Citation Grounding']){
 const result=await new vm.Script(`(async()=>{${code(name)}})()`).runInNewContext({$input:{first:()=>({json:personaResult})},console});personaResult=result[0].json;
}
const personaStory=personaResult.epics.flatMap(e=>e.features).flatMap(f=>f.stories)[0];
if(personaStory.persona!=='Reporting analyst')throw new Error('Explicitly related approved persona was not used');
if(personaStory.persona_status!=='approved')throw new Error('Explicitly related approved persona status was not preserved');
if(personaResult.unresolved_questions.some(q=>q.missing_field==='persona mapping'&&q.item_ids.includes('FR-001')))throw new Error('Persona clarification remained after explicit relationship');
const risk={prd_element_id:'PRD-RISK-001',item_id:'RISK-001',type:'risk',statement:'Adoption may be delayed.',citation_ids:['CIT-T11-01']};
const contextInput={...input,approved_item_ids:[...input.approved_item_ids,'RISK-001'],prd_elements:[...input.prd_elements,risk]};
let context=contextInput;
for(const name of ['Generate Dynamic Delivery Hierarchy','Validate PRD to Story Coverage','Validate Delivery Citation Grounding']){
 const result=await new vm.Script(`(async()=>{${code(name)}})()`).runInNewContext({$input:{first:()=>({json:context})},console});context=result[0].json;
}
if(!context.governance_mappings.some(g=>g.item_ids.includes('RISK-001')))throw new Error('Non-story PRD context was not preserved in governance mappings');

const dynamicStatements=[
 ['FR-001','We are building an analytics dashboard that gives business users visibility into key metrics without needing SQL queries.'],
 ['FR-002','Dashboard should display 5 core metrics: revenue, active users, churn rate, NPS score, and support ticket volume.'],
 ['FR-003','Users should be able to filter by date range (last 7 days, 30 days, 90 days, custom), category, and status.'],
 ['FR-004','Must support role-based access: executives see all data, team leads see their team only.'],
 ['FR-005','Export to PDF for monthly board reports.'],
 ['FR-006','Generate XLSX with formula preservation and label the action Export to Excel.'],
 ['FR-007','Hybrid refresh: 15-minute automatic refresh plus manual refresh of the latest available precomputed warehouse data, a last-updated timestamp, and protection against excessive repeated requests; no direct live-database query.'],
 ['FR-008','The first production release must include responsive web access, with mobile responsiveness completed before production launch.'],
];
const dynamicInput=structuredClone(input);
dynamicInput.prd_elements=dynamicStatements.map(([item_id,statement])=>({prd_element_id:'PRD-'+item_id,item_id,type:'functional_requirement',statement,citation_ids:['CIT-T11-01']}));
dynamicInput.approved_item_ids=dynamicStatements.map(([id])=>id);
let dynamicResult=dynamicInput;
for(const name of ['Generate Dynamic Delivery Hierarchy','Validate PRD to Story Coverage','Validate Delivery Citation Grounding']){
 const result=await new vm.Script(`(async()=>{${code(name)}})()`).runInNewContext({$input:{first:()=>({json:dynamicResult})},console});dynamicResult=result[0].json;
}
const dynamicCounts={epics:dynamicResult.epics.length,features:dynamicResult.epics.flatMap(e=>e.features).length,stories:dynamicResult.epics.flatMap(e=>e.features).flatMap(f=>f.stories).length};
if(JSON.stringify(dynamicCounts)!==JSON.stringify({epics:3,features:7,stories:12}))throw new Error('Current-content dynamic counts changed: '+JSON.stringify(dynamicCounts));
if(!dynamicResult.markdown.includes('| Epics | 3 |')||!dynamicResult.markdown.includes('| Features | 7 |')||!dynamicResult.markdown.includes('| User Stories | 12 |'))throw new Error('Dynamic count summary is not synchronized');
const changedInput=structuredClone(dynamicInput);
changedInput.prd_elements.push({prd_element_id:'PRD-FR-009',item_id:'FR-009',type:'functional_requirement',statement:'Allow administrators to configure notification channels.',citation_ids:['CIT-T11-01']});
changedInput.approved_item_ids.push('FR-009');
let changedResult=changedInput;
for(const name of ['Generate Dynamic Delivery Hierarchy','Validate PRD to Story Coverage','Validate Delivery Citation Grounding']){
 const result=await new vm.Script(`(async()=>{${code(name)}})()`).runInNewContext({$input:{first:()=>({json:changedResult})},console});changedResult=result[0].json;
}
const changedCounts={epics:changedResult.epics.length,features:changedResult.epics.flatMap(e=>e.features).length,stories:changedResult.epics.flatMap(e=>e.features).flatMap(f=>f.stories).length};
if(JSON.stringify(changedCounts)===JSON.stringify(dynamicCounts)||changedCounts.epics!==4||changedCounts.features!==8||changedCounts.stories!==13)throw new Error('Changed content did not dynamically change hierarchy: '+JSON.stringify(changedCounts));
console.log(JSON.stringify({result:'PASS',fixture:'content-driven-dynamic-counts',current_content:dynamicCounts,changed_content:changedCounts},null,2));
console.log(JSON.stringify({result:'PASS',epics:1,features:1,stories:1,acceptance_criteria:2,governance_mappings:2,open_questions:2,approved_item_coverage:'4/4',groundedness_percent:100,unsupported_claims:0},null,2));
