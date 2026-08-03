# T1-T10 Actual-Output Scorecard — 2026-08-03

## Result

The deterministic evaluator compared the extraction JSON from the latest saved n8n executions with the human-approved ground-truth dataset `0.1.0`.

| Outcome | Count |
|---|---:|
| Pass | 4 |
| Fail | 5 |
| Needs review | 1 |
| Total | 10 |

The release gate is **not passed**.

## Test results

| Test | Result | Primary finding |
|---|---|---|
| T1 | Fail | All facts and evidence were correct, but the NFR, stakeholder and deadline were not linked to the functional requirement. |
| T2 | Fail | Returned gaps only; it omitted the canonical ambiguous functional requirement and did not explicitly cover missing metrics and report format. |
| T3 | Fail | Returned `complete` and did not create an unresolved contradiction between auto-refresh and minimizing API calls. |
| T4 | Pass | Export formats and acceptance criteria matched the approved ground truth. |
| T5 | Pass | Insufficient source material was handled without inventing scope, budget or real-time behavior. |
| T6 | Fail | All viewpoints were extracted, but the two design constraints were not cross-linked and no unresolved tension was recorded. |
| T7 | Pass | Scale, p95 performance and Salesforce v52 integration were preserved and classified as NFRs. |
| T8 | Fail | Three functional requirements were extracted, but the three required persona items and persona-to-requirement links were absent. |
| T9 | Needs review | Correctly returned `no_requirements`; the clarification wording semantically requests a requirements-bearing source but needs human confirmation. |
| T10 | Pass | SSO, auth-service dependency, Team Alpha and unknown-ETA risk matched the approved ground truth. |

## Controls and evidence

- Actual outputs came from saved n8n executions; no model reruns were performed for this evaluation.
- Every actual output conforms to the extraction JSON Schema.
- Each per-test report includes the corresponding Langfuse trace ID.
- Full actual outputs are stored under `evaluation/actual/requirement-extraction/t01` through `t10`.
- Per-test deterministic reports are stored under `evaluation/reports/requirement-extraction/cases`.

## Recommended next action

Review the five failed expectations and T9 with the human reviewer before changing the prompt. After approval, update the extractor prompt as a new version, rerun only affected regression cases first, and then run the full T1-T10 release gate.
