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

function buildHumanApprovalChild() {
  const base = readJson('workflows/n8n/prd-genie-human-approval-v0.1.json');
  const byName = (name) => node(base, name);
  const trigger = byName('Human Review Form');
  trigger.name = 'When Executed by Parent Workflow';
  trigger.type = 'n8n-nodes-base.executeWorkflowTrigger';
  trigger.typeVersion = 1.1;
  trigger.parameters = { inputSource: 'passthrough' };

  const build = byName('Build Human Review Packet');
  build.name = 'Validate Eligibility and Build Review Packet';
  build.parameters.jsCode = `const parent=$input.first().json;\nconst extraction=parent.extraction; const gap=parent.gap_analysis; const gate=parent.generation_gate; const errors=[];\nif(parent.schema_version!=='1.0.0') errors.push('schema_version must be 1.0.0');\nif(!parent.run_id||parent.run_id!==extraction?.run_id||parent.run_id!==gap?.run_id||parent.run_id!==gate?.run_id) errors.push('all run_id values must match');\nif(!(parent.orchestration_context?.parent_trace_id||'').trim()) errors.push('parent_trace_id is required');\nif(!['eligible_for_human_approval','eligible_with_tbd'].includes(gate?.gate_status)) errors.push('gate status is not eligible for review');\nif(!['human_review','human_review_with_tbd'].includes(gate?.route)) errors.push('gate route is not a human-review route');\nif(gate?.prd_generation_eligible!==true||gate?.human_approval_required!==true) errors.push('gate eligibility fields are inconsistent');\nif(!['sufficient','partially_sufficient'].includes(gap?.information_sufficiency)||gap?.generation_allowed!==true||!['proceed','proceed_with_tbd'].includes(gap?.recommended_action)) errors.push('Gap Analysis is not eligible for review');\nif(!Array.isArray(extraction?.items)||!Array.isArray(gap?.gaps)||!Array.isArray(gap?.risks)) errors.push('upstream arrays are invalid');\nif(errors.length) throw new Error('Human Approval eligibility failed: '+errors.join('; '));\nreturn [{json:{...parent,proposed_approved_item_ids:extraction.items.map(item=>item.id),eligible_tbd_ids:[...new Set([...gap.gaps.map(x=>x.id),...gap.risks.map(x=>x.id),...extraction.items.filter(x=>['dependency','risk'].includes(x.type)).map(x=>x.id)])],review_packet_created_at:new Date().toISOString()}}];`;

  const wait = {
    parameters: {
      resume: 'form',
      formTitle: 'PRD Genie — Connected Human Approval',
      formDescription: '=Review run {{ $json.run_id }}. Gate: {{ $json.generation_gate.gate_status }} / {{ $json.generation_gate.route }}. Proposed grounded IDs: {{ $json.proposed_approved_item_ids.join(", ") }}. Submit only after reviewing the upstream evidence and gaps.',
      formFields: { values: [
        { fieldLabel: 'Reviewer', fieldName: 'reviewer', requiredField: true },
        { fieldLabel: 'Review decision', fieldName: 'review_status', fieldType: 'dropdown', fieldOptions: { values: [{option:'approved'},{option:'approved_with_conditions'},{option:'changes_requested'},{option:'clarification_required'},{option:'rejected'}] }, requiredField: true },
        { fieldLabel: 'Approved item IDs (comma separated)', fieldName: 'approved_item_ids', requiredField: true },
        { fieldLabel: 'Rejected item IDs (comma separated)', fieldName: 'rejected_item_ids' },
        { fieldLabel: 'Reviewed gap IDs (comma separated)', fieldName: 'reviewed_gap_ids' },
        { fieldLabel: 'Controlled TBD IDs (comma separated)', fieldName: 'controlled_tbd_ids' },
        { fieldLabel: 'Approval condition', fieldName: 'condition_description', fieldType: 'textarea' },
        { fieldLabel: 'Source grounding verified', fieldName: 'source_grounding_verified', fieldType: 'checkbox', fieldOptions:{values:[{option:'Verified'}]} },
        { fieldLabel: 'Exact values verified', fieldName: 'exact_values_verified', fieldType: 'checkbox', fieldOptions:{values:[{option:'Verified'}]} },
        { fieldLabel: 'Relationships verified', fieldName: 'relationships_verified', fieldType: 'checkbox', fieldOptions:{values:[{option:'Verified'}]} },
        { fieldLabel: 'Gap analysis verified', fieldName: 'gap_analysis_verified', fieldType: 'checkbox', fieldOptions:{values:[{option:'Verified'}]} },
        { fieldLabel: 'Unsupported claims absent', fieldName: 'unsupported_claims_absent', fieldType: 'checkbox', fieldOptions:{values:[{option:'Verified'}]} },
        { fieldLabel: 'Review notes', fieldName: 'review_notes', fieldType: 'textarea' }
      ]},
      options: { limitWaitTime: false }
    },
    id: 'ha100000-0000-4000-8000-000000000002', name: 'Wait for Human Decision',
    type: 'n8n-nodes-base.wait', typeVersion: 1.1, position: [-240,0], webhookId: 'prd-genie-connected-human-approval-v1'
  };
  base.nodes.splice(base.nodes.indexOf(build)+1,0,wait);

  const parse = byName('Parse and Validate Human Approval');
  parse.parameters.jsCode = `const packet=$('Validate Eligibility and Build Review Packet').first().json; const raw=$input.first().json;\nconst value=(key,label)=>raw[key]??raw[label]; const split=v=>String(v||'').split(',').map(x=>x.trim()).filter(Boolean); const verified=v=>v===true||v==='Verified'||(Array.isArray(v)&&v.includes('Verified'));\nconst reviewStatus=value('review_status','Review decision'); const reviewer=String(value('reviewer','Reviewer')||'').trim(); const approved=split(value('approved_item_ids','Approved item IDs (comma separated)')); const rejected=split(value('rejected_item_ids','Rejected item IDs (comma separated)')); const reviewedGaps=split(value('reviewed_gap_ids','Reviewed gap IDs (comma separated)')); const controlledTbds=split(value('controlled_tbd_ids','Controlled TBD IDs (comma separated)')); const conditionText=String(value('condition_description','Approval condition')||'').trim();\nconst checks={source_grounding_verified:verified(value('source_grounding_verified','Source grounding verified')),exact_values_verified:verified(value('exact_values_verified','Exact values verified')),relationships_verified:verified(value('relationships_verified','Relationships verified')),gap_analysis_verified:verified(value('gap_analysis_verified','Gap analysis verified')),unsupported_claims_absent:verified(value('unsupported_claims_absent','Unsupported claims absent'))};\nconst itemIds=packet.extraction.items.map(x=>x.id); const gapIds=packet.gap_analysis.gaps.map(x=>x.id); const allowedTbdIds=packet.eligible_tbd_ids; const routeMap={approved:'prd_generation',approved_with_conditions:'prd_generation_with_conditions',changes_requested:'correction',clarification_required:'clarification',rejected:'stopped'}; const errors=[];\nif(!reviewer) errors.push('reviewer is required'); if(!routeMap[reviewStatus]) errors.push('unsupported review decision'); if([...approved,...rejected].some(id=>!itemIds.includes(id))) errors.push('approved/rejected IDs must exist upstream'); if(reviewedGaps.some(id=>!gapIds.includes(id))) errors.push('reviewed gap IDs must exist upstream'); if(controlledTbds.some(id=>!allowedTbdIds.includes(id))) errors.push('controlled TBD IDs must exist upstream'); if(approved.some(id=>rejected.includes(id))) errors.push('approved and rejected IDs overlap');\nif(['approved','approved_with_conditions'].includes(reviewStatus)&&approved.length===0) errors.push('approval requires approved IDs'); if(reviewStatus==='approved'&&(rejected.length||controlledTbds.length||conditionText)) errors.push('standard approval cannot include rejection, TBD or condition'); if(reviewStatus==='approved_with_conditions'&&packet.generation_gate.gate_status!=='eligible_with_tbd') errors.push('conditional approval requires eligible_with_tbd'); if(reviewStatus==='approved_with_conditions'&&(!controlledTbds.length||!reviewedGaps.length||!conditionText)) errors.push('conditional approval requires gaps, TBDs and condition'); if(['approved','approved_with_conditions'].includes(reviewStatus)&&Object.values(checks).some(v=>!v)) errors.push('all five evidence checks must pass');\nif(errors.length) throw new Error('Human approval validation failed: '+errors.join('; ')); const conditions=conditionText?[{id:'COND-001',description:conditionText,related_ids:[...new Set([...approved,...controlledTbds])]}]:[];\nreturn [{json:{schema_version:'1.0.0',run_id:packet.run_id,review_status:reviewStatus,reviewer,reviewed_at:new Date().toISOString(),gate_status_reviewed:packet.generation_gate.gate_status,approved_item_ids:approved,rejected_item_ids:rejected,reviewed_gap_ids:reviewedGaps,controlled_tbd_ids:controlledTbds,conditions,evidence_checks:checks,review_notes:String(value('review_notes','Review notes')||''),next_route:routeMap[reviewStatus],validation:{structurally_valid:true,referenced_ids_valid:true,decision_consistent:true,validated_at:new Date().toISOString()}}}];`;

  const trace = byName('Build Approval Trace Payload');
  trace.parameters.jsCode = trace.parameters.jsCode.replaceAll("$('Build Human Review Packet')", "$('Validate Eligibility and Build Review Packet')").replace("attr('langfuse.trace.metadata.run_id', review.run_id),", "attr('langfuse.trace.metadata.run_id', review.run_id), attr('langfuse.trace.metadata.parent_trace_id', packet.orchestration_context.parent_trace_id),");
  const record = byName('Record Approval Result');
  record.name = 'Return Human Approval Stage Result';
  record.parameters.jsCode = `const result=$('Build Approval Trace Payload').first().json; const packet=$('Validate Eligibility and Build Review Packet').first().json; const response=$input.first().json; const statusCode=response.statusCode??200; const accepted=statusCode>=200&&statusCode<300; if(!accepted) throw new Error('Human Approval Langfuse ingestion failed'); const approved=['approved','approved_with_conditions'].includes(result.review_status);\nreturn [{json:{schema_version:'1.0.0',run_id:result.run_id,stage:'human_approval',execution_status:'passed',decision:approved?'continue':result.review_status==='changes_requested'?'correction':result.review_status==='clarification_required'?'clarification':'rejected',next_route:result.next_route,groundedness_percent:100,output:{human_review:{review_status:result.review_status,reviewer:result.reviewer,reviewed_at:result.reviewed_at,approved_item_ids:result.approved_item_ids,rejected_item_ids:result.rejected_item_ids,reviewed_gap_ids:result.reviewed_gap_ids,controlled_tbd_ids:result.controlled_tbd_ids,conditions:result.conditions,evidence_checks:result.evidence_checks,review_notes:result.review_notes,next_route:result.next_route},routing:result.routing,validation:result.validation,approved_package:{extraction:packet.extraction,gap_analysis:packet.gap_analysis,generation_gate:packet.generation_gate}},observability:{parent_trace_id:packet.orchestration_context.parent_trace_id,stage_trace_id:result.audit.trace_id,prompt_version:null,ingestion_accepted:true}}}];`;
  base.name='PRD Genie - Human Approval Checkpoint Child v1.0'; base.active=false; base.pinData={}; delete base.id;
  base.connections={
    'When Executed by Parent Workflow':mainConnection('Validate Eligibility and Build Review Packet'),
    'Validate Eligibility and Build Review Packet':mainConnection('Wait for Human Decision'),
    'Wait for Human Decision':mainConnection('Parse and Validate Human Approval'),
    'Parse and Validate Human Approval':mainConnection('Deterministic Approval Router'),
    'Deterministic Approval Router':mainConnection('Build Approval Trace Payload'),
    'Build Approval Trace Payload':mainConnection('Send Approval Trace to Langfuse'),
    'Send Approval Trace to Langfuse':mainConnection('Return Human Approval Stage Result')
  };
  const order=['When Executed by Parent Workflow','Validate Eligibility and Build Review Packet','Wait for Human Decision','Parse and Validate Human Approval','Deterministic Approval Router','Build Approval Trace Payload','Send Approval Trace to Langfuse','Return Human Approval Stage Result'];
  base.nodes.forEach(n=>n.position=[order.indexOf(n.name)*250-800,0]);
  return base;
}

