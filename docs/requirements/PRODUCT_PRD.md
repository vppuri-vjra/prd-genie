---
title: PRD Genie Product Requirements Document
version: 0.3.8
status: Accepted submission baseline
last_updated: 2026-08-24
owner: Vipin Puri
---

# PRD Genie Product Requirements Document

## 1. Product overview

PRD Genie is an AI-powered documentation assistant that converts meeting transcripts, product briefs, stakeholder notes, and approved evaluation inputs into grounded requirements, a structured PRD, and traceable epics and user stories. It uses a sequential multi-agent workflow with explicit gap handling, human approval, structured contracts, and Langfuse observability.

## 2. Goals and objectives

- Reduce manual product-documentation effort.
- Produce consistent PRDs using the supplied ten-section template.
- Preserve exact names, numbers, dates, versions, thresholds, and units.
- Maintain 100% traceability for factual generated content and a 0% unsupported-claim target.
- Make ambiguity, contradictions, dependencies, risks, and missing information visible.
- Demonstrate reproducible agentic orchestration and evaluation for the capstone.

### Product success metrics

| Metric | Definition | Target |
|---|---|---|
| Extraction completeness | Required ground-truth elements captured / total required elements | 100% conformance to approved T1-T10 expected outcomes |
| Unsupported-claim rate | Unsupported factual items / total factual items | 0% |
| PRD format compliance | Required template sections produced correctly / total required sections | 100% |
| Exact-value preservation | Required exact values preserved / total required exact values | 100% |
| Story traceability | Stories with approved source requirement IDs / total stories | 100% |

## 3. User personas

| Persona | Need |
|---|---|
| PM or TPM | Convert fragmented source material into structured, reviewable documentation faster |
| Engineering reviewer | Receive clear requirements and stories with evidence and unresolved issues exposed |
| Stakeholder approver | Review what was stated, suggested, missing, or contradictory before generation proceeds |
| Evaluator or grader | Reproduce tests and inspect architecture, outputs, traces, cost, and decisions |

No additional demographic or organizational attributes are assumed.

## 4. Feature requirements

Every product requirement links to the business or project requirement it supports and identifies whether its implementation is directly required, derived as a measurable control, or selected through an architecture decision.

### Functional requirements

| ID | Requirement | Category | Priority | BRD link | Source | Classification |
|---|---|---|---|---|---|---|
| FR-001 | Accept meeting transcripts, product briefs, stakeholder notes, and evaluation-test text through a normalized workflow input contract. | Input management | Must Have | BR-001, BR-002 | SRC-PS inputs; SRC-ADR-002 structured contract | Direct requirement plus design decision |
| FR-002 | Extract functional and non-functional requirements, acceptance criteria, personas, stakeholders, constraints, deadlines, dependencies, assumptions, risks, contradictions, and missing information. | Requirement Extraction | Must Have | BR-002, BR-004, BR-005 | SRC-PS required capabilities and evaluation cases | Direct source requirement |
| FR-003 | Attach source evidence and stable identifiers to extracted factual items. | Grounding and traceability | Must Have | BR-004, BR-005 | SRC-GP; SRC-ADR-002 | Derived control plus design decision |
| FR-004 | Analyze gaps and produce targeted clarification questions without inventing answers. | Gap Analysis | Must Have | BR-003, BR-005 | SRC-PS extended capability; SRC-ADR-001 selects Gap Analysis | Direct requirement plus design decision |
| FR-005 | Gate generation according to sufficiency, ambiguity, contradiction, and no-requirement conditions. | Generation safety | Must Have | BR-004, BR-005 | SRC-GP generation gate | Derived architecture control |
| FR-006 | Require a recorded human decision before PRD generation. | Human approval | Must Have | BR-006 | SRC-ADR-001 | Architecture decision |
| FR-007 | Generate a Markdown PRD using only approved extraction content and the official ten-section template. | PRD generation | Must Have | BR-002, BR-004 | SRC-PS PRD capability; SRC-PT official template | Direct source requirement |
| FR-008 | Represent unsupported mandatory PRD fields as `TBD - stakeholder input required` and create open questions. | Missing-information handling | Must Have | BR-004, BR-005 | SRC-PT mandatory sections; SRC-GP | Derived grounding control |
| FR-009 | Generate epics, features, and `As a [user], I want [capability], so that [benefit]` stories from the approved PRD. | Story breakdown | Must Have | BR-002, BR-004 | SRC-PS story-breakdown capability | Direct source requirement |
| FR-010 | Preserve requirement IDs through PRD and story outputs. | Cross-stage traceability | Must Have | BR-004 | SRC-GP; SRC-ADR-002 | Derived control plus design decision |
| FR-011 | Record agent-level and run-level evidence in Langfuse. | Observability | Must Have | BR-007 | SRC-PS evaluation; SRC-PB Step 6; SRC-ADR-001 | Direct requirement plus tool decision |
| FR-012 | Validate structured outputs before allowing downstream execution. | Validation | Must Have | BR-004, BR-007 | SRC-ADR-002; SRC-GP | Architecture decision |
| FR-013 | Export seven run-specific Markdown and JSON artifacts after release authorization. | Output management | Must Have | BR-002, BR-008 | SRC-PS output/tools and submission guidance; SRC-IR | Direct and instructor requirement |
| FR-014 | Propose non-blocking T-shirt sizes, confidence, rationale, and refinement guidance for validated stories. | Planning readiness | Should Have | BR-001, BR-002 | Approved v0.3.8 extension | Product extension with human-review boundary |

