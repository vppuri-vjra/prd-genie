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
for (const element of grounded.prd_elements) {
  if (element.type === 'deadline') {
    const row = grounded.prd_document.timeline.find(item => (item.source_requirement_ids || []).includes(element.item_id));
    if (!row || !grounded.markdown.includes(row.milestone) || !grounded.markdown.includes(row.target_date)) throw new Error('JSON/Markdown timeline mismatch ' + element.item_id);
  } else if (element.type === 'persona') {
    const persona = grounded.prd_document.user_personas.find(item => (item.source_requirement_ids || []).includes(element.item_id));
    if (!persona || !grounded.markdown.includes(persona.name_or_role) || !grounded.markdown.includes(element.item_id)) throw new Error('JSON/Markdown persona mismatch ' + element.item_id);
  } else if (!grounded.markdown.includes(element.statement)) throw new Error('JSON/Markdown mismatch ' + element.item_id);
}

const expectedHeadings = [
  '## 1. Product Overview',
  '## 2. Goals and Objectives',
  '## 3. User Personas',
  '## 4. Feature Requirements',
  '### 4.1 Functional Requirements',
  '### 4.2 Non-Functional Requirements',
  '## 5. Acceptance Criteria',
  '## 6. Out of Scope',
  '## 7. Dependencies and Risks',
  '### 7.1 Dependencies',
  '### 7.2 Risks',
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
if ((grounded.prd_document.dependencies || []).some(item => (item.source_requirement_ids || []).some(id => id.startsWith('RSK-')))) throw new Error('Risk was classified as dependency');
if (!grounded.markdown.includes('### 7.2 Risks')) throw new Error('Risks subsection missing');
for (const item of grounded.prd_document.timeline || []) {
  if (item.target_date !== 'TBD - stakeholder input required' && !/^20\d{2}-\d{2}-\d{2}$/.test(item.target_date)) throw new Error('Timeline target date is not ISO formatted');
  if (/\b20\d{2}-\d{2}-\d{2}\b/.test(item.milestone)) throw new Error('Timeline milestone contains its target date');
}
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

const mappingFixture = structuredClone(fixture);
const risk = {
  id: 'RSK-001', type: 'risk', statement: "If we don't ship by Q3, we risk losing at least one of the top 3 enterprise accounts.", status: 'stated',
  evidence: [{ source_id: 'SRC-T11', location: 'line:5' }],
};
const deadlines = [
  ['DDL-101', 'Designs complete 2026-08-21.'],
  ['DDL-102', 'Internal basic version 2026-09-04.'],
  ['DDL-103', 'Launch 2026-09-30.'],
  ['DDL-104', 'Sarah will manage the budget separately by September 10, 2026.'],
].map(([id, statement], index) => ({ id, type: 'deadline', statement, status: 'stated', evidence: [{ source_id: 'SRC-T11', location: 'line:' + (6 + index) }] }));
mappingFixture.requirement_extraction.items.push(risk, ...deadlines);
mappingFixture.approved_item_ids.push('RSK-001', ...deadlines.map(item => item.id));
mappingFixture.source_packet.citation_inventory.push(
  { source_id: 'SRC-T11', location: 'line:5', citation_id: 'CIT-T11-05' },
  ...deadlines.map((item, index) => ({ source_id: 'SRC-T11', location: 'line:' + (6 + index), citation_id: 'CIT-T11-' + String(6 + index).padStart(2, '0') })),
);
const mappingGenerated = await run('Generate Dynamic Grounded PRD', mappingFixture);
await run('Validate Approval to PRD Coverage', mappingGenerated);
if (mappingGenerated.prd_document.dependencies.length !== 0) throw new Error('Risk/dependency regression failed');
if (mappingGenerated.prd_document.risks.length !== 1 || !mappingGenerated.markdown.includes('**RSK-001:**')) throw new Error('Risk rendering regression failed');
const expectedTimeline = [
  ['Designs complete', '2026-08-21'],
  ['Internal basic version', '2026-09-04'],
  ['Launch', '2026-09-30'],
  ['Sarah will manage the budget separately', '2026-09-10'],
];
for (const [milestone, target] of expectedTimeline) {
  if (!mappingGenerated.prd_document.timeline.some(item => item.milestone === milestone && item.target_date === target)) throw new Error('Timeline mapping regression failed: ' + milestone);
}
console.log(JSON.stringify({ result: 'PASS', fixture: 'PRD-risk-and-timeline-regression', risks: 1, dependencies: 0, corrected_timeline_rows: 4 }, null, 2));

const priorityFixture = structuredClone(fixture);
const priorityCases = [
  ['FR-101', 'Must support role-based access.', 'Must Have'],
  ['FR-102', 'Multi-tenant support is critical.', 'Must Have'],
  ['FR-103', 'The export should preserve formulas.', 'Should Have'],
  ['FR-104', 'Dark mode would be nice and is not critical.', 'Nice to Have'],
  ['FR-105', 'Users can filter results.', 'Unspecified'],
];
priorityFixture.requirement_extraction.items = priorityFixture.requirement_extraction.items.filter(item => item.type !== 'functional_requirement');
priorityFixture.approved_item_ids = priorityFixture.approved_item_ids.filter(id => id !== 'FR-001');
for (const [id, statement] of priorityCases) {
  priorityFixture.requirement_extraction.items.push({ id, type: 'functional_requirement', statement, status: 'stated', priority: 'Unspecified', evidence: [{ source_id: 'SRC-T11', location: 'line:' + id.slice(-1) }] });
  priorityFixture.approved_item_ids.push(id);
  priorityFixture.source_packet.citation_inventory.push({ source_id: 'SRC-T11', location: 'line:' + id.slice(-1), citation_id: 'CIT-' + id });
}
const priorityGenerated = await run('Generate Dynamic Grounded PRD', priorityFixture);
for (const [id,, expected] of priorityCases) {
  const actual = priorityGenerated.prd_document.functional_requirements.find(item => item.id === id)?.priority;
  if (actual !== expected) throw new Error(`Priority normalization failed for ${id}: ${actual}`);
}
console.log(JSON.stringify({ result: 'PASS', fixture: 'PRD-priority-normalization', cases: priorityCases.length }, null, 2));

const personaFixture = structuredClone(fixture);
personaFixture.requirement_extraction.items = [];
personaFixture.approved_item_ids = [];
personaFixture.source_packet.citation_inventory = [];
const personaCases = [
  ['PER-001', 'persona', 'Business analysts who currently export data to Excel'],
  ['PER-002', 'persona', 'Team leads who need weekly performance summaries'],
  ['PER-003', 'persona', 'Executives who want a high-level overview without digging into details'],
  ['PER-004', 'persona', 'Customers'],
  ['FR-201', 'functional_requirement', 'We are building an analytics dashboard that gives business users visibility without needing to write SQL queries or ask the data team.'],
  ['FR-202', 'functional_requirement', 'Users should be able to filter reports and export results to Excel.'],
  ['FR-203', 'functional_requirement', 'Customers want to see their own data, filtered by their account. Multi-tenant support is critical.'],
];
personaCases.forEach(([id,type,statement],index)=>{
  const location='line:'+(20+index);
  personaFixture.requirement_extraction.items.push({id,type,statement,status:'stated',evidence:[{source_id:'SRC-T11',location}]});
  personaFixture.approved_item_ids.push(id);
  personaFixture.source_packet.citation_inventory.push({source_id:'SRC-T11',location,citation_id:'CIT-'+id});
});
const personaGenerated = await run('Generate Dynamic Grounded PRD', personaFixture);
await run('Validate Approval to PRD Coverage', personaGenerated);
await run('Validate PRD Citation Grounding', personaGenerated);
if (!personaGenerated.markdown.includes('### 2.1 Proposed Business Goal') || !personaGenerated.markdown.includes('### 2.2 Proposed User Goal') || !personaGenerated.markdown.includes('### 2.3 Success Metrics')) throw new Error('Goal subsection contract failed');
if (!personaGenerated.markdown.includes('### 3.1 Business Analysts') || !personaGenerated.markdown.includes('### 3.4 Customers — Persona Definition Pending')) throw new Error('Persona numbering contract failed');
for (const internalLabel of ['Approved Source Statement', 'Key Need Classification', 'Key Need Approval Status', 'Current Workaround Classification']) {
  if (personaGenerated.markdown.includes(internalLabel)) throw new Error('Internal persona governance leaked into Markdown: '+internalLabel);
}
if (personaGenerated.prd_document.goals_and_objectives.business_goal.status !== 'derived_proposal') throw new Error('Business goal classification failed');
if (personaGenerated.prd_document.goals_and_objectives.user_goal.approval_status !== 'pending_stakeholder_confirmation') throw new Error('User goal approval status failed');
if (personaGenerated.prd_document.goals_and_objectives.success_metrics[0].value !== 'TBD - stakeholder input required') throw new Error('Success metric TBD policy failed');
const analysts=personaGenerated.prd_document.user_personas[0],customers=personaGenerated.prd_document.user_personas[3];
if (analysts.current_workaround.value !== 'Exporting data to Excel.' || analysts.key_need.status !== 'derived_proposal') throw new Error('Business analyst persona mapping failed');
if (customers.definition_status !== 'incomplete' || customers.key_need.status !== 'derived_proposal') throw new Error('Customer persona governance failed');
if (analysts.key_need.classification !== 'derived_proposal' || analysts.key_need.approval_status !== 'pending_stakeholder_confirmation' || analysts.current_workaround.status !== 'explicit') throw new Error('Persona JSON governance retention failed');
console.log(JSON.stringify({result:'PASS',fixture:'PRD-derived-overview-goals-personas',personas:personaGenerated.prd_document.user_personas.length,derived_goals:2,success_metrics:'TBD'},null,2));
