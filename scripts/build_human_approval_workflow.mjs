import { readFile, writeFile } from 'node:fs/promises';

const sourcePath = new URL('../workflows/n8n/prd-genie-human-approval-v0.2.json', import.meta.url);
const outputPath = new URL('../workflows/n8n/prd-genie-human-approval-v0.3.json', import.meta.url);
const workflow = JSON.parse(await readFile(sourcePath, 'utf8'));

workflow.name = 'PRD Genie - Human Approval v0.3';
workflow.versionId = '5c083115-92cb-47d1-a4d4-8a20457d0302';

const nodes = Object.fromEntries(workflow.nodes.map((node) => [node.name, node]));
const form = nodes['Human Review Form'].parameters;
form.formDescription = 'Select the approved Human Approval test package and record its deterministic human decision. HA-R01 covers standard approval; HA-R02 changes requested; HA-R03 clarification; HA-R04 rejection; HA-R05 conditional approval; HA-R06 controlled entry-validation failure.';
const caseOptions = form.formFields.values.find((field) => field.fieldName === 'review_case').fieldOptions.values;
caseOptions.push({ option: 'HA-R04 / T8' }, { option: 'HA-R06 / T8' });

let buildCode = nodes['Build Human Review Packet'].parameters.jsCode;
buildCode = buildCode.replace(
  "if (!cases[selected]) throw new Error('Unsupported Human Approval route case: ' + selected);",
  "if (selected === 'HA-R04 / T8') cases[selected] = { ...cases['HA-R01 / T8'], case_id: 'HA-R04', run_id: 'RUN-T8-HA-R04-REJECTED' }; if (selected === 'HA-R06 / T8') cases[selected] = { ...cases['HA-R01 / T8'], case_id: 'HA-R06', run_id: 'RUN-T8-HA-R06-INVALID-GATE', generation_gate: { ...cases['HA-R01 / T8'].generation_gate, gate_status: 'generation_blocked' } }; if (!cases[selected]) throw new Error('Unsupported Human Approval route case: ' + selected);"
);
nodes['Build Human Review Packet'].parameters.jsCode = buildCode;

let validateCode = nodes['Parse and Validate Human Approval'].parameters.jsCode;
validateCode = validateCode.replace(
  "if (reviewStatus === 'approved' && rejected.length) errors.push('Standard approval cannot contain rejected items.');",
  "if (reviewStatus === 'approved' && rejected.length) errors.push('Standard approval cannot contain rejected items.'); if (reviewStatus === 'rejected' && approved.length) errors.push('Rejection cannot contain approved items.'); if (reviewStatus === 'rejected' && rejected.length === 0) errors.push('Rejection requires at least one rejected item.'); if (packet.case_id === 'HA-R04' && JSON.stringify(rejected) !== JSON.stringify(upstreamIds)) errors.push('HA-R04 must reject all six T8 items in canonical order.');"
);
nodes['Parse and Validate Human Approval'].parameters.jsCode = validateCode;

let traceCode = nodes['Build Approval Trace Payload'].parameters.jsCode;
traceCode = traceCode.replaceAll('human-approval-v0.2.0', 'human-approval-v0.3.0');
traceCode = traceCode.replaceAll("version: 'v0.2.0'", "version: 'v0.3.0'");
nodes['Build Approval Trace Payload'].parameters.jsCode = traceCode;

await writeFile(outputPath, `${JSON.stringify(workflow, null, 2)}\n`);
