---
title: Multi-Source T1 Parity Canary Evidence
date: 2026-08-06
status: Passed
groundedness: 100%
unsupported_claims: 0
---

# Multi-Source T1 Parity Canary

The production-style PB+MT+SN route passed its controlled T1 n8n canary without using or combining `eval_prdgenie_inputs`.

| Evidence | Value |
|---|---|
| Parent workflow | `PRD Genie - Multi-Source T1 Parity Canary v0.2` (`wXIY2Wn4umHsvWft`) |
| Requirement Extractor child | `PRD Genie - Requirement Extractor Child v1.1.1` (`f6W7bxcrodOPXh21`) |
| Accepted n8n execution | `9638` |
| Run | `RUN-T1-MULTI-SOURCE-PARITY` |
| Source packet | `SP-T1-PB-MT-SN` |
| Langfuse trace | `2f0e20055d7765ca3bb0bb0d2bea866b` |
| Langfuse ingestion | Accepted |
| Groundedness | **100%** |
| Unsupported claims | **0** |

The Requirement Extractor produced exactly `FR-001`, `NFR-001`, `STK-001`, and `DDL-001`. Every item preserved its approved source ID/type/name, exact line citation, verbatim quote, metadata path through the returned source packet, and SHA-256 content hash. The parent confirmed semantic parity, exact source traceability, the `gap_analysis` next route, and zero unsupported items.

Two earlier failures are retained as diagnostic evidence rather than represented as grounding failures: execution `9632` exposed an imported OpenAI credential binding defect, and execution `9634` exposed a wording-sensitive parity-gate defect. The corrected gate validates approved meaning through IDs, types, exact evidence and provenance instead of requiring a single sentence normalization. Execution `9636` then exposed the imported Langfuse credential reference and was corrected before the accepted run.
