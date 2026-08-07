import crypto from 'node:crypto';
import fs from 'node:fs';

const input='workflows/n8n/prd-genie-requirement-extractor-child-v1.6.1.json';
const output='workflows/n8n/prd-genie-requirement-extractor-child-v1.7.json';
const workflow=JSON.parse(fs.readFileSync(input,'utf8'));
workflow.name='PRD Genie - Requirement Extractor Child v1.7';
workflow.versionId=crypto.randomUUID();
const trace=workflow.nodes.find(n=>n.name==='Create Trace Context');
trace.parameters.jsCode=trace.parameters.jsCode
  .replace('child-v1.6.1','child-v1.7.0')
  .replace('extractor-v1.11.1-deferred-decision-ledger','extractor-v1.12-deterministic-coverage-ledger');

const parse=workflow.nodes.find(n=>n.name==='Parse and Validate Extraction');
const normalizeCode=`const raw=$json.text??$json.output??$json.response;
if(typeof raw!=='string')throw new Error('Extractor response did not contain a text payload');
const fence=String.fromCharCode(96).repeat(3);let cleaned=raw.trim();if(cleaned.startsWith(fence))cleaned=cleaned.slice(fence.length).replace(/^json\\s*/i,'');if(cleaned.endsWith(fence))cleaned=cleaned.slice(0,-fence.length).trim();
let result;try{result=JSON.parse(cleaned);}catch(error){throw new Error('Extractor returned invalid JSON before ledger normalization: '+error.message);}
const source=$('Create Trace Context').first().json;
if(source.source_route!=='production_multi_source')return [{json:{...$json,text:JSON.stringify(result)}}];
const itemEvidence=new Map(),missingEvidence=new Map(),conflictsByItem=new Map();
for(const record of result.items||[])for(const evidence of record.evidence||[]){const key=evidence.source_id+'|'+evidence.location;if(!itemEvidence.has(key))itemEvidence.set(key,new Set());itemEvidence.get(key).add(record.id);}
for(const record of result.missing_information||[])for(const evidence of record.evidence||[]){const key=evidence.source_id+'|'+evidence.location;if(!missingEvidence.has(key))missingEvidence.set(key,new Set());missingEvidence.get(key).add(record.id);}
for(const record of result.contradictions||[])for(const itemId of record.item_ids||[]){if(!conflictsByItem.has(itemId))conflictsByItem.set(itemId,new Set());conflictsByItem.get(itemId).add(record.id);}
const ledger=[];
for(const sourceEntry of source.sources||[])for(const citation of sourceEntry.citations||[]){const key=sourceEntry.source_id+'|'+citation.location;const items=itemEvidence.get(key)||new Set();const conflicts=new Set([...items].flatMap(id=>[...(conflictsByItem.get(id)||[])]));let route='CONTEXT',targets=[];if(conflicts.size){route='CONFLICT';targets=[...new Set([...conflicts,...items])].sort();}else if(missingEvidence.has(key)){route='MISSING';targets=[...missingEvidence.get(key)].sort();}else if(items.size){route='ITEM';targets=[...items].sort();}ledger.push(key+'|'+route+'|'+(targets.length?targets.join(','):'NONE'));}
result.extractor_notes=ledger;
return [{json:{...$json,text:JSON.stringify(result),coverage_ledger_normalization:{status:'passed',rows:ledger.length,method:'derived_from_emitted_evidence'}}}];`;
workflow.nodes.push({parameters:{jsCode:normalizeCode},id:crypto.randomUUID(),name:'Normalize Candidate Coverage Ledger',type:'n8n-nodes-base.code',typeVersion:2,position:[parse.position[0]-180,parse.position[1]]});
workflow.connections['Requirement Extractor'].main[0][0].node='Normalize Candidate Coverage Ledger';
workflow.connections['Normalize Candidate Coverage Ledger']={main:[[{node:'Parse and Validate Extraction',type:'main',index:0}]]};
fs.writeFileSync(output,JSON.stringify(workflow,null,2)+'\n');
console.log(`Wrote ${output}`);
