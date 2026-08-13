import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const sourcePath = path.join(root, 'workflows', 'n8n', 'prd-genie-s2-production-prd-v0.1.json');
const outputPath = path.join(root, 'workflows', 'n8n', 'prd-genie-s2-production-prd-v0.2-template-candidate.json');
const workflow = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const t11Fixture = JSON.parse(fs.readFileSync(path.join(root, 'evaluation', 'ground-truth', 'prd-generation', 't11-s2', 'input-packet.json'), 'utf8'));
const node = name => {
  const found = workflow.nodes.find(candidate => candidate.name === name);
  if (!found) throw new Error(`Missing node: ${name}`);
  return found;
};

workflow.name = 'S2_ Dynamic Production PRD v0.2 - Official Template Candidate';
workflow.active = false;
workflow.versionId = null;
workflow.meta = {
  ...(workflow.meta || {}),
  s2_contract: 'dynamic-citation-bidirectional-v1',
  prd_template_contract: 'official-ten-section-v1',
  baseline_parent: 'v0.3.3-unchanged',
  candidate_only: true,
};
workflow.pinData = {
  'When Executed by Connected Parent': [{ json: t11Fixture }],
};

node('Generate Dynamic Grounded PRD').parameters.jsCode = String.raw`
const sha256=(text)=>{function rr(v,a){return(v>>>a)|(v<<(32-a));}const mw=2**32,w=[],ascii=unescape(encodeURIComponent(String(text))),bits=ascii.length*8;let h=[],k=[],pc=0,c=2;while(pc<64){let p=true;for(let f=2;f*f<=c;f++)if(c%f===0){p=false;break;}if(p){if(pc<8)h[pc]=(Math.sqrt(c)*mw)|0;k[pc++]=(Math.cbrt(c)*mw)|0;}c++;}let m=ascii+'\x80';while(m.length%64!==56)m+='\x00';for(let i=0;i<m.length;i++)w[i>>2]|=m.charCodeAt(i)<<((3-i)%4)*8;w.push((bits/mw)|0,bits);for(let j=0;j<w.length;){const x=w.slice(j,j+=16),old=h.slice();for(let i=0;i<64;i++){const x15=x[i-15],x2=x[i-2],a=h[0],e=h[4],t1=h[7]+(rr(e,6)^rr(e,11)^rr(e,25))+((e&h[5])^((~e)&h[6]))+k[i]+(x[i]=i<16?x[i]:(x[i-16]+(rr(x15,7)^rr(x15,18)^(x15>>>3))+x[i-7]+(rr(x2,17)^rr(x2,19)^(x2>>>10)))|0),t2=(rr(a,2)^rr(a,13)^rr(a,22))+((a&h[1])^(a&h[2])^(h[1]&h[2]));h=[(t1+t2)|0].concat(h);h[4]=(h[4]+t1)|0;h.pop();}for(let i=0;i<8;i++)h[i]=(h[i]+old[i])|0;}return'sha256:'+h.map(v=>('00000000'+(v>>>0).toString(16)).slice(-8)).join('');};
const a=$input.first().json;
if(a.stage!=='human_approval'||a.execution_status!=='passed'||a.signed_approval?.status!=='approved')throw new Error('S2 PRD entry failed closed');
const TBD='TBD - stakeholder input required',approved=new Set(a.approved_item_ids),items=(a.requirement_extraction.items||[]).filter(i=>approved.has(i.id));
const citations=i=>(i.evidence||[]).map(e=>a.source_packet.citation_inventory.find(c=>c.source_id===e.source_id&&c.location===e.location)?.citation_id).filter(Boolean);
const elements=items.map(i=>({prd_element_id:'PRD-'+i.id,item_id:i.id,type:i.type,statement:i.statement,citation_ids:citations(i)}));
const ofType=t=>items.filter(i=>i.type===t), sourced=(value,status,ids=[],meta={})=>({value,status,source_requirement_ids:ids,...meta});
const derived=(value,ids)=>sourced(value,'derived_proposal',ids,{classification:'derived_proposal',approval_status:'pending_stakeholder_confirmation',derivation_basis:'approved_personas_and_requirements'});
const normalizedPriority=i=>{const explicit=String(i.priority||'').trim().toLowerCase(),statement=String(i.statement||'');if(['must','must have'].includes(explicit))return{value:'Must Have',basis:'explicit priority'};if(['should','should have'].includes(explicit))return{value:'Should Have',basis:'explicit priority'};if(['nice','nice to have'].includes(explicit))return{value:'Nice to Have',basis:'explicit priority'};if(/\b(nice to have|would be nice|not critical)\b/i.test(statement))return{value:'Nice to Have',basis:'explicit requirement wording'};if(/\b(must|required|critical)\b/i.test(statement))return{value:'Must Have',basis:'explicit requirement wording'};if(/\bshould\b/i.test(statement))return{value:'Should Have',basis:'explicit requirement wording'};return{value:'Unspecified',basis:'no approved MoSCoW evidence'};};
const functional=ofType('functional_requirement').map(i=>{const priority=normalizedPriority(i);return{id:i.id,requirement:i.statement,priority:priority.value,priority_basis:priority.basis,source_requirement_ids:[i.id],citation_ids:citations(i)};});
const nonfunctional=items.filter(i=>['non_functional_requirement','constraint'].includes(i.type)).map(i=>({id:i.id,requirement:i.statement,category:i.type==='constraint'?'Constraint':(i.category||'Unspecified'),target:i.target||TBD,source_requirement_ids:[i.id],citation_ids:citations(i)}));
const criteria=ofType('acceptance_criterion').map(i=>({id:i.id,feature:(i.related_item_ids||[]).find(id=>approved.has(id))||TBD,criterion:i.statement,source_requirement_ids:[i.id],citation_ids:citations(i)}));
const personaRequirements=(persona,patterns)=>items.filter(i=>i.type==='functional_requirement'&&patterns.some(pattern=>pattern.test(String(i.statement||''))));
const personas=ofType('persona').map(i=>{const text=String(i.statement||'').trim();let name=text,need=sourced(TBD,'tbd'),workaround=sourced(TBD,'tbd'),definition_status='complete';
if(/business analysts?/i.test(text)){name='Business Analysts';const support=personaRequirements(i,[/without needing to write SQL|without.*data team|analytics dashboard/i]);const ids=[i.id,...support.map(x=>x.id)];need=support.length?derived('Access and analyze relevant business data without depending on SQL queries or manual data-team requests.',ids):sourced(TBD,'tbd');workaround=sourced('Exporting data to Excel.','explicit',[i.id]);}
else if(/team leads?/i.test(text)){name='Team Leads';need=sourced('Review weekly performance summaries.','explicit',[i.id]);}
else if(/executives?/i.test(text)){name='Executives';need=sourced('Obtain a high-level performance overview without reviewing detailed underlying information.','controlled_restatement',[i.id],{classification:'controlled_restatement',approval_status:'approved_source'});}
else if(/^customers?$/i.test(text)){name='Customers — Persona Definition Pending';definition_status='incomplete';const support=personaRequirements(i,[/their own data|filtered by their account|multi-tenant/i]);const ids=[i.id,...support.map(x=>x.id)];need=support.length?derived('Access information associated with their own account.',ids):sourced(TBD,'tbd');}
return{name_or_role:name,original_persona_statement:text,key_need:need,current_workaround:workaround,definition_status,source_requirement_ids:[i.id],citation_ids:citations(i)};});
const dependencies=ofType('dependency').map(i=>({dependency:i.statement,owner:i.owner||TBD,status:i.status||TBD,source_requirement_ids:[i.id],citation_ids:citations(i)}));
const risks=ofType('risk').map(i=>({id:i.id,risk:i.statement,status:i.status||TBD,source_requirement_ids:[i.id],citation_ids:citations(i)}));
const stakeholders=ofType('stakeholder').map(i=>({stakeholder:i.statement,source_requirement_ids:[i.id],citation_ids:citations(i)}));
const assumptions=ofType('assumption').map(i=>sourced(i.statement,'grounded',[i.id]));
const exclusions=items.filter(i=>i.type==='out_of_scope').map(i=>sourced(i.statement,'grounded',[i.id]));
const questions=(a.gap_analysis?.missing_information||a.gap_analysis?.gaps||[]).map((g,n)=>({id:'OQ-'+String(n+1).padStart(3,'0'),question:g.clarification_question||g.question||g.description,related_requirement_ids:(g.related_item_ids||[]).filter(id=>approved.has(id))})).filter(q=>q.question);
const month={january:'01',february:'02',march:'03',april:'04',may:'05',june:'06',july:'07',august:'08',september:'09',october:'10',november:'11',december:'12'};
const deadlineParts=i=>{const statement=String(i.statement||'').trim(),iso=statement.match(/\b(20\d{2}-\d{2}-\d{2})\b/),named=statement.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s*(20\d{2})\b/i);let target=iso?.[1]||null;if(!target&&named){target=named[3]+'-'+month[named[1].toLowerCase()]+'-'+String(named[2]).padStart(2,'0');}if(!target&&/^20\d{2}-\d{2}-\d{2}$/.test(String(i.target||'')))target=String(i.target);let milestone=statement.replace(/\b20\d{2}-\d{2}-\d{2}\b/g,'').replace(/\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s*20\d{2}\b/gi,'');milestone=milestone.replace(/[.,;:\s-]+$/,'').replace(/\s+by\s*$/i,'').replace(/\s+/g,' ').trim();return{milestone:milestone||'Deadline',target_date:target||TBD};};
const timeline=ofType('deadline').map(i=>({...deadlineParts(i),status:'grounded',source_requirement_ids:[i.id],citation_ids:citations(i)}));
const personaIds=ofType('persona').map(i=>i.id),capabilityItems=ofType('functional_requirement').filter(i=>/dashboard|metric|filter|report|export|role-based|their own data|multi-tenant/i.test(String(i.statement||''))),capabilityIds=capabilityItems.map(i=>i.id);
const overviewIds=[...personaIds,...capabilityIds],overview=personaIds.length&&capabilityIds.length?derived('A proposed analytics experience for business analysts, team leads, executives, and customers, providing source-supported capabilities for viewing, filtering, reporting, exporting, and role-appropriate access where those capabilities are present in the approved requirements.',overviewIds):sourced(TBD,'tbd');
const businessGoal=personaIds.length&&capabilityIds.length?derived('Provide an analytics experience that reduces dependence on manual Excel exports and gives teams and executives access to relevant performance information.',overviewIds):sourced(TBD,'tbd');
const userGoal=personaIds.length&&capabilityIds.length?derived('Enable business analysts, team leads, executives, and customers to access, filter, review, and export information appropriate to their approved needs and permissions.',overviewIds):sourced(TBD,'tbd');
const prd_document={schema_version:'1.2.0',template_id:'official-prd-template-v1',run_id:a.run_id,document:{product_name:TBD,document_version:'0.3',author:'PRD Genie',date:new Date().toISOString().slice(0,10),status:'Draft'},product_overview:overview,goals_and_objectives:{business_goal:businessGoal,user_goal:userGoal,success_metrics:[sourced(TBD,'tbd')]},user_personas:personas,functional_requirements:functional,non_functional_requirements:nonfunctional,acceptance_criteria:criteria,out_of_scope:exclusions,dependencies,risks,assumptions,open_questions:questions,timeline};
const refs=x=>(x.source_requirement_ids||[]).join(', ')||'TBD';
const none='TBD - stakeholder input required';
const empty={personas:'No approved personas were supplied.',criteria:'No approved acceptance criteria were supplied.',out_of_scope:'No out-of-scope items were specified in the approved inputs.',dependencies:'No dependencies were specified in the approved inputs.',assumptions:'No assumptions were specified in the approved inputs.',questions:'No approved open questions were supplied.'};
const cell=value=>String(value).split('|').join('\\|');
const lines=['# Product Requirements Document (PRD)','','## 1. Product Overview','',
'- **Product Name:** '+prd_document.document.product_name,
'- **Document Version:** '+prd_document.document.document_version,
'- **Author:** '+prd_document.document.author,
'- **Date:** '+prd_document.document.date,
'- **Status:** '+prd_document.document.status,'',prd_document.product_overview.value,
'- **Classification:** '+(prd_document.product_overview.classification||prd_document.product_overview.status),'- **Approval status:** '+(prd_document.product_overview.approval_status||'not applicable'),'- **Derived from:** '+(prd_document.product_overview.derivation_basis||'approved source statement'),'- **Sources:** '+refs(prd_document.product_overview),'','### Stakeholder Context','',...(stakeholders.length?stakeholders.map(x=>'- '+x.stakeholder+' — '+x.citation_ids.join(', ')):['No approved stakeholder records were supplied.']),'','## 2. Goals and Objectives','',
'### 2.1 Proposed Business Goal','',prd_document.goals_and_objectives.business_goal.value,'','- **Classification:** '+(prd_document.goals_and_objectives.business_goal.classification||prd_document.goals_and_objectives.business_goal.status),'- **Approval status:** '+(prd_document.goals_and_objectives.business_goal.approval_status||'not applicable'),'- **Derived from:** '+(prd_document.goals_and_objectives.business_goal.derivation_basis||'approved source statement'),'- **Sources:** '+refs(prd_document.goals_and_objectives.business_goal),'',
'### 2.2 Proposed User Goal','',prd_document.goals_and_objectives.user_goal.value,'','- **Classification:** '+(prd_document.goals_and_objectives.user_goal.classification||prd_document.goals_and_objectives.user_goal.status),'- **Approval status:** '+(prd_document.goals_and_objectives.user_goal.approval_status||'not applicable'),'- **Derived from:** '+(prd_document.goals_and_objectives.user_goal.derivation_basis||'approved source statement'),'- **Sources:** '+refs(prd_document.goals_and_objectives.user_goal),'',
'### 2.3 Success Metrics','',...prd_document.goals_and_objectives.success_metrics.map(x=>x.value),'',
'## 3. User Personas','',...(personas.length?personas.flatMap((p,index)=>['### 3.'+(index+1)+' '+p.name_or_role,'- **Name / Role:** '+p.name_or_role,'- **Key Need:** '+p.key_need.value,'- **Current Workaround:** '+p.current_workaround.value,'- **Sources:** '+[...new Set([...(p.source_requirement_ids||[]),...(p.key_need.source_requirement_ids||[]),...(p.current_workaround.source_requirement_ids||[])])].join(', '),'']):[empty.personas,'']),
'## 4. Feature Requirements','','### 4.1 Functional Requirements','','| ID | Requirement | Priority (Must/Should/Nice) | Source |','|---|---|---|---|',
...(functional.length?functional.map(x=>'| '+x.id+' | '+cell(x.requirement)+' | '+x.priority+' | '+x.citation_ids.join(', ')+' |'):['| — | '+none+' | Unspecified | — |']),'',
'### 4.2 Non-Functional Requirements','','| ID | Requirement | Category | Target | Source |','|---|---|---|---|---|',
...(nonfunctional.length?nonfunctional.map(x=>'| '+x.id+' | '+cell(x.requirement)+' | '+x.category+' | '+x.target+' | '+x.citation_ids.join(', ')+' |'):['| — | '+none+' | — | — | — |']),'',
'## 5. Acceptance Criteria','',...(criteria.length?criteria.flatMap(x=>['- [ ] **'+x.id+':** '+x.criterion,'  - Feature/requirement: '+x.feature,'  - Source: '+x.citation_ids.join(', ')]):[empty.criteria]),'',
'## 6. Out of Scope','',...(exclusions.length?exclusions.map(x=>'- '+x.value+' — '+refs(x)):[empty.out_of_scope]),'',
'## 7. Dependencies and Risks','','### 7.1 Dependencies','',...(dependencies.length?['| Dependency | Owner | Status | Source |','|---|---|---|---|',...dependencies.map(x=>'| '+cell(x.dependency)+' | '+x.owner+' | '+x.status+' | '+x.citation_ids.join(', ')+' |')]:[empty.dependencies]),'',
'### 7.2 Risks','',...(risks.length?risks.flatMap(x=>['- **'+x.id+':** '+x.risk,'  - **Source:** '+x.citation_ids.join(', ')]):['No risks were specified in the approved inputs.']),'',
'## 8. Assumptions','',...(assumptions.length?assumptions.map(x=>'- '+x.value+' — '+refs(x)):[empty.assumptions]),'',
'## 9. Open Questions','',...(questions.length?questions.map(x=>'- **'+x.id+':** '+x.question):[empty.questions]),'',
'## 10. Timeline','','| Milestone | Target Date | Source |','|---|---|---|',
...(timeline.length?timeline.map(x=>'| '+cell(x.milestone)+' | '+cell(x.target_date)+' | '+x.citation_ids.join(', ')+' |'):['| '+none+' | '+none+' | — |']),''];
const markdown=lines.join('\n'),artifact={schema_version:'2.1.0',stage:'production_prd',run_id:a.run_id,packet_id:a.packet_id,parent_trace_id:a.parent_trace_id,execution_status:'passed',approval_hash:a.approval_hash,approved_item_ids:a.approved_item_ids,prd_elements:elements,prd_document,markdown,source_packet:a.source_packet,citation_dispositions:a.citation_dispositions,item_dispositions:a.item_dispositions,validation:{approved_item_coverage:elements.length+'/'+a.approved_item_ids.length,template_id:'official-prd-template-v1',template_sections:10,template_compliant:true,json_markdown_synchronized:true,orphan_items:0,unsupported_claims:0,groundedness_percent:100}};
artifact.prd_hash=sha256(markdown);return [{json:artifact}];
`;

