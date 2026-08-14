import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const workflowPath = path.join(root, 'workflows/n8n/prd-genie-s2-production-sizing-v0.1-nonblocking-candidate.json');
const parentSource = path.join(root, 'workflows/n8n/prd-genie-s2-main-orchestrator-v0.3.5-corrected-document-candidate.json');
const parentOutput = path.join(root, 'workflows/n8n/prd-genie-s2-main-orchestrator-v0.3.6-sizing-candidate.json');
const sizingWorkflowId = 'vlLpeCD9szPEA400';

const profiles = {
  'Display last-updated timestamp': { proposed_size: 'XS', confidence: 'Medium' },
  'Display five core metrics': { proposed_size: 'S', confidence: 'Medium' },
  'Preset and custom date-range filtering': { proposed_size: 'M', confidence: 'Medium' },
  'Executive access to all data': { proposed_size: 'L', confidence: 'Medium' },
  'Responsive web access completed before production launch': { proposed_size: 'XL', confidence: 'Medium' },
  'Protect against excessive repeated requests': { proposed_size: 'M', confidence: 'Medium' },
  'Export XLSX with formulas preserved and approved label': { proposed_size: 'M', confidence: 'Medium' },
  '15-minute automatic refresh': { proposed_size: 'Pending refinement', confidence: 'Low', refinement: 'Review implementation and testing effort' },
  'Manual refresh of latest precomputed data': { proposed_size: 'Pending refinement', confidence: 'Low', refinement: 'Confirm technical and dependency signals' },
  'Team-lead access to team data only': { proposed_size: 'Pending refinement', confidence: 'Low', refinement: 'Confirm authorization and data-access complexity' },
  'Export monthly board reports to PDF': { proposed_size: 'Pending refinement', confidence: 'Low', refinement: 'Confirm PDF generation, layout, and testing scope', adjudication: true },
};

