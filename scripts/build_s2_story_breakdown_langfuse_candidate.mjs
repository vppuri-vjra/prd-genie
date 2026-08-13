import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const provenArg=process.argv[2];
if(!provenArg)throw new Error('Usage: node scripts/build_s2_story_breakdown_langfuse_candidate.mjs <exported-proven-story-shadow.json>');
const proven=JSON.parse(fs.readFileSync(path.resolve(provenArg),'utf8'));
const approved=JSON.parse(fs.readFileSync(path.join(root,'workflows/n8n/prd-genie-s2-story-breakdown-v0.2-contract-candidate.json'),'utf8'));
const approvedByName=new Map(approved.nodes.map(n=>[n.name,n]));
for(const name of ['When Executed by Connected Parent','Generate Dynamic Delivery Hierarchy','Validate PRD to Story Coverage','Validate Delivery Citation Grounding','Return Story Breakdown']){
 const index=proven.nodes.findIndex(n=>n.name===name);if(index<0)throw new Error('Missing proven node: '+name);const replacement=structuredClone(approvedByName.get(name));replacement.position=proven.nodes[index].position;proven.nodes[index]=replacement;
}
const trace=proven.nodes.find(n=>n.name==='Build Story Breakdown Trace');
if(!trace?.parameters?.jsCode?.includes('otlp_payload'))throw new Error('Proven trace builder lacks OTLP payload');
trace.parameters.jsCode=trace.parameters.jsCode.replace(/const evaluation_context=\{[\s\S]*?\};const story_item_ids=new Set\([\s\S]*?\);const story_prd_elements=x\.prd_elements\.filter\(e=>story_item_ids\.has\(e\.item_id\)\);/g,'');
trace.parameters.jsCode=trace.parameters.jsCode.replace(/evaluation_context,evaluation_context,/g,'evaluation_context,');
trace.parameters.jsCode=trace.parameters.jsCode.replace(
 'const semanticInput={',
 "const evaluation_context={claim_scope:'Evaluate source-derived Epic, Feature, User Story, Story Breakdown Acceptance Criterion, governance, and open-question statements for faithfulness. Treat stable IDs, hierarchy numbering, controlled unresolved placeholders, grammatical capability normalization, validation fields, and orchestration metadata as authorized system scaffolding rather than business claims.',authorized_system_scaffolding:['EPIC, FEAT, US, SBAC, GOV, and OQ identifiers','1, 1.1, and 1.1.1 display numbering','product user with persona_status pending stakeholder confirmation when no approved relationship exists','[benefit pending stakeholder confirmation] with benefit_status and an open question','grammatical normalization of an approved requirement in the user-story capability field; source title and SBAC remain verbatim','validation, decision, next_route, run_id'],code_evaluator_contract:'prd_elements contains only elements mapped to stories; other approved PRD elements remain represented in governance_mappings.'};const story_prd_elements=x.prd_elements.filter(e=>['functional_requirement','non_functional_requirement'].includes(e.type));const semanticInput={evaluation_context,"
);
trace.parameters.jsCode=trace.parameters.jsCode.replace(
 'prd_elements:x.prd_elements,',
 'prd_elements:story_prd_elements,'
);
trace.parameters.jsCode=trace.parameters.jsCode.replace(/evaluation_context,evaluation_context,/g,'evaluation_context,');
trace.parameters.jsCode=trace.parameters.jsCode.replace(
 "const story_prd_elements=x.prd_elements.filter(e=>['functional_requirement','non_functional_requirement'].includes(e.type));",
 "const story_item_ids=new Set(x.epics.flatMap(e=>e.features).flatMap(f=>f.stories).flatMap(s=>s.item_ids));const story_prd_elements=x.prd_elements.filter(e=>story_item_ids.has(e.item_id));"
);
trace.parameters.jsCode=trace.parameters.jsCode.replace(
 'const semanticOutput={epics:x.epics,validation:x.validation,decision:x.decision,next_route:x.next_route,run_id:x.run_id};',
 "const semanticOutput={epics:x.epics,governance_mappings:x.governance_mappings,unresolved_questions:x.unresolved_questions,markdown:x.markdown,validation:x.validation,decision:x.decision||'continue',next_route:x.next_route||'final_validation',run_id:x.run_id};"
);
proven.name='S2_ Dynamic Story Breakdown v0.2.1 - Numbered Contract Langfuse Candidate';
proven.active=false;proven.versionId=null;proven.pinData=approved.pinData;proven.meta={...(proven.meta||{}),...(approved.meta||{}),langfuse_shadow:true,candidate_only:true,baseline_parent:'v0.3.3-unchanged'};
const output=path.join(root,'workflows/n8n/prd-genie-s2-story-breakdown-v0.2.1-contract-langfuse-candidate.json');fs.writeFileSync(output,JSON.stringify(proven,null,2)+'\n');console.log(path.relative(root,output));
