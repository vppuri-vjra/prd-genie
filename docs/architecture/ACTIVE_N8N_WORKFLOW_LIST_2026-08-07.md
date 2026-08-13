# Active n8n workflow list — 2026-08-07

## 2026-08-13 isolated Agreement Gate candidate update

| Workflow | ID | Lifecycle | Latest evidence | Disposition |
|---|---|---|---|---|
| S2 Dynamic Story Breakdown — Langfuse candidate | `4AwRsfASe07ktb5M` | Published callable child | `RUN-S2-11157-16e7090e`; 100% groundedness; 0 unsupported claims | Validated candidate child |
| S2 Dynamic Main Orchestrator v0.3.4 — 180-second polling candidate | `SDtf0KGQuR6yo2Pu` | Unpublished | `RUN-S2-11157-16e7090e`; 1m 58.198s; Release Authorized path | Successful promotion candidate; production parent unchanged |
| Merged-import parent copy | `PzpWjDCFV9Bcfiyb` | Unpublished | Structural inspection found both old and new Story references | Do not use; retain until approved cleanup |

The Story Code Evaluator was corrected from raw mapped-array equality to unique approved-ID set equality. Repeated lineage references remain valid when one approved requirement yields multiple stories; missing or unknown IDs still fail. Details: [`s2-agreement-gate-story-evaluator-runtime-pass-2026-08-13.md`](../../evaluation/results/s2-agreement-gate-story-evaluator-runtime-pass-2026-08-13.md).

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

## 2026-08-08 Connected realistic orchestrator checkpoint

Clean candidate `PRD Genie - Realistic Six-Source Main Orchestrator v0.2` is saved unpublished/inactive as `CJQX9sNhCsGxX0Sf`. Its local export validates a 12-node fail-closed topology with five parent sub-workflow calls; v0.11 contains the nested Requirement Extractor v1.10 and Gap Analyzer v1.0 calls, accounting for seven authoritative stages.

Execution `9743` failed closed at the first dynamic child boundary; attempted v0.11 execution `9744` reported `Workflow is not active and cannot be executed.` No downstream stage or new Langfuse trace is accepted. Completing this checkpoint requires lifecycle authorization not currently granted. Construction candidate `WSrFHqt7BgwFplUT` / execution `9742` is retained as failed evidence; no archive or deletion occurred.

Lifecycle authorization was subsequently granted for required children. Published Requirement Extractor v1.10 and Gap Analyzer v1.0 passed connected executions `9751` and `9752`. Callable gate v0.11.2 `6bamqbjuGMy5vHet` then failed closed in execution `9750` because two Gap Analysis records were not mapped by the deterministic clarification policy. Parent v0.4 `qKXqVnjrAQjt8Ehx` / execution `9749` stopped there; Human Approval and later stages were not invoked.

## 2026-08-08 Connected production-style runtime pass

`PRD Genie - Realistic Six-Source Main Orchestrator v0.10` is saved inactive/unpublished as `Zh0BIOxTGyDyU4jB`. Parent execution `9785` passed in 1m 41.714s. Connected child executions were gate `9786`, Requirement Extractor `9787`, Gap Analyzer `9788`, Human Approval lineage verifier `9789`, Production PRD `9790`, Story Breakdown `9791`, and Final Validator/export `9792`.

The final contract reports seven connected stages, dynamic handoffs, 100% groundedness, zero unsupported claims, and final stage trace `bb1a0fe38750902d05c95c6e8d0cbd41`. The parent remains unpublished/inactive. Required callable children are published; no workflow was activated, archived, or deleted. See [`realistic-six-source-main-orchestrator-v0.10-runtime-pass-2026-08-08.md`](../../evaluation/results/realistic-six-source-main-orchestrator-v0.10-runtime-pass-2026-08-08.md).

## 2026-08-08 Google Drive production-input runtime pass

`PRD Genie - Realistic Clarification v4 Google Drive Gate Callable v0.12.0` is published but inactive as `WDrjaIMsrnF46q8b`; direct canary execution `9797` passed after listing, exact-six validation, download, text extraction, manifest comparison, Requirement Extraction, Gap Analysis, and deterministic resolution. It reads the six approved files from Drive folder `1SxIfeNPCcGQQT4DqsRdEq9DMruwCkYaS` and fails closed on missing, duplicate, extra, or content-mismatched inputs.

Inactive/unpublished parent `PRD Genie - Realistic Six-Source Google Drive Main Orchestrator v0.11` is saved as `YiWB9OxjvUyfxk53`. Parent execution `9800` passed in 1m 3.682s; child executions `9801`–`9807` cover the Drive gate with nested Requirement Extractor and Gap Analyzer, Human Approval, Production PRD, Story Breakdown, and Final Validator/export. The result preserved run ID, parent trace `26c7466f817aa1511f4a4e239bb52a62`, source hashes, citations, approval lineage, 17/17 decision dispositions, 100% groundedness, and zero unsupported claims. No workflow was activated, archived, or deleted. See [`realistic-six-source-google-drive-main-orchestrator-v0.11-runtime-pass-2026-08-08.md`](../../evaluation/results/realistic-six-source-google-drive-main-orchestrator-v0.11-runtime-pass-2026-08-08.md).

## 2026-08-08 Google Drive validated-output runtime pass

Inactive/unpublished parent `PRD Genie - Realistic Six-Source Google Drive I/O Main Orchestrator v0.12.1` is saved as `1iBHRurP8NLMW7BP`. Execution `9816` passed in 1m 30.519s and, only after Final Validator/export passed, wrote a timestamped final PRD Markdown file and Story Breakdown JSON file to `Production Outputs` folder `1DoTRyMj2ucxkD3B8_Oq5fc02TfS0rvVp`. Google Drive returned file IDs `1G2cd7xOyAj5J2-NpU4W8Eq-EwkgxFdh6` and `1eLQdPfHlsMcQOWB8x5BVie5nJaylKZCU`.

Construction v0.12 `fZtwbTojKAgyfV0w` / execution `9808` failed closed before upload on an incorrect Markdown field mapping and is retained as diagnostic evidence. No workflow was activated, archived, or deleted. See [`realistic-six-source-google-drive-io-main-orchestrator-v0.12.1-runtime-pass-2026-08-08.md`](../../evaluation/results/realistic-six-source-google-drive-io-main-orchestrator-v0.12.1-runtime-pass-2026-08-08.md).
