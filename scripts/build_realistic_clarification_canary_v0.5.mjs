import crypto from 'node:crypto';import fs from 'node:fs';
const id=process.argv[2];if(!id)throw new Error('Extractor ID required');
const input='workflows/n8n/prd-genie-realistic-clarification-v3-canary-v0.4.json',output='workflows/n8n/prd-genie-realistic-clarification-v3-canary-v0.5.json';
const w=JSON.parse(fs.readFileSync(input,'utf8'));w.name='PRD Genie - Realistic Clarification v3 Canary v0.5';w.versionId=crypto.randomUUID();
const old='Execute Requirement Extractor Child v1.8',next='Execute Requirement Extractor Child v1.9',n=w.nodes.find(x=>x.name===old);n.name=next;n.parameters.workflowId.value=id;n.parameters.workflowId.cachedResultName='PRD Genie - Requirement Extractor Child v1.9';
w.connections['Load Approved Five-Source Packet v3'].main[0][0].node=next;w.connections[next]=w.connections[old];delete w.connections[old];
fs.writeFileSync(output,JSON.stringify(w,null,2)+'\n');console.log(`Wrote ${output}`);
