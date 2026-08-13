import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const source=process.argv[2];
if(!source)throw new Error('Usage: node scripts/build_s2_v034_score_poll_candidate.mjs <v0.3.4-export.json>');
const workflow=JSON.parse(fs.readFileSync(source,'utf8'));
const node=name=>{const found=workflow.nodes.find(candidate=>candidate.name===name);if(!found)throw new Error('Missing node: '+name);return found;};

workflow.name='S2_ Dynamic Realistic Six-Source Main Orchestrator v0.3.4 - Official PRD and Story Canary';
workflow.active=false;
workflow.versionId=null;
workflow.meta={...(workflow.meta||{}),candidate_only:true,production_parent_unchanged:'v0.3.3',score_poll_policy:'18 attempts x 10 seconds; fail closed'};

node('Prepare Score Poll Attempt').parameters.jsCode=`const x=$input.first().json;
const previous=Number(x.evaluation_poll?.attempt??0);
const maxAttempts=18;
return [{json:{...x,evaluation_poll:{...(x.evaluation_poll??{}),attempt:previous+1,max_attempts:maxAttempts,interval_seconds:10,started_at:x.evaluation_poll?.started_at??new Date().toISOString(),status:'polling'}}}];`;

const output=path.join(root,'workflows/n8n/prd-genie-s2-main-orchestrator-v0.3.4-score-poll-candidate.json');
fs.writeFileSync(output,JSON.stringify(workflow,null,2)+'\n');
console.log(path.relative(root,output));
