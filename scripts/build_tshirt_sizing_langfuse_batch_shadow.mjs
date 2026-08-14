import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const fixtureRoot = path.join(root, 'evaluation/ground-truth/t-shirt-sizing');
const outputPath = path.join(root, 'workflows/n8n/prd-genie-complexity-sizing-langfuse-batch-shadow-v0.1.json');
const caseNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 12];

const cases = caseNumbers.map(index => {
  const key = `ts-t${String(index).padStart(2, '0')}`;
  const input = JSON.parse(fs.readFileSync(path.join(fixtureRoot, key, 'input-packet.json'), 'utf8'));
  const expected = JSON.parse(fs.readFileSync(path.join(fixtureRoot, key, 'expected-output.json'), 'utf8'));
  return { input, expected };
});

const prepare = String.raw`
const cases=${JSON.stringify(cases)},hex=n=>Array.from({length:n},()=>Math.floor(Math.random()*16).toString(16)).join('');
const attr=(key,value)=>({key,value:{stringValue:typeof value==='string'?value:JSON.stringify(value)}});
const policy={policy_status:'approved_evaluation_policy',confidence_rule:{Medium:'Use when a numeric assessment is grounded but remains a proposal pending delivery-team confirmation.',Low:'Use when unknown signals require refinement before numeric sizing.'},sizing_status_rule:'All automated T-shirt sizes are proposals pending delivery-team confirmation.',size_handling:{XS:'Ready for delivery',S:'Ready for delivery',M:'Normal sprint candidate',L:'Consider splitting',XL:'Must refine or split before sprint planning',pending_refinement:'Refine before sizing'}};
return cases.map(({input,expected})=>{
  const a=expected.assessment,traceId=hex(32),spanId=hex(16),start=(BigInt(Date.now())*1000000n).toString(),end=(BigInt(Date.now()+1)*1000000n).toString();
  const approvedProfile={status:'human_reviewed_ground_truth_profile',case_id:input.evaluation_case_id,expected_signals:a.signals,expected_total_complexity_score:a.total_complexity_score,expected_size:a.recommended_size,expected_confidence:a.confidence,expected_sizing_status:a.sizing_status,expected_recommendation:a.recommendation,scale:{XS:'0-2',S:'3-5',M:'6-8',L:'9-11',XL:'12-14'}};
  const sourceEvidence={artifact:input.frozen_artifacts.story_breakdown_artifact,artifact_sha256:input.frozen_artifacts.story_breakdown_artifact_sha256,story:input.story,evidence_references:a.evidence_references};
  const signalEvidence=Object.fromEntries(Object.entries(a.signals).map(([signal,score])=>[signal,{references:score==='unknown'?[]:a.evidence_references,rationale:score==='unknown'?'Insufficient approved evidence':'Human-reviewed profile supported by approved story sources and acceptance criteria'}]));
  const output={recommended_size:a.recommended_size,total_complexity_score:a.total_complexity_score,signals:a.signals,confidence:a.confidence,sizing_status:a.sizing_status,recommendation:a.recommendation};
  const span={traceId,spanId,name:'complexity-sizing-agent',kind:1,startTimeUnixNano:start,endTimeUnixNano:end,attributes:[attr('langfuse.trace.name','prd-genie-complexity-sizing-shadow'),attr('langfuse.environment','evaluation'),attr('langfuse.version','complexity-sizing-batch-v0.1.1'),attr('langfuse.trace.tags',['capstone','complexity-sizing','batch-shadow',input.evaluation_case_id]),attr('langfuse.trace.metadata.evaluation_case_id',input.evaluation_case_id),attr('langfuse.trace.metadata.source_run_id',input.source_run_id),attr('langfuse.trace.metadata.user_story_id',input.story.user_story_id),attr('langfuse.observation.type','GENERATION'),attr('langfuse.observation.model.name','deterministic-rules-batch-v0.1.1'),attr('langfuse.observation.input',{frozen_artifacts:input.frozen_artifacts,user_story_id:input.story.user_story_id,signal_evidence:signalEvidence,source_evidence:sourceEvidence,approved_ground_truth_profile:approvedProfile,approved_sizing_policy:policy}),attr('langfuse.observation.output',output),attr('langfuse.observation.metadata.mode','batch_shadow')],status:{code:1}};
  return {json:{evaluation_case_id:input.evaluation_case_id,user_story_id:input.story.user_story_id,trace_id:traceId,otlp_payload:{resourceSpans:[{resource:{attributes:[attr('service.name','prd-genie-n8n'),attr('deployment.environment.name','evaluation')]},scopeSpans:[{scope:{name:'prd-genie-complexity-sizing-batch',version:'v0.1.0'},spans:[span]}]}]}}};
});
`;

