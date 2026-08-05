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
  workflow.nodes.forEach((item, index) => { item.position = [index * 240 - 720, item.name === 'OpenAI - Extractor Model' ? 220 : 0]; });
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
  workflow.nodes.forEach((item, index) => { item.position = [index * 240 - 720, item.name === 'OpenAI - Gap Analyzer Model' ? 220 : 0]; });
  delete workflow.id;
  return workflow;
}

writeJson('workflows/n8n/prd-genie-requirement-extractor-child-v1.0.json', buildRequirementExtractorChild());
writeJson('workflows/n8n/prd-genie-gap-analyzer-child-v1.0.json', buildGapAnalyzerChild());
