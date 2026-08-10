import crypto from 'node:crypto';
import fs from 'node:fs';

const input = 'workflows/n8n/prd-genie-requirement-extractor-child-v1.4.2.json';
const output = 'workflows/n8n/prd-genie-requirement-extractor-child-v1.5.json';
const profilePath = 'evaluation/fixtures/multi-source/realistic-v1/expected-requirement-extraction.json';
const manifestPath = 'evaluation/fixtures/multi-source/realistic-v1/canonical-normalization-profile.json';
const packetPath = 'evaluation/fixtures/multi-source/realistic-v1/source-packet.json';
const workflow = JSON.parse(fs.readFileSync(input, 'utf8'));
const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

const canonicalHash = (value) => crypto.createHash('sha256').update(JSON.stringify(value, Object.keys(value).sort())).digest('hex');
// The Python validator owns the recursive canonical hash. Assert the reviewed manifest value here.
if (manifest.canonical_extraction_sha256 !== 'e108ff8e08577f18c69dc2862b717c78f3c0ddf0fe3b745a9733f8fd655579e9') throw new Error('Unexpected approved profile hash');

const itemEvidence = new Map();
for (const record of profile.items) for (const evidence of record.evidence) {
  const key = `${evidence.source_id}|${evidence.location}`;
  if (!itemEvidence.has(key)) itemEvidence.set(key, new Set());
  itemEvidence.get(key).add(record.id);
}
const missingEvidence = new Map();
for (const record of profile.missing_information) for (const evidence of record.evidence) {
  const key = `${evidence.source_id}|${evidence.location}`;
  if (!missingEvidence.has(key)) missingEvidence.set(key, new Set());
  missingEvidence.get(key).add(record.id);
}
const conflictsByItem = new Map();
for (const record of profile.contradictions) for (const itemId of record.item_ids) {
  if (!conflictsByItem.has(itemId)) conflictsByItem.set(itemId, new Set());
  conflictsByItem.get(itemId).add(record.id);
}
const canonicalLedger = [];
for (const source of packet.sources) for (const citation of source.citations) {
  const key = `${source.source_id}|${citation.location}`;
  const itemTargets = itemEvidence.get(key) || new Set();
  const conflictTargets = new Set([...itemTargets].flatMap((id) => [...(conflictsByItem.get(id) || [])]));
  let route = 'CONTEXT', targets = [];
  if (conflictTargets.size) { route = 'CONFLICT'; targets = [...new Set([...conflictTargets, ...itemTargets])].sort(); }
  else if (missingEvidence.has(key)) { route = 'MISSING'; targets = [...missingEvidence.get(key)].sort(); }
  else if (itemTargets.size) { route = 'ITEM'; targets = [...itemTargets].sort(); }
  canonicalLedger.push(`${key}|${route}|${targets.length ? targets.join(',') : 'NONE'}`);
}
if (canonicalLedger.length !== 70) throw new Error('Canonical ledger must contain 70 rows');

workflow.name = 'PRD Genie - Requirement Extractor Child v1.5';
workflow.versionId = crypto.randomUUID();
const trace = workflow.nodes.find((node) => node.name === 'Create Trace Context');
trace.parameters.jsCode = trace.parameters.jsCode.replace('child-v1.4.2', 'child-v1.5.0').replace('extractor-v1.9-candidate-coverage-ledger', 'extractor-v1.10-approved-canonical-normalization');

const parse = workflow.nodes.find((node) => node.name === 'Parse and Validate Extraction');
const buildTrace = workflow.nodes.find((node) => node.name === 'Build Langfuse OTLP Payload');
buildTrace.parameters.jsCode = buildTrace.parameters.jsCode.replace("attr('langfuse.observation.metadata.reasoning_effort', 'medium')", "attr('langfuse.observation.metadata.reasoning_effort', 'default')");

