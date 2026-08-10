import crypto from 'node:crypto';
import fs from 'node:fs';

const input='workflows/n8n/prd-genie-requirement-extractor-child-v1.9.json';
const output='workflows/n8n/prd-genie-requirement-extractor-child-v1.10.json';
const workflow=JSON.parse(fs.readFileSync(input,'utf8'));
workflow.name='PRD Genie - Requirement Extractor Child v1.10';
workflow.versionId=crypto.randomUUID();
const trace=workflow.nodes.find(n=>n.name==='Create Trace Context');
trace.parameters.jsCode=trace.parameters.jsCode.replace('child-v1.9.0','child-v1.10.0').replace('extractor-v1.14-deterministic-provenance-hydration','extractor-v1.15-versioned-clarification-contract');
const node=workflow.nodes.find(n=>n.name==='Validate and Adapt Source Input');
let code=node.parameters.jsCode;
const start=code.indexOf("if (data.packet_id === 'SP-REALISTIC-PB-MT-SN-CLAR-V3')");
const loop=code.indexOf('for (const source of data.sources) {',start);
if(start<0||loop<0)throw new Error('v1.9 contract anchors missing');
const generic=`const ids = data.sources.map(source => source.source_id);
if (new Set(ids).size !== ids.length) errors.push('duplicate source IDs');
const baseTypes=['product_brief','meeting_transcript','stakeholder_notes'];
for (const type of baseTypes) if (data.sources.filter(source=>source.source_type===type).length!==1) errors.push('exactly one '+type+' base source is required');
const clarificationSources=data.sources.filter(source=>source.source_type==='stakeholder_clarification');
if (data.sources.some(source=>!baseTypes.includes(source.source_type)&&source.source_type!=='stakeholder_clarification')) errors.push('unsupported production source type');
if (data.sources.length!==baseTypes.length+clarificationSources.length) errors.push('production packet contains an unclassified source');
if (clarificationSources.length) {
  const contract=data.clarification_contract;
  if (!contract||contract.decision_maker!=='Vipin'||contract.decision_date!=='2026-08-07') errors.push('authoritative clarification contract is required');
  const observed=new Set();
  for (const source of clarificationSources) {
    if (source.provenance?.origin!=='submitted_text'||!source.metadata?.meeting_date) errors.push('clarification provenance/metadata invalid for '+source.source_id);
    if (!source.raw_text.includes('Decision maker: '+contract?.decision_maker)||!source.raw_text.includes('Decision date: '+contract?.decision_date)) errors.push('clarification identity text mismatch for '+source.source_id);
    for (const citation of source.citations||[]) for (const match of citation.quote.matchAll(/DEC-[0-9]{4}-[0-9]{2}-[0-9]{2}-[A-Z0-9-]+/g)) observed.add(match[0]);
  }
  const declared=contract?.decision_ids||[];
  if (!Array.isArray(declared)||!declared.length||new Set(declared).size!==declared.length) errors.push('clarification decision IDs are missing or duplicated');
  for (const id of declared) if (!observed.has(id)) errors.push('declared decision citation missing '+id);
  const needsSupersession=clarificationSources.some(source=>/supersed/i.test(source.raw_text));
  if (needsSupersession&&(!Array.isArray(contract?.supersessions)||!contract.supersessions.length)) errors.push('clarification supersessions are required');
  for (const entry of contract?.supersessions||[]) {
    const source=data.sources.find(item=>item.source_id===entry.source_id);
    const citation=source?.citations?.find(item=>item.location===entry.location&&item.quote===entry.quote);
    if (!entry.decision_id||!source||!citation||entry.content_hash!==source.content_hash) errors.push('invalid supersession evidence '+(entry.decision_id||'unknown'));
  }
}
`;
code=code.slice(0,start)+generic+code.slice(loop);
const specificStart=code.indexOf("if (data.packet_id === 'SP-REALISTIC-PB-MT-SN-CLAR-V3')",code.indexOf('for (const source of data.sources) {'));
const errorsAnchor=code.indexOf("if (errors.length) throw new Error('Source packet validation failed",specificStart);
if(specificStart<0||errorsAnchor<0)throw new Error('v1.9 decision anchors missing');
code=code.slice(0,specificStart)+code.slice(errorsAnchor);
node.parameters.jsCode=code;
fs.writeFileSync(output,JSON.stringify(workflow,null,2)+'\n');
console.log(`Wrote ${output}`);
