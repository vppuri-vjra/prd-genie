import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const provenArg = process.argv[2];
if (!provenArg) {
  throw new Error('Usage: node scripts/build_s2_prd_template_langfuse_candidate.mjs <exported-proven-langfuse-shadow-workflow.json>');
}
const provenPath = path.resolve(provenArg);
const approvedPath = path.join(root, 'workflows/n8n/prd-genie-s2-production-prd-v0.2-template-candidate.json');
const outputPath = path.join(root, 'workflows/n8n/prd-genie-s2-production-prd-v0.2.1-template-langfuse-candidate.json');
const proven = JSON.parse(fs.readFileSync(provenPath, 'utf8'));
const approved = JSON.parse(fs.readFileSync(approvedPath, 'utf8'));
const approvedByName = new Map(approved.nodes.map(node => [node.name, node]));

for (const name of [
  'When Executed by Connected Parent',
  'Generate Dynamic Grounded PRD',
  'Validate Approval to PRD Coverage',
  'Validate PRD Citation Grounding',
  'Return PRD and Stop Before Story Breakdown',
]) {
  const index = proven.nodes.findIndex(node => node.name === name);
  if (index < 0) throw new Error('Missing proven node: ' + name);
  const replacement = structuredClone(approvedByName.get(name));
  replacement.position = proven.nodes[index].position;
  proven.nodes[index] = replacement;
}

// Keep the proven shadow workflow's trace builder because it creates the
// OTLP payload consumed by the credential-bound Langfuse HTTP node. The
// approved six-node candidate's trace builder only creates local metadata.
const traceBuilder = proven.nodes.find(node => node.name === 'Build PRD Trace');
traceBuilder.parameters.jsCode = traceBuilder.parameters.jsCode.replace(
  'decision:x.decision,next_route:x.next_route,run_id:x.run_id',
  "decision:x.decision||'continue',next_route:x.next_route||'story_breakdown',run_id:x.run_id",
);
traceBuilder.parameters.jsCode = traceBuilder.parameters.jsCode.replace(
  'citation_dispositions:x.citation_dispositions,item_dispositions:x.item_dispositions',
  "citation_dispositions:x.citation_dispositions,item_dispositions:x.item_dispositions,evaluation_context:{claim_scope:'Evaluate source-derived PRD statements for faithfulness. Treat template headings, document metadata, controlled TBD placeholders, empty-section declarations, deterministic validation fields, and orchestration metadata as authorized system scaffolding rather than business claims.',authorized_template_scaffolding:['official ten-section PRD headings','document version, author, generated date, and draft status','TBD - stakeholder input required','No approved or specified items declarations'],authorized_system_metadata:['validation','decision','next_route','run_id']}"
);

proven.name = 'S2_ Dynamic Production PRD v0.2.1 - Official Template Langfuse Candidate';
proven.active = false;
proven.versionId = null;
proven.pinData = approved.pinData;
proven.meta = {
  ...(proven.meta || {}),
  ...(approved.meta || {}),
  langfuse_shadow: true,
  candidate_only: true,
  baseline_parent: 'v0.3.3-unchanged',
};

fs.writeFileSync(outputPath, JSON.stringify(proven, null, 2) + '\n');
console.log(path.relative(root, outputPath));
