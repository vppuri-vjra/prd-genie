import fs from 'node:fs';

const base = 'evaluation/fixtures/multi-source/realistic-v1';
const packet = JSON.parse(fs.readFileSync(`${base}/source-packet.json`, 'utf8'));
const decisions = {
  'SRC-REALISTIC-PB-001': {
    3:'stakeholder_candidate',4:'document_metadata',5:'document_metadata',8:'requirement_candidate',11:'persona_requirement_candidate',12:'persona_requirement_candidate',13:'persona_requirement_candidate',16:'requirement_candidate',17:'requirement_candidate',18:'requirement_candidate',19:'persona_requirement_candidate',20:'requirement_candidate',23:'constraint_candidate',24:'constraint_candidate',25:'nonfunctional_candidate',26:'deadline_candidate',29:'missing_information',30:'missing_information',31:'missing_information_suggestion',34:'context_only',35:'context_only'
  },
  'SRC-REALISTIC-MT-001': {
    12:'requirement_candidate',14:'question_context',16:'nonfunctional_candidate',18:'missing_information',20:'requirement_candidate',22:'question_context',24:'mixed_candidate',26:'missing_information',28:'missing_information',36:'vague_context',38:'question_context',40:'ambiguous_fragment',42:'missing_information',44:'context_only',52:'requirement_candidate',54:'risk_context',56:'mixed_candidate',58:'requirement_candidate',60:'solution_suggestion',62:'requirement_candidate',64:'risk_candidate',66:'unresolved_contradiction',74:'mixed_candidate',76:'feasibility_context',78:'acceptance_rationale',80:'solution_suggestion',82:'constraint_candidate',90:'ambiguous_fragment',91:'ambiguous_fragment',92:'missing_information',93:'dependency_fragment',94:'missing_information',95:'schedule_context'
  },
  'SRC-REALISTIC-SN-001': {
    10:'mixed_candidate',12:'constraint_suggestion',14:'mixed_candidate',16:'estimate_context',22:'requirement_candidate',24:'contradiction_candidate',26:'scope_suggestion',28:'feature_suggestion',34:'deadline_candidate',36:'deadline_risk_candidate',38:'vague_requirement',40:'feature_suggestion',42:'missing_information',48:'requirement_candidate',50:'scope_question',52:'requirement_candidate'
  }
};

const reviewed = [];
for (const source of packet.sources) {
  const sourceDecisions = decisions[source.source_id] || {};
  for (const citation of source.citations) {
    const line = Number(citation.location.split(':')[1]);
    reviewed.push({
      source_id: source.source_id,
      source_type: source.source_type,
      location: citation.location,
      quote: citation.quote,
      speaker: citation.speaker,
      disposition: sourceDecisions[line] || 'UNREVIEWED'
    });
  }
}

const output = {
  schema_version: '1.0.0',
  packet_id: packet.packet_id,
  review_status: 'approved',
  policy: {
    citations_are_evidence_candidates_not_automatic_requirements: true,
    preserve_conflicts_without_resolution: true,
    preserve_suggestions_as_suggested: true,
    vague_fragments_become_missing_information_not_requirements: true,
    context_only_lines_do_not_create_items: true
  },
  reviewed_citations: reviewed
};
fs.writeFileSync(`${base}/citation-review.json`, `${JSON.stringify(output, null, 2)}\n`);
