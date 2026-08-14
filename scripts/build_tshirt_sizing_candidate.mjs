import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const fixtureRoot = path.join(root, 'evaluation/ground-truth/t-shirt-sizing');
const outputPath = path.join(root, 'workflows/n8n/prd-genie-complexity-sizing-candidate-v0.1.json');
const baseInput = JSON.parse(fs.readFileSync(path.join(fixtureRoot, 'ts-t03/input-packet.json'), 'utf8'));
const expected = JSON.parse(fs.readFileSync(path.join(fixtureRoot, 'ts-t03/expected-output.json'), 'utf8'));
const pinned = {
  ...baseInput,
  signal_assessments: Object.fromEntries(Object.entries(expected.assessment.signals).map(([signal, score]) => [signal, {
    score,
    evidence_references: expected.assessment.evidence_references,
    rationale: `Human-approved ${signal} ground-truth signal for TS-T03`,
  }])),
};

const validateInput = String.raw`
const p=$input.first().json,e=[];
const signals=['scope','technical_complexity','uncertainty','dependencies','data_and_integration','testing_effort','risk'];
if(p.schema_version!=='0.1.0')e.push('schema_version');
if(!p.evaluation_case_id||!p.source_run_id)e.push('identity');
if(!p.frozen_artifacts?.prd_artifact_sha256||!p.frozen_artifacts?.story_breakdown_artifact_sha256)e.push('artifact hashes');
if(!p.story?.epic_id||!p.story?.feature_id||!p.story?.user_story_id)e.push('story hierarchy');
if(!Array.isArray(p.story.source_ids)||!Array.isArray(p.story.acceptance_criterion_ids))e.push('evidence inventory');
const known=new Set([...p.story.source_ids,...p.story.acceptance_criterion_ids]);
for(const signal of signals){const a=p.signal_assessments?.[signal];if(!a)continue;if(![0,1,2,'unknown'].includes(a.score))e.push('score '+signal);if(a.score!=='unknown'){if(!Array.isArray(a.evidence_references)||!a.evidence_references.length)e.push('missing evidence '+signal);else for(const id of a.evidence_references)if(!known.has(id))e.push('unsupported evidence '+id);}}
if(e.length)throw new Error('Sizing input failed closed: '+[...new Set(e)].join('; '));return [{json:p}];
`;

const calculate = String.raw`
const p=$input.first().json,signals=['scope','technical_complexity','uncertainty','dependencies','data_and_integration','testing_effort','risk'],scores={},evidence={},assumptions=[];
for(const signal of signals){const a=p.signal_assessments?.[signal];scores[signal]=a?.score??'unknown';evidence[signal]={references:a?.evidence_references||[],rationale:a?.rationale||'Insufficient approved evidence'};if(a?.assumption)assumptions.push(a.assumption);}
const unknown=signals.filter(s=>scores[s]==='unknown'),numeric=signals.filter(s=>Number.isInteger(scores[s]));
let total=null,size='pending_refinement',recommendation='refine_before_sizing',confidence='Low';
if(!unknown.length){total=numeric.reduce((n,s)=>n+scores[s],0);size=total<=2?'XS':total<=5?'S':total<=8?'M':total<=11?'L':'XL';recommendation=size==='XL'?'must_refine_or_split':size==='L'?'consider_split':size==='M'?'normal_candidate':'ready';confidence='Medium';}
return [{json:{schema_version:'0.1.0',stage:'complexity_sizing',evaluation_case_id:p.evaluation_case_id,source_run_id:p.source_run_id,frozen_artifacts:p.frozen_artifacts,assessment:{user_story_id:p.story.user_story_id,recommended_size:size,total_complexity_score:total,signals:scores,signal_evidence:evidence,assumptions,confidence,sizing_status:'proposed_pending_team_confirmation',recommendation},mode:'shadow'}}];
`;

const validateOutput = String.raw`
const x=$input.first().json,e=[],signals=['scope','technical_complexity','uncertainty','dependencies','data_and_integration','testing_effort','risk'],a=x.assessment;
if(x.stage!=='complexity_sizing'||x.mode!=='shadow')e.push('stage/mode');
if(!a?.user_story_id)e.push('story ID');
for(const s of signals){if(![0,1,2,'unknown'].includes(a.signals?.[s]))e.push('signal '+s);if(a.signals?.[s]!=='unknown'&&!a.signal_evidence?.[s]?.references?.length)e.push('evidence '+s);}
const unknown=signals.some(s=>a.signals[s]==='unknown');
if(unknown){if(a.recommended_size!=='pending_refinement'||a.total_complexity_score!==null||a.recommendation!=='refine_before_sizing')e.push('unknown fail-closed policy');}
else{const total=signals.reduce((n,s)=>n+a.signals[s],0),size=total<=2?'XS':total<=5?'S':total<=8?'M':total<=11?'L':'XL';if(a.total_complexity_score!==total)e.push('arithmetic');if(a.recommended_size!==size)e.push('size mapping');if(size==='XL'&&a.recommendation!=='must_refine_or_split')e.push('XL policy');}
if(e.length)throw new Error('Sizing output failed closed: '+e.join('; '));return [{json:{...x,deterministic_validation:{passed:true,controls:['schema','story_identity','artifact_hash_presence','signal_domain','evidence_presence','unknown_fail_closed','arithmetic','score_to_size_mapping','XL_policy']}}}];
`;

const workflow = {
  name: 'PRD Genie - Complexity Sizing Candidate v0.1 - Isolated Unpublished',
  nodes: [
    {parameters:{inputSource:'passthrough'},id:'trigger',name:'When Executed by Connected Parent',type:'n8n-nodes-base.executeWorkflowTrigger',typeVersion:1.1,position:[0,0]},
    {parameters:{jsCode:validateInput},id:'validate-input',name:'Validate Frozen Sizing Input',type:'n8n-nodes-base.code',typeVersion:2,position:[280,0]},
    {parameters:{jsCode:calculate},id:'calculate',name:'Calculate Evidence-Backed Size',type:'n8n-nodes-base.code',typeVersion:2,position:[560,0]},
    {parameters:{jsCode:validateOutput},id:'validate-output',name:'Deterministic Sizing Validator',type:'n8n-nodes-base.code',typeVersion:2,position:[840,0]},
    {parameters:{jsCode:"const x=$input.first().json;return [{json:{...x,decision:'continue_shadow',next_route:'human_team_confirmation'}}];"},id:'return',name:'Return Proposed Sizing',type:'n8n-nodes-base.code',typeVersion:2,position:[1120,0]},
  ],
  connections: {
    'When Executed by Connected Parent':{main:[[{node:'Validate Frozen Sizing Input',type:'main',index:0}]]},
    'Validate Frozen Sizing Input':{main:[[{node:'Calculate Evidence-Backed Size',type:'main',index:0}]]},
    'Calculate Evidence-Backed Size':{main:[[{node:'Deterministic Sizing Validator',type:'main',index:0}]]},
    'Deterministic Sizing Validator':{main:[[{node:'Return Proposed Sizing',type:'main',index:0}]]},
  },
  pinData:{'When Executed by Connected Parent':[{json:pinned}]},
  active:false,
  settings:{executionOrder:'v1'},
  versionId:null,
  meta:{candidate_only:true,isolated:true,published:false,production_parent_unchanged:true,agreement_gate:'shadow',contract_version:'0.1.0'},
  tags:[],
};

fs.writeFileSync(outputPath, JSON.stringify(workflow, null, 2)+'\n');
console.log(path.relative(root, outputPath));