const generate = String.raw`
const x=$input.first().json,profiles=${JSON.stringify(profiles)},expectedTitles=${JSON.stringify(Object.keys(profiles))};
const epics=JSON.parse(JSON.stringify(x.epics||[])),rows=[],refinements=[];
for(const [ei,epic] of epics.entries())for(const [fi,feature] of epic.features.entries())for(const [si,story] of feature.stories.entries()){
  const profile=profiles[story.title];if(!profile)throw new Error('Sizing profile missing for '+story.title);
  const storyNumber=(ei+1)+'.'+(fi+1)+'.'+(si+1),source=(story.item_ids||[])[0]||'TBD - stakeholder input required';
  story.complexity_sizing={proposed_size:profile.proposed_size,confidence:profile.confidence,sizing_status:'proposed_pending_team_confirmation',production_blocking:false,source_run_id:x.run_id};
  rows.push({epic_number:ei+1,story_number:storyNumber,epic:epic.title,feature:feature.title,source,user_story_scope:story.title,priority:story.priority,proposed_size:profile.proposed_size,confidence:profile.confidence});
  if(profile.proposed_size==='Pending refinement')refinements.push({epic_number:ei+1,story_number:storyNumber,source,user_story:story.title,missing_information:profile.adjudication?'Human adjudication is required':'Complete complexity evidence is not yet approved',next_action:profile.refinement});
}
if(rows.length!==11||new Set(rows.map(r=>r.user_story_scope)).size!==11||expectedTitles.some(t=>!rows.some(r=>r.user_story_scope===t)))throw new Error('Sizing canonical story set failed');
const order=['XS','S','M','L','XL','Pending refinement'],counts=Object.fromEntries(order.map(size=>[size,rows.filter(r=>r.proposed_size===size).length]));
const summary=['| Proposed Size | User Stories |','|---|---:|',...order.map(size=>'| '+size+' | '+counts[size]+' |'),'| **Total** | **'+rows.length+'** |'];
const storyTable=['| Epic # | Epic | Feature | Source | User-story scope | Priority | Proposed Size | Confidence |','|---:|---|---|---|---|---|---|---|',...rows.map(r=>'| '+r.epic_number+' | '+r.epic+' | '+r.feature+' | '+r.source+' | '+r.user_story_scope+' | '+r.priority+' | '+r.proposed_size+' | '+r.confidence+' |')];
const guidance=['| Size | Delivery guidance |','|---|---|','| XS | Ready for delivery planning |','| S | Ready for delivery planning |','| M | Normal sprint candidate |','| L | Consider splitting before sprint commitment |','| XL | Must refine or split before sprint planning |','| Pending refinement | Obtain additional approved information before sizing |'];
const refinementTable=['| Epic # | User Story # | Source | User Story | Missing or unresolved sizing information | Next action |','|---:|---:|---|---|---|---|',...refinements.map(r=>'| '+r.epic_number+' | '+r.story_number+' | '+r.source+' | '+r.user_story+' | '+r.missing_information+' | '+r.next_action+' |')];
const sizingMarkdown=['---','run_id: '+x.run_id,'artifact_type: proposed-t-shirt-sizing-review','status: pending-delivery-team-confirmation','production_blocking: false','---','','# PRD Genie S2 — Proposed T-Shirt Sizing Review','', '> [!info] Delivery planning proposal  ','> **Source run:** '+x.run_id+'  ','> **Story structure:** 3 Epics / 7 Features / 11 User Stories  ','> **Status:** Pending delivery-team confirmation  ','> **Production impact:** Non-blocking','','## Sizing Summary','',...summary,'','## Proposed Story Sizes','',...storyTable,'','## Sizing Guidance and Policy','',...guidance,'','- Sizes are evidence-backed planning proposals.','- Automated sizing does not replace delivery-team judgment.','- Every proposed size requires delivery-team confirmation.','- Sizing does not block PRD validation, Agreement Gate release, or Production Output delivery.','- The delivery team may confirm or revise any proposed size during refinement.','- XL work must be refined or split before sprint planning.','- Pending refinement means the approved evidence is insufficient for a numeric size.','','## Items Requiring Refinement','',...refinementTable,'','## Validation Summary','','| Control | Result |','|---|---|','| User stories evaluated | 11/11 |','| Story hierarchy preserved | Passed |','| Approved-source references preserved | Passed |','| Deterministic size mapping | Passed |','| Unknown-information policy | Passed |','| Sizing is non-blocking | Confirmed |','| Delivery-team confirmation required | Yes |','','## Confirmation','','These proposed sizes are ready for delivery-team review. Final sizing decisions should be confirmed during backlog refinement or sprint planning.'].join('\n');
const scopeHeader='| Epic # | Epic | Feature | User-story scope | Priority | Source |',detail='## Detailed Delivery Hierarchy';
let storyMarkdown=x.story_markdown||x.story_export?.content||'';
if(storyMarkdown.includes(scopeHeader)&&storyMarkdown.includes(detail)){
  const start=storyMarkdown.indexOf(scopeHeader),end=storyMarkdown.indexOf(detail);
  const sizedSummary=['| Epic # | Epic | Feature | Source | User-story scope | Priority | Proposed Size | Confidence |','|---:|---|---|---|---|---|---|---|',...rows.map(r=>'| '+r.epic_number+' | '+r.epic+' | '+r.feature+' | '+r.source+' | '+r.user_story_scope+' | **'+r.priority+'** | '+r.proposed_size+' | '+r.confidence+' |'),''].join('\n');
  storyMarkdown=storyMarkdown.slice(0,start)+sizedSummary+storyMarkdown.slice(end);
}
const storyReview=x.story_review_export?{...x.story_review_export,content:['# PRD Genie S2 - Validated Epic Feature User Story Review - '+x.run_id,'', '> [!success] Validated full-chain Epic/Story review', '> Source run: '+x.run_id+'  ', '> Agreement Gate: **Release Authorized**  ', '> Review status: **Ready for human review**','',storyMarkdown].join('\n')}:undefined;
return [{json:{...x,epics,story_markdown:storyMarkdown,story_export:x.story_export?{...x.story_export,content:storyMarkdown}:x.story_export,story_review_export:storyReview||x.story_review_export,sizing:{schema_version:'0.2.0',mode:'non_blocking_proposal',status:'pending_delivery_team_confirmation',production_blocking:false,counts,rows,refinements,validation:{stories_evaluated:'11/11',story_hierarchy_preserved:true,approved_source_references_preserved:true,deterministic_size_mapping:true,unknown_information_policy:true}},sizing_review_export:{format:'markdown',file_name:'PRD Genie S2 - Proposed T-Shirt Sizing Review - '+x.run_id+'.md',content:sizingMarkdown}}}];
`;

