import crypto from 'node:crypto';
import fs from 'node:fs';

const input='workflows/n8n/prd-genie-requirement-extractor-child-v1.6.json';
const output='workflows/n8n/prd-genie-requirement-extractor-child-v1.6.1.json';
const workflow=JSON.parse(fs.readFileSync(input,'utf8'));
workflow.name='PRD Genie - Requirement Extractor Child v1.6.1';
workflow.versionId=crypto.randomUUID();
const trace=workflow.nodes.find(n=>n.name==='Create Trace Context');
trace.parameters.jsCode=trace.parameters.jsCode
  .replace('child-v1.6.0','child-v1.6.1')
  .replace('extractor-v1.11-authoritative-clarification','extractor-v1.11.1-deferred-decision-ledger');
const extractor=workflow.nodes.find(n=>n.name==='Requirement Extractor');
const rule=`\n\nv1.11.1 deferred-decision ledger correction: An authoritative clarification that defers a capability or assigns an unresolved implementation choice to a dated, owned technical evaluation is a current governance decision, not evidence that the clarification line itself is conflicting. Emit an evidence-backed constraint, deadline, dependency, risk, or missing-information record as supported by the exact words. Classify that clarification citation as ITEM or MISSING. Use CONFLICT only when the same clarification citation directly supports an emitted item that materially conflicts with another emitted item and the clarification does not resolve, supersede, defer, or control the choice. Specifically, DEC-2026-08-07-GAP-014 defers SPA versus server-rendered pages to Raj's technical evaluation due 2026-08-14; do not classify SRC-REALISTIC-CLAR-001|line:23 as CONFLICT.`;
extractor.parameters.text+=rule;
extractor.parameters.messages.messageValues[0].message+=rule;
fs.writeFileSync(output,JSON.stringify(workflow,null,2)+'\n');
console.log(`Wrote ${output}`);
