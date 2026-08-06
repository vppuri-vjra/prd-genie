import fs from 'node:fs';
import crypto from 'node:crypto';

const path = 'workflows/n8n/prd-genie-connected-orchestrator-v0.4.json';
const workflow = JSON.parse(fs.readFileSync(path, 'utf8'));
workflow.name = 'PRD Genie - Connected Orchestrator v0.5';
workflow.versionId = crypto.randomUUID();

const childWorkflows = {
  'Execute Requirement Extractor Child': ['BTdoh2JW0mNlq9eT', 'PRD Genie - Requirement Extractor Child v1.0'],
  'Execute Gap Analyzer Child': ['wGBE80XMjD5rTKql', 'PRD Genie - Gap Analyzer Child v1.0'],
  'Execute Human Approval Child': ['lx7vCf4zxBlBjveh', 'PRD Genie - Human Approval Checkpoint Child v1.0.1'],
  'Execute PRD Generator Child': ['T07vf7xPOWegbCJk', 'PRD Genie - PRD Generator Child v1.0.1'],
  'Execute Story Breakdown Child': ['M85Dvpg0uriViX14', 'PRD Genie - Story Breakdown Child v1.0']
};
for (const [nodeName, [workflowId, cachedResultName]] of Object.entries(childWorkflows)) {
  const node = workflow.nodes.find((candidate) => candidate.name === nodeName);
  node.parameters.workflowId = { __rl: true, value: workflowId, mode: 'list', cachedResultName };
}

const finalRoute = workflow.nodes.find((node) => node.name === 'Validate Final Validation Route');
finalRoute.position = [3040, 0];

const mapFinal = {
  parameters: {
    jsCode: `const storyResult=$input.first().json,prdResult=$('Validate Story Breakdown Route').first().json;if(storyResult.next_route!=='final_validation'||storyResult.groundedness_percent!==100)throw new Error('Run is not eligible for Final Validation');return [{json:{schema_version:'1.0.0',run_id:storyResult.run_id,prd_generation_stage:prdResult.prd_generation_stage,story_breakdown_stage:storyResult.story_breakdown_stage,orchestration_context:{parent_trace_id:storyResult.parent_trace_id,test_id:'T1-to-Final',environment:'connected-canary'}}}];`
  },
  id: crypto.randomUUID(),
  name: 'Map Final Validator Input',
  type: 'n8n-nodes-base.code',
  typeVersion: 2,
  position: [3320, 0]
};
const executeFinal = {
  parameters: {
    source: 'database',
    workflowId: { __rl: true, value: 'gPc9aTRQ8qLWdZgL', mode: 'list', cachedResultName: 'PRD Genie - Final Validator and Export Child v1.0' },
    workflowInputs: { mappingMode: 'defineBelow', value: {}, matchingColumns: [], schema: [], attemptToConvertTypes: false, convertFieldsToString: true },
    mode: 'once',
    options: { waitForSubWorkflow: true }
  },
  id: crypto.randomUUID(),
  name: 'Execute Final Validator Child',
  type: 'n8n-nodes-base.executeWorkflow',
  typeVersion: 1.3,
  position: [3600, 0]
};
const validateComplete = {
  parameters: {
    jsCode: `const stage=$input.first().json,parent=$('Create T1 Parent Run').first().json,e=[];if(stage.schema_version!=='1.0.0'||stage.run_id!==parent.run_id)e.push('identity');if(stage.stage!=='final_validation'||stage.execution_status!=='passed'||stage.decision!=='complete'||stage.next_route!=='completed')e.push('final route');if(stage.groundedness_percent!==100||stage.output?.validation?.groundedness_percent!==100)e.push('groundedness');if(stage.output?.contract_status!=='passed'||stage.output?.validation?.unsupported_claims!==0)e.push('final contract');if(stage.observability?.parent_trace_id!==parent.orchestration_context.parent_trace_id||!stage.observability?.ingestion_accepted)e.push('observability');if(stage.observability?.model_call!==false||stage.observability?.token_usage?.total!==0)e.push('deterministic usage');if(stage.output?.final_export?.format!=='markdown'||typeof stage.output?.final_export?.content!=='string')e.push('markdown export');if(e.length)throw new Error('Connected final validation canary failed: '+e.join('; '));return [{json:{schema_version:'1.0.0',result_type:'connected_final_export_canary_result',run_id:parent.run_id,test_id:'T1-to-Final',execution_status:'completed',contract_status:'passed',current_stage:'final_validation',next_route:'completed',groundedness_percent:100,parent_trace_id:parent.orchestration_context.parent_trace_id,final_validation_stage:stage,final_export:stage.output.final_export,checks:{run_id_preserved:true,parent_trace_id_preserved:true,all_stage_contracts_passed:true,cross_stage_coverage_passed:true,final_markdown_exported:true,unsupported_claims_absent:true,langfuse_ingestion_accepted:true,model_call:false},recorded_at:new Date().toISOString()}}];`
  },
  id: crypto.randomUUID(),
  name: 'Validate Completed Pipeline',
  type: 'n8n-nodes-base.code',
  typeVersion: 2,
  position: [3880, 0]
};

workflow.nodes.push(mapFinal, executeFinal, validateComplete);
workflow.connections['Validate Final Validation Route'] = { main: [[{ node: mapFinal.name, type: 'main', index: 0 }]] };
workflow.connections[mapFinal.name] = { main: [[{ node: executeFinal.name, type: 'main', index: 0 }]] };
workflow.connections[executeFinal.name] = { main: [[{ node: validateComplete.name, type: 'main', index: 0 }]] };

fs.writeFileSync('workflows/n8n/prd-genie-connected-orchestrator-v0.5.json', `${JSON.stringify(workflow, null, 2)}\n`);