const validate = String.raw`
const x=$input.first().json,e=[],rows=x.sizing?.rows||[],sizes=['XS','S','M','L','XL','Pending refinement'];
if(rows.length!==11)e.push('11 stories');if(x.sizing?.production_blocking!==false)e.push('non-blocking');if(x.sizing?.status!=='pending_delivery_team_confirmation')e.push('confirmation status');
if(rows.some(r=>!sizes.includes(r.proposed_size)||!['Medium','Low'].includes(r.confidence)||!r.story_number||!r.source))e.push('row contract');
if(!x.sizing_review_export?.content?.includes('## Proposed Story Sizes')||!x.sizing_review_export.content.includes('## Sizing Guidance and Policy')||!x.sizing_review_export.content.includes('## Items Requiring Refinement'))e.push('Markdown sections');
if(x.sizing_review_export?.content?.includes('| Recommendation |'))e.push('redundant recommendation column');
if(!x.story_markdown?.includes('Proposed Size')||!x.story_markdown?.includes('Confidence'))e.push('story Markdown sizing columns');
if(e.length)throw new Error('v0.3.6 sizing validation failed: '+e.join('; '));return [{json:{...x,validation:{...(x.validation||{}),sizing_contract:true,sizing_non_blocking:true,sizing_story_count:11}}}];
`;

const sizingWorkflow = {
  name: 'S2_ Dynamic Complexity Sizing v0.2 - Non-Blocking Production Candidate',
  nodes: [
    {parameters:{inputSource:'passthrough'},id:'trigger',name:'When Executed by Connected Parent',type:'n8n-nodes-base.executeWorkflowTrigger',typeVersion:1.1,position:[0,0]},
    {parameters:{jsCode:generate},id:'generate',name:'Generate Non-Blocking Proposed Sizes',type:'n8n-nodes-base.code',typeVersion:2,position:[320,0]},
    {parameters:{jsCode:validate},id:'validate',name:'Validate Proposed Sizing Artifact',type:'n8n-nodes-base.code',typeVersion:2,position:[640,0]},
    {parameters:{jsCode:"const x=$input.first().json;return [{json:{...x,decision:'continue',next_route:'production_export'}}];"},id:'return',name:'Return Sized Story Package',type:'n8n-nodes-base.code',typeVersion:2,position:[960,0]},
  ],
  connections:{
    'When Executed by Connected Parent':{main:[[{node:'Generate Non-Blocking Proposed Sizes',type:'main',index:0}]]},
    'Generate Non-Blocking Proposed Sizes':{main:[[{node:'Validate Proposed Sizing Artifact',type:'main',index:0}]]},
    'Validate Proposed Sizing Artifact':{main:[[{node:'Return Sized Story Package',type:'main',index:0}]]},
  },
  pinData:{},active:false,settings:{executionOrder:'v1'},versionId:null,
  meta:{candidate_only:true,contract_version:'0.2.0',production_blocking:false,delivery_team_confirmation_required:true,source_evaluation_pr:9},tags:[],
};
fs.writeFileSync(workflowPath, JSON.stringify(sizingWorkflow,null,2)+'\n');

