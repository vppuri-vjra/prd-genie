import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const source = path.join(root, 'workflows/n8n/prd-genie-s2-main-orchestrator-v0.3.4-score-poll-candidate.json');
const workflow = JSON.parse(fs.readFileSync(source, 'utf8'));

const replacements = {
  'Execute Production PRD v0.1': {
    id: '1WXsLji7nKcZ9h19',
    name: 'S2_ Dynamic Production PRD v0.2.1 - Official Template Langfuse Candidate',
  },
  'Execute Story Breakdown v0.2': {
    id: 'L9fOL3BCH5hpsVGv',
    name: 'S2_ Dynamic Story Breakdown v0.2.5 - Corrected Structure Langfuse Callable Candidate',
  },
  'Execute Final Validator v0.1': {
    id: '9mWVW58xe4mxcYZg',
    name: 'S2_ Dynamic Final Validator and Export v0.3 - Full Markdown Candidate',
  },
};

for (const [nodeName, replacement] of Object.entries(replacements)) {
  const node = workflow.nodes.find(candidate => candidate.name === nodeName);
  if (!node) throw new Error(`Missing node: ${nodeName}`);
  const reference = node.parameters?.workflowId;
  if (!reference || typeof reference !== 'object') throw new Error(`Missing workflow reference: ${nodeName}`);
  reference.value = replacement.id;
  reference.cachedResultUrl = `/workflow/${replacement.id}`;
  reference.cachedResultName = replacement.name;
}

const prepareExports = workflow.nodes.find(candidate => candidate.name === 'Prepare Validated Drive Exports');
if (!prepareExports) throw new Error('Missing Prepare Validated Drive Exports');
prepareExports.parameters.jsCode = `const final=$input.first().json;if(final.execution_status!=='passed'||final.validation?.groundedness_percent!==100||final.validation?.unsupported_claims!==0||final.validation?.review_markdown_generated!==true||Object.entries(final.validation).some(([k,v])=>k.startsWith('orphan_')&&v!==0))throw new Error('S2 Drive export blocked');const safe=final.run_id.replace(/[^A-Za-z0-9._-]/g,'-'),stamp=new Date().toISOString().replace(/[:.]/g,'-'),summary={run_id:final.run_id,starting_point:{input_documents:final.reconciliation.source_documents,citations:final.reconciliation.citations_indexed},ending_point:final.counts,reconciliation:final.reconciliation,groundedness_percent:100,unsupported_claims:0},story_breakdown={schema_version:'2.0.0',artifact_type:'story_breakdown',run_id:final.run_id,packet_id:final.packet_id,parent_trace_id:final.parent_trace_id,source_manifest:final.source_packet.sources.map(s=>({source_id:s.source_id,source_name:s.source_name,source_hash:s.source_hash,drive_file_id:s.provenance?.drive_file_id})),counts:final.counts,validation:final.validation,epics:final.epics},files=[{file_name:safe+'-'+stamp+'-run-summary.json',mime_type:'application/json',content:JSON.stringify(summary,null,2)},{file_name:safe+'-'+stamp+'-final-prd.md',mime_type:'text/markdown',content:final.final_export.content},{file_name:final.prd_review_export.file_name,mime_type:'text/markdown',content:final.prd_review_export.content},{file_name:final.story_review_export.file_name,mime_type:'text/markdown',content:final.story_review_export.content},{file_name:safe+'-'+stamp+'-story-breakdown.json',mime_type:'application/json',content:JSON.stringify(story_breakdown,null,2)},{file_name:safe+'-'+stamp+'-traceability.json',mime_type:'application/json',content:JSON.stringify({source_packet:final.source_packet,citation_dispositions:final.citation_dispositions,item_dispositions:final.item_dispositions,prd_elements:final.prd_elements,epics:final.epics,reconciliation:final.reconciliation},null,2)}];return files.map(f=>({json:{run_id:final.run_id,file_name:f.file_name,mime_type:f.mime_type,output_folder_id:'1DoTRyMj2ucxkD3B8_Oq5fc02TfS0rvVp',run_summary:summary},binary:{data:{data:Buffer.from(f.content,'utf8').toString('base64'),mimeType:f.mime_type,fileName:f.file_name}}}));`;

