# S2 Evaluation Score Policy

Status: evaluation-hardening candidate  
Baseline tag: `s2-validated-baseline-2026-08-10`

## Required trace scores

| Score | Type | Passing value | Initial mode | Producer |
|---|---|---:|---|---|
| `groundedness` | Numeric | `1.0` | Blocking | PRD Genie deterministic evaluator |
| `unsupported_claims` | Numeric | `0` | Blocking | PRD Genie deterministic evaluator |
| `ground_truth_match` | Boolean | `1` | Blocking in evaluation runs | PRD Genie deterministic evaluator |
| `exact_value_preservation` | Boolean | `1` | Blocking | PRD Genie deterministic evaluator |
| `attribution_accuracy` | Boolean | `1` | Blocking | PRD Genie deterministic evaluator |
| `schema_valid` | Boolean | `1` | Blocking | PRD Genie deterministic evaluator |
| `hallucination_detected` | Boolean | `0` | Blocking | PRD Genie deterministic evaluator |
| `evaluation_pass` | Boolean | `1` | Blocking | PRD Genie deterministic evaluator |
| `code_evaluator_pass` | Boolean | `1` | Blocking after validation | Langfuse Code Evaluator |
| `llm_judge_faithfulness` | Numeric | `>= 0.90` | Shadow | Langfuse LLM-as-a-Judge |
| `llm_judge_hallucination_detected` | Boolean | `0` | Shadow | Langfuse LLM-as-a-Judge |
| `evaluator_agreement` | Boolean | `1` | Blocking | n8n Agreement Gate |

## Release behavior

- Missing, failed, late, or disagreeing blocking scores stop delivery.
- LLM-judge scores are required for monitoring after rollout but do not initially block delivery.
- A judge failure or disagreement creates a review signal during shadow mode.
- Promotion of the LLM judge to a blocking control requires explicit approval supported by calibration evidence.

## Score semantics

- `groundedness` measures the fraction of evaluated claims with valid current-source evidence.
- `unsupported_claims` counts evidence failures.
- `hallucination_detected` is true when unsupported evidence, exact-value mutation, or incorrect attribution is detected.
- `ground_truth_match` covers expected status, required values, required item types, and evaluation acceptance.
- `schema_valid` indicates that the invoked agent completed its validated output contract.
- Scores written by n8n are PRD Genie evaluation results stored in Langfuse; they are not Langfuse Code Evaluator results.

