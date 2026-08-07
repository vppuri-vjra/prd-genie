import crypto from 'node:crypto';import fs from 'node:fs';
const input='workflows/n8n/prd-genie-realistic-clarification-v3-canary-v0.5.json',output='workflows/n8n/prd-genie-realistic-clarification-v3-canary-v0.6.json';
const w=JSON.parse(fs.readFileSync(input,'utf8'));w.name='PRD Genie - Realistic Clarification v3 Canary v0.6';w.versionId=crypto.randomUUID();fs.writeFileSync(output,JSON.stringify(w,null,2)+'\n');console.log(`Wrote ${output}`);
