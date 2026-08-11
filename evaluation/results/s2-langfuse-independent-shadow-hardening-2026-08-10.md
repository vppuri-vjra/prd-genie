# S2 Langfuse Independent Shadow Hardening Result

Date: 2026-08-10  
n8n execution: `10311`
Extractor candidate: `CNZIUbNBFEap9ioy`  
Evaluator candidate: `lNRM0vzmggdpAoJe`  
Mode: Unpublished shadow

## Deterministic evaluation

The fresh S2 T1-T10 pipeline completed successfully: **10/10 passed**, **100% groundedness**, **0 unsupported claims**, and **10/10 Langfuse traces accepted**. Native deterministic scores were written to Langfuse.

## Independent Langfuse scores

| Test | Trace ID | Code pass | LLM faithfulness | LLM hallucination |
|---|---|---:|---:|---:|
| T1 | `c6d545f0aa0e33e8dcc75d79b744f5fa` | true | 1.00 | 0.00 |
| T2 | `323c905a3bfecd29ae26bd6eae6a6a4e` | true | 1.00 | 0.00 |
| T3 | `59395ebbf887a731fdfbe2c90db24882` | true | 1.00 | 0.00 |
| T4 | `19a85c3687c88f466119c8665245932a` | true | 0.98 | 0.00 |
| T5 | `431e4c07932b13c1edb6735284ca75b7` | true | 1.00 | 0.01 |
| T6 | `be5505c4d1088e7523286cd0e67163ea` | true | 1.00 | 0.00 |
| T7 | `1dcdf4d0724b66e9bbd834d32251e867` | true | 1.00 | 0.00 |
| T8 | `28bbe48eb4fc84399ce4a13a34c0850c` | true | 1.00 | 0.00 |
| T9 | `622c486a2989db8275b55b8747da2960` | true | 1.00 | 0.00 |
| T10 | `01e51790c59ea0aba29b8b62f9473e97` | true | 1.00 | 0.00 |
| **Aggregate** | **10 traces** | **10/10** | **0.998 average** | **0.001 average** |

## T6 adjudication outcome

The reviewer confirmed that microservices and a single-page app can coexist. T6 remains `partial` because proposal approval status, the exact March deadline, and delivery scope remain unknown. The unsupported contradiction and constraint cross-links were removed.

This improved T6 hallucination from the first shadow baseline's `0.40` to `0.08`. Code evaluation passed, and the substantive Langfuse judge assessment no longer identifies the architecture interpretation as a contradiction hallucination.

## T3 adjudication outcome

The reviewer approved the Langfuse judge's finding that five-second auto-refresh and API-call minimization can be satisfied together. T3 ground truth version `0.2.0` preserves both as stated requirements, removes the inferred contradiction and cross-links, and changes extraction status from `partial` to `complete`. The live shadow evaluator verifies the original Drive bundle and then records adjudication `T3-HUMAN-ADJUDICATION-2026-08-10`, base hash `4ad3e09eb76eb7fa21823b5f9ccbd372dc8453a93ff200dedc588c8907eb0e26`, and effective-control hash `d9b032e50d30bb0b8f0b75f8977800cbea5d86e7aecdcc4e2cddc2f056657b04`.

## Promotion decision

All ten cases now pass deterministic n8n evaluation, Langfuse Code Evaluation, and both provisional LLM thresholds. The Code Evaluator receives the complete structured extraction. The LLM judges receive the dedicated `requirement-extractor-semantic-evaluation` observation with the `substantive-v1` projection. Keep the Agreement Gate in shadow mode until this result is repeated for stability and equivalent independent evaluations are completed for the other four processing agents.
