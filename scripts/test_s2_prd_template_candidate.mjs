import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');
const workflow = JSON.parse(fs.readFileSync(path.join(root, 'workflows/n8n/prd-genie-s2-production-prd-v0.2-template-candidate.json'), 'utf8'));
const fixture = JSON.parse(fs.readFileSync(path.join(root, 'evaluation/ground-truth/prd-generation/t11-s2/input-packet.json'), 'utf8'));
const code = name => workflow.nodes.find(node => node.name === name)?.parameters?.jsCode;
const run = async (name, input) => {
  const source = code(name);
  if (!source) throw new Error('Missing node code: ' + name);
  const context = vm.createContext({
    $input: { first: () => ({ json: input }) },
    console, Buffer, Date, JSON, Math, Set, Map, String, Number, Object, Array, Error,
    encodeURIComponent, unescape,
  });
  return (await new vm.Script('(async()=>{' + source + '})()').runInContext(context))[0].json;
};

const generated = await run('Generate Dynamic Grounded PRD', fixture);
if (process.argv.includes('--print-markdown')) {
  console.log(generated.markdown);
  process.exit(0);
}
const coverageChecked = await run('Validate Approval to PRD Coverage', generated);
const grounded = await run('Validate PRD Citation Grounding', coverageChecked);

const expectedHeadings = [
  '## 1. Product Overview',
  '## 2. Goals and Objectives',
  '## 3. User Personas',
  '## 4. Feature Requirements',
  '### 4.1 Functional Requirements',
  '### 4.2 Non-Functional Requirements',
  '## 5. Acceptance Criteria',
  '## 6. Out of Scope',
  '## 7. Dependencies',
  '## 8. Assumptions',
  '## 9. Open Questions',
  '## 10. Timeline',
];
for (const heading of expectedHeadings) {
  if (grounded.markdown.split(heading).length !== 2) throw new Error('Heading contract failed: ' + heading);
}
if (grounded.prd_elements.length !== 4) throw new Error('Expected T11-S2 4/4 PRD elements');
if (grounded.validation.approved_item_coverage !== '4/4') throw new Error('Expected 4/4 approval coverage');
if (!grounded.validation.template_compliant || !grounded.validation.json_markdown_synchronized) throw new Error('Template validation flags failed');
if (grounded.validation.groundedness_percent !== 100 || grounded.validation.unsupported_claims !== 0) throw new Error('Grounding controls failed');
for (const expected of [
  'No approved personas were supplied.',
  'No approved acceptance criteria were supplied.',
  'No out-of-scope items were specified in the approved inputs.',
  'No dependencies were specified in the approved inputs.',
  'No assumptions were specified in the approved inputs.',
  'No approved open questions were supplied.',
]) {
  if (!grounded.markdown.includes(expected)) throw new Error('Empty-section policy failed: ' + expected);
}

console.log(JSON.stringify({
  result: 'PASS',
  fixture: 'T11-S2',
  template_sections: grounded.validation.template_sections,
  approved_item_coverage: grounded.validation.approved_item_coverage,
  prd_elements: grounded.prd_elements.length,
  groundedness_percent: grounded.validation.groundedness_percent,
  unsupported_claims: grounded.validation.unsupported_claims,
}, null, 2));
