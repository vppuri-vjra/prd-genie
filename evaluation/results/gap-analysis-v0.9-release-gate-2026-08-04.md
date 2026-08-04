# Gap Analyzer v0.9 Release Gate — 2026-08-04

## Outcome

**Passed.** All six approved Gap Analyzer cases passed one unchanged regression batch under the fixed `gap-analyzer-v0.9-dependency-uncertainty` prompt and unchanged model/workflow settings.

Average groundedness: **100%**.

## Fixed baseline

| Setting | Value |
|---|---|
| Workflow | `PRD Genie - Gap Analyzer v0.1` |
| n8n workflow ID | `xrtf52GK57IRI1NI` |
| Prompt | `gap-analyzer-v0.9-dependency-uncertainty` |
| Model | `gpt-5.6-terra` |
| Reasoning effort | `medium` |
| Output contract | `schemas/gap-analysis.schema.json` |
| Ground truth | Six human-approved Gap Analyzer cases |

No prompt, model, workflow, schema, ground-truth, or evaluator rule changed during the batch.

## Results

| Case | n8n execution | Decision | Gate/route | Evaluator | Langfuse trace |
|---|---:|---|---|---|---|
| GA-T1 | `7614` | `sufficient / proceed` | `eligible_for_human_approval / human_review` | Pass, 100% | `d79e95c9fcd703319496abfd757d3311` |
| GA-T2 | `7617` | `insufficient / request_clarification` | `clarification_required / clarification` | Pass, 100% | `1e6357e7ec3e60155a48a537c1240388` |
| GA-T3 | `7618` | `insufficient / request_clarification` | `clarification_required / clarification` | Pass, 100% | `454ba7971bc86f6cf72bb1044a76be22` |
| GA-T5 | `7619` | `insufficient / request_clarification` | `clarification_required / clarification` | Pass, 100% | `eb4d94ec687f49f70cd7297a7d3edd9d` |
| GA-T9 | `7620` | `insufficient / block_generation` | `generation_blocked / blocked` | Pass, 100% | `6f3121dc8e7a6391160465fb8d832a7d` |
| GA-T10 | `7621` | `partially_sufficient / proceed_with_tbd` | `eligible_with_tbd / human_review_with_tbd` | Pass, 100% | `3ba5da4fb2b9ac3e9a6a00c1beb7bb6d` |

Every execution passed structural validation, decision consistency, source traceability, deterministic routing, trace identity, and Langfuse US ingestion/authentication.

## Promotion decision

`gap-analyzer-v0.9-dependency-uncertainty` is promoted as the Gap Analyzer baseline.

This promotion covers the six approved early Gap Analyzer cases: GA-T1, GA-T2, GA-T3, GA-T5, GA-T9, and GA-T10. T4, T6, T7, and T8 remain intentionally deferred candidates for later Gap Analysis coverage; their absence is not represented as a pass.

