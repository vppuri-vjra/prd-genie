import fs from 'node:fs';

const root=new URL('../',import.meta.url);
const read=p=>JSON.parse(fs.readFileSync(new URL(p,root),'utf8'));
const write=(p,v)=>fs.writeFileSync(new URL(p,root),JSON.stringify(v,null,2)+'\n');

// Rebuild the canonical JSON/Markdown and deterministic v0.1 evidence artifact.
await import('./build_realistic_v4_story_breakdown.mjs');

const workflow=read('workflows/n8n/prd-genie-realistic-v4-story-breakdown-child-v0.1.json');
workflow.name='PRD Genie - Realistic v4 Story Breakdown Child v0.2';
workflow.versionId='a8417c04-9725-4c5d-8f46-8ec5eebce002';

const validator=workflow.nodes.find(n=>n.name==='Build and Validate Deterministic Breakdown');
validator.parameters.jsCode=`const x=$input.first().json,b=x.expected_breakdown,e=[];
const epicIds=b.epics.map(ep=>ep.id);
const features=b.epics.flatMap(ep=>ep.features);
const featureIds=features.map(f=>f.id);
const stories=features.flatMap(f=>f.stories);
const storyIds=stories.map(s=>s.id);
const criteria=stories.flatMap(s=>s.acceptance_criteria);
const criterionIds=criteria.map(a=>a.id);
const duplicates=ids=>ids.length!==new Set(ids).size;
if(duplicates(epicIds))e.push('duplicate Epic IDs');
if(duplicates(featureIds))e.push('duplicate Feature IDs');
if(duplicates(storyIds))e.push('duplicate User Story IDs');
if(duplicates(criterionIds))e.push('duplicate Acceptance Criterion IDs');
for(const s of stories)if(!s.source_refs?.length||!s.acceptance_criteria?.length)e.push('incomplete '+s.id);
if(b.epics.length!==3||features.length!==4||stories.length!==7||criteria.length!==12)e.push('canonical counts');
if(b.coverage_ledger.length!==19||new Set(b.coverage_ledger.map(c=>c.approved_item_id)).size!==19)e.push('coverage');
if(b.scope_dispositions.some(d=>d.active_delivery_scope))e.push('active non-delivery scope');
if(b.validation?.orphan_items!==0||b.validation?.groundedness_percent!==100||b.validation?.unsupported_claims!==0)e.push('acceptance status');
if(e.length)throw new Error('Breakdown validation failed closed: '+e.join('; '));
return [{json:x}];`;

write('workflows/n8n/prd-genie-realistic-v4-story-breakdown-child-v0.2.json',workflow);
console.log(JSON.stringify({workflow:workflow.name,nodes:workflow.nodes.length,connections:Object.keys(workflow.connections).length,trigger:workflow.nodes[0].parameters},null,2));
