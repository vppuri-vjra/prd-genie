import crypto from 'node:crypto';
import fs from 'node:fs';

const input='workflows/n8n/prd-genie-realistic-clarification-v4-canary-v0.8.json';
const output='workflows/n8n/prd-genie-realistic-clarification-v4-canary-v0.9.json';
const workflow=JSON.parse(fs.readFileSync(input,'utf8'));
workflow.name='PRD Genie - Realistic Clarification v4 Deterministic Gate Canary v0.9';
workflow.versionId=crypto.randomUUID();
const child=workflow.nodes.find(n=>n.name==='Execute Requirement Extractor Child v1.9');
child.name='Execute Requirement Extractor Child v1.10';
child.parameters.workflowId={__rl:true,value:'eDAl2qSb4ai17JZk',mode:'list',cachedResultName:'PRD Genie - Requirement Extractor Child v1.10'};
const validate=workflow.nodes.find(n=>n.name==='Validate Six-Source Extraction');
validate.parameters.jsCode=validate.parameters.jsCode.replace("$('Execute Requirement Extractor Child v1.9')","$('Execute Requirement Extractor Child v1.10')");
const load=workflow.nodes.find(n=>n.name==='Load Approved Six-Source Packet v4');
const packet=JSON.parse(fs.readFileSync('evaluation/fixtures/multi-source/realistic-v1/source-packet-v4.json','utf8'));
const sourceById=Object.fromEntries(packet.sources.map(source=>[source.source_id,source]));
const evidence=(decision_id,source_id,location)=>{const source=sourceById[source_id],citation=source.citations.find(item=>item.location===location);return {decision_id,source_id,location,quote:citation.quote,content_hash:source.content_hash};};
const supersessions=[
  evidence('DEC-2026-08-07-GAP-006','SRC-REALISTIC-MT-001','line:82'),
  evidence('DEC-2026-08-07-GAP-007','SRC-REALISTIC-MT-001','line:52'),
  evidence('DEC-2026-08-07-GAP-010','SRC-REALISTIC-MT-001','line:24'),
  evidence('DEC-2026-08-07-GAP-008-A1','SRC-REALISTIC-CLAR-001','line:17'),
  evidence('DEC-2026-08-07-GAP-014-A1','SRC-REALISTIC-CLAR-001','line:23'),
  evidence('DEC-2026-08-07-MOBILE-LAUNCH-001','SRC-REALISTIC-SN-001','line:26'),
];
load.parameters.jsCode=load.parameters.jsCode.replace('const parent_trace_id=',`const supersessions=${JSON.stringify(supersessions)};\nconst parent_trace_id=`).replace('decision_ids,deterministic_resolution:resolution','decision_ids,supersessions,deterministic_resolution:resolution');
workflow.connections['Execute Requirement Extractor Child v1.10']=workflow.connections['Execute Requirement Extractor Child v1.9'];
delete workflow.connections['Execute Requirement Extractor Child v1.9'];
for(const target of workflow.connections['Load Approved Six-Source Packet v4'].main[0])if(target.node==='Execute Requirement Extractor Child v1.9')target.node='Execute Requirement Extractor Child v1.10';
fs.writeFileSync(output,JSON.stringify(workflow,null,2)+'\n');
console.log(`Wrote ${output}`);