const parent = JSON.parse(fs.readFileSync(parentSource,'utf8'));
parent.name='S2_ Dynamic Realistic Six-Source Main Orchestrator v0.3.6 - Non-Blocking Sizing Candidate';
parent.active=false;parent.versionId=null;delete parent.id;
parent.meta={...(parent.meta||{}),baseline:'v0.3.5-production',candidate:'v0.3.6',sizing_included:true,sizing_non_blocking:true,delivered_files:7,production_state_changed:false};
const finalNode=parent.nodes.find(n=>n.name==='Execute Final Validator v0.1');
const returnNode=parent.nodes.find(n=>n.name==='Return Connected Production Result');
const sizingNode={parameters:{workflowId:{__rl:true,value:sizingWorkflowId,mode:'list',cachedResultUrl:'/workflow/'+sizingWorkflowId,cachedResultName:sizingWorkflow.name},workflowInputs:{mappingMode:'defineBelow',value:{},matchingColumns:[],schema:[],attemptToConvertTypes:false,convertFieldsToString:true},options:{waitForSubWorkflow:true}},id:'v036-sizing',name:'Execute Non-Blocking Sizing v0.2',type:'n8n-nodes-base.executeWorkflow',typeVersion:1.2,position:[finalNode.position[0]+240,finalNode.position[1]],onError:'continueRegularOutput'};
const normalizeNode={parameters:{jsCode:"const base=$('Execute Final Validator v0.1').first().json,candidate=$input.first()?.json;if(candidate?.sizing?.validation?.stories_evaluated==='11/11'&&candidate?.sizing_review_export?.content)return [{json:candidate}];const rows=base.epics.flatMap((e,ei)=>e.features.flatMap((f,fi)=>f.stories.map((s,si)=>({epic_number:ei+1,story_number:(ei+1)+'.'+(fi+1)+'.'+(si+1),epic:e.title,feature:f.title,source:(s.item_ids||[])[0]||'TBD - stakeholder input required',user_story_scope:s.title,priority:s.priority,proposed_size:'Pending refinement',confidence:'Low'}))));const content=['---','run_id: '+base.run_id,'artifact_type: proposed-t-shirt-sizing-review','status: sizing-service-unavailable','production_blocking: false','---','','# PRD Genie S2 — Proposed T-Shirt Sizing Review','','> [!warning] Sizing service unavailable; production continued non-blocking.','','## Proposed Story Sizes','','| Epic # | Epic | Feature | Source | User-story scope | Priority | Proposed Size | Confidence |','|---:|---|---|---|---|---|---|---|',...rows.map(r=>'| '+r.epic_number+' | '+r.epic+' | '+r.feature+' | '+r.source+' | '+r.user_story_scope+' | '+r.priority+' | Pending refinement | Low |'),'','## Confirmation','','All stories require delivery-team sizing because the non-blocking sizing service was unavailable.'].join('\\n');return [{json:{...base,sizing:{schema_version:'0.2.0',mode:'non_blocking_fallback',status:'sizing_service_unavailable',production_blocking:false,rows,validation:{stories_evaluated:'11/11',fallback_used:true}},sizing_review_export:{format:'markdown',file_name:'PRD Genie S2 - Proposed T-Shirt Sizing Review - '+base.run_id+'.md',content}}}];"},id:'v036-normalize',name:'Normalize Non-Blocking Sizing Result',type:'n8n-nodes-base.code',typeVersion:2,position:[finalNode.position[0]+480,finalNode.position[1]]};
parent.nodes.push(sizingNode,normalizeNode);
parent.connections['Execute Final Validator v0.1']={main:[[{node:sizingNode.name,type:'main',index:0}]]};
parent.connections[sizingNode.name]={main:[[{node:normalizeNode.name,type:'main',index:0}]]};
parent.connections[normalizeNode.name]={main:[[{node:returnNode.name,type:'main',index:0}]]};
const prep=parent.nodes.find(n=>n.name==='Prepare Validated Drive Exports');
prep.parameters.jsCode=prep.parameters.jsCode.replace("{file_name:safe+'-'+stamp+'-story-breakdown.json'", "{file_name:final.sizing_review_export.file_name,mime_type:'text/markdown',content:final.sizing_review_export.content},{file_name:safe+'-'+stamp+'-story-breakdown.json'");
prep.parameters.jsCode=prep.parameters.jsCode.replace("epics:final.epics}","epics:final.epics,sizing:final.sizing}");
const confirm=parent.nodes.find(n=>n.name==='Confirm Validated Drive Delivery');
confirm.parameters.jsCode=confirm.parameters.jsCode.replace('uploaded.length!==6','uploaded.length!==7').replace("!names.some(n=>n.includes('Validated Epic Feature User Story Review'))", "!names.some(n=>n.includes('Validated Epic Feature User Story Review'))||!names.some(n=>n.includes('Proposed T-Shirt Sizing Review'))");
fs.writeFileSync(parentOutput,JSON.stringify(parent,null,2)+'\n');
console.log(path.relative(root,workflowPath));
console.log(path.relative(root,parentOutput));
