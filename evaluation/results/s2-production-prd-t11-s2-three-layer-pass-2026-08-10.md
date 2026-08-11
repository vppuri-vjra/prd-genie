# S2 Production PRD T11-S2 — Three-Layer Evaluation Pass

Date: 2026-08-10  
Mode: Shadow  
Production workflow changed: No

## Result

| Layer | Score | Result |
|---|---:|---|
| n8n deterministic evaluation | 7/7 score receipts | Pass |
| Langfuse Code Evaluator | 5/5 controls | Pass |
| LLM faithfulness | 0.90 | Pass |
| LLM hallucination | 0 | Pass — no hallucination |

## Evidence

| Field | Value |
|---|---|
| Evaluation case | `PRD-T11-S2` |
| Trace ID | `33a21f0623b499e80cc56d6282172687` |
| Semantic observation | `production-prd-semantic-evaluation` |
| Evaluation child workflow | `RMe6Ll2wVt5q2wol` |
| n8n evaluator workflow | `rmrCrD1uq8zQjPmV` |
| Langfuse code evaluator | `prd_genie_production_prd_code_controls_v1` |
| Faithfulness configuration | `d94d231e-11c9-4498-a7bc-a6819bd5ae8b` |
| Hallucination configuration | `ebe2408f-b258-4912-9636-2622140576c6` |

## Interpretation

The LLM judge confirmed that the four substantive PRD elements, their values, and their citations are supported by the approved source context. The 0.90 faithfulness score reflects procedural metadata such as run identity and routing. These fields are workflow controls, not business claims, and are validated separately by deterministic checks.

The Agreement Gate remains in shadow mode. This run does not make Langfuse evaluation release-blocking.
