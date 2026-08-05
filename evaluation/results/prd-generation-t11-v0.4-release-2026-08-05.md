# T11 PRD Generator v0.4 Observable Release — 2026-08-05

## Result

| Field | Result |
|---|---|
| Workflow | `PRD Genie - PRD Generator + Langfuse v0.1` |
| n8n workflow ID | `30ZYQxRHWggFgrAe` |
| Test | `T11` |
| Source | Approved T1 package after `HA-R01 / approved` |
| Run ID | `RUN-T1-GROUND-TRUTH` |
| Prompt | `prd-generator-v0.4-array-and-feature-shape` |
| Execution status | `completed` |
| Contract status | `passed` |
| Groundedness | **100%** |
| Template sections | `10` |
| Langfuse region | US |
| Langfuse ingestion | **Accepted — HTTP 200** |
| Langfuse trace ID | `05e9aa534e4286e17ec65512a72e48ff` |

## Validation

| Check | Result |
|---|---:|
| Structurally valid | Pass |
| Nested schema valid | Pass |
| Run ID preserved | Pass |
| Approved IDs only | Pass |
| Canonical T11 coverage | Pass |
| Ten-section Markdown rendered | Pass |
| Unsupported claims | 0 |

## Grounded output

The release preserved `FR-001`, `NFR-001`, `STK-001`, and `DDL-001`; used the approved TBD treatment for unsupported business/product fields; returned empty unsupported collections; produced both approved acceptance criteria; and preserved `Q3` exactly.

## Observability

The trace contains a parent PRD-generation span, the `prd-generator` generation observation, and a deterministic validation/rendering span. The final result records prompt v0.4 and confirms authenticated Langfuse ingestion.

The n8n chain output did not expose model token counts. This is recorded explicitly as `token_usage_status: not_exposed_by_chain_output`; no usage value was invented.

## Release decision

**T11 observable release passed at 100% groundedness.**
