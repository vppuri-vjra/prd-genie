# Gap Analyzer Ground Truth

Dataset version: `0.1.0`

Reviewer: Vipin

Review date: 2026-08-03

Status: Approved

## Semantic evaluator adjudications — 2026-08-11

The fresh three-layer shadow evaluation raised semantic-review signals for GA-T1, GA-T4, and GA-T8. Human review confirmed the existing canonical outputs and classified the findings as evaluator-policy clarifications rather than business-source or ground-truth corrections.

| Case | Adjudication | Disposition | Canonical output |
|---|---|---|---|
| GA-T1 | `GA-T1-HUMAN-ADJUDICATION-2026-08-11` | Treat controlled non-material unknowns and mandatory human review as part of the sufficiency policy | Unchanged |
| GA-T4 | `GA-T4-HUMAN-ADJUDICATION-2026-08-11` | Separate source faithfulness from external technical-feasibility critique | Unchanged |
| GA-T8 | `GA-T8-HUMAN-ADJUDICATION-2026-08-11` | Judge deterministic routing against the approved decision policy, not business text alone | Unchanged |

Machine-readable register: `HUMAN_ADJUDICATIONS_2026-08-11.json`.

The unchanged post-adjudication v2 shadow rerun passed 10/10 deterministic and code evaluations, with 10/10 faithfulness scores at 1.00 and 10/10 hallucination scores at 0.00. See `evaluation/results/s2-gap-analyzer-adjudicated-langfuse-v2-shadow-2026-08-11.md` for the trace-level receipts. The Agreement Gate remains in shadow mode.

## Authoritative inputs

Each case consumes the corresponding human-approved Requirement Extraction canonical output under `evaluation/ground-truth/requirement-extraction/`. Raw transcripts are not passed directly to the Gap Analyzer.

## Approved cases

| Case | Extraction source | Expected decision | Grounded claims | Groundedness | Status |
|---|---|---|---:|---:|---|
| GA-T1 | `t01/expected-output.json` | `sufficient / proceed` | 8/8 | 100% | Approved |
| GA-T2 | `t02/expected-output.json` | `insufficient / request_clarification` | 13/13 | 100% | Approved |
| GA-T3 | `t03/expected-output.json` | `insufficient / request_clarification` | 9/9 | 100% | Approved |
| GA-T4 | `t04/expected-output.json` | `sufficient / proceed` | 8/8 | 100% | Approved |
| GA-T5 | `t05/expected-output.json` | `insufficient / request_clarification` | 10/10 | 100% | Approved |
| GA-T6 | `t06/expected-output.json` | `insufficient / request_clarification` | 13/13 | 100% | Approved |
| GA-T7 | `t07/expected-output.json` | `sufficient / proceed` | 8/8 | 100% | Approved |
| GA-T8 | `t08/expected-output.json` | `sufficient / proceed` | 8/8 | 100% | Approved |
| GA-T9 | `t09/expected-output.json` | `insufficient / block_generation` | 9/9 | 100% | Approved |
| GA-T10 | `t10/expected-output.json` | `partially_sufficient / proceed_with_tbd` | 10/10 | 100% | Approved |

Groundedness is calculated as `grounded evaluated claims / total evaluated claims × 100`. Deterministic workflow decisions count as grounded when every premise comes from the approved extraction and the outcome follows the approved decision matrix without adding product facts.

## Coverage

- Eligible grounded extraction: GA-T1.
- Ambiguous requirement and missing dimensions: GA-T2.
- Unresolved contradiction without invented resolution or risk: GA-T3.
- Grounded report-export behavior and acceptance criteria: GA-T4.
- Product fragments without reliable items: GA-T5.
- Combined material gaps and neutral stakeholder-viewpoint reconciliation: GA-T6.
- Exact scalability, performance, and integration requirements: GA-T7.
- Separate persona-to-capability relationships: GA-T8.
- No meaningful requirements: GA-T9.
- Grounded dependency risk with explicit TBD: GA-T10.

### T1-T10 coverage strategy

The initial Gap Analyzer dataset is a representative behavioral-coverage subset of the ten approved Requirement Extractor cases. Selection was based on distinct sufficiency, contradiction, clarification, blocking, and controlled-`TBD` paths rather than on test-number continuity. Deferred cases remain candidates for the complete Gap Analyzer regression; they were not rejected or declared irrelevant.

| Test | GA Early Identified (Y/N) | GA Early Identification Rationale | Candidate for Later GA Processing (Y/N) |
|---|---:|---|---:|
| T1 | Y | Represents the positive path: usable extraction with only non-material unknowns; expected to proceed to human approval. | N |
| T2 | Y | Covers an ambiguous requirement and missing material dimensions requiring clarification. | N |
| T3 | Y | Covers an explicit unresolved contradiction without inventing a resolution or unsupported risk. | N |
| T4 | Y | Complete extraction with grounded export behavior and acceptance criteria; approved for the positive `sufficient / proceed` path. | N |
| T5 | Y | Covers product fragments for which no reliable requirement items could be extracted. | N |
| T6 | Y | Contains approved architecture-decision, deadline, and scope gaps plus a neutral unresolved reconciliation issue; expected to request clarification. | N |
| T7 | Y | Complete extraction with exact scalability, performance, and integration requirements; approved for the positive `sufficient / proceed` path. | N |
| T8 | Y | Complete extraction with three grounded persona-to-capability relationships; approved for the positive `sufficient / proceed` path. | N |
| T9 | Y | Covers no meaningful requirements and the generation-blocking path. | N |
| T10 | Y | Covers partially sufficient input, a grounded dependency risk, and controlled `TBD` processing. | N |

`GA Early Identified: Y` means that a human-approved canonical Gap Analysis already exists in this dataset. `Candidate for Later GA Processing: Y` means that canonical Gap Analysis must still be created, human-reviewed, and approved before the case can enter the full unchanged regression batch. A `N` in the later-processing column means that the case is already included in the early dataset, not that it will be excluded from future regression runs.

### Relationship to PRD generation

All T1-T10 inputs remain in the intended end-to-end evaluation scope. The PRD Generator must not receive a case merely because its Requirement Extraction exists. It may receive only a case whose approved Gap Analysis and deterministic gate make it eligible, followed by the required human approval.

- Existing early cases use their approved canonical GA decisions.
- All T1-T10 cases now have human-approved canonical GA decisions.
- The full GA-T1-T10 regression should run unchanged before promoting this complete baseline.
- Eligible cases test PRD generation quality; clarification and blocked cases test that the PRD Generator is not invoked.

Coverage-strategy groundedness: **100% for all ten approved cases and their documented paths**.

## Approval guardrails

- No canonical output invents a requirement, answer, stakeholder, date, budget, metric, dependency, contradiction, or risk.
- Every gap links to extracted item IDs, extractor missing-information IDs, or the explicit absence of requirements.
- GA-T3 contains no downstream risk because the approved extraction does not explicitly contain one.
- `generation_allowed: true` means eligible for human review and never bypasses human approval.

## Automated evaluator

`scripts/evaluate_gap_analysis.py` validates schema compliance, decision fields, gap coverage and precision, severity, clarification questions, item and source traceability, contradictions, risks, and groundedness percentage.

The recorded evaluator self-check compared the original six canonical outputs with themselves and passed all six at 100% groundedness. GA-T4, GA-T6, GA-T7, and GA-T8 were subsequently human-approved. Their initial v0.9 targeted execution identified the GA-T6 missing-information coverage defect; prompt v1.0 corrected it. The unchanged complete GA-T1-T10 regression passed 10/10 at 100% average groundedness. Reports are stored under `evaluation/reports/`.
