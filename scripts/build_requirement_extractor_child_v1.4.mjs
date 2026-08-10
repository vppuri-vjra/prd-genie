import fs from 'node:fs';

const inputPath = 'workflows/n8n/prd-genie-requirement-extractor-child-v1.3.json';
const outputPath = 'workflows/n8n/prd-genie-requirement-extractor-child-v1.4.json';
const workflow = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

workflow.name = 'PRD Genie - Requirement Extractor Child v1.4';

const trace = workflow.nodes.find((node) => node.name === 'Create Trace Context');
trace.parameters.jsCode = trace.parameters.jsCode
  .replace('child-v1.3.0', 'child-v1.4.0')
  .replace('extractor-v1.8-canonical-source-order', 'extractor-v1.9-candidate-coverage-ledger');

const model = workflow.nodes.find((node) => node.name === 'Requirement Extractor');
const messages = model.parameters.messages.messageValues;
const systemMessage = messages[0];
systemMessage.message += `

v1.9 candidate-coverage ledger: For production_multi_source only, extractor_notes is a deterministic coverage ledger, not free-form notes. Emit exactly one string for every approved citation in every source, using SOURCE_ID|line:N|ROUTE|TARGETS. ROUTE must be ITEM, MISSING, CONFLICT, or CONTEXT. TARGETS is a comma-separated list of emitted IDs with no spaces, or NONE. Use ITEM when the citation supports one or more emitted items. Use MISSING when it supports missing_information. Use CONFLICT when it materially supports an unresolved contradiction; include its CTR ID and every directly supported emitted item ID. Use CONTEXT only when the citation is intentionally not extracted, and use NONE. Classify every approved citation exactly once. Never cite an unapproved location or omit a citation. The ledger records coverage; it does not authorize creating unsupported output. For evaluation_test, retain the existing extractor_notes behavior.`;

model.parameters.text += `\nFor production_multi_source, finish by emitting the complete v1.9 candidate-coverage ledger in extractor_notes.`;

const parse = workflow.nodes.find((node) => node.name === 'Parse and Validate Extraction');
const marker = "if(errors.length)throw new Error('Extraction validation failed: '+errors.join('; '));";
const ledgerValidation = `if(source.source_route==='production_multi_source'){
  if(!Array.isArray(result.extractor_notes))errors.push('extractor_notes must be a coverage ledger array');
  else{
    const approved=new Map();
    for(const sourceEntry of source.sources||[])for(const citation of sourceEntry.citations||[])approved.set(sourceEntry.source_id+'|'+citation.location,{source:sourceEntry,citation});
    const seen=new Set(),itemIds=new Set((result.items||[]).map(record=>record.id)),missingIds=new Set((result.missing_information||[]).map(record=>record.id)),contradictionIds=new Set((result.contradictions||[]).map(record=>record.id)),contradictionItems=new Map((result.contradictions||[]).map(record=>[record.id,new Set(record.item_ids||[])]));
    const itemEvidence=new Map(),missingEvidence=new Set();
    for(const record of result.items||[])for(const evidence of record.evidence||[]){const key=evidence.source_id+'|'+evidence.location;if(!itemEvidence.has(key))itemEvidence.set(key,new Set());itemEvidence.get(key).add(record.id);}
    for(const record of result.missing_information||[])for(const evidence of record.evidence||[])missingEvidence.add(evidence.source_id+'|'+evidence.location);
    for(const [index,row] of result.extractor_notes.entries()){
      if(typeof row!=='string'){errors.push('coverage ledger row '+index+' must be a string');continue;}
      const match=row.match(/^([^|]+)\\|(line:[1-9][0-9]*)\\|(ITEM|MISSING|CONFLICT|CONTEXT)\\|([A-Z]+-[0-9]{3}(?:,[A-Z]+-[0-9]{3})*|NONE)$/);
      if(!match){errors.push('invalid coverage ledger row '+index);continue;}
      const [,sourceId,location,route,targetText]=match,key=sourceId+'|'+location;
      if(!approved.has(key))errors.push('coverage ledger has unknown citation '+key);
      if(seen.has(key))errors.push('coverage ledger duplicates citation '+key);else seen.add(key);
      const targets=targetText==='NONE'?[]:targetText.split(',');
      if(route==='CONTEXT'&&targets.length)errors.push('CONTEXT must target NONE for '+key);
      if(route!=='CONTEXT'&&!targets.length)errors.push(route+' requires targets for '+key);
      if(route==='ITEM'&&!targets.some(id=>itemIds.has(id)))errors.push('ITEM requires an emitted item target for '+key);
      if(route==='MISSING'&&!targets.some(id=>missingIds.has(id)))errors.push('MISSING requires an emitted missing target for '+key);
      if(route==='CONFLICT'&&!targets.some(id=>contradictionIds.has(id)))errors.push('CONFLICT requires an emitted contradiction target for '+key);
      for(const id of targets)if(!itemIds.has(id)&&!missingIds.has(id)&&!contradictionIds.has(id))errors.push('coverage ledger has unknown target '+id);
      if(route==='CONTEXT'&&(itemEvidence.has(key)||missingEvidence.has(key)))errors.push('CONTEXT citation is used as evidence '+key);
      if(route==='MISSING'&&!missingEvidence.has(key))errors.push('MISSING citation is not used by missing_information '+key);
      if(route==='ITEM'&&!itemEvidence.has(key))errors.push('ITEM citation is not used by an item '+key);
      if(route==='CONFLICT'&&!itemEvidence.has(key))errors.push('CONFLICT citation is not used by a conflicting item '+key);
      if(route==='ITEM'&&targets.some(id=>!itemIds.has(id)))errors.push('ITEM has a non-item target for '+key);
      if(route==='ITEM'&&itemEvidence.has(key)&&[...itemEvidence.get(key)].some(id=>!targets.includes(id)))errors.push('ITEM omits an evidence-backed item target for '+key);
      if(route==='MISSING'&&targets.some(id=>!missingIds.has(id)))errors.push('MISSING has a non-missing target for '+key);
      if(route==='CONFLICT'){
        const targetItems=targets.filter(id=>itemIds.has(id)),targetConflicts=targets.filter(id=>contradictionIds.has(id));
        if(targets.some(id=>missingIds.has(id)))errors.push('CONFLICT has a missing-information target for '+key);
        if(itemEvidence.has(key)&&[...itemEvidence.get(key)].some(id=>!targetItems.includes(id)))errors.push('CONFLICT omits an evidence-backed item target for '+key);
        if(targetConflicts.some(id=>![...contradictionItems.get(id)].some(itemId=>targetItems.includes(itemId))))errors.push('CONFLICT target does not reference a supported item for '+key);
      }
    }
    for(const key of approved.keys())if(!seen.has(key))errors.push('coverage ledger missing citation '+key);
    for(const key of itemEvidence.keys())if(!seen.has(key))errors.push('item evidence absent from coverage ledger '+key);
    for(const key of missingEvidence)if(!seen.has(key))errors.push('missing-information evidence absent from coverage ledger '+key);
  }
}
`;

if (!parse.parameters.jsCode.includes(marker)) throw new Error('Parser insertion marker not found');
parse.parameters.jsCode = parse.parameters.jsCode.replace(marker, ledgerValidation + marker);

fs.writeFileSync(outputPath, JSON.stringify(workflow, null, 2) + '\n');
console.log(`Wrote ${outputPath}`);