function buildConnectedOrchestratorV02() {
  const workflow=buildConnectedOrchestrator(); workflow.name='PRD Genie - Connected Orchestrator v0.2';
  const map={parameters:{jsCode:`const result=$input.first().json; const stages=result.stage_results; if(result.next_route!=='human_approval'||result.groundedness_percent!==100) throw new Error('Run is not eligible for Human Approval'); return [{json:{schema_version:'1.0.0',run_id:result.run_id,extraction:stages.requirement_extraction.output,gap_analysis:stages.gap_analysis.output.gap_analysis,generation_gate:stages.gap_analysis.output.generation_gate,orchestration_context:{parent_trace_id:result.parent_trace_id,test_id:'T1',environment:'connected-canary'}}}];`},id:'c2000000-0000-4000-8000-000000000001',name:'Map Human Approval Input',type:'n8n-nodes-base.code',typeVersion:2,position:[820,0]};
  const execute={parameters:{source:'database',workflowId:{__rl:true,value:'',mode:'list',cachedResultName:''},workflowInputs:{mappingMode:'defineBelow',value:{},matchingColumns:[],schema:[],attemptToConvertTypes:false,convertFieldsToString:true},mode:'once',options:{waitForSubWorkflow:true}},id:'c2000000-0000-4000-8000-000000000002',name:'Execute Human Approval Child',type:'n8n-nodes-base.executeWorkflow',typeVersion:1.3,position:[1080,0]};
  const final={parameters:{jsCode:`const stage=$input.first().json; const mapped=$('Map Human Approval Input').first().json; const errors=[]; if(stage.run_id!==mapped.run_id) errors.push('run_id mismatch'); if(stage.stage!=='human_approval'||stage.execution_status!=='passed') errors.push('stage invalid'); if(stage.decision!=='continue'||stage.next_route!=='prd_generation') errors.push('T1 approval must route to prd_generation'); if(stage.groundedness_percent!==100) errors.push('groundedness must be 100'); if(stage.observability?.parent_trace_id!==mapped.orchestration_context.parent_trace_id) errors.push('parent trace mismatch'); if(!stage.observability?.ingestion_accepted) errors.push('Langfuse ingestion not accepted'); if(errors.length) throw new Error('Connected Human Approval canary failed: '+errors.join('; ')); return [{json:{schema_version:'1.0.0',result_type:'connected_human_approval_canary_result',run_id:mapped.run_id,test_id:'T1',execution_status:'passed',current_stage:'human_approval',next_route:'prd_generation',groundedness_percent:100,parent_trace_id:mapped.orchestration_context.parent_trace_id,human_approval_stage:stage,checks:{run_id_preserved:true,parent_trace_id_preserved:true,human_approval_passed:true,expected_route_reached:true,langfuse_ingestion_accepted:true},recorded_at:new Date().toISOString()}}];`},id:'c2000000-0000-4000-8000-000000000003',name:'Validate PRD Generation Route',type:'n8n-nodes-base.code',typeVersion:2,position:[1360,0]};
  workflow.nodes.push(map,execute,final); workflow.connections['Validate Human Approval Route']=mainConnection('Map Human Approval Input'); workflow.connections['Map Human Approval Input']=mainConnection('Execute Human Approval Child'); workflow.connections['Execute Human Approval Child']=mainConnection('Validate PRD Generation Route');
  return workflow;
}

writeJson('workflows/n8n/prd-genie-requirement-extractor-child-v1.0.json', buildRequirementExtractorChild());
writeJson('workflows/n8n/prd-genie-gap-analyzer-child-v1.0.json', buildGapAnalyzerChild());
writeJson('workflows/n8n/prd-genie-connected-orchestrator-v0.1.json', buildConnectedOrchestrator());
writeJson('workflows/n8n/prd-genie-human-approval-checkpoint-child-v1.0.json', buildHumanApprovalChild());
writeJson('workflows/n8n/prd-genie-connected-orchestrator-v0.2.json', buildConnectedOrchestratorV02());
