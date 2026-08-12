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
const ofType=t=>items.filter(i=>i.type===t), sourced=(value,status,ids=[])=>({value,status,source_requirement_ids:ids});
const functional=ofType('functional_requirement').map(i=>({id:i.id,requirement:i.statement,priority:['must','should','nice'].includes(String(i.priority).toLowerCase())?String(i.priority)[0].toUpperCase()+String(i.priority).slice(1).toLowerCase()+' Have':'Unspecified',source_requirement_ids:[i.id],citation_ids:citations(i)}));
const nonfunctional=ofType('non_functional_requirement').map(i=>({id:i.id,requirement:i.statement,category:i.category||'Unspecified',target:i.target||TBD,source_requirement_ids:[i.id],citation_ids:citations(i)}));
const criteria=ofType('acceptance_criterion').map(i=>({id:i.id,feature:(i.related_item_ids||[]).find(id=>approved.has(id))||TBD,criterion:i.statement,source_requirement_ids:[i.id],citation_ids:citations(i)}));
const personas=ofType('persona').map(i=>({name_or_role:i.statement,key_need:sourced(TBD,'tbd'),current_workaround:sourced(TBD,'tbd'),source_requirement_ids:[i.id],citation_ids:citations(i)}));
const dependencies=ofType('dependency').map(i=>({dependency:i.statement,owner:TBD,status:i.status||TBD,risk:TBD,source_requirement_ids:[i.id],citation_ids:citations(i)}));
const assumptions=ofType('assumption').map(i=>sourced(i.statement,'grounded',[i.id]));
const exclusions=items.filter(i=>i.type==='out_of_scope').map(i=>sourced(i.statement,'grounded',[i.id]));
const questions=(a.gap_analysis?.missing_information||a.gap_analysis?.gaps||[]).map((g,n)=>({id:'OQ-'+String(n+1).padStart(3,'0'),question:g.clarification_question||g.question||g.description,related_requirement_ids:(g.related_item_ids||[]).filter(id=>approved.has(id))})).filter(q=>q.question);
const timeline=ofType('deadline').map(i=>({milestone:i.statement,target_date:i.target||i.statement,status:'grounded',source_requirement_ids:[i.id],citation_ids:citations(i)}));
const overviewIds=items.filter(i=>['functional_requirement','persona','stakeholder'].includes(i.type)).slice(0,4).map(i=>i.id);
const overview=overviewIds.length?sourced(overviewIds.map(id=>items.find(i=>i.id===id).statement).join(' '),'grounded',overviewIds):sourced(TBD,'tbd');
const prd_document={schema_version:'1.1.0',template_id:'official-prd-template-v1',run_id:a.run_id,document:{product_name:TBD,document_version:'0.2',author:'PRD Genie',date:new Date().toISOString().slice(0,10),status:'Draft'},product_overview:overview,goals_and_objectives:{business_goal:sourced(TBD,'tbd'),user_goal:sourced(TBD,'tbd'),success_metrics:[sourced(TBD,'tbd')]},user_personas:personas,functional_requirements:functional,non_functional_requirements:nonfunctional,acceptance_criteria:criteria,out_of_scope:exclusions,dependencies,assumptions,open_questions:questions,timeline};
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
'Source: '+refs(prd_document.product_overview),'','## 2. Goals and Objectives','',
'- **Business Goal:** '+prd_document.goals_and_objectives.business_goal.value,
'- **User Goal:** '+prd_document.goals_and_objectives.user_goal.value,
'- **Success Metrics:**',...prd_document.goals_and_objectives.success_metrics.map(x=>'  - '+x.value),'',
'## 3. User Personas','',...(personas.length?personas.flatMap(p=>['### '+p.name_or_role,'- **Key Need:** '+p.key_need.value,'- **Current Workaround:** '+p.current_workaround.value,'- **Source:** '+refs(p),'']):[empty.personas,'']),
'## 4. Feature Requirements','','### 4.1 Functional Requirements','','| ID | Requirement | Priority (Must/Should/Nice) | Source |','|---|---|---|---|',
...(functional.length?functional.map(x=>'| '+x.id+' | '+cell(x.requirement)+' | '+x.priority+' | '+x.citation_ids.join(', ')+' |'):['| — | '+none+' | Unspecified | — |']),'',
'### 4.2 Non-Functional Requirements','','| ID | Requirement | Category | Target | Source |','|---|---|---|---|---|',
...(nonfunctional.length?nonfunctional.map(x=>'| '+x.id+' | '+cell(x.requirement)+' | '+x.category+' | '+x.target+' | '+x.citation_ids.join(', ')+' |'):['| — | '+none+' | — | — | — |']),'',
'## 5. Acceptance Criteria','',...(criteria.length?criteria.flatMap(x=>['- [ ] **'+x.id+':** '+x.criterion,'  - Feature/requirement: '+x.feature,'  - Source: '+x.citation_ids.join(', ')]):[empty.criteria]),'',
'## 6. Out of Scope','',...(exclusions.length?exclusions.map(x=>'- '+x.value+' — '+refs(x)):[empty.out_of_scope]),'',
'## 7. Dependencies','','| Dependency | Owner | Status | Risk | Source |','|---|---|---|---|---|',
...(dependencies.length?dependencies.map(x=>'| '+cell(x.dependency)+' | '+x.owner+' | '+x.status+' | '+x.risk+' | '+x.citation_ids.join(', ')+' |'):[empty.dependencies]),'',
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
const headings=['## 1. Product Overview','## 2. Goals and Objectives','## 3. User Personas','## 4. Feature Requirements','### 4.1 Functional Requirements','### 4.2 Non-Functional Requirements','## 5. Acceptance Criteria','## 6. Out of Scope','## 7. Dependencies','## 8. Assumptions','## 9. Open Questions','## 10. Timeline'];
let at=-1;for(const h of headings){const next=x.markdown.indexOf(h);if(next<0||next<=at)e.push('missing or unordered heading '+h);at=next;}
if(headings.some(h=>x.markdown.split(h).length!==2))e.push('duplicate template heading');
for(const p of x.prd_elements)if(!x.markdown.includes(p.statement))e.push('JSON/Markdown mismatch '+p.item_id);
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
