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
| PRD Genie - Realistic v4 Story Breakdown Child v0.2 | `MEm1VyILsMyn53HU` | v0.2 | Approved PRD-to-Epic/Feature/Story hierarchy | 7 | Unpublished | Current, validated | `9727`; trace `f772ec699a437bc70de67ac124976161`; Langfuse HTTP 200 | PRD `9725` → stop before downstream publication | 100% |
| PRD Genie - Realistic v4 Story Breakdown Child v0.1 | `KKYU4QssjUTovd8U` | v0.1 | Failed Story Breakdown candidate | 7 | Unpublished | Failed-evidence-only; retain | `9726` failed closed before trace construction on false duplicate-parent-ID detection | PRD `9725` → stopped in deterministic validator | Runtime not evaluated; local 100% |

The complete read-only live-project reconciliation is recorded in `COMPLETE_N8N_WORKFLOW_AUDIT_2026-08-07.md`: 83 total workflows, including 68 PRD Genie workflows and 15 unrelated workflows. The smallest safe cleanup-review set is one duplicate non-authoritative Connected Orchestrator; no workflow state was changed.

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

The active review now includes unpublished Story Breakdown workflow `KKYU4QssjUTovd8U`. Its trigger and credential are valid, but execution `9726` exposed a false duplicate-ID integration-validator defect before trace construction. It is failure evidence, not a validated current stage. Cleanup requires separate authorization; no archive or deletion occurred.

Groundedness: **100%** for accepted evidence and local PRD validation. Unsupported claims: **0**.

## 2026-08-07 Story Breakdown v0.2 runtime update

`PRD Genie - Realistic v4 Story Breakdown Child v0.2` is now saved and unpublished as `MEm1VyILsMyn53HU`. Execution `9727` passed with trace `f772ec699a437bc70de67ac124976161`, Langfuse HTTP 200, 3 epics, 4 features, 7 stories, 12 acceptance criteria, 19/19 approved-scope coverage, 6/6 sources, zero orphans, 100% groundedness, and zero unsupported claims. It replaces v0.1 for current use; v0.1 `KKYU4QssjUTovd8U` and execution `9726` remain failure evidence.

The complete 68-workflow reconciliation and one-item safe cleanup recommendation are in [`COMPLETE_N8N_WORKFLOW_AUDIT_2026-08-07.md`](COMPLETE_N8N_WORKFLOW_AUDIT_2026-08-07.md).

## 2026-08-07 Final Validation/export runtime update

`PRD Genie - Realistic v4 Final Validator and Export v0.1` is saved and unpublished as `3A8biYxoQ7Q1E9FQ`. Execution `9728` passed with trace `4e1ef40a6da7a838ad9e9cc3a37a1a35`, accepted Langfuse HTTP 200, final export SHA-256 `82c614c0e6608c5b0010d22de6eb66ffa9def5600acb82fd80ebf1651756c5e1`, 100% groundedness, and zero unsupported claims. The prior control `gPc9aTRQ8qLWdZgL` is unchanged.
