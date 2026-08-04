# Gap Analyzer Ground Truth

Dataset version: `0.1.0`

Reviewer: Vipin

Review date: 2026-08-03

Status: Approved

## Authoritative inputs

Each case consumes the corresponding human-approved Requirement Extraction canonical output under `evaluation/ground-truth/requirement-extraction/`. Raw transcripts are not passed directly to the Gap Analyzer.

## Approved cases

| Case | Extraction source | Expected decision | Grounded claims | Groundedness | Status |
|---|---|---|---:|---:|---|
| GA-T1 | `t01/expected-output.json` | `sufficient / proceed` | 8/8 | 100% | Approved |
| GA-T2 | `t02/expected-output.json` | `insufficient / request_clarification` | 10/10 | 100% | Approved |
| GA-T3 | `t03/expected-output.json` | `insufficient / request_clarification` | 9/9 | 100% | Approved |
| GA-T5 | `t05/expected-output.json` | `insufficient / request_clarification` | 10/10 | 100% | Approved |
| GA-T9 | `t09/expected-output.json` | `insufficient / block_generation` | 9/9 | 100% | Approved |
| GA-T10 | `t10/expected-output.json` | `partially_sufficient / proceed_with_tbd` | 10/10 | 100% | Approved |

Groundedness is calculated as `grounded evaluated claims / total evaluated claims × 100`. Deterministic workflow decisions count as grounded when every premise comes from the approved extraction and the outcome follows the approved decision matrix without adding product facts.

## Coverage

- Eligible grounded extraction: GA-T1.
- Ambiguous requirement and missing dimensions: GA-T2.
- Unresolved contradiction without invented resolution or risk: GA-T3.
- Product fragments without reliable items: GA-T5.
- No meaningful requirements: GA-T9.
- Grounded dependency risk with explicit TBD: GA-T10.

## Approval guardrails

- No canonical output invents a requirement, answer, stakeholder, date, budget, metric, dependency, contradiction, or risk.
- Every gap links to extracted item IDs, extractor missing-information IDs, or the explicit absence of requirements.
- GA-T3 contains no downstream risk because the approved extraction does not explicitly contain one.
- `generation_allowed: true` means eligible for human review and never bypasses human approval.
