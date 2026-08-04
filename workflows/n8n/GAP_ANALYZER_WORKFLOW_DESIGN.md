# Gap Analyzer n8n Workflow Design

## Status

Approved design for workflow version `v0.1.0` using prompt `gap-analyzer-v0.1`.

Implementation status: **In progress** in n8n workflow `xrtf52GK57IRI1NI`, named **PRD Genie - Gap Analyzer v0.1**.

## Purpose

Run the Gap Analyzer as a separately testable n8n workflow before connecting it to the full PRD Genie pipeline. The workflow consumes validated Requirement Extractor JSON, produces schema-valid Gap Analysis JSON, applies a deterministic generation gate, and records an observable Langfuse trace.

## Workflow

```text
Manual Trigger
→ Load Gap Analyzer Test Input
→ Validate Requirement Extraction Input
→ Create Gap Trace Context
→ Gap Analyzer Agent
→ Parse and Validate Gap Analysis
→ Deterministic Generation Gate
→ Build Langfuse Trace
→ Send Trace to Langfuse
→ Record Gap Analysis Result
```

## Node responsibilities

| # | Node | Responsibility |
|---|---|---|
| 1 | Manual Trigger | Start a controlled development or evaluation run. |
| 2 | Load Gap Analyzer Test Input | Load one approved Requirement Extractor output without adding a wrapper. |
| 3 | Validate Requirement Extraction Input | Reject input that does not conform to `schemas/requirement-extraction.schema.json`. |
| 4 | Create Gap Trace Context | Preserve `run_id` and attach test, workflow, prompt, environment, and trace metadata. |
| 5 | Gap Analyzer Agent | Apply `prompts/gap-analyzer-v0.1.md` and return only the requested Gap Analysis object. |
| 6 | Parse and Validate Gap Analysis | Parse model output and validate it against `schemas/gap-analysis.schema.json`. |
| 7 | Deterministic Generation Gate | Verify the decision combination and convert it into a controlled routing outcome without another LLM call. |
| 8 | Build Langfuse Trace | Create the parent run and `gap-analyzer` generation observation payload, including input, output, model, latency, usage when available, and success or failure status. |
| 9 | Send Trace to Langfuse | Send the trace to the configured Langfuse US project. |
| 10 | Record Gap Analysis Result | Return and retain the final result required for evaluation and later pipeline integration. |

## Approved design decisions

| Decision | Approved approach | Basis |
|---|---|---|
| Initial deployment | Separate Gap Analyzer workflow | Allows isolated contract, prompt, trace, and ground-truth testing before pipeline integration. |
| Input contract | Direct Requirement Extraction JSON | Matches the approved Gap Analyzer contract and avoids duplicate `run_id` values. |
| Run identity | Preserve the extractor's `run_id` throughout | Required for end-to-end traceability and Langfuse correlation. |
| Model calls | One Gap Analyzer model call | The subsequent gate is deterministic and must not reinterpret the model result. |
| Gate authority | Validate and route from schema-valid decision fields | The analyzer recommends; deterministic code enforces consistency. |
| Human authority | Human approval still controls PRD generation | `generation_allowed: true` means eligible for review, not automatic approval. |
| Observability | Langfuse generation observation named `gap-analyzer` | Makes the model step distinct and auditable within the parent run. |
| Versioning | Workflow `v0.1.0`; prompt `gap-analyzer-v0.1` | Separates workflow and prompt changes for reproducible evaluation. |

## Deterministic gate rules

| Gap Analyzer decision | Gate result |
|---|---|
| `sufficient` + `true` + `proceed` | Eligible for human approval. |
| `partially_sufficient` + `true` + `proceed_with_tbd` | Eligible for human approval with explicit TBDs. |
| `insufficient` + `false` + `request_clarification` | Route to clarification; do not generate a PRD. |
| `insufficient` + `false` + `block_generation` | Block PRD generation. |
| Any inconsistent or schema-invalid combination | Fail validation and record the failure path. |

## Initial execution sequence

1. Run `GA-T1` to validate the sufficient/proceed path.
2. Run `GA-T2` to validate the insufficient/request-clarification path.
3. Compare both actual outputs with approved ground truth using `scripts/evaluate_gap_analysis.py`.
4. Confirm parent trace, `gap-analyzer` generation, token/usage capture when exposed, and failure-path visibility in Langfuse.
5. Run the remaining approved Gap Analyzer regression cases before connecting the workflow to PRD generation.

## Implementation checkpoint — 2026-08-03

The first four nodes are implemented and connected:

1. `When clicking ‘Execute workflow’` (Manual Trigger).
2. `Load Gap Analyzer Test Input`, containing the human-approved T1 canonical extraction.
3. `Validate Requirement Extraction Input`, performing deterministic contract checks before any model call.
4. `Create Gap Trace Context`, separating the unchanged extraction from approved execution and Langfuse metadata.

The connected four-node path completed successfully with one item and preserved `RUN-T1-GROUND-TRUTH`. The trace context records `GA-T1`, workflow version `0.1.0`, prompt version `gap-analyzer-v0.1`, the development environment, n8n execution/workflow identifiers, start time, and the `gap-analyzer` Langfuse observation name. An initial unconnected validator run correctly exercised the failure path by rejecting missing required fields; the node was then connected and the workflow rerun successfully.

Input groundedness: **100%**. The loader content exactly represents the approved T1 canonical extraction stored in `evaluation/ground-truth/requirement-extraction/t01/expected-output.json`.

Trace-context groundedness: **100% (9/9 metadata fields)**. Every field is inherited from the approved extraction or defined by the approved workflow design; no product requirement content is introduced.

## Groundedness

Design groundedness: **100% (8/8 decisions)**. Each approved decision is traceable to the Gap Analyzer contract, approved prompt, architecture/ADR, evaluation requirements, or the established Requirement Extractor observability pattern. This percentage assesses design traceability; actual workflow quality will be measured separately through execution and regression evaluation.