### Non-functional requirements

| ID | Requirement | Category | Target | BRD link | Source | Classification |
|---|---|---|---|---|---|---|
| NFR-001 | Every factual generated item shall be supported by approved source evidence or an approved upstream requirement ID. | Grounding | 100% factual traceability | BR-004 | SRC-PS grounding; SRC-GP | Source-supported objective plus derived target |
| NFR-002 | The final evaluated baseline shall contain zero unsupported requirements. | Quality | 0 unsupported claims | BR-004 | SRC-PS evaluation; SRC-GP | Derived release target |
| NFR-003 | JSON stage outputs shall validate against versioned JSON Schema Draft 2020-12 contracts. | Reliability | 100% accepted stage outputs structurally valid | BR-004, BR-007 | SRC-ADR-002 | Architecture decision and measurable control |
| NFR-004 | Exact names, numbers, dates, API versions, thresholds, and units shall be preserved. | Data fidelity | 100% of required exact values preserved | BR-004, BR-005 | SRC-PS extraction/evaluation requirements; SRC-GP | Direct source requirement |
| NFR-005 | Credentials and secret values shall not be stored in GitHub, exported workflows, screenshots, or documentation. | Security | 0 exposed secrets | BR-008 | SRC-RG security policy | Derived security control |
| NFR-006 | Every LLM stage shall expose input, output, prompt version, model, latency, token usage, cost, errors, run ID, and test ID where available. | Observability | 100% of LLM stages traced | BR-007 | SRC-PS evaluation; SRC-PB Step 6; SRC-ADR-001 | Direct requirement plus tool decision |
| NFR-007 | The repository shall be public, organized, documented, and reproducible for graders. | Reproducibility | All required artifacts linked and reproducible | BR-008 | SRC-PS submission; SRC-PB Step 7 | Direct submission requirement |
| NFR-008 | Material ambiguity or blocking contradiction shall stop or defer generation rather than be resolved automatically. | Safety | 0 downstream generations when gate decision blocks | BR-005, BR-006 | SRC-PS ambiguity behavior; SRC-GP; SRC-ADR-001 | Direct behavior plus architecture control |

### Requirement-source register

This PRD reuses the source IDs defined in `docs/requirements/BRD.md` and adds the following implementation sources:

| Source ID | Source | Relevant coverage |
|---|---|---|
| SRC-PT | `Resources/prd_template.md` | Official ten-section PRD output structure |
| SRC-ADR-002 | `docs/decisions/ADR-002-structured-contracts.md` | Versioned JSON contracts, validation, evidence, and stable identifiers |
| SRC-RG | `docs/REPOSITORY_GUIDE.md` | Public-repository security, privacy, evidence, and reproducibility rules |

`SRC-PS`, `SRC-PB`, `SRC-IR`, `SRC-ADR-001`, and `SRC-GP` retain the meanings defined in the BRD source register.

## 5. Acceptance criteria

