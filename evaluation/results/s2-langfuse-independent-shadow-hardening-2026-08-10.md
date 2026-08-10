# S2 Langfuse Independent Shadow Hardening Result

Date: 2026-08-10  
n8n execution: `10256`  
Extractor candidate: `CNZIUbNBFEap9ioy`  
Evaluator candidate: `lNRM0vzmggdpAoJe`  
Mode: Unpublished shadow

## Deterministic evaluation

The fresh S2 T1-T10 pipeline completed successfully: **10/10 passed**, **100% groundedness**, **0 unsupported claims**, and **10/10 Langfuse traces accepted**. Native deterministic scores were written to Langfuse.

## Independent Langfuse scores

| Test | Trace ID | Code pass | LLM faithfulness | LLM hallucination |
|---|---|---:|---:|---:|
| T1 | `ab9052b1aa367a23f62cf5e2fa7c6c3a` | true | 0.85 | 0.08 |
| T2 | `2b3ade01fbef0dea15761c7200d2cd6b` | true | 0.70 | 0.12 |
| T3 | `8abab44bd10930023cbd4333aae06c5e` | true | 1.00 | 0.08 |
| T4 | `af71c0219264c64c2fdbddb456a043bd` | true | 1.00 | 0.00 |
| T5 | `41e6360d9abf78b4effdaa82d6bb3062` | true | 1.00 | 0.02 |
| T6 | `5730c01a80aac93958aaa909ef287d16` | true | 0.78 | 0.08 |
| T7 | `e5af958f13b3607773b9f9582aab6396` | true | 1.00 | 0.00 |
| T8 | `ce6e7408b934c8e59ae21f931456c6e2` | true | 1.00 | 0.05 |
| T9 | `cefcc0a0e04b47b773f3162eece28b03` | true | 0.83 | 0.00 |
| T10 | `01605779cbfe1246e371ea72e7604fc4` | true | 0.78 | 0.01 |
| **Aggregate** | **10 traces** | **10/10** | **0.894 average** | **0.044 average** |

## T6 adjudication outcome

The reviewer confirmed that microservices and a single-page app can coexist. T6 remains `partial` because proposal approval status, the exact March deadline, and delivery scope remain unknown. The unsupported contradiction and constraint cross-links were removed.

This improved T6 hallucination from the first shadow baseline's `0.40` to `0.08`. Code evaluation passed, and the substantive Langfuse judge assessment no longer identifies the architecture interpretation as a contradiction hallucination.

## Promotion decision

Keep the agreement gate in shadow mode. The deterministic pipeline and Code Evaluator now agree 10/10, but provisional per-trace LLM thresholds are not yet met by T2 (`faithfulness 0.70`, `hallucination 0.12`), T6 (`faithfulness 0.78`), and T10 (`faithfulness 0.78`). Judge comments attribute much of the remaining penalty to administrative metadata such as run IDs, source filenames, schema fields, locations, and confidence values rather than unsupported product claims.

Next calibration: send the LLM judges a substantive projection of the output instead of the complete administrative envelope, then rerun in shadow mode before considering a blocking agreement gate.