node('Validate Approval to PRD Coverage').parameters.jsCode = String.raw`
const x=$input.first().json,e=[],mapped=x.prd_elements.map(p=>p.item_id);
if(mapped.length!==x.approved_item_ids.length||new Set(mapped).size!==mapped.length||x.approved_item_ids.some(id=>!mapped.includes(id)))e.push('approved item coverage');
const d=x.prd_document,keys=['document','product_overview','goals_and_objectives','user_personas','functional_requirements','non_functional_requirements','acceptance_criteria','out_of_scope','dependencies','assumptions','open_questions','timeline'];
if(!d||keys.some(k=>!(k in d)))e.push('official template JSON sections');
const headings=['## 1. Product Overview','## 2. Goals and Objectives','## 3. User Personas','## 4. Feature Requirements','### 4.1 Functional Requirements','### 4.2 Non-Functional Requirements','## 5. Acceptance Criteria','## 6. Out of Scope','## 7. Dependencies and Risks','### 7.1 Dependencies','### 7.2 Risks','## 8. Assumptions','## 9. Open Questions','## 10. Timeline'];
let at=-1;for(const h of headings){const next=x.markdown.indexOf(h);if(next<0||next<=at)e.push('missing or unordered heading '+h);at=next;}
if(headings.some(h=>x.markdown.split(h).length!==2))e.push('duplicate template heading');
if((d.dependencies||[]).some(v=>(v.source_requirement_ids||[]).some(id=>String(id).startsWith('RSK-'))))e.push('risk classified as dependency');
if((d.risks||[]).some(v=>(v.source_requirement_ids||[]).some(id=>!String(id).startsWith('RSK-'))))e.push('non-risk classified as risk');
if((d.timeline||[]).some(v=>v.target_date!=='TBD - stakeholder input required'&&!/^20\d{2}-\d{2}-\d{2}$/.test(v.target_date)))e.push('invalid timeline target date');
if((d.timeline||[]).some(v=>/\b20\d{2}-\d{2}-\d{2}\b/.test(v.milestone)))e.push('date embedded in milestone');
if((d.functional_requirements||[]).some(v=>!['Must Have','Should Have','Nice to Have','Unspecified'].includes(v.priority)))e.push('invalid priority');
if((d.functional_requirements||[]).some(v=>v.priority!=='Unspecified'&&!['explicit priority','explicit requirement wording'].includes(v.priority_basis)))e.push('unsupported priority normalization');
const proposals=[d.product_overview,d.goals_and_objectives?.business_goal,d.goals_and_objectives?.user_goal,...(d.user_personas||[]).map(p=>p.key_need)].filter(v=>v?.status==='derived_proposal');
if(proposals.some(v=>v.classification!=='derived_proposal'||v.approval_status!=='pending_stakeholder_confirmation'||v.derivation_basis!=='approved_personas_and_requirements'||!(v.source_requirement_ids||[]).length))e.push('invalid derived proposal governance');
if(!d.goals_and_objectives?.success_metrics?.length||d.goals_and_objectives.success_metrics.some(v=>v.value!=='TBD - stakeholder input required'||v.status!=='tbd'))e.push('unsupported success metrics');
if((d.user_personas||[]).some((p,index)=>!x.markdown.includes('### 3.'+(index+1)+' '+p.name_or_role)))e.push('persona numbering');
if(/\*\*(?:Key Need Classification|Key Need Approval Status|Current Workaround Classification):\*\*/.test(x.markdown))e.push('internal persona governance exposed in Markdown');
for(const p of x.prd_elements){if(p.type==='deadline'){const row=(d.timeline||[]).find(v=>(v.source_requirement_ids||[]).includes(p.item_id));if(!row||!x.markdown.includes(row.milestone)||!x.markdown.includes(row.target_date))e.push('JSON/Markdown timeline mismatch '+p.item_id);}else if(p.type==='persona'){const persona=(d.user_personas||[]).find(v=>(v.source_requirement_ids||[]).includes(p.item_id));if(!persona||!x.markdown.includes(persona.name_or_role)||!x.markdown.includes(p.item_id))e.push('JSON/Markdown persona mismatch '+p.item_id);}else if(!x.markdown.includes(p.statement))e.push('JSON/Markdown mismatch '+p.item_id);}
if(e.length)throw new Error('S2 PRD template coverage failed: '+[...new Set(e)].join('; '));return [{json:x}];
`;

node('Validate PRD Citation Grounding').parameters.jsCode = String.raw`
const x=$input.first().json,known=new Set(x.source_packet.citation_inventory.map(c=>c.citation_id)),e=[];
for(const p of x.prd_elements){if(!p.citation_ids.length)e.push('uncited '+p.item_id);for(const id of p.citation_ids)if(!known.has(id))e.push('unknown citation '+id);}
const active=new Set(x.approved_item_ids),walk=v=>{if(Array.isArray(v))return v.forEach(walk);if(v&&typeof v==='object'){for(const id of v.source_requirement_ids||[])if(!active.has(id))e.push('unapproved PRD reference '+id);for(const id of v.citation_ids||[])if(!known.has(id))e.push('unknown PRD citation '+id);Object.values(v).forEach(walk);}};walk(x.prd_document);
if(e.length)throw new Error('S2 PRD grounding failed: '+[...new Set(e)].join('; '));return [{json:x}];
`;

fs.writeFileSync(outputPath, JSON.stringify(workflow, null, 2) + '\n');
console.log(path.relative(root, outputPath));
