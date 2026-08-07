# Realistic Clarification v4 Canary v0.9 — Integration Failure

Date: 2026-08-07

## Imported workflow verification

- n8n workflow: `vMShSs7pPjzm7EWr`
- Title: `PRD Genie - Realistic Clarification v4 Deterministic Gate Canary v0.9`
- Topology: six expected nodes and five sequential connections
- Requirement Extractor child: `eDAl2qSb4ai17JZk` (v1.10)
- Gap Analyzer child: `wGBE80XMjD5rTKql` (v1.0)
- Saved history verified; workflow remained unpublished
- Local export SHA-256: `9da6537383966abff5000157f2ed7187819a51e453d52e844877f494c68e25b8`

## Controlled executions

| Scope | Parent execution | Child execution | Result | Groundedness | Langfuse |
|---|---:|---:|---|---:|---|
| Adapter only | `9707` | — | Passed in 1.624s; six-source v4 packet and deterministic classification contract preserved | Adapter contract 100% | Not invoked by design |
| Extractor only | `9708` | `9709` | Requirement Extraction passed; next route `gap_analysis` | 100% | Accepted; trace `c7a4403a6b558ff53db3ff2c755ca8f4`, parent `9038ad8eab5236c15485e4dfee5d929d` |
| Full v4 | `9710` | `9711` | Requirement Extraction passed, then `Validate Six-Source Extraction` failed before Gap Analysis | RE 100%; full-run acceptance not reached | RE accepted; trace `4927a95c7a93422f2b2a83b14c534c95`, parent `2d5fcc41b8481b0541048a143b9f8fb4` |

## Failure classification

This is an **integration defect**, not a grounding failure. The v0.9 validator still references the removed node `Load Approved Five-Source Packet v3`. Its inherited code also expects five sources and retains an obsolete four-source error label. n8n execution `9710` therefore failed closed in `Validate Six-Source Extraction` before Gap Analysis or deterministic resolution.

Gap Analysis, deterministic resolution, Human Approval, and PRD generation were not invoked. The required runtime classifications (`deferred`, `deferred`, `deferred`, `resolved`) remain adapter-contract evidence only and are not claimed as full-run acceptance.

Groundedness: **100% for accepted Requirement Extraction executions `9709` and `9711`**. Unsupported claims/decisions: **0**. Full-run groundedness/eligibility: **not accepted because the integration boundary failed**.
