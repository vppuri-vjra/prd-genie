import crypto from 'node:crypto';
import fs from 'node:fs';

const input = 'workflows/n8n/prd-genie-requirement-extractor-child-v1.4.2.json';
const output = 'workflows/n8n/prd-genie-requirement-extractor-child-v1.6.json';
const packet = JSON.parse(fs.readFileSync('evaluation/fixtures/multi-source/realistic-v1/source-packet-v2.json', 'utf8'));
const decisions = JSON.parse(fs.readFileSync('evaluation/fixtures/multi-source/realistic-v1/stakeholder-clarification-decisions-2026-08-07.json', 'utf8'));
const workflow = JSON.parse(fs.readFileSync(input, 'utf8'));

workflow.name = 'PRD Genie - Requirement Extractor Child v1.6';
workflow.versionId = crypto.randomUUID();
const trace = workflow.nodes.find(n => n.name === 'Create Trace Context');
trace.parameters.jsCode = trace.parameters.jsCode
  .replace('child-v1.4.2', 'child-v1.6.0')
  .replace('extractor-v1.9-candidate-coverage-ledger', 'extractor-v1.11-authoritative-clarification');

const validate = workflow.nodes.find(n => n.name === 'Validate and Adapt Source Input');
validate.parameters.jsCode = validate.parameters.jsCode
  .replace("if (data.sources.length !== 3) errors.push('exactly three sources are required');", `
if (data.packet_id === '${packet.packet_id}') {
  if (data.run_id !== '${packet.run_id}') errors.push('v2 run_id mismatch');
  if (data.sources.length !== 4) errors.push('v2 packet requires exactly four sources');
} else if (data.sources.length !== 3) errors.push('exactly three sources are required');`)
  .replace("const expectedTypes = ['meeting_transcript','product_brief','stakeholder_notes'];", `const expectedTypes = data.packet_id === '${packet.packet_id}' ? ['meeting_transcript','product_brief','stakeholder_clarification','stakeholder_notes'] : ['meeting_transcript','product_brief','stakeholder_notes'];`)
  .replace("errors.push('source types must be exactly PB, MT and SN')", "errors.push('source types do not match the selected production packet contract')")
  .replace("if (errors.length) throw new Error('Source packet validation failed: ' + errors.join('; '));", `
if (data.packet_id === '${packet.packet_id}') {
  const expectedHashes=${JSON.stringify(Object.fromEntries(packet.sources.map(s => [s.source_id, s.content_hash])))};
  for (const source of data.sources) if (expectedHashes[source.source_id] !== source.content_hash) errors.push('unapproved v2 source/hash '+source.source_id);
  const clarification=data.sources.find(s=>s.source_id==='SRC-REALISTIC-CLAR-001');
  const expectedDecisions=${JSON.stringify(decisions.decisions.map(d => ({id:d.decision_id,location:d.clarification_source_citation.location,quote:d.clarification_source_citation.quote})))};
  if (!clarification) errors.push('authoritative clarification source missing');
  else for (const decision of expectedDecisions) {
    const citation=(clarification.citations||[]).find(c=>c.location===decision.location&&c.quote===decision.quote);
    if (!citation || !citation.quote.includes(decision.id)) errors.push('decision citation mismatch '+decision.id);
  }
}
if (errors.length) throw new Error('Source packet validation failed: ' + errors.join('; '));`);

const extractor = workflow.nodes.find(n => n.name === 'Requirement Extractor');
extractor.parameters.text += `\n\nFor packet ${packet.packet_id}, stakeholder_clarification is authoritative later evidence. Preserve the frozen PB/MT/SN statements as historical evidence, apply only explicitly stated clarification decisions, and retain exact decision IDs in the resulting requirement statement or evidence-backed description. A clarification can resolve, defer, control, or supersede an earlier record; never silently erase the earlier source. Do not treat a deferred capability as a first-release requirement. Do not infer that an unrelated contradiction is resolved. Classify every clarification citation in the coverage ledger.`;
extractor.parameters.messages.messageValues[0].message += `\n\nv1.11 authoritative-clarification rule: For the reviewed four-source packet, stakeholder_clarification is later authoritative evidence. Apply each DEC-2026-08-07-GAP-### decision exactly. Explicit supersession replaces only the named earlier proposal while preserving its historical citation. Deferred capabilities are not current-release requirements. A controlled TBD remains an explicitly managed uncertainty. Do not clear contradictions or missing information that a clarification decision does not address. Every clarification-derived item or missing-information record must cite the exact stakeholder_clarification line and preserve full multi-source provenance.`;

fs.writeFileSync(output, JSON.stringify(workflow, null, 2) + '\n');
console.log(`Wrote ${output}`);
