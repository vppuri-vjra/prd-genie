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
| `code_evaluation_pass` | Boolean | `1` | Shadow; blocking after validation | Langfuse Code Evaluator |
| `llm_faithfulness` | Numeric | Provisional `>= 0.80` | Shadow | Langfuse LLM-as-a-Judge |
| `llm_hallucination` | Numeric | Provisional `<= 0.10` | Shadow | Langfuse LLM-as-a-Judge |
| `evaluator_agreement` | Boolean | `1` | Blocking | n8n Agreement Gate |

## Release behavior

- Missing, failed, late, or disagreeing blocking scores stop delivery.
- LLM-judge scores are required for monitoring after rollout but do not initially block delivery.
- A judge failure or disagreement creates a review signal during shadow mode.
- Promotion of the LLM judge to a blocking control requires explicit approval supported by calibration evidence.
- Provisional thresholds are calibration targets, not production release policy.
- Evaluator scores must be present for the current trace, evaluator version, model, and observation before agreement can pass.

## Score semantics

- `groundedness` measures the fraction of evaluated claims with valid current-source evidence.
- `unsupported_claims` counts evidence failures.
- `hallucination_detected` is true when unsupported evidence, exact-value mutation, or incorrect attribution is detected.
- `ground_truth_match` covers expected status, required values, required item types, and evaluation acceptance.
- `schema_valid` indicates that the invoked agent completed its validated output contract.
- Scores written by n8n are PRD Genie evaluation results stored in Langfuse; they are not Langfuse Code Evaluator results.

## Active shadow evaluators

| Evaluator | Rule ID | Target | Sampling |
|---|---|---|---:|
| `prd_genie_s2_code_controls_v1` | `78676fbc-8928-4b97-b684-9cc8574571d1` | `requirement-extractor` generations | 100% |
| `llm_faithfulness` | `34c536fe-ca82-43fb-b79a-d0842a112425` | `requirement-extractor` generations | 100% |
| `llm_hallucination` | `bf824260-52b4-4ae1-bafa-ba45a625bb6f` | `requirement-extractor` generations | 100% |

The LLM judges use `openai / gpt-5.6-terra`. They receive `Input.$.source_text` as context and the complete generation output as the answer under evaluation.

The Code Evaluator is currently on version 3 (`cmsnk60ao0idzad0krzyrwtbh`). Version 3 treats an extraction with no emitted claims as evidence-grounded when it contains no unsupported evidence; this corrects the T5 false failure without weakening evidence checks for claim-bearing outputs.

## Evaluation-hardening candidates

| Candidate | Live n8n ID | State |
|---|---|---|
| Requirement Extractor child v0.2 | `CNZIUbNBFEap9ioy` | Unpublished shadow candidate |
| T1-T10 Evaluator v0.4 | `lNRM0vzmggdpAoJe` | Unpublished shadow candidate |

The candidate prompt now preserves named comparison references and keeps the vague T2 request `partial`; T2 and T5 pass the reviewed ground truth. T6 remains an explicit adjudication item: the reviewed dataset expects a `partial` architecture contradiction, while the semantic judge notes that a microservices backend and a single-page application frontend can coexist. Do not change the reviewed ground truth or promote the agreement gate until this policy is human-adjudicated.
