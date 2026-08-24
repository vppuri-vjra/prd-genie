# Q3 — Build PRD Orchestrator

This is the complete written response for **Q3**. The presentation uses a concise summary and links back to this evidence.

**Formal submission baseline — use for grading and all acceptance claims:** v0.3.8 · n8n execution `11901` · run `RUN-S2-11902-16e7090e`

**Supplementary demonstration evidence only — does not replace the formal baseline:** n8n execution `11958` · run `RUN-S2-11959-16e7090e`
**Published view:** https://vjra.us/prd-genie.html#q3-build-architecture

## A governed multi-agent pipeline from source evidence to planning-ready delivery

Specialized agents accelerate documentation without replacing product judgment. PRD Orchestrator ingests six approved source documents, extracts and clarifies requirements, requires human approval, generates a corrected PRD, creates a dynamic Epic–Feature–User Story hierarchy, validates bidirectional traceability, and proposes non-blocking story sizes.

The v0.3.8 candidate uses the complete governed topology, restores sizing evaluation, removes duplicate semantic scoring, and captures fully loaded token and cost evidence.

**Input-set evolution:** three immutable discovery sources were followed by three human-authored clarification records dated August 7, 2026. Formal execution `11901` consumed the resulting six-document approved packet; decision IDs and bounded supersession preserve both original evidence and current governing state.

### Architecture

| Layer | Component | Responsibility | Evidence boundary |
| --- | --- | --- | --- |
| Source | Google Drive Inputs | Authoritative six-file runtime input | Drive ID, filename, normalized content, hash, retrieval time |
| Orchestration | n8n parent + seven stages + sizing | Run creation, structured handoffs, fail-closed routing | Run ID, workflow IDs, parent/child executions, contracts |
| Intelligence | OpenAI model calls | Extraction, gap analysis, PRD, story decomposition, sizing | Constrained outputs with exact evidence references |
| Human governance | Approval workflow | Business decisions, approved scope, citation dispositions | Signed approval lineage and terminal outcomes |
| Assurance | Code validators + Agreement Gate | Schema, sets, grounding, hierarchy, duplicates, orphans | Deterministic results and release authorization |
| Observability | Langfuse | Traces, evaluators, latency, tokens, cache, cost | Accepted parent/stage traces and evaluator evidence |
| Delivery | Google Drive Outputs | Validated Markdown and JSON artifact storage | Artifact identity, run association, delivery receipt |
| Evidence | GitHub · Obsidian · vjra.us | Version control, living inventory, submission walkthrough | Commits, snapshots, exported workflows, published views |

The Gap Analyzer immediately follows Requirement Extraction to test the normalized, citation-linked contract before approval or PRD generation. This fail-fast boundary prevents unresolved gaps from becoming polished content; downstream validators separately check grounding, coverage, structure, and reconciliation.

### Delivered capability

- Extraction: requirements, NFRs, stakeholders, constraints, and deadlines.
- Clarification: ambiguity and missing information remain explicit.
- PRD: corrected ten-section document with feature criteria.
- Delivery: 3 Epics · 7 Features · 11 Stories · 11 criteria.
- Validation: schema, grounding, reconciliation, and Agreement Gate.
- Export: seven validated run-specific artifacts.
- Gap analysis: missing information, conflicts, dependencies, and risks.
- Human-in-the-loop: approval before production generation.
- Traceability: 145/145 citations with forward and reverse lineage.
- Integrity: zero orphaned governed records.
- Sizing: 11/11 proposed sizes with confidence and rationale.

### Formal baseline evaluator results

| Stage | Code controls | Faithfulness | Hallucination | Additional result |
| --- | --- | --- | --- | --- |
| Gap Analyzer | Passed | 0.90 | 0.01 | Gaps preserved without unsupported resolution |
| Human Approval | Passed | 0.99 | 0.00 | Approval lineage preserved |
| Production PRD | Passed | 0.99 | 0.05 | Required ten-section structure present |
| Story Breakdown | 1.00 | 0.98 | 0.02 | 11 stories and criteria reconciled |
| Scope Estimator (T-shirt size estimates) | 1.00 | 1.00 | 0.00 | Reasonableness 1.00 |

T1–T10 test detailed, vague, contradictory, incomplete, persona, technical, dependency, and empty inputs. T11 validates PRD generation; T12 validates Epic and Story generation. Exact values are preserved, ambiguity is flagged without invention, acceptance criteria are preserved and mapped, and evidence is retained through n8n executions, Langfuse traces, and result files.

### Accepted execution

- Parent execution: `11901`
- Run ID: `RUN-S2-11902-16e7090e`
- Duration: 2m 33.201s
- Agreement Gate: Release authorized
- Candidate status: Accepted v0.3.8 submission baseline

### Cost and evaluation strategy

| Cost component | Tokens | Cost | Operating interpretation |
| --- | --- | --- | --- |
| Pipeline generation | 59,922 | $0.228024 | Core agent generation and transformation |
| 41 evaluator calls | 485,545 | $1.246385 | Deterministic controls are free; semantic evaluation drives loaded cost |
| Fully loaded total | 545,467 | $1.474409 | Accepted candidate baseline for approximately one governed run per week |

At one fully evaluated run per user per week, the modeled average is approximately **$0.21 per user per day** and **$6.38 per user per month**.

Cost control strategy: execute code controls first, remove duplicate semantic evaluators, apply stage-specific LLM judges only where needed, monitor cached and total tokens, retain full evaluation for candidate acceptance, and use lighter routine monitoring only after governance approval.

### Q3 rubric coverage

| Criterion | Points | Evidence |
| --- | --- | --- |
| Architecture, orchestration, tool rationale | 10 | System diagram, logical flow, technical layers, selection rationale |
| Core capabilities end to end | 12 | Extraction through validated export |
| Extended capability | 8 | Gap analysis, human approval, traceability, sizing |
| Observability connected | 5 | n8n evidence and Langfuse code/LLM results |
| Baseline dataset tested | 5 | T1–T12 ground truth, outputs, traces, documented results |
| Cost and evaluation strategy | 5 | Loaded tokens, cost, thresholds, optimization strategy |
| **Total** | **45** | Fully represented |

**Q3 conclusion:** The solution's principal contribution is not unrestricted document generation. It is the combination of specialized agents, evidence grounding, visible uncertainty, human approval, bidirectional traceability, deterministic validation, semantic evaluation, and fail-closed release control.
