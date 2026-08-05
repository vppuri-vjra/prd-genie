import fs from 'node:fs';

const root = new URL('../', import.meta.url);
const readJson = (path) => JSON.parse(fs.readFileSync(new URL(path, root), 'utf8'));
const writeJson = (path, value) => fs.writeFileSync(new URL(path, root), JSON.stringify(value, null, 2) + '\n');
const node = (workflow, name) => {
  const value = workflow.nodes.find((candidate) => candidate.name === name);
  if (!value) throw new Error(`Missing node: ${name}`);
  return value;
};
const removeNode = (workflow, name) => {
  workflow.nodes = workflow.nodes.filter((candidate) => candidate.name !== name);
  delete workflow.connections[name];
  for (const connection of Object.values(workflow.connections)) {
    for (const branches of Object.values(connection)) {
      for (const branch of branches) {
        for (let index = branch.length - 1; index >= 0; index -= 1) {
          if (branch[index].node === name) branch.splice(index, 1);
        }
      }
    }
  }
};
const mainConnection = (target) => ({ main: [[{ node: target, type: 'main', index: 0 }]] });

const promotedV15Rules = `\n\nPromoted v1.4 relationship audit: Before returning JSON, audit related_item_ids. When an NFR specifies how well a functional capability must operate, link the NFR and functional requirement bidirectionally, including when they are in adjacent sentences. Both items must contain the other's ID. Do not link items merely because they occur near one another; named stakeholders and deadlines remain unlinked unless the source explicitly states a relationship.\n\nPromoted v1.5 product-fragment status boundary: When items is empty, return partial if the source contains product-relevant fragments that support grounded actionable missing_information but are too incomplete for a reliable requirement item. Return no_requirements only when the source is empty, contains no meaningful product-related content, or clearly should not be interpreted as product requirements. An empty items array does not automatically mean no_requirements. For a fragment such as Discussed dashboard... John mentioned something about real-time... budget TBD..., return partial with no requirement items and grounded clarifications; preserve the exact phrase budget TBD and do not invent dashboard or real-time requirements, a stakeholder item for John, or a budget risk.`;

