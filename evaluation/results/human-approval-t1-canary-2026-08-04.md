# Human Approval T1 Canary — 2026-08-04

## Result

| Field | Result |
|---|---|
| Workflow | `PRD Genie - Human Approval v0.1` |
| n8n workflow ID | `L3J0nRWdKhs46wxF` |
| Run ID | `RUN-T1-GROUND-TRUTH` |
| Human reviewer | Vipin |
| Human decision | `approved` |
| Contract status | **Passed** |
| Groundedness | **100%** |
| Next route | `prd_generation` |
| PRD-generation eligible | `true` |
| Completed at | `2026-08-04T22:46:15.657Z` |
| Langfuse region | US |
| Langfuse trace ID | `04c6b3386a8197b7c553429a57b75bc8` |
| Langfuse ingestion | **Accepted — HTTP 200** |

## Approved scope

`FR-001`, `NFR-001`, `STK-001`, and `DDL-001` were approved. No item was rejected.

## Evidence checks

| Check | Result |
|---|---:|
| Source grounding verified | Pass |
| Exact values verified | Pass |
| Relationships verified | Pass |
| Gap Analysis verified | Pass |
| Unsupported claims absent | Pass |

## Deterministic validation

- Contract structure: valid.
- Referenced IDs: valid.
- Decision and route combination: consistent.
- Route: `prd_generation`.
- Model call: none.
- Token usage: 0 input, 0 output, 0 total.
- Audit trace ID: `04c6b3386a8197b7c553429a57b75bc8`.
- Langfuse observation: `human-approval` span.
- Langfuse ingestion: accepted (`HTTP 200`).

## Node evidence

All nodes completed successfully:

1. `Human Review Form`
2. `Build T1 Human Review Packet`
3. `Parse and Validate Human Approval`
4. `Deterministic Approval Router`
5. `Build Approval Trace Payload`
6. `Send Approval Trace to Langfuse`
7. `Record Approval Result`

The audit payload was transmitted to Langfuse US and verified on the trace detail page. It is a deterministic, non-LLM approval span: `model_call=false` and token usage is 0 input, 0 output, 0 total.
