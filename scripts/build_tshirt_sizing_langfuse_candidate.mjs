import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const sourcePath = path.join(root, 'workflows/n8n/prd-genie-complexity-sizing-candidate-v0.1.json');
const outputPath = path.join(root, 'workflows/n8n/prd-genie-complexity-sizing-langfuse-shadow-v0.1.json');
const workflow = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

workflow.name = 'PRD Genie - Complexity Sizing + Langfuse Shadow v0.1 - Isolated Unpublished';
workflow.nodes = workflow.nodes.filter(node => node.name !== 'Return Proposed Sizing');
delete workflow.connections['Deterministic Sizing Validator'];

const buildTrace = String.raw`
const x=$input.first().json,hex=n=>Array.from({length:n},()=>Math.floor(Math.random()*16).toString(16)).join('');
const traceId=hex(32),rootSpanId=hex(16),validationSpanId=hex(16),start=(BigInt(Date.now())*1000000n).toString(),end=(BigInt(Date.now()+1)*1000000n).toString();
const attr=(key,value)=>({key,value:{stringValue:typeof value==='string'?value:JSON.stringify(value)}});
const common=[attr('langfuse.trace.name','prd-genie-complexity-sizing-shadow'),attr('langfuse.environment','evaluation'),attr('langfuse.version','complexity-sizing-v0.1.0'),attr('langfuse.trace.tags',['capstone','complexity-sizing','shadow',x.evaluation_case_id]),attr('langfuse.trace.metadata.evaluation_case_id',x.evaluation_case_id),attr('langfuse.trace.metadata.source_run_id',x.source_run_id),attr('langfuse.trace.metadata.user_story_id',x.assessment.user_story_id)];
const root={traceId,spanId:rootSpanId,name:'complexity-sizing-agent',kind:1,startTimeUnixNano:start,endTimeUnixNano:end,attributes:[...common,attr('langfuse.observation.type','GENERATION'),attr('langfuse.observation.model.name','deterministic-rules-v0.1'),attr('langfuse.observation.input',{frozen_artifacts:x.frozen_artifacts,user_story_id:x.assessment.user_story_id,signal_evidence:x.assessment.signal_evidence}),attr('langfuse.observation.output',{recommended_size:x.assessment.recommended_size,total_complexity_score:x.assessment.total_complexity_score,signals:x.assessment.signals,confidence:x.assessment.confidence,recommendation:x.assessment.recommendation}),attr('langfuse.observation.metadata.mode','shadow')],status:{code:1}};
const validation={traceId,spanId:validationSpanId,parentSpanId:rootSpanId,name:'validate-complexity-sizing',kind:1,startTimeUnixNano:start,endTimeUnixNano:end,attributes:[attr('langfuse.observation.type','SPAN'),attr('langfuse.observation.input',x.assessment),attr('langfuse.observation.output',x.deterministic_validation),attr('langfuse.observation.metadata.deterministic_passed',x.deterministic_validation.passed)],status:{code:1}};
return [{json:{...x,trace_id:traceId,otlp_payload:{resourceSpans:[{resource:{attributes:[attr('service.name','prd-genie-n8n'),attr('deployment.environment.name','evaluation')]},scopeSpans:[{scope:{name:'prd-genie-complexity-sizing',version:'v0.1.0'},spans:[root,validation]}]}]}}}];
`;

workflow.nodes.push(
  {parameters:{jsCode:buildTrace},id:'build-trace',name:'Build Sizing Langfuse Trace',type:'n8n-nodes-base.code',typeVersion:2,position:[1120,0]},
  {parameters:{method:'POST',url:'https://us.cloud.langfuse.com/api/public/otel/v1/traces',authentication:'genericCredentialType',genericAuthType:'httpBasicAuth',sendHeaders:true,headerParameters:{parameters:[{name:'x-langfuse-ingestion-version',value:'4'}]},sendBody:true,contentType:'raw',rawContentType:'application/json',body:'={{ JSON.stringify($json.otlp_payload) }}',options:{response:{response:{fullResponse:true,neverError:false,responseFormat:'text'}}}},credentials:{httpBasicAuth:{id:'trc3KgAB4Nacxjj3',name:'Langfuse US - PRD Genie'}},id:'send-trace',name:'Send Sizing Trace to Langfuse',type:'n8n-nodes-base.httpRequest',typeVersion:4.2,position:[1400,0]},
  {parameters:{jsCode:"const x=$('Build Sizing Langfuse Trace').first().json,r=$input.first().json,statusCode=r.statusCode??200;if(statusCode<200||statusCode>=300)throw new Error('Sizing Langfuse ingestion failed with HTTP '+statusCode);return [{json:{...x,otlp_payload:undefined,langfuse:{trace_id:x.trace_id,ingestion_accepted:true,status_code:statusCode},decision:'continue_shadow',next_route:'langfuse_evaluator_settlement'}}];"},id:'confirm-trace',name:'Confirm Sizing Trace Ingestion',type:'n8n-nodes-base.code',typeVersion:2,position:[1680,0]},
);

workflow.connections['Deterministic Sizing Validator']={main:[[{node:'Build Sizing Langfuse Trace',type:'main',index:0}]]};
workflow.connections['Build Sizing Langfuse Trace']={main:[[{node:'Send Sizing Trace to Langfuse',type:'main',index:0}]]};
workflow.connections['Send Sizing Trace to Langfuse']={main:[[{node:'Confirm Sizing Trace Ingestion',type:'main',index:0}]]};
workflow.meta={...workflow.meta,langfuse_shadow:true,required_score_names:['sizing_lf_code_evaluation_pass','sizing_llm_faithfulness','sizing_llm_reasonableness','sizing_llm_hallucination'],production_parent_unchanged:true};
fs.writeFileSync(outputPath,JSON.stringify(workflow,null,2)+'\n');
console.log(path.relative(root,outputPath));
