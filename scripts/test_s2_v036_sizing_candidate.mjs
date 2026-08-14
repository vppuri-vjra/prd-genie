import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=path.resolve(import.meta.dirname,'..');
const read=name=>JSON.parse(fs.readFileSync(path.join(root,'workflows/n8n',name),'utf8'));
const sizing=read('prd-genie-s2-production-sizing-v0.1-nonblocking-candidate.json');
const parent=read('prd-genie-s2-main-orchestrator-v0.3.6-sizing-candidate.json');
const code=(workflow,name)=>workflow.nodes.find(n=>n.name===name).parameters.jsCode;
const run=async(js,input,extra={})=>(await new vm.Script(`(async()=>{${js}})()`).runInNewContext({$input:{first:()=>({json:input})},...extra}))[0].json;
const feature=(title,stories)=>({title,stories:stories.map(([storyTitle,source,priority])=>({title:storyTitle,item_ids:[source],priority}))});
const story={run_id:'RUN-S2-V036-TEST',epics:[
  {title:'Analytics Insights and Discovery',features:[feature('Dashboard Insights',[['Display five core metrics','FR-001','Should Have']]),feature('Report Filtering',[['Preset and custom date-range filtering','FR-002','Should Have']]),feature('Controlled Data Refresh',[['15-minute automatic refresh','FR-006','Unspecified'],['Manual refresh of latest precomputed data','FR-006','Unspecified'],['Display last-updated timestamp','FR-006','Unspecified'],['Protect against excessive repeated requests','FR-006','Unspecified']])]},
  {title:'Secure and Accessible Experience',features:[feature('Role-Based Access',[['Executive access to all data','FR-003','Must Have'],['Team-lead access to team data only','FR-003','Must Have']]),feature('Responsive Web Access',[['Responsive web access completed before production launch','NFR-003','Must Have']])]},
  {title:'Reporting and Export',features:[feature('PDF Reporting',[['Export monthly board reports to PDF','FR-004','Must Have']]),feature('Excel Export',[['Export XLSX with formulas preserved and approved label','FR-005','Unspecified']])]},
],story_markdown:'## Scope and Priority Summary\n\n| Epic # | Epic | Feature | User-story scope | Priority | Source |\n|---:|---|---|---|---|---|\n\n## Detailed Delivery Hierarchy'};
assert.equal(story.epics.length,3);
assert.equal(story.epics.flatMap(e=>e.features).length,7);
assert.equal(story.epics.flatMap(e=>e.features).flatMap(f=>f.stories).length,11);
const sized=await run(code(sizing,'Generate Non-Blocking Proposed Sizes'),story);
const valid=await run(code(sizing,'Validate Proposed Sizing Artifact'),sized);
assert.equal(valid.sizing.production_blocking,false);
assert.equal(valid.sizing.rows.length,11);
assert.equal(JSON.stringify(valid.sizing.counts),JSON.stringify({XS:1,S:1,M:3,L:1,XL:1,'Pending refinement':4}));
assert.equal(valid.sizing.refinements.length,4);
assert.ok(valid.sizing_review_export.content.includes('| Epic # | Epic | Feature | Source | User-story scope | Priority | Proposed Size | Confidence |'));
assert.ok(valid.sizing_review_export.content.includes('| Epic # | User Story # | Source | User Story | Missing or unresolved sizing information | Next action |'));
assert.ok(!valid.sizing_review_export.content.includes('| Recommendation |'));
assert.ok(valid.story_markdown.includes('Proposed Size'));
assert.ok(valid.epics.flatMap(e=>e.features).flatMap(f=>f.stories).every(s=>s.complexity_sizing?.production_blocking===false));
assert.equal(parent.active,false);
assert.equal(parent.id,undefined);
assert.equal(parent.meta.sizing_included,true);
assert.equal(parent.meta.delivered_files,7);
assert.equal(parent.nodes.find(n=>n.name==='Execute Non-Blocking Sizing v0.2').onError,'continueRegularOutput');
assert.ok(code(parent,'Prepare Validated Drive Exports').includes('sizing_review_export'));
assert.ok(code(parent,'Prepare Validated Drive Exports').includes('sizing:final.sizing'));
assert.ok(code(parent,'Confirm Validated Drive Delivery').includes('uploaded.length!==7'));
assert.ok(code(parent,'Confirm Validated Drive Delivery').includes('Proposed T-Shirt Sizing Review'));
assert.equal(parent.connections['Execute Final Validator v0.1'].main[0][0].node,'Execute Non-Blocking Sizing v0.2');
assert.equal(parent.connections['Normalize Non-Blocking Sizing Result'].main[0][0].node,'Return Connected Production Result');
for(const node of [...sizing.nodes,...parent.nodes].filter(n=>n.parameters?.jsCode)) new vm.Script(`(async()=>{${node.parameters.jsCode}})()`);
const fallback=await run(code(parent,'Normalize Non-Blocking Sizing Result'),{error:'sizing unavailable'},{$:()=>({first:()=>({json:story})})});
assert.equal(fallback.sizing.mode,'non_blocking_fallback');
assert.equal(fallback.sizing.rows.length,11);
console.log(JSON.stringify({result:'PASS',candidate:'v0.3.6',stories_sized:11,distribution:valid.sizing.counts,refinement_items:4,delivery_files:7,production_blocking:false,production_state_changed:false},null,2));
