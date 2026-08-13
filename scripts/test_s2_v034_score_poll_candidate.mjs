import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=path.resolve(import.meta.dirname,'..');
const workflow=JSON.parse(fs.readFileSync(path.join(root,'workflows/n8n/prd-genie-s2-main-orchestrator-v0.3.4-score-poll-candidate.json'),'utf8'));
const code=name=>workflow.nodes.find(node=>node.name===name)?.parameters?.jsCode;
for(const name of ['Prepare Score Poll Attempt','Scores Complete Path','Retry Poll Path','Polling Timeout Path','Production Agreement Gate v0.3 - Enforced','Release Authorized Path','Hold for Human Review Path'])if(!code(name))throw new Error('Missing '+name);
const run=async(name,input)=>{const result=await new vm.Script(`(async()=>{${code(name)}})()`).runInNewContext({$input:{first:()=>({json:input})},Date});return result.map(item=>item.json);};
let current={evaluation_poll:{attempt:0,max_attempts:2}};
current=(await run('Prepare Score Poll Attempt',current))[0];
if(current.evaluation_poll.attempt!==1||current.evaluation_poll.max_attempts!==18||current.evaluation_poll.interval_seconds!==10)throw new Error('Canary did not own the bounded poll policy');
for(let attempt=1;attempt<18;attempt++){
 if((await run('Polling Timeout Path',current)).length!==0)throw new Error('Timed out before attempt 18');
 current=(await run('Prepare Score Poll Attempt',current))[0];
}
if((await run('Retry Poll Path',current)).length!==0)throw new Error('Retry continued after attempt 18');
if((await run('Polling Timeout Path',current)).length!==1)throw new Error('Did not fail closed at attempt 18');
const complete={...current,evaluation_poll:{...current.evaluation_poll,score_complete:true}};
if((await run('Scores Complete Path',complete)).length!==1||(await run('Polling Timeout Path',complete)).length!==0)throw new Error('Complete scores did not bypass timeout');
const evaluatorFailure={execution_status:'passed',validation:{unsupported_claims:0,orphan_delivery_items:0},evaluation_scores:{langfuse_code:false,llm_faithfulness:1,llm_hallucination:0.03}};
const gatedFailure=(await run('Production Agreement Gate v0.3 - Enforced',evaluatorFailure))[0];
if(gatedFailure.production_loop.release_authorized!==false||gatedFailure.agreement_gate.decision!=='disagreement')throw new Error('Code-evaluator failure did not fail closed');
if((await run('Release Authorized Path',gatedFailure)).length!==0||(await run('Hold for Human Review Path',gatedFailure)).length!==1)throw new Error('Code-evaluator failure reached the release branch');
const evaluatorPass={...evaluatorFailure,evaluation_scores:{langfuse_code:true,llm_faithfulness:1,llm_hallucination:0.03}};
const gatedPass=(await run('Production Agreement Gate v0.3 - Enforced',evaluatorPass))[0];
if(gatedPass.production_loop.release_authorized!==true||gatedPass.agreement_gate.decision!=='agreement')throw new Error('Complete evaluator agreement did not authorize release');
if((await run('Release Authorized Path',gatedPass)).length!==1||(await run('Hold for Human Review Path',gatedPass)).length!==0)throw new Error('Complete evaluator agreement did not reach only the release branch');
console.log(JSON.stringify({result:'PASS',max_attempts:18,interval_seconds:10,timeout_seconds:180,fail_closed:true,code_failure_route:'hold_for_human_review',complete_agreement_route:'release'},null,2));
