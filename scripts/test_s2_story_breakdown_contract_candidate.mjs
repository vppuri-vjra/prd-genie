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
if(current.epics.length!==1||current.epics[0].features.length!==1||stories.length!==1||criteria.length!==2)throw new Error('T12-S2 hierarchy counts changed');
if(current.governance_mappings.length!==2||current.unresolved_questions.length!==2)throw new Error('T12-S2 governance/question counts changed');
if(stories[0].persona!=='user'||stories[0].benefit!=='TBD - stakeholder input required'||stories[0].status!=='partially_grounded')throw new Error('Controlled story fields changed');
if(current.validation.approved_item_coverage!=='4/4'||current.validation.unsupported_claims!==0||current.validation.groundedness_percent!==100)throw new Error('Validation metrics failed');
console.log(JSON.stringify({result:'PASS',epics:1,features:1,stories:1,acceptance_criteria:2,governance_mappings:2,open_questions:2,approved_item_coverage:'4/4',groundedness_percent:100,unsupported_claims:0},null,2));
