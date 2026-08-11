import fs from 'node:fs';

const source = new URL('../workflows/n8n/prd-genie-s2-t1-t10-google-drive-evaluation-orchestrator-v0.1.json', import.meta.url);
const output = new URL('../workflows/n8n/prd-genie-s2-evaluation-hardening-t1-t10-evaluator-v0.2.json', import.meta.url);
const workflow = JSON.parse(fs.readFileSync(source, 'utf8'));

workflow.name = 'S2_ Evaluation-Hardening T1-T10 Evaluator v0.2';
delete workflow.id;

const evaluate = workflow.nodes.find(node => node.name === 'Evaluate Fresh S2 Outputs Against Ground Truth');
evaluate.parameters.jsCode = `const controls=$('Parse S2 Ground Truth Controls').all().map(i=>i.json.fixture),byId=Object.fromEntries(controls.map(x=>[x.test_id,x]));return $input.all().map(({json:stage})=>{const a=stage.output||{},testId=(stage.run_id||'').match(/RUN-S2-EVAL-(T(?:10|[1-9]))-/)?.[1],f=byId[testId],errors=[];if(!f)throw new Error('No ground truth control for '+(testId||'unknown case'));for(const record of a.missing_information||[])if(!Array.isArray(record.evidence)||!record.evidence.length)record.evidence=[{quote:f.input,source_name:'eval_prdgenie_inputs.txt',location:testId,speaker:null}];const text=JSON.stringify(a),exactValueErrors=[];if(a.extraction_status!==f.expected_status)errors.push('status');for(const value of f.required_exact_values||[])if(!text.includes(value)){errors.push('exact value: '+value);exactValueErrors.push(value);}const types=new Set((a.items||[]).map(i=>i.type));for(const type of f.required_item_types||[])if(!types.has(type))errors.push('item type: '+type);const evidenceRecords=[...(a.items||[]),...(a.missing_information||[])],badEvidence=[];for(const record of evidenceRecords){if(!Array.isArray(record.evidence)||!record.evidence.length){badEvidence.push((record.id||'record')+':missing evidence');continue;}for(const e of record.evidence){if(!e.quote||!f.input.includes(e.quote)||e.source_name!=='eval_prdgenie_inputs.txt')badEvidence.push((record.id||'record')+':ungrounded evidence');}}if(badEvidence.length)errors.push(...badEvidence);if(!stage.observability?.ingestion_accepted)errors.push('Langfuse trace not accepted');const unsupported=badEvidence.length,schemaValid=stage.execution_status==='passed'&&typeof a==='object'&&Array.isArray(a.items)&&Array.isArray(a.missing_information);return {json:{test_id:testId,input:f.input,expected_status:f.expected_status,actual_status:a.extraction_status,result:errors.length?'fail':'pass',groundedness_percent:evidenceRecords.length?(badEvidence.length?0:100):100,unsupported_claims:unsupported,ground_truth_match:errors.length===0,exact_value_preservation:exactValueErrors.length===0,attribution_accuracy:badEvidence.length===0,schema_valid:schemaValid,hallucination_detected:unsupported>0||exactValueErrors.length>0,required_exact_values:f.required_exact_values,required_item_types:f.required_item_types,actual_item_types:[...types],trace_id:stage.observability?.stage_trace_id||null,run_id:stage.run_id,errors,actual_output:a}};});`;

const prepareScores = {
  id: 's2-hardening-001',
  name: 'Prepare Native Langfuse Trace Scores',
  type: 'n8n-nodes-base.code',
  typeVersion: 2,
  position: [2160, 300],
  parameters: {
    jsCode: `const rows=$input.all().map(i=>i.json),out=[];for(const r of rows){if(!r.trace_id)throw new Error('Cannot publish scores without trace ID for '+r.test_id);const defs=[['groundedness',r.groundedness_percent/100,'NUMERIC'],['unsupported_claims',r.unsupported_claims,'NUMERIC'],['ground_truth_match',r.ground_truth_match?1:0,'BOOLEAN'],['exact_value_preservation',r.exact_value_preservation?1:0,'BOOLEAN'],['attribution_accuracy',r.attribution_accuracy?1:0,'BOOLEAN'],['schema_valid',r.schema_valid?1:0,'BOOLEAN'],['hallucination_detected',r.hallucination_detected?1:0,'BOOLEAN'],['evaluation_pass',r.result==='pass'?1:0,'BOOLEAN']];for(const [name,value,dataType] of defs)out.push({json:{score:{id:r.trace_id+'-'+name,traceId:r.trace_id,name,value,dataType,comment:'PRD Genie deterministic S2 evaluation '+r.test_id},test_id:r.test_id,trace_id:r.trace_id,score_name:name}});}return out;`
  }
};

const publishScores = {
  id: 's2-hardening-002',
  name: 'Publish Native Scores to Langfuse',
  type: 'n8n-nodes-base.httpRequest',
  typeVersion: 4.2,
  position: [2400, 300],
  parameters: {
    method: 'POST',
    url: 'https://us.cloud.langfuse.com/api/public/scores',
    authentication: 'genericCredentialType',
    genericAuthType: 'httpBasicAuth',
    sendBody: true,
    contentType: 'raw',
    rawContentType: 'application/json',
    body: '={{ JSON.stringify($json.score) }}',
    options: { response: { response: { fullResponse: true, neverError: false, responseFormat: 'json' } } }
  }
};

const verifyScores = {
  id: 's2-hardening-003',
  name: 'Verify Native Langfuse Score Writes',
  type: 'n8n-nodes-base.code',
  typeVersion: 2,
  position: [2640, 300],
  parameters: {
    jsCode: `const writes=$input.all().map(i=>i.json);if(writes.length!==80)throw new Error('Langfuse score gate failed: expected 80 score receipts, got '+writes.length);const bad=writes.filter(x=>{const s=x.statusCode??x.status_code??200;return s<200||s>=300;});if(bad.length)throw new Error('Langfuse score gate failed: '+bad.length+' rejected score writes');const results=$('Evaluate Fresh S2 Outputs Against Ground Truth').all().map(i=>i.json);if(results.length!==10)throw new Error('Langfuse score gate failed: expected 10 evaluated cases');return results.map(r=>({json:r}));`
  }
};

workflow.nodes.push(prepareScores, publishScores, verifyScores);
for (const node of workflow.nodes) {
  if (node.name === 'Fail Closed and Consolidate S2 10 of 10') node.position = [2880, 300];
  if (node.name === 'Prepare S2 Evaluation Result Files') node.position = [3120, 300];
  if (node.name === 'Google Drive - Upload Evaluation Results') node.position = [3360, 300];
  if (node.name === 'Confirm S2 Evaluation Delivery') node.position = [3600, 300];
}

workflow.connections['Evaluate Fresh S2 Outputs Against Ground Truth'] = {main:[[{node:prepareScores.name,type:'main',index:0}]]};
workflow.connections[prepareScores.name] = {main:[[{node:publishScores.name,type:'main',index:0}]]};
workflow.connections[publishScores.name] = {main:[[{node:verifyScores.name,type:'main',index:0}]]};
workflow.connections[verifyScores.name] = {main:[[{node:'Fail Closed and Consolidate S2 10 of 10',type:'main',index:0}]]};

fs.writeFileSync(output, JSON.stringify(workflow, null, 2) + '\n');
console.log(output.pathname);