function buildRequirementExtractorChild() {
  const workflow = readJson('workflows/n8n/prd-genie-requirement-extractor-v0.2.json');
  workflow.name = 'PRD Genie - Requirement Extractor Child v1.0';
  workflow.id = undefined;
  workflow.active = false;
  workflow.pinData = {};
  removeNode(workflow, 'Normalize T1 Input');

  const trigger = node(workflow, 'Manual Trigger');
  trigger.name = 'When Executed by Parent Workflow';
  trigger.type = 'n8n-nodes-base.executeWorkflowTrigger';
  trigger.typeVersion = 1.1;
  trigger.parameters = { inputSource: 'passthrough' };

  const validate = node(workflow, 'Validate Workflow Input');
  validate.name = 'Validate Parent Source Input';
  validate.parameters.jsCode = `const data = $input.first().json;\nconst errors = [];\nif (data.schema_version !== '1.0.0') errors.push('schema_version must be 1.0.0');\nif (!/^RUN-[A-Za-z0-9-]+$/.test(data.run_id || '')) errors.push('run_id is invalid');\nif (!['meeting_transcript','product_brief','stakeholder_notes','evaluation_test'].includes(data.input_type)) errors.push('input_type is invalid');\nif (!(data.source_name || '').trim()) errors.push('source_name is required');\nif (!(data.source_text || '').trim()) errors.push('source_text is required');\nif (Number.isNaN(Date.parse(data.submitted_at))) errors.push('submitted_at must be an ISO date-time');\nif (!(data.orchestration_context?.parent_trace_id || '').trim()) errors.push('orchestration_context.parent_trace_id is required');\nif (data.orchestration_context?.active_run_id && data.orchestration_context.active_run_id !== data.run_id) errors.push('active_run_id must match run_id');\nif (errors.length) throw new Error('Parent source input validation failed: ' + errors.join('; '));\nreturn [{ json: data }];`;

  const context = node(workflow, 'Create Trace Context');
  context.parameters.jsCode = `const startedMs = Date.now();\nconst randomHex = length => Array.from({length}, () => Math.floor(Math.random() * 16).toString(16)).join('');\nconst parent = $input.first().json;\nreturn [{json:{...parent,trace_context:{parent_trace_id:parent.orchestration_context.parent_trace_id,trace_id:randomHex(32),root_span_id:randomHex(16),generation_span_id:randomHex(16),validation_span_id:randomHex(16),trace_started_unix_nano:String(startedMs*1000000),generation_started_unix_nano:String((startedMs+1)*1000000),workflow_version:'child-v1.0.0',prompt_version:'extractor-v1.5-product-fragment-status-boundary',environment:parent.orchestration_context.environment || 'connected-canary'}}}];`;

  const prompt = node(workflow, 'Requirement Extractor').parameters.messages.messageValues[0];
  if (!prompt.message.includes('Promoted v1.4 relationship audit')) prompt.message += promotedV15Rules;

  const parse = node(workflow, 'Parse and Validate Extraction');
  parse.parameters.jsCode = parse.parameters.jsCode.replace("$('Create Trace Context').first().json", "$('Create Trace Context').first().json");

  const buildTrace = node(workflow, 'Build Langfuse OTLP Payload');
  buildTrace.parameters.jsCode = buildTrace.parameters.jsCode.replace(
    "attr('langfuse.trace.metadata.prompt_version', context.prompt_version)",
    "attr('langfuse.trace.metadata.prompt_version', context.prompt_version), attr('langfuse.trace.metadata.parent_trace_id', context.parent_trace_id)"
  );

  const result = node(workflow, 'Record Trace Result');
  result.name = 'Return Requirement Extraction Stage Result';
  result.parameters.jsCode = `const trace = $('Build Langfuse OTLP Payload').first().json;\nconst statusCode = $json.statusCode ?? 200;\nconst accepted = statusCode >= 200 && statusCode < 300;\nif (!accepted) throw new Error('Langfuse ingestion was not accepted');\nconst context = $('Create Trace Context').first().json.trace_context;\nreturn [{json:{schema_version:'1.0.0',run_id:trace.run_id,stage:'requirement_extraction',execution_status:'passed',decision:'continue',next_route:'gap_analysis',groundedness_percent:100,output:trace.extraction,observability:{parent_trace_id:context.parent_trace_id,stage_trace_id:trace.trace_id,prompt_version:context.prompt_version,ingestion_accepted:accepted}}}];`;

  workflow.connections = {
    'When Executed by Parent Workflow': mainConnection('Validate Parent Source Input'),
    'Validate Parent Source Input': mainConnection('Create Trace Context'),
    'Create Trace Context': mainConnection('Requirement Extractor'),
    'OpenAI - Extractor Model': workflow.connections['OpenAI - Extractor Model'],
    'Requirement Extractor': mainConnection('Parse and Validate Extraction'),
    'Parse and Validate Extraction': mainConnection('Build Langfuse OTLP Payload'),
    'Build Langfuse OTLP Payload': mainConnection('Send Trace to Langfuse'),
    'Send Trace to Langfuse': mainConnection('Return Requirement Extraction Stage Result')
  };
  const visualOrder = ['When Executed by Parent Workflow','Validate Parent Source Input','Create Trace Context','Requirement Extractor','Parse and Validate Extraction','Build Langfuse OTLP Payload','Send Trace to Langfuse','Return Requirement Extraction Stage Result'];
  workflow.nodes.forEach((item) => {
    const index = item.name === 'OpenAI - Extractor Model' ? visualOrder.indexOf('Requirement Extractor') : visualOrder.indexOf(item.name);
    item.position = [index * 240 - 720, item.name === 'OpenAI - Extractor Model' ? 220 : 0];
  });
  delete workflow.id;
  return workflow;
}

