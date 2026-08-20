# PRD Genie — n8n Workflow Inventory for candidate v0.3.8

Verified: 2026-08-17

## Current candidate state — v0.3.8

v0.3.8 is the final submission candidate built from the protected v0.3.7 production checkpoint. It preserves the stable intake, approval, Agreement Gate, polling, export controls, and manual trigger while promoting the corrected Production PRD, FAC-driven Story Breakdown, and telemetry-enabled non-blocking sizing workflows.

The primary accepted evidence is parent execution `11901` / run `RUN-S2-11902-16e7090e`. The run completed end to end, released through the Agreement Gate, produced all seven Google Drive outputs, passed the 3-Epic / 7-Feature / 11-Story contract, and completed sizing 11/11.

| Role | v0.3.8 candidate workflow | **Live n8n ID** | **Artifact-producing run for v0.3.8** | Lifecycle / usage |
|---|---|---|---|---|
| Manual parent orchestrator | PRD Genie — Main Orchestrator — v0.3.8 Candidate | `YCgHHBa8xUvSOYGI` | `RUN-S2-11902-16e7090e` (parent execution `11901`) | Saved manual-trigger candidate entrypoint |
| Drive and clarification gate copy | PRD Genie — Drive Intake and Clarification Gate — v0.3.8 Candidate | `CQEgz6G2sPHhehjW` | Candidate-package copy | Complete candidate snapshot; accepted parent retains the stable Stage 1 reference |
| Requirement extractor copy | PRD Genie — Requirement Extractor — v0.3.8 Candidate | `YcNGjVHdyAJgZeod` | Candidate-package copy | Complete candidate snapshot; stable nested extraction contract retained at runtime |
| Gap Analyzer copy | PRD Genie — Gap Analyzer — v0.3.8 Candidate | `6F4ANeRIDJVkA28C` | Candidate-package copy | Complete candidate snapshot; stable nested gap-analysis contract retained at runtime |
| Human approval copy | PRD Genie — Human Approval — v0.3.8 Candidate | `uMSo2zvHLGWcM2vo` | Candidate-package copy | Complete candidate snapshot; accepted parent retains the stable Stage 4 reference |
| Stage 5 — Production PRD | PRD Genie — Production PRD — v0.3.8 Candidate | `ocoEGqFDyzzFYf3U` | `RUN-S2-11902-16e7090e` | Corrected ten-section PRD and feature-level acceptance criteria |
| Stage 6 — Story Breakdown | PRD Genie — Story Breakdown — v0.3.8 Candidate | `kswPN0mT0u7rp4vq` | `RUN-S2-11902-16e7090e` | FAC-driven 3/7/11 hierarchy with verbatim SBAC linkage |
| Stage 7 copy — Final Validator and Export | PRD Genie — Final Validator and Export — v0.3.8 Candidate | `gU24pjEsig7u60S4` | Candidate-package copy | Complete candidate snapshot; accepted parent retains the stable Stage 7 reference |
| Post-Stage 7 — Story Sizing | PRD Genie — Story Sizing — v0.3.8 Candidate | `cFuv8QCLpLhtX6A6` | `RUN-S2-11902-16e7090e` | Telemetry-enabled, advisory, non-blocking sizing; passed 11/11 |

## Authoritative runtime call graph

The accepted v0.3.8 parent uses a minimal-change hybrid call graph. Candidate copies of the stable stages are retained for a complete export set but are not substituted into the accepted runtime path.

| Parent step | Runtime workflow ID | v0.3.8 disposition |
|---|---|---|
| Drive and Clarification Gate | `m4WqDP4xJLhwyBnC` | Stable reference retained |
| Human Approval | `pui6krDb6mF9emRH` | Stable reference retained |
| Production PRD | `ocoEGqFDyzzFYf3U` | v0.3.8 candidate invoked |
| Story Breakdown | `kswPN0mT0u7rp4vq` | v0.3.8 candidate invoked |
| Final Validator and Export | `PCV1gEpUt8ZxOVyw` | Stable reference retained |
| Non-Blocking Story Sizing | `cFuv8QCLpLhtX6A6` | v0.3.8 candidate invoked |

## Primary v0.3.8 evidence

| Control | Accepted result |
|---|---|
| Parent execution | `11901` — succeeded in 2m 33.201s |
| Correlated run | `RUN-S2-11902-16e7090e` |
| Parent correlation | `9dd67a8445d178a82dbf0fe15308b090` |
| Story trace | `35579c15ebbeb1bf83406a8274600333` |
| Sizing trace | `0a29e318a6784852cc64b997229b00c2` |
| Agreement Gate | Release authorized |
| Production PRD | Passed; ten-section document with feature-level acceptance criteria |
| Story Breakdown | Code `1.00`; faithfulness `0.98`; hallucination `0.02` |
| Gap Analyzer | Faithfulness `0.90`; hallucination `0.01` |
| Human Approval | Faithfulness `0.99`; hallucination `0.00` |
| Production PRD evaluation | Faithfulness `0.99`; hallucination `0.05` |
| Sizing | 11/11; faithfulness `1.00`; hallucination `0.00`; reasonableness `1.00` |
| Drive delivery | Seven validated output files |
| Trigger | Manual |
| Protected fallback | v0.3.7 remains unchanged |

## Fully loaded usage and cost

| Cost component | Input tokens | Output tokens | Total tokens | Cost |
|---|---:|---:|---:|---:|
| Pipeline generation | 49,104 | 10,818 | 59,922 | `$0.228024` |
| Langfuse evaluators — 41 calls | 480,771 | 4,774 | 485,545 | `$1.246385` |
| **Fully loaded run** | **529,875** | **15,592** | **545,467** | **`$1.474409`** |

## Primary delivered artifacts

| Artifact | Google Drive file ID |
|---|---|
| Run summary | `1KUzoIxV9l0Ddz86tgLJeryXU5VyWVIJS` |
| Final PRD Markdown | `10Rc9rtw-zYemiswLM0aPnoLIHmDtSRVI` |
| Validated Full PRD Review | `1NZZJgu1UBvyB91jr8wQ72FO8RCP0wING` |
| Validated Epic Feature User Story Review | `1avNdNgVi1cDIBvBC-6YNupgsYgPvEaJT` |
| Proposed T-Shirt Sizing Review | `1a3jiUoNy2bQ0mvr6aZpFDIUPTz9ONupb` |
| Story Breakdown JSON | `1p0C48qQmkN88DaLQ-urdEsOZi2nUaKqr` |
| Traceability JSON | `1F92GAjQcMCKG-T-7EwBDslDRTDWwnG3N` |

## Local and Obsidian evidence

- Final nine-workflow JSON check-in: `v0.3.8 Check_In`
- Accepted Markdown artifacts: `Evaluation Evidence/v0.3.8`
- Primary and comparison status: `Overall Status`
- Earlier working snapshots: `Pre Overall Status`

## Candidate disposition

`RUN-S2-11902-16e7090e` is the authoritative v0.3.8 evidence run for GitHub and submission. The later repeatability run remains in Obsidian comparison evidence only. No v0.3.7 workflow is renamed, repointed, archived, or deleted.