1. T1-T10 Requirement Extraction cases are executed against approved ground truth and documented.
2. T11 produces all ten PRD sections using only the approved T1 extraction.
3. T12 produces grounded epics, features, and user stories traceable to approved requirements.
4. Empty or insufficient input does not generate unsupported requirements or a PRD.
5. Contradictions are preserved and surfaced for resolution.
6. Exact required values are not altered.
7. The human approval record controls PRD-generation eligibility.
8. Each successful LLM stage produces correlated Langfuse trace and evaluator evidence; the accepted run also preserves fully loaded usage and cost.
9. Invalid structured output fails visibly and does not silently continue downstream.
10. The final repository contains the required documentation and submission artifacts.
11. Final validation reconciles 145/145 citation dispositions and all governed PRD and delivery IDs with zero orphans before export.
12. Post-export sizing returns advisory results for 11/11 stories without controlling release authorization.

## 6. Out of scope

- Automatic approval of requirements.
- Autonomous resolution of product conflicts.
- Production-scale identity, access-management, or content-governance integrations.
- Fine-tuning as a required capability.
- RAG unless later evidence shows that it is necessary for the supplied scope.
- Generating unsupported business goals, personas, benefits, priorities, timelines, or success metrics.

## 7. Dependencies

| Dependency | Status |
|---|---|
| n8n Cloud workflow environment | Available |
| OpenAI model access | Available |
| Langfuse US project and credentials | Available |
| Supplied resource files and PRD template | Available and treated as read-only |
| Human review for ground truth and approval steps | Available; project owner is the capstone reviewer, with future production role ownership outside scope |
| Public GitHub repository | Available |
| Obsidian project vault | Available |

## 8. Assumptions

- Markdown is the primary output format for the MVP.
- The same sequential flow is appropriate for all supported source types after normalization.
- Human review is feasible before PRD generation.
- Missing source information may be represented as explicit TBDs but may not be invented.
- The four-iteration capability sequence was completed on a compressed schedule for v0.3.8.

## 9. Resolved submission decisions and future product questions

- **Operating-cost model:** one fully evaluated run per user per week; formal execution `11901` models to approximately `$0.21` per user per day and `$6.38` per user per month.
- **Extraction acceptance:** 100% conformance to the human-reviewed expected outcomes across the final T1-T10 baseline.
- **Human approver:** the signed Human Approval workflow is mandatory; the project owner serves as capstone reviewer for the accepted demonstration path.
- **Submission formats:** Markdown remains the product-output format; the submission also includes DOCX/PDF architecture write-up, PPTX/PDF presentation, JSON workflows and evidence, screenshots, HTML trace evidence, and a linked MP4 demonstration.
- **Evidence packaging:** complete submission-safe exports and screenshots are stored in GitHub; live n8n, Langfuse, and Google Drive records remain external with their identifiers and captured evidence preserved.
- **Future product validation:** production time saved, adoption, role-based approval ownership, and routine-versus-release evaluation profiles require a controlled PM pilot.

## 10. Timeline

| Iteration | Formal plan | Outcome |
|---|---|---|
| 1 | Week 1 | BRD, PRD, architecture baseline, ADRs, contracts, Requirement Extractor, Langfuse, and T1-T10 |
| 2 | Week 2 | T10 correction, ground truth, documentation refinement, and evaluation controls |
| 3 | Week 3 | Gap Analyzer, Human Approval, PRD Generator, Story Breakdown, T11-T12, and connected pipeline |
| 4 | Week 4 | Final regression, cost and metrics, assignments, screenshots, slides, demo, and submission audit |

All four capability increments are complete for the accepted v0.3.8 submission baseline. Historical progress is retained in `docs/planning/ITERATION_PLAN.md`; final operational evidence is anchored to execution `11901` / `RUN-S2-11902-16e7090e`.

## 11. Accepted v0.3.8 result

- Nine coordinated workflow exports.
- Six authoritative input documents and 145 indexed citations.
- Three Epics, seven Features, eleven User Stories, and eleven mapped acceptance criteria.
- 145/145 citation dispositions, 100% governed reconciliation, and zero orphaned records.
- Seven validated delivery artifacts and 11/11 advisory sizing results.
- Agreement Gate release authorization.
- Formal baseline usage of 545,467 tokens at `$1.474409` fully loaded cost.
- Supplementary execution `11958` is demonstration evidence only and does not replace formal execution `11901`.