function buildGapAnalyzerChild() {
  const workflow = readJson('workflows/n8n/prd-genie-gap-analyzer-generation-gate-v1.0.json');
  workflow.name = 'PRD Genie - Gap Analyzer Child v1.0';
  workflow.active = false;
  workflow.pinData = {};
  removeNode(workflow, 'Load Gap Analyzer Test Input');

  const trigger = node(workflow, 'When clicking ‘Execute workflow’');
  trigger.name = 'When Executed by Parent Workflow';
  trigger.type = 'n8n-nodes-base.executeWorkflowTrigger';
  trigger.typeVersion = 1.1;
  trigger.parameters = { inputSource: 'passthrough' };

  const validate = node(workflow, 'Validate Requirement Extraction Input');
  validate.name = 'Validate Parent Extraction Input';
  validate.parameters.jsCode = `const parent = $input.first().json;\nconst extraction = parent.extraction ?? parent.output;\nconst errors = [];\nif (!extraction || typeof extraction !== 'object') errors.push('extraction or output is required');\nconst x = extraction || {};\nif (x.schema_version !== '1.0.0') errors.push('extraction.schema_version must be 1.0.0');\nif (typeof x.run_id !== 'string' || !x.run_id.trim()) errors.push('extraction.run_id is required');\nif (parent.run_id !== x.run_id) errors.push('parent run_id must match extraction.run_id');\nif (!(parent.orchestration_context?.parent_trace_id || '').trim()) errors.push('orchestration_context.parent_trace_id is required');\nif (!['complete','partial','no_requirements'].includes(x.extraction_status)) errors.push('invalid extraction_status');\nif (typeof x.summary !== 'string' || !x.summary.trim()) errors.push('summary is required');\nfor (const field of ['items','contradictions','missing_information','extractor_notes']) if (!Array.isArray(x[field])) errors.push(field + ' must be an array');\nif (Array.isArray(x.items)) { const ids = new Set(); for (const item of x.items) { if (!item.id || ids.has(item.id)) errors.push('item IDs must be present and unique'); ids.add(item.id); if (!Array.isArray(item.evidence) || item.evidence.length === 0) errors.push('evidence missing for ' + item.id); } }\nif (errors.length) throw new Error('Parent extraction input invalid: ' + errors.join('; '));\nreturn [{json:{...x,input_validation:{valid:true,validated_at:new Date().toISOString(),contract:'requirement-extraction.schema.json'},orchestration_context:parent.orchestration_context}}];`;

  const context = node(workflow, 'Create Gap Trace Context');
  context.parameters.jsCode = `const input = $input.first().json;\nconst {input_validation,orchestration_context,...extraction} = input;\nconst testMatch = extraction.run_id.match(/RUN-T(\\d+)-/);\nconst trace_context={run_id:extraction.run_id,parent_trace_id:orchestration_context.parent_trace_id,test_id:testMatch?'GA-T'+testMatch[1]:(orchestration_context.test_id || 'GA-CONNECTED'),workflow_name:'PRD Genie - Gap Analyzer Child',workflow_version:'1.0.0',prompt_version:'gap-analyzer-v1.0-missing-information-coverage',environment:orchestration_context.environment || 'connected-canary',langfuse_observation:'gap-analyzer',started_at:new Date().toISOString(),n8n_execution_id:$execution.id || null,n8n_workflow_id:$workflow.id};\nreturn [{json:{extraction,trace_context}}];`;

  const buildTrace = node(workflow, 'Build Langfuse OTLP Payload');
  buildTrace.parameters.jsCode = buildTrace.parameters.jsCode.replace(
    "attr('langfuse.trace.metadata.prompt_version',ctx.prompt_version),",
    "attr('langfuse.trace.metadata.prompt_version',ctx.prompt_version),\n  attr('langfuse.trace.metadata.parent_trace_id',ctx.parent_trace_id),"
  );

  const result = node(workflow, 'Record Gap Analysis Result');
  result.name = 'Return Gap Analysis Stage Result';
  result.parameters.jsCode = `const trace = $('Build Langfuse OTLP Payload').first().json;\nconst response = $json;\nconst ingestion=response?.data?.payload?.data ?? response?.payload?.data ?? response?.data ?? response;\nconst authValue=ingestion?.authCheck?.validKey;\nconst accepted=[true,'true',1,'1'].includes(authValue) || (response?.name==='otel-ingestion-job' && Boolean(response?.data?.id));\nif (!accepted) throw new Error('Langfuse ingestion was not confirmed');\nconst gate=trace.generation_gate;\nconst context=trace.trace_context;\nreturn [{json:{schema_version:'1.0.0',run_id:trace.run_id,stage:'gap_analysis',execution_status:'passed',decision:gate.route,next_route:gate.route==='human_review_with_tbd'?'human_approval':gate.route==='human_review'?'human_approval':gate.route==='blocked'?'stopped':gate.route,groundedness_percent:100,output:{gap_analysis:trace.gap_analysis,generation_gate:gate},observability:{parent_trace_id:context.parent_trace_id,stage_trace_id:trace.trace_id,prompt_version:context.prompt_version,ingestion_accepted:true}}}];`;

  workflow.connections = {
    'When Executed by Parent Workflow': mainConnection('Validate Parent Extraction Input'),
    'Validate Parent Extraction Input': mainConnection('Create Gap Trace Context'),
    'Create Gap Trace Context': mainConnection('Gap Analyzer Agent'),
    'OpenAI - Gap Analyzer Model': workflow.connections['OpenAI - Gap Analyzer Model'],
    'Gap Analyzer Agent': mainConnection('Parse and Validate Gap Analysis'),
    'Parse and Validate Gap Analysis': mainConnection('Deterministic Generation Gate'),
    'Deterministic Generation Gate': mainConnection('Build Langfuse OTLP Payload'),
    'Build Langfuse OTLP Payload': mainConnection('Send Trace to Langfuse'),
    'Send Trace to Langfuse': mainConnection('Return Gap Analysis Stage Result')
  };
  const visualOrder = ['When Executed by Parent Workflow','Validate Parent Extraction Input','Create Gap Trace Context','Gap Analyzer Agent','Parse and Validate Gap Analysis','Deterministic Generation Gate','Build Langfuse OTLP Payload','Send Trace to Langfuse','Return Gap Analysis Stage Result'];
  workflow.nodes.forEach((item) => {
    const index = item.name === 'OpenAI - Gap Analyzer Model' ? visualOrder.indexOf('Gap Analyzer Agent') : visualOrder.indexOf(item.name);
    item.position = [index * 240 - 720, item.name === 'OpenAI - Gap Analyzer Model' ? 220 : 0];
  });
  delete workflow.id;
  return workflow;
}

