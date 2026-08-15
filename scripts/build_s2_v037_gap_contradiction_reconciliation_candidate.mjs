import fs from 'node:fs';
import crypto from 'node:crypto';

const input = 'workflows/n8n/prd-genie-s2-gap-analyzer-child-v0.1.json';
const output = 'workflows/n8n/prd-genie-s2-gap-analyzer-child-v0.1.1-contradiction-reconciliation-candidate.json';
const workflow = JSON.parse(fs.readFileSync(input, 'utf8'));

workflow.name = 'S2_ Dynamic Gap Analyzer v0.1.1 - Contradiction Reconciliation Candidate';
workflow.versionId = crypto.randomUUID();

const trace = workflow.nodes.find(node => node.name === 'Create Gap Trace Context');
trace.parameters.jsCode = trace.parameters.jsCode
  .replace("workflow_version:'child-v1.0.0'", "workflow_version:'child-v1.0.1-contradiction-reconciliation'")
  .replace("prompt_version:'gap-analyzer-v1.0-missing-information-coverage'", "prompt_version:'gap-analyzer-v1.0.1-deterministic-contradiction-reconciliation'");

const parse = workflow.nodes.find(node => node.name === 'Parse and Validate Gap Analysis');
const marker = "const errors = [];";
if (!parse.parameters.jsCode.includes(marker)) throw new Error('Gap validation insertion marker not found');

const reconciliation = `// Deterministically restore contradiction trace links from the validated extractor contract.\nconst extractedContradictions=new Map((extraction.contradictions||[]).map(c=>[c.id,c]));\nlet reconciledContradictionCount=0;\nfor(const contradiction of result.contradictions||[]){\n  const sourceContradiction=extractedContradictions.get(contradiction.id);\n  if(!sourceContradiction)continue;\n  const authoritativeIds=Array.isArray(sourceContradiction.item_ids)?sourceContradiction.item_ids:[];\n  if(authoritativeIds.length){\n    const before=JSON.stringify(contradiction.related_item_ids||[]);\n    contradiction.related_item_ids=[...new Set(authoritativeIds)];\n    if(JSON.stringify(contradiction.related_item_ids)!==before)reconciledContradictionCount++;\n  }\n}\n`;

parse.parameters.jsCode = parse.parameters.jsCode
  .replace(marker, reconciliation + marker)
  .replace(
    "traceability_valid:true,validated_at:new Date().toISOString()",
    "traceability_valid:true,contradiction_trace_reconciled:reconciledContradictionCount,validated_at:new Date().toISOString()",
  );

fs.writeFileSync(output, JSON.stringify(workflow, null, 2) + '\n');
console.log(output);