const confirmDelivery = workflow.nodes.find(candidate => candidate.name === 'Confirm Validated Drive Delivery');
if (!confirmDelivery) throw new Error('Missing Confirm Validated Drive Delivery');
confirmDelivery.parameters.jsCode = `const uploaded=$input.all(),final=$('Return Connected Production Result').first().json,names=uploaded.map(i=>String(i.json.name||''));if(uploaded.length!==6||uploaded.some(i=>!i.json.id&&!i.json.webViewLink)||!names.some(n=>n.endsWith('-story-breakdown.json'))||!names.some(n=>n.includes('Validated Full PRD Review'))||!names.some(n=>n.includes('Validated Epic Feature User Story Review')))throw new Error('S2 Drive delivery confirmation failed');return [{json:{...final,drive_delivery:{status:'passed',folder_id:'1DoTRyMj2ucxkD3B8_Oq5fc02TfS0rvVp',file_count:uploaded.length,files:uploaded.map(i=>({id:i.json.id,name:i.json.name,webViewLink:i.json.webViewLink}))}}}];`;

const validateStory = workflow.nodes.find(candidate => candidate.name === 'Validate Dynamic Story Output');
if (!validateStory) throw new Error('Missing Validate Dynamic Story Output');
validateStory.parameters.jsCode = `const x=$input.first().json,stories=x.epics.flatMap(e=>e.features).flatMap(f=>f.stories),features=x.epics.flatMap(e=>e.features),titles=stories.map(s=>s.title),expected=['Display five core metrics','Preset and custom date-range filtering','15-minute automatic refresh','Manual refresh of latest precomputed data','Display last-updated timestamp','Protect against excessive repeated requests','Executive access to all data','Team-lead access to team data only','Responsive web access completed before production launch','Export monthly board reports to PDF','Export XLSX with formulas preserved and approved label'],unique=a=>[...new Set(a)];const errors=[];if(x.stage!=='story_breakdown'||x.execution_status!=='passed')errors.push('stage status');if(x.validation?.orphan_delivery_items!==0||x.validation?.unsupported_claims!==0)errors.push('delivery validation');if(x.epics.length!==3||features.length!==7||stories.length!==11)errors.push('canonical counts');if(unique(titles).length!==titles.length||expected.some(t=>!titles.includes(t))||titles.some(t=>!expected.includes(t)))errors.push('canonical delivery titles');const deliveryIds=unique(stories.flatMap(s=>s.item_ids)),approved=new Set(x.prd_elements.map(p=>p.item_id));if(deliveryIds.some(id=>!approved.has(id)))errors.push('unapproved delivery item');if(errors.length)throw new Error('S2 parent blocked at story: '+errors.join('; '));return [{json:{...x,validation:{...x.validation,canonical_delivery_contract:true,canonical_counts:{epics:3,features:7,user_stories:11},canonical_story_titles:true}}}];`;

workflow.name = 'S2_ Dynamic Realistic Six-Source Main Orchestrator v0.3.5 - Corrected Document Production Promotion Candidate';
workflow.active = false;
workflow.versionId = null;
delete workflow.id;
workflow.meta = {
  ...(workflow.meta || {}),
  candidate_only: true,
  production_parent_unchanged: 'v0.3.4',
  corrected_document_promotion: 'Stages 5-7 references, canonical delivery enforcement, and additive human-review Drive exports',
  sizing_included: false,
};

const output = path.join(root, 'workflows/n8n/prd-genie-s2-main-orchestrator-v0.3.5-corrected-document-candidate.json');
fs.writeFileSync(output, `${JSON.stringify(workflow, null, 2)}\n`);
console.log(path.relative(root, output));
