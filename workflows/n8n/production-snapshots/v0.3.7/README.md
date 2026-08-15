# PRD Genie S2 v0.3.7 — Live Production Snapshot

Captured from the live n8n project on **2026-08-15** after the accepted production smoke:

- Parent execution: `11580`
- Run: `RUN-S2-11581-16e7090e`
- Trigger: manual
- Production behavior changed during capture: **No**

## Exact live exports

| Order | File | Live n8n ID | Exported workflow name | SHA-256 |
|---|---|---|---|---|
| 0 | `00-parent-orchestrator.json` | `LpRK4ibx4rXZ1IEs` | S2_ Dynamic Realistic Six-Source Main Orchestrator v0.3.7 - Production | `d8465633b3220de9b59486d8678b71b514eb82724076720aa32fcfb5029ea70e` |
| 1 | `01-drive-clarification-gate.json` | `bi4Gvq9tNWcQ2wfR` | S2_ Dynamic Drive and Clarification Gate v0.2.5 - Acceptance Reconciliation Candidate | `56f7035fdb4a0ddcee4828dd712564ed579a5065665f63bdcc01f6b25bde573e` |
| 2 | `02-requirement-extractor.json` | `FXXpNgmJQfWjKZlV` | S2_ Dynamic Requirement Extractor v0.1.2 - Acceptance Reconciliation Imported Clean | `208d3391456739578bd043f750a02de9ed93cfeecfff01c00a4c060e8a03fc9d` |
| 3 | `03-gap-analyzer.json` | `rR8PH0JXrXPM6fgv` | S2_ Dynamic Gap Analyzer v0.1.1 - Contradiction Reconciliation Candidate | `ce686978679effbf1aaa37a79249ce7419ea9807a5b9f1a845a2a21eb2e65da6` |
| 4 | `04-human-approval.json` | `c2bgrqVym4XpBeT8` | S2_ Dynamic Human Approval v0.2 - Langfuse Shadow | `e1ac26e996180b2f58a39e5982b07ce4f7144fd9fdfa734b5c33a7586b42159e` |
| 5 | `05-production-prd.json` | `WvENlg3lF5iOyCFO` | S2_ Dynamic Production PRD v0.2.4 - Dynamic Display IDs Candidate | `3ee8877aba44cfbf3ebdffb7749042156923a7424fb2cf4f765503fce9593881` |
| 6 | `06-story-breakdown.json` | `dLDH4ChV0qAogbRD` | S2_ Dynamic Story Breakdown v0.2.7 - Evaluator Alignment Candidate | `9f93f276de8d7ea251e6692bd2ba235eaf5a549dfa207fa131744459bf39e43d` |
| 7 | `07-final-validator-export.json` | `GotMdQ0eX6zbYwki` | S2_ Dynamic Final Validator and Export v0.4 - Acceptance Alignment Candidate | `ce3fa92ec2afa04e2b08055ecc914763696548a09db5ada944408397fb1b487a` |
| 8 | `08-post-stage-7-sizing.json` | `vlLpeCD9szPEA400` | S2_ Dynamic Complexity Sizing v0.2 - Non-Blocking Production Candidate | `30f6a6afe32ab9f39959bbf16f902c68e1552232473a32e2be4f61b8f9bb6f17` |

## Reference reconciliation

The exported parent references the exact live IDs for Stage 1, Stage 4, Stage 5, Stage 6, Stage 7, and post-Stage-7 sizing. The exported Stage 1 workflow references the exact live Requirement Extractor and Gap Analyzer IDs.

Authoritative execution order:

`Parent → Stage 1 → Stage 2 → Stage 3 → Stage 4 → Stage 5 → Stage 6 → Agreement Gate → Stage 7 → non-blocking sizing`

Sizing remains post-validation and advisory. These files are evidence exports; importing them is not part of the snapshot procedure.
