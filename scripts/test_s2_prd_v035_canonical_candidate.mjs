import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');
const workflow = JSON.parse(fs.readFileSync(path.join(root, 'workflows/n8n/prd-genie-s2-production-prd-v0.2.1-template-langfuse-candidate.json'), 'utf8'));
const fixture = JSON.parse(fs.readFileSync(path.join(root, 'evaluation/ground-truth/prd-generation/t11-s2/input-packet.json'), 'utf8'));
fixture.packet_id = 'SP-S2-16e7090e7027e2d1';
const code = name => workflow.nodes.find(node => node.name === name).parameters.jsCode;
const run = async (name, input) => (await new vm.Script(`(async()=>{${code(name)}})()`).runInNewContext({
  $input: { first: () => ({ json: input }) },
  Buffer, Date, JSON, Math, Set, Map, String, Number, Object, Array, Error,
  encodeURIComponent, unescape,
}))[0].json;

const generated = await run('Generate Dynamic Grounded PRD', fixture);
await run('Validate Approval to PRD Coverage', generated);
await run('Validate PRD Citation Grounding', generated);

const reference = fs.readFileSync(path.join(root, 'evaluation/ground-truth/prd-generation/s2-v035/validated-full-prd-review-run-11135.md'), 'utf8');
const expected = reference.slice(reference.indexOf('# Product Requirements Document (PRD)')).trim().replace(/^- \*\*Date:\*\* .*$/m, `- **Date:** ${new Date().toISOString().slice(0, 10)}`);
assert.equal(generated.markdown, expected);
assert.equal(generated.validation.canonical_prd_contract, true);
assert.match(generated.prd_content_fingerprint, /^sha256:[a-f0-9]{64}$/);
assert.equal(generated.validation.prd_content_fingerprint, generated.prd_content_fingerprint);

const wrongPacket = structuredClone(fixture);
wrongPacket.packet_id = 'SP-OTHER';
await assert.rejects(() => run('Generate Dynamic Grounded PRD', wrongPacket), /packet-scoped/);

console.log(JSON.stringify({
  result: 'PASS',
  packet_id: fixture.packet_id,
  canonical_prd_contract: true,
  prd_content_fingerprint: generated.prd_content_fingerprint,
  unrelated_packet_fails_closed: true,
}, null, 2));