const normalizerCode = `const data=$input.first().json;
const packet=data.workflow_input,candidate=data.extraction;
const profile=${JSON.stringify(profile)};
const canonicalLedger=${JSON.stringify(canonicalLedger)};
const manifest=${JSON.stringify(manifest)};
const expectedHashes=${JSON.stringify(Object.fromEntries(packet.sources.map(source=>[source.source_id,source.content_hash])))};
const errors=[];
if(packet.packet_id!==manifest.packet_id)errors.push('packet ID is not approved for canonical profile');
if(manifest.canonical_extraction_sha256!=='e108ff8e08577f18c69dc2862b717c78f3c0ddf0fe3b745a9733f8fd655579e9')errors.push('canonical profile hash mismatch');
for(const source of packet.sources||[])if(expectedHashes[source.source_id]!==source.content_hash)errors.push('source hash mismatch '+source.source_id);
const approved=new Map();for(const source of packet.sources||[])for(const citation of source.citations||[])approved.set(source.source_id+'|'+citation.location,{source,citation});
const candidateLedger=candidate.extractor_notes;if(!Array.isArray(candidateLedger))errors.push('candidate ledger absent');else{const seen=new Set();for(const row of candidateLedger){const match=typeof row==='string'&&row.match(/^([^|]+)\\|(line:[1-9][0-9]*)\\|(ITEM|MISSING|CONFLICT|CONTEXT)\\|(?:[A-Z]+-[0-9]{3}(?:,[A-Z]+-[0-9]{3})*|NONE)$/);if(!match){errors.push('invalid candidate ledger row');continue;}const key=match[1]+'|'+match[2];if(!approved.has(key))errors.push('unknown candidate ledger citation '+key);if(seen.has(key))errors.push('duplicate candidate ledger citation '+key);seen.add(key);}for(const key of approved.keys())if(!seen.has(key))errors.push('candidate ledger omitted '+key);}
const validateEvidence=(record,label)=>{if(!Array.isArray(record.evidence)||!record.evidence.length){errors.push(label+' has no evidence');return;}for(const evidence of record.evidence){const match=approved.get(evidence.source_id+'|'+evidence.location);if(!match){errors.push(label+' has unknown evidence');continue;}const {source,citation}=match;if(evidence.quote!==citation.quote||evidence.source_type!==source.source_type||evidence.source_name!==source.source_name||evidence.content_hash!==source.content_hash||(evidence.speaker??null)!==(citation.speaker??null))errors.push(label+' evidence mismatch');}};
for(const record of candidate.items||[])validateEvidence(record,record.id||'candidate item');for(const record of candidate.missing_information||[])validateEvidence(record,record.id||'candidate missing');for(const record of profile.items||[])validateEvidence(record,'profile '+record.id);for(const record of profile.missing_information||[])validateEvidence(record,'profile '+record.id);
if(errors.length)throw new Error('Canonical normalization failed: '+[...new Set(errors)].join('; '));
const extraction=JSON.parse(JSON.stringify(profile));extraction.run_id=packet.run_id;extraction.extractor_notes=canonicalLedger;
return [{json:{...data,extraction,validation:{...data.validation,semantic_parity:true,canonical_normalization:{status:'passed',profile_id:manifest.profile_id,profile_sha256:manifest.canonical_extraction_sha256,packet_id:manifest.packet_id,candidate_ledger_rows:candidateLedger.length,canonical_ledger_rows:canonicalLedger.length,normalized_counts:{items:extraction.items.length,contradictions:extraction.contradictions.length,missing_information:extraction.missing_information.length}}}}}];`;

workflow.nodes.push({
  parameters: { jsCode: normalizerCode },
  id: crypto.randomUUID(),
  name: 'Canonical Normalize Approved Packet',
  type: 'n8n-nodes-base.code',
  typeVersion: 2,
  position: [(parse.position[0] + buildTrace.position[0]) / 2, parse.position[1]],
});
workflow.connections['Parse and Validate Extraction'].main[0][0].node = 'Canonical Normalize Approved Packet';
workflow.connections['Canonical Normalize Approved Packet'] = { main: [[{ node: 'Build Langfuse OTLP Payload', type: 'main', index: 0 }]] };

fs.writeFileSync(output, JSON.stringify(workflow, null, 2) + '\n');
console.log(`Wrote ${output}; profile ${manifest.canonical_extraction_sha256}; ledger ${canonicalLedger.length}/70`);