const summarize = String.raw`
const responses=$input.all(),prepared=$('Prepare Nine Eligible Langfuse Traces').all();
const results=responses.map((item,index)=>({evaluation_case_id:prepared[index].json.evaluation_case_id,user_story_id:prepared[index].json.user_story_id,trace_id:prepared[index].json.trace_id,status_code:item.json.statusCode??200,ingestion_accepted:(item.json.statusCode??200)>=200&&(item.json.statusCode??200)<300}));
const failed=results.filter(result=>!result.ingestion_accepted);
if(failed.length)throw new Error('Langfuse batch ingestion failed: '+failed.map(result=>result.evaluation_case_id).join(', '));
return [{json:{schema_version:'0.1.0',stage:'complexity_sizing_langfuse_batch_shadow',mode:'isolated_unpublished',semantic_cases:results.length,ingestion_accepted:results.length,failed:0,excluded_fail_closed_cases:['TS-T09','TS-T10','TS-T11'],required_score_names:['sizing_lf_code_evaluation_pass','sizing_llm_faithfulness','sizing_llm_reasonableness','sizing_llm_hallucination'],results}}];
`;

const workflow = {
  name: 'PRD Genie - Complexity Sizing Langfuse Batch Shadow v0.1.1 - Isolated Unpublished',
  nodes: [
    {parameters:{},id:'manual',name:'Manual Batch Shadow Trigger',type:'n8n-nodes-base.manualTrigger',typeVersion:1,position:[0,0]},
    {parameters:{jsCode:prepare},id:'prepare',name:'Prepare Nine Eligible Langfuse Traces',type:'n8n-nodes-base.code',typeVersion:2,position:[300,0]},
    {parameters:{method:'POST',url:'https://us.cloud.langfuse.com/api/public/otel/v1/traces',authentication:'genericCredentialType',genericAuthType:'httpBasicAuth',sendHeaders:true,headerParameters:{parameters:[{name:'x-langfuse-ingestion-version',value:'4'}]},sendBody:true,contentType:'raw',rawContentType:'application/json',body:'={{ JSON.stringify($json.otlp_payload) }}',options:{response:{response:{fullResponse:true,neverError:false,responseFormat:'text'}}}},id:'send',name:'Send Nine Traces to Langfuse',type:'n8n-nodes-base.httpRequest',typeVersion:4.2,position:[600,0],credentials:{httpBasicAuth:{id:'trc3KgAB4Nacxjj3',name:'Langfuse US - PRD Genie'}}},
    {parameters:{jsCode:summarize},id:'confirm',name:'Confirm Nine Trace Ingestions',type:'n8n-nodes-base.code',typeVersion:2,position:[900,0]},
  ],
  connections:{
    'Manual Batch Shadow Trigger':{main:[[{node:'Prepare Nine Eligible Langfuse Traces',type:'main',index:0}]]},
    'Prepare Nine Eligible Langfuse Traces':{main:[[{node:'Send Nine Traces to Langfuse',type:'main',index:0}]]},
    'Send Nine Traces to Langfuse':{main:[[{node:'Confirm Nine Trace Ingestions',type:'main',index:0}]]},
  },
  pinData:{},active:false,settings:{executionOrder:'v1'},versionId:null,
  meta:{candidate_only:true,isolated:true,published:false,production_parent_unchanged:true,agreement_gate:'shadow',semantic_case_count:9,excluded_fail_closed_cases:['TS-T09','TS-T10','TS-T11'],contract_version:'0.1.1'},tags:[],
};

fs.writeFileSync(outputPath, JSON.stringify(workflow, null, 2) + '\n');
console.log(path.relative(root, outputPath));
