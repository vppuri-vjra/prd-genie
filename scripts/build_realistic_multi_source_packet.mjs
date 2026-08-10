import fs from 'node:fs';
import crypto from 'node:crypto';

const base = 'evaluation/fixtures/multi-source/realistic-v1';
const definitions = [
  {
    source_id: 'SRC-REALISTIC-PB-001',
    source_type: 'product_brief',
    source_name: 'product-brief.txt',
    lines: [3,4,5,8,11,12,13,16,17,18,19,20,23,24,25,26,29,30,31,34,35]
  },
  {
    source_id: 'SRC-REALISTIC-MT-001',
    source_type: 'meeting_transcript',
    source_name: 'meeting-transcripts.txt',
    lines: [12,14,16,18,20,22,24,26,28,36,38,40,42,44,52,54,56,58,60,62,64,66,74,76,78,80,82,90,91,92,93,94,95]
  },
  {
    source_id: 'SRC-REALISTIC-SN-001',
    source_type: 'stakeholder_notes',
    source_name: 'stakeholder-notes.txt',
    lines: [10,12,14,16,22,24,26,28,34,36,38,40,42,48,50,52]
  }
];

const speakerFor = (quote) => {
  const match = /^([A-Za-z ]+):\s/.exec(quote);
  return match ? match[1].trim() : null;
};

const sources = definitions.map((definition) => {
  const fixturePath = `${base}/${definition.source_name}`;
  const rawText = fs.readFileSync(fixturePath, 'utf8');
  const allLines = rawText.split(/\r?\n/);
  return {
    source_id: definition.source_id,
    source_type: definition.source_type,
    source_name: definition.source_name,
    raw_text: rawText,
    provenance: { origin: 'uploaded_document', fixture_path: fixturePath },
    citations: definition.lines.map((line) => ({ quote: allLines[line - 1], location: `line:${line}`, speaker: speakerFor(allLines[line - 1]) })),
    metadata: { document_version: 'supplied-capstone-resource-v1', language: 'en' },
    content_hash: `sha256:${crypto.createHash('sha256').update(rawText, 'utf8').digest('hex')}`
  };
});

const packet = {
  schema_version: '1.0.0',
  packet_id: 'SP-REALISTIC-PB-MT-SN-V1',
  run_id: 'RUN-REALISTIC-MULTI-SOURCE-V1',
  test_id: null,
  producer: 'production_multi_source',
  sources,
  submitted_at: '2026-08-06T00:00:00Z',
  metadata: { language: 'en', logical_input_contract: 'requirement_extractor_input_v1', route_policy: 'alternative_not_combined' }
};

fs.writeFileSync(`${base}/source-packet.json`, `${JSON.stringify(packet, null, 2)}\n`);

