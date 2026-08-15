import fs from 'node:fs';
import vm from 'node:vm';

const file = 'workflows/n8n/prd-genie-s2-requirement-extractor-child-v0.1.2-acceptance-reconciliation-candidate.json';
const workflow = JSON.parse(fs.readFileSync(file, 'utf8'));
const normalize = workflow.nodes.find(node => node.name === 'Normalize Candidate Provenance and Coverage');
const code = normalize.parameters.jsCode;

const quote = 'Ananya: Users need to export reports as PDF and CSV. For the PDF export, it must include the company logo at the top of every page. For CSV, it must preserve formulas.';
const source = {packet_id:'SP-S2-16e7090e7027e2d1',source_route:'production_multi_source',sources:[{source_id:'SRC-01',source_type:'meeting_transcript',source_name:'Feature Review',content_hash:'sha256:test',citations:[{citation_id:'CIT-01-0074-640ddf26',location:'line:74',speaker:'Ananya',quote}]}]};
const result = {schema_version:'1.0.0',run_id:'RUN-TEST',extraction_status:'complete',summary:'test',items:[{id:'FR-004',type:'functional_requirement',statement:'Export to PDF for monthly board reports',status:'stated',priority:'Unspecified',category:'export',target:null,evidence:[{source_id:'SRC-01',location:'line:74',quote}],confidence:1,related_item_ids:[]}],contradictions:[],missing_information:[],extractor_notes:[]};
const sandbox = {$json:{text:JSON.stringify(result)},$:(name)=>({first:()=>({json:source})})};
const returned = new vm.Script(`(function(){${code}})()`).runInNewContext(sandbox);
const reconciled = JSON.parse(returned[0].json.text);
const criterion = reconciled.items.find(item=>item.type==='acceptance_criterion');
if(!criterion)throw new Error('Acceptance criterion was not reconciled');
if(criterion.statement!=='For the PDF export, it must include the company logo at the top of every page.')throw new Error('Criterion wording changed');
if(!criterion.related_item_ids.includes('FR-004'))throw new Error('Criterion lacks FR linkage');
if(!reconciled.items[0].related_item_ids.includes(criterion.id))throw new Error('FR lacks criterion linkage');
if(reconciled.extractor_notes.length!==1||!reconciled.extractor_notes[0].includes('|ITEM|'))throw new Error('Coverage ledger was not rebuilt from reconciled evidence');
if(reconciled.acceptance_reconciliation?.status!=='passed')throw new Error('Reconciliation audit is absent');
console.log('v0.3.7 extractor acceptance-reconciliation checks passed.');
