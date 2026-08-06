import fs from 'node:fs';
import crypto from 'node:crypto';

const id = () => crypto.randomUUID();
const attrCode = "const attr=(key,value)=>({key,value:{stringValue:typeof value==='string'?value:JSON.stringify(value)}});";

const nodes = [
  {
    parameters: { workflowInputs: { values: [] } },
    type: 'n8n-nodes-base.executeWorkflowTrigger',
    typeVersion: 1,
    position: [0, 0],
    id: id(),
    name: 'When Executed by Parent Workflow'
  },
  {
    parameters: {
      jsCode: `const p=$input.first().json,e=[];const prdStage=p.prd_generation_stage,storyStage=p.story_breakdown_stage;if(p.schema_version!=='1.0.0')e.push('schema_version');if(!/^RUN-[A-Za-z0-9-]+$/.test(p.run_id||''))e.push('run_id');if(!prdStage||prdStage.run_id!==p.run_id||prdStage.stage!=='prd_generation'||prdStage.execution_status!=='passed'||prdStage.groundedness_percent!==100)e.push('PRD stage invalid');if(!storyStage||storyStage.run_id!==p.run_id||storyStage.stage!=='story_breakdown'||storyStage.execution_status!=='passed'||storyStage.decision!=='continue'||storyStage.next_route!=='final_validation'||storyStage.groundedness_percent!==100)e.push('Story stage invalid');const parent=p.orchestration_context?.parent_trace_id;if(!parent||prdStage?.observability?.parent_trace_id!==parent||storyStage?.observability?.parent_trace_id!==parent)e.push('parent trace mismatch');if(!prdStage?.observability?.ingestion_accepted||!storyStage?.observability?.ingestion_accepted)e.push('upstream Langfuse ingestion not accepted');const prd=prdStage?.output?.prd,story=storyStage?.output?.story_breakdown,prdMd=prdStage?.output?.prd_markdown,storyMd=storyStage?.output?.story_markdown;if(prdStage?.output?.test_id!=='T11'||prdStage?.output?.contract_status!=='passed'||prdStage?.output?.validation?.canonical_t11_coverage!==true||!prd||typeof prdMd!=='string')e.push('canonical T11 missing');if(storyStage?.output?.test_id!=='T12'||storyStage?.output?.contract_status!=='passed'||storyStage?.output?.validation?.canonical_t12_coverage!==true||!story||typeof storyMd!=='string')e.push('canonical T12 missing');const reqIds=[...(prd?.functional_requirements||[]),...(prd?.non_functional_requirements||[])].map(x=>x.id),acIds=(prd?.acceptance_criteria||[]).map(x=>x.id),storyReq=[],storyAc=[];const walk=x=>{if(Array.isArray(x))x.forEach(walk);else if(x&&typeof x==='object'){if(Array.isArray(x.source_requirement_ids))storyReq.push(...x.source_requirement_ids);if(Array.isArray(x.source_acceptance_criteria_ids))storyAc.push(...x.source_acceptance_criteria_ids);Object.values(x).forEach(walk)}};walk(story);if(storyReq.some(x=>!reqIds.includes(x))||reqIds.some(x=>!storyReq.includes(x)))e.push('requirement cross-stage coverage');if(storyAc.some(x=>!acIds.includes(x))||acIds.some(x=>!storyAc.includes(x)))e.push('acceptance cross-stage coverage');if(e.length)throw new Error('Final validation failed: '+[...new Set(e)].join('; '));const markdown=['# PRD Genie Final Package','',prdMd,'','---','',storyMd].join('\\n');return [{json:{schema_version:'1.0.0',run_id:p.run_id,test_id:'T1-to-Final',parent_trace_id:parent,final_export:{format:'markdown',file_name:'prd-genie-t1-final.md',content:markdown},validation:{run_id_preserved:true,parent_trace_id_preserved:true,prd_contract_passed:true,story_contract_passed:true,requirement_cross_stage_coverage:true,acceptance_cross_stage_coverage:true,upstream_langfuse_ingestion_accepted:true,unsupported_claims:0,groundedness_percent:100,validated_at:new Date().toISOString()}}}];`
    },
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [240, 0],
    id: id(),
    name: 'Validate Cross-Stage Package and Export'
  },
  {
    parameters: {
      jsCode: `const r=$input.first().json;const hex=n=>Array.from({length:n},()=>Math.floor(Math.random()*16).toString(16)).join('');const traceId=hex(32),spanId=hex(16),now=BigInt(Date.now())*1000000n;${attrCode}const span={traceId,spanId,name:'final-validation-and-export',kind:1,startTimeUnixNano:now.toString(),endTimeUnixNano:(now+1000000n).toString(),attributes:[attr('langfuse.trace.name','prd-genie-final-validation'),attr('langfuse.environment','evaluation'),attr('langfuse.version','final-validator-v1.0.0'),attr('langfuse.trace.tags',['capstone','final-validation','T1-to-Final']),attr('langfuse.trace.metadata.run_id',r.run_id),attr('langfuse.trace.metadata.parent_trace_id',r.parent_trace_id),attr('langfuse.trace.metadata.model_call',false),attr('langfuse.observation.type','SPAN'),attr('langfuse.observation.input',{test_id:r.test_id}),attr('langfuse.observation.output',{validation:r.validation,file_name:r.final_export.file_name}),attr('langfuse.observation.metadata.groundedness_percent',100),attr('langfuse.observation.metadata.token_usage',{input:0,output:0,total:0})],status:{code:1}};return [{json:{...r,audit:{trace_id:traceId,model_call:false,token_usage:{input:0,output:0,total:0}},otlp_payload:{resourceSpans:[{resource:{attributes:[attr('service.name','prd-genie-n8n'),attr('deployment.environment.name','evaluation')]},scopeSpans:[{scope:{name:'prd-genie-final-validation',version:'v1.0.0'},spans:[span]}]}]}}}];`
    },
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [500, 0],
    id: id(),
    name: 'Build Final Validation Trace'
  },
  {
    parameters: {
      method: 'POST',
      url: 'https://us.cloud.langfuse.com/api/public/otel/v1/traces',
      authentication: 'genericCredentialType',
      genericAuthType: 'httpBasicAuth',
      sendHeaders: true,
      headerParameters: { parameters: [{ name: 'x-langfuse-ingestion-version', value: '4' }] },
      sendBody: true,
      contentType: 'raw',
      rawContentType: 'application/json',
      body: '={{ JSON.stringify($json.otlp_payload) }}',
      options: { response: { response: { fullResponse: true, neverError: false, responseFormat: 'text' } } }
    },
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [760, 0],
    id: id(),
    name: 'Send Final Validation Trace to Langfuse',
    credentials: {
      httpBasicAuth: {
        id: 'trc3KgAB4Nacxjj3',
        name: 'Langfuse US - PRD Genie'
      }
    }
  },
  {
    parameters: {
      jsCode: `const r=$('Build Final Validation Trace').first().json,response=$input.first().json,statusCode=response.statusCode??200;if(statusCode<200||statusCode>=300)throw new Error('Final validation Langfuse ingestion failed with HTTP '+statusCode);return [{json:{schema_version:'1.0.0',run_id:r.run_id,stage:'final_validation',execution_status:'passed',decision:'complete',next_route:'completed',groundedness_percent:100,output:{test_id:r.test_id,contract_status:'passed',final_export:r.final_export,validation:r.validation},observability:{parent_trace_id:r.parent_trace_id,stage_trace_id:r.audit.trace_id,prompt_version:'deterministic-final-validator-v1.0',ingestion_accepted:true,model_call:false,token_usage:r.audit.token_usage},recorded_at:new Date().toISOString()}}];`
    },
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [1020, 0],
    id: id(),
    name: 'Record Final Validation Stage'
  }
];

const connections = {};
for (let i = 0; i < nodes.length - 1; i++) connections[nodes[i].name] = { main: [[{ node: nodes[i + 1].name, type: 'main', index: 0 }]] };

const workflow = {
  name: 'PRD Genie - Final Validator and Export Child v1.0',
  nodes,
  connections,
  pinData: {},
  settings: { executionOrder: 'v1' },
  active: false,
  versionId: id(),
  meta: { templateCredsSetupCompleted: true },
  tags: []
};

fs.writeFileSync('workflows/n8n/prd-genie-final-validator-child-v1.0.json', `${JSON.stringify(workflow, null, 2)}\n`);
