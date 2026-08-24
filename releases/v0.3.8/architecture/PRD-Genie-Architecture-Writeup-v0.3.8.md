# PRD Genie Architecture Write-up — v0.3.8

**Formal submission baseline — use for grading and all acceptance claims:** n8n execution `11901` · run `RUN-S2-11902-16e7090e`

**Supplementary demonstration evidence only — does not replace the formal baseline:** n8n execution `11958` · run `RUN-S2-11959-16e7090e`

## Problem summary

NeuronForge PMs and TPMs manually reconcile product briefs, meeting transcripts, stakeholder notes, and clarifications before creating PRDs and delivery backlogs. This process is slow, inconsistent, and difficult to audit because evidence, decisions, and downstream artifacts can drift apart. PRD Genie creates a governed path from authoritative evidence to planning-ready documentation while retaining human approval, visible uncertainty, and source-to-delivery traceability.

**Auditable input-set evolution:** the project began with three immutable discovery sources (`product-brief.txt`, `meeting-transcripts.txt`, and `stakeholder-notes.txt`). The governed clarification history then added three human-authored decision sources dated August 7, 2026. Formal baseline execution `11901` consumed the resulting six-document approved packet. Later decisions preserve original statements and use explicit decision IDs and supersession scope rather than rewriting history.

## Architecture diagram

The approved system architecture is shown on slide 7 of the [v0.3.8 presentation](../presentation/PRD-Genie-Capstone-Presentation-v0.3.8.pdf). Six approved Google Drive inputs enter a manual n8n parent workflow that coordinates seven governed stages and non-blocking sizing. OpenAI supplies constrained semantic reasoning; Langfuse records traces, evaluators, latency, tokens, and cost; deterministic controls and human approval govern release; and seven validated artifacts are delivered to Google Drive.

## Tool selection rationale

| Category | Selection and rationale |
| --- | --- |
| Workflow platform | **n8n Cloud** — visual parent/child orchestration, Google Drive integration, manual triggers, deterministic code nodes, and exportable JSON workflows. |
| Language model | **OpenAI GPT-5.6 Terra** — structured, evidence-grounded extraction, analysis, document generation, decomposition, and advisory sizing under bounded prompts. |
| APIs and storage | **Google Drive** — controlled source intake and run-specific delivery with file identity, hashes, and artifact receipts. |
| Observability | **Langfuse** — correlated traces, code and semantic evaluator results, latency, token usage, and fully loaded cost. |
| Versioned evidence | **GitHub, Obsidian, and vjra.us** — reproducible workflows and evidence, working documentation, and an evaluator-facing published index. |

## Orchestration pattern and justification

PRD Genie uses a **sequential parent/child pipeline with conditional fail-closed branches**. Each downstream artifact depends on a validated upstream contract: intake precedes extraction; extraction precedes gap analysis; human approval precedes production generation; the PRD precedes story decomposition; and reconciliation precedes export. Clarification, rejection, validation failure, and human revision stop or redirect the run instead of allowing unsupported content to propagate. Specialized child workflows remain independently testable while one parent run identity connects sources, decisions, artifacts, evaluations, and delivery.

### Why Gap Analysis follows Requirement Extraction

The Requirement Extractor first creates a normalized, citation-linked statement of what the evidence says. The Gap Analyzer then tests that structured result for missing information, ambiguity, contradiction, dependencies, risks, and generation readiness before human approval or document generation. This placement is intentionally fail-fast: unresolved evidence cannot be silently converted into polished PRD content, and the system avoids the cost and rework of generating a PRD and stories that must later be discarded. Post-generation validators still check grounding, structure, coverage, and cross-stage reconciliation; they complement rather than replace the pre-generation Gap Analyzer.

## Agent and control responsibilities

| Stage | Input → output | Responsibility and key rules |
| --- | --- | --- |
| Drive Intake + Clarification | Approved files → normalized, hashed evidence | Verify the required current-run source set; preserve identity and provenance; stop for missing inputs. |
| Requirement Extractor | Evidence segments → citation-linked requirements | Extract only supported requirements, constraints, NFRs, stakeholders, and dates; never invent missing facts. |
| Gap Analyzer | Requirements → gaps, conflicts, questions, route | Expose ambiguity and contradiction; do not silently resolve uncertainty; route insufficient evidence to clarification. |
| Human Approval | Evidence + gaps → signed dispositions | Authorize scope and decisions; no approval means no production generation. |
| Production PRD | Approved evidence → ten-section PRD | Generate only approved content; preserve stable IDs; mark controlled unknowns rather than fabricate. |
| Story Breakdown | Validated PRD → Epics, Features, Stories, criteria | Preserve requirement lineage and hierarchy; reject duplicates, orphans, or unsupported decomposition. |
| Final Validator + Export | All governed artifacts → authorized delivery | Reconcile sets and bidirectional mappings; Agreement Gate fails closed; export only validated artifacts. |
| Post-story Sizing | Approved stories → size, confidence, guidance | Provide non-blocking advisory estimates; never represent AI sizing as an engineering commitment. |

## Cost analysis

Formal baseline execution `11901` used **545,467 tokens** at a fully loaded cost of **$1.474409**: 59,922 generation tokens costing $0.228024 and 485,545 tokens across 41 evaluator calls costing $1.246385. At one fully evaluated run per user per week, the modeled average is approximately **$0.21 per user per day** and **$6.38 per user per month**. Code-first controls, removal of duplicate semantic evaluation, stage-specific judges, and lighter routine monitoring are the principal cost controls.

## Evaluation strategy and production metrics

1. **Accuracy and completeness:** percentage of governed requirement, acceptance-criteria, and hierarchy IDs reconciled from source through export; target 100% with zero orphans.
2. **Trustworthiness:** unsupported-claim count and stage hallucination score; target zero unsupported claims and hallucination at or below the enforced 0.15 threshold.
3. **Usefulness and efficiency:** planning artifacts accepted without rework, reviewer time saved, latency, adoption, and fully loaded cost per governed run.

Evaluation combines T1–T12 ground truth, deterministic schema/exact-value/set controls, Langfuse code evaluation, semantic faithfulness and hallucination judges, sizing reasonableness, and the fail-closed Agreement Gate.

## Testing observations and fixes

- Detailed, vague, contradictory, incomplete, persona, technical, dependency, and empty inputs showed that typed contracts and explicit insufficient-information behavior prevent polished but unsupported outputs.
- Early semantic failures exposed hallucination and incomplete-score risks; prompts were tightened, trace correlation was made strict, and the Agreement Gate was configured to hold incomplete or failing evidence for human review.
- Cross-stage duplicate and orphan risks were addressed with stable IDs, set equality, bidirectional lineage, and final reconciliation before export.
- Duplicate semantic scoring increased cost without adding coverage; removing it retained quality controls while reducing evaluator overhead.

**Accepted result:** execution `11901` completed in 2m 33.201s, authorized release, reconciled 145/145 citation dispositions with zero orphaned governed records, delivered seven validated artifacts, and sized 11/11 stories. Execution `11958` is supplementary demonstration evidence and does not replace the formal baseline.
