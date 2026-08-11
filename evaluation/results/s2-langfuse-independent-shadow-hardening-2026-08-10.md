# S2 Langfuse Independent Shadow Hardening Result

Date: 2026-08-10  
n8n execution: `10333`
Extractor candidate: `CNZIUbNBFEap9ioy`  
Evaluator candidate: `lNRM0vzmggdpAoJe`  
Mode: Unpublished shadow

## Deterministic evaluation

The fresh S2 T1-T10 pipeline completed successfully: **10/10 passed**, **100% groundedness**, **0 unsupported claims**, and **10/10 Langfuse traces accepted**. Native deterministic scores were written to Langfuse.

## Independent Langfuse scores

| Test | Trace ID | Code pass | LLM faithfulness | LLM hallucination |
|---|---|---:|---:|---:|
| T1 | `22b500d819403dfa035453d9135f5ac9` | true | 0.80 | 0.02 |
| T2 | `e335f25cd6643e4c2aecfe7840f10daf` | true | 1.00 | 0.00 |
| T3 | `ebdf2020604b35bb3bdd0c04e92fc991` | true | 1.00 | 0.00 |
| T4 | `bfdbfd268c2d63748505ea6a3ff5c68f` | true | 1.00 | 0.00 |
| T5 | `044eedf64187f586c738562056b0d037` | true | 1.00 | 0.00 |
| T6 | `4f861ab33c5bc734a16e521270e53fd9` | true | 0.88 | 0.01 |
| T7 | `20ed3d27cc9dd6f0190a646e56660476` | true | 1.00 | 0.00 |
| T8 | `62cf4fc705ef69497e858ed5c88adf78` | true | 1.00 | 0.00 |
| T9 | `aaf5a0a59d0555c41e894baf1aa1a4ef` | true | 1.00 | 0.00 |
| T10 | `d5c427afb589fdadc54e8f38e00e57c7` | true | 0.75 | 0.08 |
| **Aggregate** | **10 traces** | **10/10** | **0.943 average** | **0.011 average** |

## T6 adjudication outcome

The reviewer confirmed that microservices and a single-page app can coexist. T6 remains `partial` because proposal approval status, the exact March deadline, and delivery scope remain unknown. The unsupported contradiction and constraint cross-links were removed.

This improved T6 hallucination from the first shadow baseline's `0.40` to `0.08`. Code evaluation passed, and the substantive Langfuse judge assessment no longer identifies the architecture interpretation as a contradiction hallucination.

## T3 adjudication outcome

The reviewer approved the Langfuse judge's finding that five-second auto-refresh and API-call minimization can be satisfied together. T3 ground truth version `0.2.0` preserves both as stated requirements, removes the inferred contradiction and cross-links, and changes extraction status from `partial` to `complete`. Google Drive control bundle `v1.1` contains the adjudication directly with authoritative case-payload hash `559785b3a8788113e9b43e05dad09cab56b447a7ed322bc1f72b7aae8d923c82`; the evaluator-side runtime overlay has been removed.

## Promotion decision

All ten cases pass deterministic n8n evaluation and Langfuse Code Evaluation using the Drive-read `v1.1` bundle. Nine of ten meet both provisional LLM thresholds; T10 faithfulness is `0.75` against the `0.80` threshold while hallucination remains acceptable at `0.08`. Keep the Agreement Gate in shadow mode and investigate T10 judge stability without lowering thresholds.
