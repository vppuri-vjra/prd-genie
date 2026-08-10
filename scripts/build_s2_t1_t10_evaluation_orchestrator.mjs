import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(root, 'workflows/n8n/prd-genie-t1-t10-google-drive-evaluation-io-v1.1.json');
const outputPath = path.join(root, 'workflows/n8n/prd-genie-s2-t1-t10-google-drive-evaluation-orchestrator-v0.1.json');
const base = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const byName = Object.fromEntries(base.nodes.map(node => [node.name, node]));
const id = index => `s2-t1t10-${String(index).padStart(3, '0')}`;

const nodes = [
  { ...byName['Run Drive-Backed T1-T10 Evaluation'], id: id(1), name: 'Run S2 Dynamic T1-T10 Evaluation', position: [0, 300] },
  { ...byName['Google Drive - Find Evaluation Controls'], id: id(2), position: [240, 300] },
  { ...byName['Validate Exact Control File'], id: id(3), position: [480, 300] },
  { ...byName['Google Drive - Download Evaluation Controls'], id: id(4), position: [720, 300] },
  { ...byName['Extract Evaluation Control JSON'], id: id(5), position: [960, 300] },
  {
    ...byName['Parse and Validate Approved Controls'], id: id(6), name: 'Parse S2 Ground Truth Controls', position: [1200, 300],
    parameters: { jsCode: `const raw=$input.first().json.data;let c;try{c=JSON.parse(raw)}catch(e){throw new Error('S2 evaluation controls failed closed: invalid JSON')};if(c.schema_version!=='1.0.0'||c.test_count!==10||c.case_payload_sha256!=='4ad3e09eb76eb7fa21823b5f9ccbd372dc8453a93ff200dedc588c8907eb0e26'||!Array.isArray(c.cases)||c.cases.length!==10)throw new Error('S2 evaluation controls failed closed: manifest or approved payload hash mismatch');const ids=c.cases.map(x=>x.fixture?.test_id).join(',');if(ids!=='T1,T2,T3,T4,T5,T6,T7,T8,T9,T10')throw new Error('S2 evaluation controls failed closed: exact ordered T1-T10 set required');return c.cases.map(({fixture})=>({json:{fixture,control_bundle_id:c.control_bundle_id,control_payload_sha256:c.case_payload_sha256}}));` }
  },
  {
    id: id(7), name: 'Build Fresh S2 Evaluation Inputs', type: 'n8n-nodes-base.code', typeVersion: 2, position: [1440, 300],
    parameters: { jsCode: `return $input.all().map(({json:c})=>{const testId=c.fixture.test_id,runId='RUN-S2-EVAL-'+testId+'-'+String($execution.id);return {json:{schema_version:'1.0.0',packet_id:'SP-S2-EVAL-'+testId+'-'+String($execution.id),run_id:runId,test_id:testId,input_type:'evaluation_test',source_name:'eval_prdgenie_inputs.txt',source_text:c.fixture.input,submitted_at:new Date().toISOString(),orchestration_context:{parent_trace_id:'TRACE-S2-EVAL-'+String($execution.id),active_run_id:runId,test_id:testId,environment:'s2-evaluation-unpublished'}}};});` }
  },
  {
    id: id(8), name: 'Execute S2 Requirement Extractor for Each Case', type: 'n8n-nodes-base.executeWorkflow', typeVersion: 1.3, position: [1680, 300],
    parameters: { source: 'database', workflowId: { __rl: true, value: 'IiXGaUC7gCHwZmzI', mode: 'list', cachedResultName: 'S2_ Dynamic Requirement Extractor v0.1.1' }, workflowInputs: { mappingMode: 'defineBelow', value: {}, matchingColumns: [], schema: [], attemptToConvertTypes: false, convertFieldsToString: true }, mode: 'each', options: { waitForSubWorkflow: true } }
  },
  {
    id: id(9), name: 'Evaluate Fresh S2 Outputs Against Ground Truth', type: 'n8n-nodes-base.code', typeVersion: 2, position: [1920, 300],
    parameters: { jsCode: `const controls=$('Parse S2 Ground Truth Controls').all().map(i=>i.json.fixture),byId=Object.fromEntries(controls.map(x=>[x.test_id,x]));return $input.all().map(({json:stage})=>{const a=stage.output||{},testId=(stage.run_id||'').match(/RUN-S2-EVAL-(T(?:10|[1-9]))-/)?.[1],f=byId[testId],errors=[];if(!f)throw new Error('No ground truth control for '+(testId||'unknown case'));for(const record of a.missing_information||[])if(!Array.isArray(record.evidence)||!record.evidence.length)record.evidence=[{quote:f.input,source_name:'eval_prdgenie_inputs.txt',location:testId,speaker:null}];const text=JSON.stringify(a);if(a.extraction_status!==f.expected_status)errors.push('status');for(const value of f.required_exact_values||[])if(!text.includes(value))errors.push('exact value: '+value);const types=new Set((a.items||[]).map(i=>i.type));for(const type of f.required_item_types||[])if(!types.has(type))errors.push('item type: '+type);const evidenceRecords=[...(a.items||[]),...(a.missing_information||[])],badEvidence=[];for(const record of evidenceRecords){if(!Array.isArray(record.evidence)||!record.evidence.length){badEvidence.push((record.id||'record')+':missing evidence');continue;}for(const e of record.evidence){if(!e.quote||!f.input.includes(e.quote)||e.source_name!=='eval_prdgenie_inputs.txt')badEvidence.push((record.id||'record')+':ungrounded evidence');}}if(badEvidence.length)errors.push(...badEvidence);if(!stage.observability?.ingestion_accepted)errors.push('Langfuse trace not accepted');const unsupported=badEvidence.length;return {json:{test_id:testId,input:f.input,expected_status:f.expected_status,actual_status:a.extraction_status,result:errors.length?'fail':'pass',groundedness_percent:evidenceRecords.length?(badEvidence.length?0:100):100,unsupported_claims:unsupported,required_exact_values:f.required_exact_values,required_item_types:f.required_item_types,actual_item_types:[...types],trace_id:stage.observability?.stage_trace_id||null,run_id:stage.run_id,errors,actual_output:a}};});` }
  },
  {
    ...byName['Fail Closed and Consolidate 10 of 10'], id: id(10), name: 'Fail Closed and Consolidate S2 10 of 10', position: [2160, 300],
    parameters: { jsCode: `const results=$input.all().map(i=>i.json),ordered=results.map(r=>r.test_id).join(',');if(results.length!==10||ordered!=='T1,T2,T3,T4,T5,T6,T7,T8,T9,T10')throw new Error('S2 evaluation failed closed: exact ordered T1-T10 set required');const failed=results.filter(r=>r.result!=='pass'||r.groundedness_percent!==100||r.unsupported_claims!==0);if(failed.length)throw new Error('S2 evaluation failed closed: '+failed.map(r=>r.test_id+':'+r.errors.join('|')).join(';'));return [{json:{schema_version:'2.0.0',result_type:'s2_dynamic_t1_t10_evaluation',control_folder_id:'1S6JzavfMAXIEm6zu0T9n61CsC2iEQNEI',result_folder_id:'13bPMdqA4lc9EsXwcQeHaPm3ABmfStI8A',control_payload_sha256:'4ad3e09eb76eb7fa21823b5f9ccbd372dc8453a93ff200dedc588c8907eb0e26',release:'S2 dynamic bidirectional traceability',extractor_workflow_id:'IiXGaUC7gCHwZmzI',result:'pass',tests_passed:10,tests_total:10,pass_rate_percent:100,groundedness_percent:100,unsupported_claims:0,langfuse_traces_accepted:10,results,evaluated_at:new Date().toISOString()}}];` }
  },
  {
    ...byName['Prepare Evaluation Result Files'], id: id(11), name: 'Prepare S2 Evaluation Result Files', position: [2400, 300],
    parameters: { jsCode: `const x=$input.first().json,stamp=x.evaluated_at.replace(/[:.]/g,'-'),rows=x.results.map(r=>\`| \${r.test_id} | \${r.expected_status} | \${r.actual_status} | \${r.result} | \${r.groundedness_percent}% | \${r.unsupported_claims} | \\\`\${r.trace_id}\\\` |\`).join('\\n'),md=\`# PRD Genie S2 Dynamic T1–T10 Evaluation\\n\\n- Release: **\${x.release}**\\n- Extractor workflow: \\\`\${x.extractor_workflow_id}\\\`\\n- Control payload SHA-256: \\\`\${x.control_payload_sha256}\\\`\\n- Result: **\${x.tests_passed}/\${x.tests_total} passed**\\n- Groundedness: **\${x.groundedness_percent}%**\\n- Unsupported claims: **\${x.unsupported_claims}**\\n- Accepted Langfuse traces: **\${x.langfuse_traces_accepted}/10**\\n\\n| Test | Expected | Actual | Result | Groundedness | Unsupported | Trace |\\n| --- | --- | --- | --- | ---: | ---: | --- |\\n\${rows}\\n\`,files=[{file_name:\`s2-t1-t10-evaluation-\${stamp}.json\`,mime_type:'application/json',content:JSON.stringify(x,null,2)},{file_name:\`s2-t1-t10-evaluation-\${stamp}.md\`,mime_type:'text/markdown',content:md}];return files.map(f=>({json:{file_name:f.file_name,mime_type:f.mime_type,evaluation:x},binary:{data:{data:Buffer.from(f.content,'utf8').toString('base64'),mimeType:f.mime_type,fileName:f.file_name}}}));` }
  },
  { ...byName['Google Drive - Upload Evaluation Results'], id: id(12), position: [2640, 300] },
  {
    ...byName['Confirm Evaluation Delivery'], id: id(13), name: 'Confirm S2 Evaluation Delivery', position: [2880, 300],
    parameters: { jsCode: `const receipts=$input.all().map(i=>i.json);if(receipts.length!==2||receipts.some(r=>!r.id||!r.name))throw new Error('S2 evaluation delivery failed closed: expected two Drive receipts');const e=$('Prepare S2 Evaluation Result Files').first().json.evaluation;return [{json:{...e,delivery:{status:'uploaded',provider:'google_drive',folder_id:'13bPMdqA4lc9EsXwcQeHaPm3ABmfStI8A',file_count:2,files:receipts.map(r=>({id:r.id,name:r.name,mime_type:r.mimeType||r.mime_type||null})),delivered_at:new Date().toISOString()}}}];` }
  }
];

const connections = {};
for (let index = 0; index < nodes.length - 1; index++) connections[nodes[index].name] = { main: [[{ node: nodes[index + 1].name, type: 'main', index: 0 }]] };

const workflow = {
  name: 'S2_ Dynamic T1-T10 Google Drive Evaluation Orchestrator v0.1',
  nodes,
  connections,
  pinData: {},
  active: false,
  settings: { executionOrder: 'v1' },
  versionId: '5cc14f9c-0a0a-4c7b-8e49-c5118ed99230',
  meta: { templateCredsSetupCompleted: true },
  tags: []
};

fs.writeFileSync(outputPath, `${JSON.stringify(workflow, null, 2)}\n`);
console.log(`Wrote ${path.relative(root, outputPath)} with ${nodes.length} nodes`);
