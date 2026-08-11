# S2 Evaluation Hardening — Native Langfuse Scores Runtime

Date: 2026-08-10
Workflow: `S2_ Evaluation-Hardening T1-T10 Evaluator v0.2`
n8n workflow ID: `IXUDC6jJC2M65ruT`
Execution: `10074`

## Result

The isolated candidate executed ten fresh S2 Requirement Extractor calls and evaluated them against the approved T1–T10 controls. The new native-score path generated and submitted eight scores for each trace.

| Control | Result |
|---|---:|
| Fresh evaluated cases | 10 |
| Native Langfuse score writes | 80/80 accepted |
| Score-write verification output | 10 cases returned |
| Cases passing ground-truth evaluation | 9/10 |
| Groundedness | 100% for all ten cases |
| Unsupported claims | 0 for all ten cases |
| Hallucination detected | false for all ten cases |
| Final report upload | Correctly blocked |

The score path passed. The final consolidation gate then failed closed on T10 because the approved expected status is `complete` while the fresh S2 extraction returned `partial`.

## T10 mismatch

| Field | Approved expectation | Fresh actual |
|---|---|---|
| Test | T10 | T10 |
| Status | `complete` | `partial` |
| Required item types | functional requirement, dependency, risk | All present |
| Exact values | SSO login, new auth service, Team Alpha, ETA unknown | All preserved |
| Groundedness | 100% | 100% |
| Unsupported claims | 0 | 0 |
| Hallucination detected | false | false |

The fresh output added a grounded `missing_information` record for the explicitly unknown dependency ETA. This made the agent choose `partial`. The candidate did not weaken the evaluator, rewrite ground truth, or upload a passing report.

## Scores written per trace

- `groundedness`
- `unsupported_claims`
- `ground_truth_match`
- `exact_value_preservation`
- `attribution_accuracy`
- `schema_valid`
- `hallucination_detected`
- `evaluation_pass`

These scores are computed by the PRD Genie deterministic evaluator and stored in Langfuse. They are not yet Langfuse Code Evaluator or LLM-as-a-Judge scores.

## Decision required

Do not change the T10 expected status automatically. Human review must decide whether:

1. `complete` remains canonical and the S2 Requirement Extractor needs a stability correction; or
2. `partial` is the preferred behavior when an explicit unknown dependency ETA creates a clarification record, requiring a reviewed ground-truth version update.
