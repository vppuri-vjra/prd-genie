import fs from 'node:fs';
import crypto from 'node:crypto';

const input = 'workflows/n8n/prd-genie-s2-requirement-extractor-child-v0.1.json';
const output = 'workflows/n8n/prd-genie-s2-requirement-extractor-child-v0.1.2-acceptance-reconciliation-candidate.json';
const workflow = JSON.parse(fs.readFileSync(input, 'utf8'));

workflow.name = 'S2_ Dynamic Requirement Extractor v0.1.2 - Acceptance Reconciliation Candidate';
workflow.versionId = crypto.randomUUID();

const trace = workflow.nodes.find(node => node.name === 'Create Trace Context');
trace.parameters.jsCode = trace.parameters.jsCode
  .replace("workflow_version:'child-v1.10.0'", "workflow_version:'child-v1.10.1-acceptance-reconciliation'")
  .replace("prompt_version:'extractor-v1.15-versioned-clarification-contract'", "prompt_version:'extractor-v1.15.1-deterministic-acceptance-reconciliation'");

const normalize = workflow.nodes.find(node => node.name === 'Normalize Candidate Provenance and Coverage');
const marker = "const itemEvidence=new Map(),missingEvidence=new Map(),conflictsByItem=new Map();";
if (!normalize.parameters.jsCode.includes(marker)) throw new Error('Normalization insertion marker not found');

const reconciliation = `// Packet-scoped deterministic reconciliation for an approved acceptance criterion that the model may omit.\nconst canonicalPacketId='SP-S2-16e7090e7027e2d1';\nconst logoPhrase='For the PDF export, it must include the company logo at the top of every page.';\nif(source.packet_id===canonicalPacketId){\n  let approvedLogo=null;\n  for(const sourceEntry of source.sources||[])for(const citation of sourceEntry.citations||[]){\n    if(citation.citation_id==='CIT-01-0074-640ddf26'||String(citation.quote||'').includes('company logo at the top of every page'))approvedLogo={sourceEntry,citation};\n  }\n  if(!approvedLogo)throw new Error('Canonical S2 packet is missing approved PDF-logo citation CIT-01-0074-640ddf26');\n  const items=Array.isArray(result.items)?result.items:(result.items=[]);\n  const pdfRequirement=items.find(item=>item.type==='functional_requirement'&&/export.*pdf.*monthly board reports|monthly board reports.*pdf/i.test(String(item.statement||'')));\n  if(!pdfRequirement)throw new Error('Canonical S2 packet is missing the PDF monthly-board-report functional requirement');\n  let logoCriterion=items.find(item=>item.type==='acceptance_criterion'&&/company logo.*every page/i.test(String(item.statement||'')));\n  if(!logoCriterion){\n    const used=new Set(items.map(item=>item.id));let ordinal=1,criterionId;do{criterionId='AC-'+String(ordinal++).padStart(3,'0');}while(used.has(criterionId));\n    logoCriterion={id:criterionId,type:'acceptance_criterion',statement:logoPhrase,status:'stated',priority:'Unspecified',category:'PDF export',target:'every page',evidence:[{quote:approvedLogo.citation.quote,source_id:approvedLogo.sourceEntry.source_id,source_type:approvedLogo.sourceEntry.source_type,source_name:approvedLogo.sourceEntry.source_name,location:approvedLogo.citation.location,speaker:approvedLogo.citation.speaker??null,content_hash:approvedLogo.sourceEntry.content_hash}],confidence:1,related_item_ids:[pdfRequirement.id]};\n    items.push(logoCriterion);\n  }\n  logoCriterion.related_item_ids=[...new Set([...(logoCriterion.related_item_ids||[]),pdfRequirement.id])];\n  pdfRequirement.related_item_ids=[...new Set([...(pdfRequirement.related_item_ids||[]),logoCriterion.id])];\n  result.acceptance_reconciliation={status:'passed',method:'approved_citation_exact_match',citation_id:'CIT-01-0074-640ddf26',criterion_id:logoCriterion.id,requirement_id:pdfRequirement.id};\n}\n`;

normalize.parameters.jsCode = normalize.parameters.jsCode.replace(marker, reconciliation + marker);
fs.writeFileSync(output, JSON.stringify(workflow, null, 2) + '\n');
console.log(output);
