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
| Completed at | `2026-08-04T22:18:25.921Z` |

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
- Audit trace ID prepared: `6acf2c6fb5835c6b8b3f61aebc7230ad`.

## Node evidence

All nodes completed successfully:

1. `Human Review Form`
2. `Build T1 Human Review Packet`
3. `Parse and Validate Human Approval`
4. `Deterministic Approval Router`
5. `Build Approval Trace Payload`
6. `Record Approval Result`

The audit payload was built but was not transmitted to Langfuse in this canary. Langfuse delivery and ingestion verification remain the next observability increment.
