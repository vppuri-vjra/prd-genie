# Active n8n workflow list — 2026-08-07

This local list distinguishes validated current workflows from published production status. “Current” does not mean published. No n8n workflow was modified during this read-only review.

## Validated current chain

| Workflow | ID | Version | Stage / role | Nodes | Publication | Status | Latest accepted evidence | Upstream → downstream | Groundedness |
|---|---|---|---|---:|---|---|---|---|---:|
| PRD Genie - Requirement Extractor Child v1.10 | `eDAl2qSb4ai17JZk` | v1.10 | Unified requirement extraction | 10 | Unpublished | Current, validated | child `9722`; trace `320fb727a808c8228001e1aef5de7d98` | six-source packet → Canary v0.11 / Gap Analyzer | 100% |
| PRD Genie - Gap Analyzer Child v1.0 | `wGBE80XMjD5rTKql` | v1.0 | Gap Analysis | 10 | Current connected child | Current, validated | child `9723`; trace `322897a2600add94152dbf938c837c00` | RE v1.10 → deterministic gate | 100% |
| PRD Genie - Realistic Clarification v4 Deterministic Gate Canary v0.11 | `ZUYumiSo2xdAJva5` | v0.11 | Six-source adapter, RE/GA orchestration, gate | 6 | Unpublished | Current, validated | children `9722`/`9723`; parent trace `26c7466f817aa1511f4a4e239bb52a62` | packet → RE v1.10 → GA v1.0 → Human Approval | 100% |
| PRD Genie - Realistic v4 Human Approval Tail v0.1 | `xcBnMPcnCI6xVS4h` | v0.1 | Signed Human Approval | 9 | Unpublished | Current, validated | `9724`; trace `f4e298e120d6503b5dfac4688adae1db` | Canary v0.11 → realistic PRD Generator | 100% |
| PRD Genie - Realistic v4 Production PRD Generator v0.1 | `2K9dntvZDaUgudrl` | v0.1 | Deterministic JSON/Markdown PRD and ledger | 7 | Unpublished | Current, validated | `9725`; trace `f8879ebe22d888152a77f892230c62ba` | approval `9724` → stop before Story Breakdown | 100% |

## Relevant validated controls

| Workflow | ID | Version | Role | Nodes | State | Latest evidence | Links | Groundedness |
|---|---|---|---|---:|---|---|---|---:|
| Requirement Extractor + Langfuse | `NXJLNsdf3N8HfrnQ` | v0.2 | T1–T10 standalone control | 10 | Registry-listed current control; publication not reverified | promoted T1–T10 gate | control input → standalone GA | 100% |
| Gap Analyzer + Generation Gate | `xrtf52GK57IRI1NI` | v1.0 | T1–T10 GA control | 11 | Registry-listed current control; publication not reverified | 10/10 regression | extraction → approval/clarification/block | 100% |
| Human Approval | `hE3ekoftADwnQog2` | v0.3 | HA route-suite control | 7 | Registry-listed current control; publication not reverified | HA-R01–HA-R06 | gate → PRD control | 100% |
| PRD Generator + Langfuse | `30ZYQxRHWggFgrAe` | v0.1 | T11 control | 11 | Registry-listed current control; publication not reverified | T11 `8621` | approved T1 → Story Breakdown | 100% |
| Story Breakdown + Langfuse | `sYjmLbuEQNhrm6xK` | v0.2 | T12 control | 11 | Registry-listed current control; publication not reverified | observable T12 release | PRD → final validation | 100% |
| Connected Orchestrator | `OTmIj7I1AFVvCceV` | v0.5 | T1-to-final control | 18 | Registry-listed current control; publication not reverified | `9578` | all accepted connected children | 100% |

## Superseded, evidence-only, and cleanup candidates

| Workflow | ID | Version / nodes | Disposition | Preserved evidence | Proposed cleanup order |
|---|---|---:|---|---|---:|
| Realistic Clarification v4 Canary | `PhT3aEnSrbEJnlgE` | v0.8 / 6 | Malformed duplicate; cleanup candidate | `9700`–`9703` | 1 |
| Realistic Clarification v4 Canary | `mJRvWwPZrPgwQWwW` | v0.8 / 6 | Superseded; evidence only | `9704`–`9705` | 2 |
| Realistic Clarification v4 Canary | `vMShSs7pPjzm7EWr` | v0.9 / 6 | Superseded; evidence only | `9707`–`9711` | 3 |
| Realistic Clarification v4 Canary | `LuCOCCe1jRhb6g5o` | v0.10 / 6 | Superseded; evidence only | `9712`–`9717` | 4 |

Discrepancy resolved: the earlier inventory did not include a live PRD-stage workflow and formerly showed v0.11/Human Approval as pending. The accepted chain now includes PRD workflow `2K9dntvZDaUgudrl` and execution `9725`. Cleanup requires separate authorization; no archive or deletion occurred.

Groundedness: **100%** for accepted evidence and local PRD validation. Unsupported claims: **0**.
