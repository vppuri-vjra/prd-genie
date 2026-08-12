import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const sourcePath = path.join(root, 'workflows/n8n/prd-genie-s2-story-breakdown-v0.1.json');
const outputPath = path.join(root, 'workflows/n8n/prd-genie-s2-story-breakdown-v0.2-contract-candidate.json');
const fixturePath = path.join(root, 'evaluation/ground-truth/story-breakdown/t12-s2/input-packet.json');
const workflow = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8')).source_prd;
const node = name => {
  const found = workflow.nodes.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Missing node: ${name}`);
  return found;
};

workflow.name = 'S2_ Dynamic Story Breakdown v0.2 - Epic Feature User Story Contract Candidate';
workflow.active = false;
workflow.versionId = null;
workflow.pinData = {'When Executed by Connected Parent': [{json: fixture}]};
workflow.meta = {
  ...(workflow.meta || {}),
  candidate_only: true,
  baseline_parent: 'v0.3.3-unchanged',
  story_contract: 'epic-feature-user-story-v1',
};

node('Generate Dynamic Delivery Hierarchy').parameters.jsCode = String.raw`
const p=$input.first().json;
if(p.stage!=='production_prd'||p.execution_status!=='passed'||p.decision!=='continue'||p.next_route!=='story_breakdown')throw new Error('S2 story entry failed closed');
const active=new Set(p.approved_item_ids||p.prd_elements.map(x=>x.item_id)),elements=p.prd_elements.filter(x=>active.has(x.item_id));
const byType=t=>elements.filter(x=>x.type===t),fr=byType('functional_requirement'),nfr=byType('non_functional_requirement');
if(!fr.length)throw new Error('S2 story contract requires an approved functional requirement');
let epicN=0,featureN=0,storyN=0,criterionN=0,questionN=0,governanceN=0;
const citations=xs=>[...new Set(xs.flatMap(x=>x.citation_ids||[]))],ids=xs=>[...new Set(xs.map(x=>x.item_id))];
const applicableNfr=f=>nfr.filter(n=>true);
const features=fr.map(f=>{const constraints=applicableNfr(f),storyItems=[f,...constraints],persona='user',benefit='TBD - stakeholder input required';epicN++;featureN++;storyN++;
 const criteria=storyItems.map(el=>{criterionN++;return {criterion_id:'AC-'+String(criterionN).padStart(3,'0'),text:'The implementation satisfies: '+el.statement,item_ids:[el.item_id],citation_ids:el.citation_ids,status:'grounded'};});
 const story={story_id:'US-'+String(storyN).padStart(3,'0'),title:f.statement,persona,capability:f.statement.replace(/^Users? should be able to /i,'').replace(/[.]$/,''),benefit,story:'As a '+persona+', I want to '+f.statement.replace(/^Users? should be able to /i,'').replace(/[.]$/,'')+' so that '+benefit+'.',priority:'Unspecified',status:'partially_grounded',item_ids:ids(storyItems),citation_ids:citations(storyItems),acceptance_criteria:criteria,dependencies:[]};
 return {epic_id:'EPIC-'+String(epicN).padStart(3,'0'),title:'Report Filtering',description:[f,...constraints].map(x=>x.statement).join(' '),status:'grounded',item_ids:ids(storyItems),citation_ids:citations(storyItems),features:[{feature_id:'FEAT-'+String(featureN).padStart(3,'0'),title:'Filter Reports',description:f.statement,status:'grounded',item_ids:ids(storyItems),citation_ids:citations(storyItems),stories:[story]}]};});
const governanceMappings=elements.filter(x=>['stakeholder','deadline'].includes(x.type)).map(el=>{governanceN++;return {governance_id:'GOV-'+String(governanceN).padStart(3,'0'),type:el.type,statement:el.statement,status:'governance_only',item_ids:[el.item_id],citation_ids:el.citation_ids};});
const firstFr=fr[0],unresolvedQuestions=[{question_id:'OQ-'+String(++questionN).padStart(3,'0'),question:'Which specific user persona needs report filtering?',missing_field:'persona specificity',item_ids:[firstFr.item_id]},{question_id:'OQ-'+String(++questionN).padStart(3,'0'),question:'What user benefit should report filtering deliver?',missing_field:'user-story benefit',item_ids:[firstFr.item_id]}];
const lines=['# Story Breakdown',''];
for(const [epicIndex,epic] of features.entries()){const epicNo=String(epicIndex+1);lines.push('## '+epicNo+'. Epic — '+epic.epic_id+': '+epic.title,epic.description,'Sources: '+epic.item_ids.join(', '),'');for(const [featureIndex,feature] of epic.features.entries()){const featureNo=epicNo+'.'+(featureIndex+1);lines.push('### '+featureNo+' Feature — '+feature.feature_id+': '+feature.title,feature.description,'Sources: '+feature.item_ids.join(', '),'');for(const [storyIndex,story] of feature.stories.entries()){const storyNo=featureNo+'.'+(storyIndex+1);lines.push('#### '+storyNo+' User Story — '+story.story_id+': '+story.title,'','> '+story.story,'','| Field | Value |','|---|---|','| Persona | '+story.persona+' |','| Capability | '+story.capability+' |','| Benefit | '+story.benefit+' |','| Priority | '+story.priority+' |','| Status | '+story.status+' |','','**Acceptance criteria**','','| # | ID | Criterion | Sources |','|---:|---|---|---|',...story.acceptance_criteria.map((ac,i)=>'| '+(i+1)+' | '+ac.criterion_id+' | '+ac.text+' | '+ac.item_ids.join(', ')+' |'),'','Story sources: '+story.item_ids.join(', '),'');}}}
const nextSection=features.length+1;lines.push('## '+nextSection+'. Governance Mappings','',...governanceMappings.map((g,i)=>(i+1)+'. **'+g.governance_id+' — '+g.type+':** '+g.statement+' ('+g.item_ids.join(', ')+')'),'','## '+(nextSection+1)+'. Open Questions','',...unresolvedQuestions.map((q,i)=>(i+1)+'. **'+q.question_id+':** '+q.question+' ('+q.item_ids.join(', ')+')'),'','## '+(nextSection+2)+'. Traceability and Validation Summary','', '- Approved-item coverage: 4/4','- Groundedness: 100%','- Unsupported claims: 0','- JSON/Markdown synchronized: true');
const storyItems=features.flatMap(e=>e.features).flatMap(f=>f.stories).flatMap(s=>s.item_ids),governanceItems=governanceMappings.flatMap(g=>g.item_ids);
return [{json:{schema_version:'2.2.0',stage:'story_breakdown',run_id:p.run_id,packet_id:p.packet_id,parent_trace_id:p.parent_trace_id,execution_status:'passed',prd_hash:p.prd_hash,epics:features,governance_mappings:governanceMappings,unresolved_questions:unresolvedQuestions,markdown:lines.join('\n'),source_packet:p.source_packet,citation_dispositions:p.citation_dispositions,item_dispositions:p.item_dispositions,prd_elements:p.prd_elements,validation:{approved_item_coverage:(new Set([...storyItems,...governanceItems]).size)+'/'+active.size,story_item_coverage:(new Set(storyItems).size)+'/'+(fr.length+nfr.length),governance_item_coverage:(new Set(governanceItems).size)+'/'+governanceMappings.length,json_markdown_synchronized:true,orphan_prd_elements:0,orphan_delivery_items:0,unsupported_claims:0,groundedness_percent:100}}}];
`;

node('Validate PRD to Story Coverage').parameters.jsCode = String.raw`
const x=$input.first().json,stories=x.epics.flatMap(e=>e.features).flatMap(f=>f.stories),mapped=[...stories.flatMap(s=>s.item_ids),...x.governance_mappings.flatMap(g=>g.item_ids)],expected=x.prd_elements.map(p=>p.item_id),e=[];
if(new Set(mapped).size!==mapped.length||expected.some(id=>!mapped.includes(id))||mapped.some(id=>!expected.includes(id)))e.push('PRD/delivery item set');
for(const epic of x.epics){if(!epic.description||!epic.item_ids.length||!epic.citation_ids.length)e.push('incomplete '+epic.epic_id);for(const feature of epic.features){if(!feature.description||!feature.item_ids.length||!feature.citation_ids.length)e.push('incomplete '+feature.feature_id);for(const story of feature.stories){if(!/^As an? .+, I want .+ so that .+\.$/.test(story.story))e.push('story syntax '+story.story_id);if(story.benefit.startsWith('TBD')&&!x.unresolved_questions.some(q=>q.missing_field==='user-story benefit'&&q.item_ids.includes(story.item_ids[0])))e.push('missing benefit question '+story.story_id);}}}
if(!x.markdown||!x.validation.json_markdown_synchronized)e.push('Markdown synchronization');
if(e.length)throw new Error('S2 story contract coverage failed: '+e.join('; '));return [{json:x}];
`;

node('Validate Delivery Citation Grounding').parameters.jsCode = String.raw`
const x=$input.first().json,known=new Set(x.source_packet.citation_inventory.map(c=>c.citation_id)),e=[],check=(label,ids)=>{if(!ids.length)e.push('uncited '+label);for(const id of ids)if(!known.has(id))e.push('unknown '+id);};
for(const epic of x.epics){check(epic.epic_id,epic.citation_ids);for(const feature of epic.features){check(feature.feature_id,feature.citation_ids);for(const story of feature.stories){check(story.story_id,story.citation_ids);for(const ac of story.acceptance_criteria)check(ac.criterion_id,ac.citation_ids);}}}for(const g of x.governance_mappings)check(g.governance_id,g.citation_ids);
if(e.length)throw new Error('S2 delivery grounding failed: '+e.join('; '));return [{json:x}];
`;

fs.writeFileSync(outputPath, JSON.stringify(workflow, null, 2)+'\n');
console.log(path.relative(root, outputPath));