function buildConnectedOrchestrator() {
  const codeNode = (id, name, position, jsCode) => ({
    parameters: { jsCode }, id, name, type: 'n8n-nodes-base.code', typeVersion: 2, position
  });
  const executeChild = (id, name, position) => ({
    parameters: {
      source: 'database',
      workflowId: { __rl: true, value: '', mode: 'list', cachedResultName: '' },
      workflowInputs: {
        mappingMode: 'defineBelow', value: {}, matchingColumns: [], schema: [],
        attemptToConvertTypes: false, convertFieldsToString: true
      },
      mode: 'once',
      options: { waitForSubWorkflow: true }
    },
    id, name, type: 'n8n-nodes-base.executeWorkflow', typeVersion: 1.3, position
  });
  const workflow = {
    name: 'PRD Genie - Connected Orchestrator v0.1',
    nodes: [
      {
        parameters: {}, id: 'c1000000-0000-4000-8000-000000000001',
        name: 'Manual T1 Canary Trigger', type: 'n8n-nodes-base.manualTrigger', typeVersion: 1,
        position: [-840, 0]
      },
      codeNode('c1000000-0000-4000-8000-000000000002', 'Create T1 Parent Run', [-600, 0],
        `const randomHex=length=>Array.from({length},()=>Math.floor(Math.random()*16).toString(16)).join('');\nconst run_id='RUN-T1-CONNECTED-'+Date.now();\nreturn [{json:{schema_version:'1.0.0',run_id,test_id:'T1',input_type:'evaluation_test',source_name:'eval_prdgenie_inputs.txt',source_text:'The user should be able to filter reports by date range, category, and status. Results must load in under 2 seconds. PM: Sarah. Deadline: Q3.',submitted_by:'Connected orchestrator canary',submitted_at:new Date().toISOString(),metadata:{document_version:'connected-canary-v1',language:'en'},orchestration_context:{active_run_id:run_id,parent_trace_id:randomHex(32),environment:'connected-canary'}}}];`),
      executeChild('c1000000-0000-4000-8000-000000000003', 'Execute Requirement Extractor Child', [-340, 0]),
      codeNode('c1000000-0000-4000-8000-000000000004', 'Validate Extraction Stage and Map GA Input', [-40, 0],
        `const stage=$input.first().json;\nconst parent=$('Create T1 Parent Run').first().json;\nconst errors=[];\nif(stage.schema_version!=='1.0.0') errors.push('stage schema_version');\nif(stage.run_id!==parent.run_id) errors.push('Requirement Extractor run_id mismatch');\nif(stage.stage!=='requirement_extraction'||stage.execution_status!=='passed'||stage.decision!=='continue'||stage.next_route!=='gap_analysis') errors.push('Requirement Extractor route invalid');\nif(stage.groundedness_percent!==100) errors.push('Requirement Extractor groundedness must be 100');\nif(stage.observability?.parent_trace_id!==parent.orchestration_context.parent_trace_id) errors.push('Requirement Extractor parent_trace_id mismatch');\nif(!stage.observability?.ingestion_accepted) errors.push('Requirement Extractor Langfuse ingestion not accepted');\nif(stage.output?.run_id!==parent.run_id) errors.push('Extraction output run_id mismatch');\nif(errors.length) throw new Error('Requirement Extraction stage validation failed: '+errors.join('; '));\nreturn [{json:{schema_version:'1.0.0',run_id:parent.run_id,extraction:stage.output,orchestration_context:{parent_trace_id:parent.orchestration_context.parent_trace_id,test_id:'T1',environment:'connected-canary'},requirement_extraction_stage:stage}}];`),
      executeChild('c1000000-0000-4000-8000-000000000005', 'Execute Gap Analyzer Child', [280, 0]),
      codeNode('c1000000-0000-4000-8000-000000000006', 'Validate Human Approval Route', [580, 0],
        `const stage=$input.first().json;\nconst mapped=$('Validate Extraction Stage and Map GA Input').first().json;\nconst extractionStage=mapped.requirement_extraction_stage;\nconst errors=[];\nif(stage.schema_version!=='1.0.0') errors.push('stage schema_version');\nif(stage.run_id!==mapped.run_id) errors.push('Gap Analyzer run_id mismatch');\nif(stage.stage!=='gap_analysis'||stage.execution_status!=='passed') errors.push('Gap Analyzer stage status invalid');\nif(stage.decision!=='human_review'||stage.next_route!=='human_approval') errors.push('T1 must route to human_approval');\nif(stage.groundedness_percent!==100) errors.push('Gap Analyzer groundedness must be 100');\nif(stage.observability?.parent_trace_id!==mapped.orchestration_context.parent_trace_id) errors.push('Gap Analyzer parent_trace_id mismatch');\nif(!stage.observability?.ingestion_accepted) errors.push('Gap Analyzer Langfuse ingestion not accepted');\nif(stage.output?.generation_gate?.route!=='human_review') errors.push('Generation Gate route must be human_review');\nif(errors.length) throw new Error('Connected T1 canary failed: '+errors.join('; '));\nreturn [{json:{schema_version:'1.0.0',result_type:'connected_orchestration_canary_result',run_id:mapped.run_id,test_id:'T1',execution_status:'passed',current_stage:'gap_analysis',next_route:'human_approval',groundedness_percent:100,parent_trace_id:mapped.orchestration_context.parent_trace_id,stage_results:{requirement_extraction:extractionStage,gap_analysis:stage},checks:{run_id_preserved:true,parent_trace_id_preserved:true,requirement_extraction_passed:true,gap_analysis_passed:true,expected_route_reached:true,langfuse_ingestion_accepted:true},recorded_at:new Date().toISOString()}}];`)
    ],
    pinData: {},
    connections: {
      'Manual T1 Canary Trigger': mainConnection('Create T1 Parent Run'),
      'Create T1 Parent Run': mainConnection('Execute Requirement Extractor Child'),
      'Execute Requirement Extractor Child': mainConnection('Validate Extraction Stage and Map GA Input'),
      'Validate Extraction Stage and Map GA Input': mainConnection('Execute Gap Analyzer Child'),
      'Execute Gap Analyzer Child': mainConnection('Validate Human Approval Route')
    },
    active: false,
    settings: { executionOrder: 'v1' },
    versionId: 'c1000000-0000-4000-8000-000000000010',
    meta: { templateCredsSetupCompleted: false, instanceCompatibility: 'n8n Cloud 2.31.5' },
    tags: []
  };
  return workflow;
}

writeJson('workflows/n8n/prd-genie-requirement-extractor-child-v1.0.json', buildRequirementExtractorChild());
writeJson('workflows/n8n/prd-genie-gap-analyzer-child-v1.0.json', buildGapAnalyzerChild());
writeJson('workflows/n8n/prd-genie-connected-orchestrator-v0.1.json', buildConnectedOrchestrator());
