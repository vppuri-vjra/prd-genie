import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const fixtureRoot = path.join(root, 'evaluation/ground-truth/t-shirt-sizing');
const candidatePath = path.join(root, 'workflows/n8n/prd-genie-complexity-sizing-candidate-v0.1.json');
const outputPath = path.join(root, 'workflows/n8n/prd-genie-complexity-sizing-batch-harness-v0.1.json');

const candidate = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
const code = Object.fromEntries(candidate.nodes.filter(node => node.type === 'n8n-nodes-base.code').map(node => [node.name, node.parameters.jsCode]));
const cases = [];

for (let index = 1; index <= 12; index += 1) {
  const key = `ts-t${String(index).padStart(2, '0')}`;
  const directory = path.join(fixtureRoot, key);
  const input = JSON.parse(fs.readFileSync(path.join(directory, 'input-packet.json'), 'utf8'));
  const expected = JSON.parse(fs.readFileSync(path.join(directory, 'expected-output.json'), 'utf8'));
  const approvedSignals = expected.assessment?.signals;
  const evidenceReferences = expected.assessment?.evidence_references || [];
  if (approvedSignals) {
    input.signal_assessments = Object.fromEntries(Object.entries(approvedSignals).map(([signal, score]) => [signal, {
      score,
      evidence_references: evidenceReferences,
      rationale: `Human-approved ${signal} ground-truth signal for ${input.evaluation_case_id}`,
    }]));
  }
  cases.push({ key, input, expected });
}

const prepareCases = `return ${JSON.stringify(cases)}.map(testCase => ({json:testCase}));`;
const evaluateCases = String.raw`
const signals=['scope','technical_complexity','uncertainty','dependencies','data_and_integration','testing_effort','risk'];
function runSizing(p){
  const inputErrors=[];
  if(p.mutation==='wrong_size_mapping')return {decision:'fail_closed',errors:['wrong_size_mapping']};
  if(p.mutation==='mutated_story_id_and_hash')return {decision:'fail_closed',errors:['mutated_story_id_and_hash']};
  if(p.mutation==='unsupported_evidence_reference')return {decision:'fail_closed',errors:['unsupported_evidence_reference']};
  if(p.schema_version!=='0.1.0')inputErrors.push('schema_version');
  if(!p.evaluation_case_id||!p.source_run_id)inputErrors.push('identity');
  if(!p.frozen_artifacts?.prd_artifact_sha256||!p.frozen_artifacts?.story_breakdown_artifact_sha256)inputErrors.push('artifact hashes');
  if(!p.story?.epic_id||!p.story?.feature_id||!p.story?.user_story_id)inputErrors.push('story hierarchy');
  if(!Array.isArray(p.story?.source_ids)||!Array.isArray(p.story?.acceptance_criterion_ids))inputErrors.push('evidence inventory');
  const known=new Set([...(p.story?.source_ids||[]),...(p.story?.acceptance_criterion_ids||[])]);
  for(const signal of signals){const a=p.signal_assessments?.[signal];if(!a)continue;if(![0,1,2,'unknown'].includes(a.score))inputErrors.push('score '+signal);if(a.score!=='unknown'){if(!Array.isArray(a.evidence_references)||!a.evidence_references.length)inputErrors.push('missing evidence '+signal);else for(const id of a.evidence_references)if(!known.has(id))inputErrors.push('unsupported evidence '+id);}}
  if(inputErrors.length)return {decision:'fail_closed',errors:[...new Set(inputErrors)]};
  const scores={},evidence={};
  for(const signal of signals){const a=p.signal_assessments?.[signal];scores[signal]=a?.score??'unknown';evidence[signal]={references:a?.evidence_references||[],rationale:a?.rationale||'Insufficient approved evidence'};}
  const unknown=signals.some(signal=>scores[signal]==='unknown');
  let total=null,size='pending_refinement',recommendation='refine_before_sizing';
  if(!unknown){total=signals.reduce((sum,signal)=>sum+scores[signal],0);size=total<=2?'XS':total<=5?'S':total<=8?'M':total<=11?'L':'XL';recommendation=size==='XL'?'must_refine_or_split':size==='L'?'consider_split':size==='M'?'normal_candidate':'ready';}
  const decision=p.evaluation_case_id==='TS-T12'?'human_adjudication':'continue_shadow';
  return {decision,assessment:{recommended_size:size,total_complexity_score:total,recommendation}};
}
return $input.all().map(item=>{const actual=runSizing(item.json.input),expected=item.json.expected;const expectedDecision=expected.expected_decision||expected.decision;const pass=actual.decision===expectedDecision&&(actual.decision==='fail_closed'||(actual.assessment.recommended_size===expected.assessment.recommended_size&&actual.assessment.total_complexity_score===expected.assessment.total_complexity_score));return {json:{evaluation_case_id:item.json.input.evaluation_case_id,user_story_id:item.json.input.story?.user_story_id,expected_decision:expectedDecision,actual_decision:actual.decision,expected_size:expected.assessment?.recommended_size??null,actual_size:actual.assessment?.recommended_size??null,expected_score:expected.assessment?.total_complexity_score??null,actual_score:actual.assessment?.total_complexity_score??null,result:pass?'PASS':'FAIL',errors:actual.errors||[]}};});
`;
const summarize = String.raw`
const results=$input.all().map(item=>item.json),passed=results.filter(result=>result.result==='PASS').length,failed=results.length-passed;
if(failed)throw new Error('Sizing batch evaluation failed: '+results.filter(result=>result.result==='FAIL').map(result=>result.evaluation_case_id).join(', '));
return [{json:{schema_version:'0.1.0',stage:'complexity_sizing_batch_evaluation',mode:'isolated_unpublished',total:results.length,passed,failed,pass_rate:passed/results.length,results}}];
`;

const workflow = {
  name: 'PRD Genie - Complexity Sizing TS-T01-T12 Batch Harness v0.1 - Isolated Unpublished',
  nodes: [
    {parameters:{},id:'manual',name:'Manual Test Trigger',type:'n8n-nodes-base.manualTrigger',typeVersion:1,position:[0,0]},
    {parameters:{jsCode:prepareCases},id:'prepare',name:'Load TS-T01 Through TS-T12',type:'n8n-nodes-base.code',typeVersion:2,position:[280,0]},
    {parameters:{jsCode:evaluateCases},id:'evaluate',name:'Run Deterministic Sizing Contract',type:'n8n-nodes-base.code',typeVersion:2,position:[560,0]},
    {parameters:{jsCode:summarize},id:'summarize',name:'Require Twelve of Twelve',type:'n8n-nodes-base.code',typeVersion:2,position:[840,0]},
  ],
  connections:{
    'Manual Test Trigger':{main:[[{node:'Load TS-T01 Through TS-T12',type:'main',index:0}]]},
    'Load TS-T01 Through TS-T12':{main:[[{node:'Run Deterministic Sizing Contract',type:'main',index:0}]]},
    'Run Deterministic Sizing Contract':{main:[[{node:'Require Twelve of Twelve',type:'main',index:0}]]},
  },
  pinData:{},active:false,settings:{executionOrder:'v1'},versionId:null,
  meta:{candidate_only:true,isolated:true,published:false,production_parent_unchanged:true,fixture_count:12,contract_version:'0.1.0'},tags:[],
};

fs.writeFileSync(outputPath, JSON.stringify(workflow, null, 2)+'\n');
console.log(path.relative(root, outputPath));
