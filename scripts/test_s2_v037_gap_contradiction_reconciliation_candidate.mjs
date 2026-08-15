import fs from 'node:fs';
import vm from 'node:vm';

const file = 'workflows/n8n/prd-genie-s2-gap-analyzer-child-v0.1.1-contradiction-reconciliation-candidate.json';
const workflow = JSON.parse(fs.readFileSync(file, 'utf8'));
const parse = workflow.nodes.find(node => node.name === 'Parse and Validate Gap Analysis');
const code = parse.parameters.jsCode;

const extraction = {
  schema_version:'1.0.0', run_id:'RUN-TEST', extraction_status:'complete', summary:'test',
  items:[
    {id:'CON-001',type:'constraint',statement:'Use option A',evidence:[{quote:'Use option A'}]},
    {id:'CON-002',type:'constraint',statement:'Use option B',evidence:[{quote:'Use option B'}]},
  ],
  contradictions:[{id:'CTR-001',description:'Options conflict',severity:'high',item_ids:['CON-001','CON-002']}],
  missing_information:[], extractor_notes:[],
};
const result = {
  schema_version:'1.0.0',run_id:'RUN-TEST',information_sufficiency:'insufficient',generation_allowed:false,
  recommended_action:'request_clarification',decision_reason:'The constraints conflict.',gaps:[],
  contradictions:[{id:'CTR-001',description:'Options conflict',severity:'high',related_item_ids:[]}],risks:[],
};
const context = {extraction,trace_context:{run_id:'RUN-TEST'}};
const sandbox = {$json:{text:JSON.stringify(result)},$:(name)=>({first:()=>({json:context})})};
const returned = new vm.Script(`(function(){${code}})()`).runInNewContext(sandbox);
const contradiction = returned[0].json.gap_analysis.contradictions[0];
if(JSON.stringify([...contradiction.related_item_ids])!==JSON.stringify(['CON-001','CON-002']))throw new Error('Authoritative contradiction item_ids were not restored');
if(returned[0].json.validation.contradiction_trace_reconciled!==1)throw new Error('Reconciliation audit count is incorrect');

const unsafeExtraction = structuredClone(extraction);
unsafeExtraction.contradictions[0].item_ids=['CON-999'];
const unsafeContext = {extraction:unsafeExtraction,trace_context:{run_id:'RUN-TEST'}};
const unsafeSandbox = {$json:{text:JSON.stringify(result)},$:(name)=>({first:()=>({json:unsafeContext})})};
let rejected=false;
try{new vm.Script(`(function(){${code}})()`).runInNewContext(unsafeSandbox);}catch(error){rejected=/unknown ID CON-999/.test(String(error.message));}
if(!rejected)throw new Error('Unknown authoritative item ID did not fail closed');

console.log('v0.3.7 gap contradiction-reconciliation checks passed.');
