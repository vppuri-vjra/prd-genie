---
title: PRD Genie Workflow Inventory
version: 1.0
status: Living Inventory
last_updated: 2026-08-06
owner: Vipin Puri
---

# PRD Genie Workflow Inventory

The exact live allowlist, including immutable n8n workflow IDs and duplicate-name handling, is maintained in [`VALID_N8N_WORKFLOW_REGISTRY.md`](VALID_N8N_WORKFLOW_REGISTRY.md). Use that registry to decide which canvas is safe to run.

The same allowlist is visible in n8n as registry workflow `isz9Jj1qVbwQVceS`; its verification execution is `9640`.

## Primary execution order

| Order | n8n workflow | Role | Current version/status | Groundedness evidence |
|---:|---|---|---|---:|
| 1 | `PRD Genie - Requirement Extractor + Langfuse v0.2` | Convert source text into structured, evidence-linked requirements | Active; Requirement Extractor prompt v1.5 passed T1-T10 regression | 100% |
| 2 | `PRD Genie - Gap Analyzer + Generation Gate v1.0` | Identify gaps/contradictions and deterministically decide the next route | Active; GA v1.0 passed GA-T1-T10 regression | 100% |
| 3 | `PRD Genie - Human Approval v0.3` | Record approve, approve-with-conditions, changes-requested, clarification, rejection, and controlled validation-failure decisions | Active; HA-R01 through HA-R06 route suite passed at 100%; v0.1 and v0.2 retained as evidence | 100% |
| 4 | `PRD Genie - PRD Generator + Langfuse v0.1` | Generate and validate the ten-section PRD | Active; T11/T1 observable release passed | 100% |
| 5 | `PRD Genie - Story Breakdown + Langfuse v0.2` | Generate and validate epics, features, user stories, criteria, and unresolved questions | Active; T12/T1 observable release passed | 100% |
| 6 | `PRD Genie - Connected Orchestrator v0.2` | Pass one run envelope through extraction, gap analysis and an actual Human Approval checkpoint | T1 connected canary passed through `prd_generation` route | 100% |
| 7 | `PRD Genie - Connected Orchestrator v0.3` | Continue an approved connected run through PRD generation | Connected T1-to-T11 canary passed; routed to Story Breakdown | 100% |
| 8 | `PRD Genie - Connected Orchestrator v0.4` | Continue the connected run through Story Breakdown | Connected T1-to-T12 canary passed; routed to final validation | 100% |
| 9 | `PRD Genie - Connected Orchestrator v0.5` | Continue the connected run through Final Validation and Markdown export | Connected T1-to-Final execution `9578` passed and completed | 100% |
| 10 | `PRD Genie - Multi-Source T1 Parity Canary v0.2` | Prove production-style PB+MT+SN parity at the Requirement Extractor boundary | Execution `9638` passed; exact traceability, semantic parity and Langfuse ingestion accepted | 100% |
| 11 | `PRD Genie - Realistic Multi-Source Requirement Extraction Canary v0.6` | Prove approved realistic PB+MT+SN canonical parity through Child v1.5 | Execution `9661` passed; 70/70 coverage, 44/4/12 parity and Langfuse accepted | 100% |
| 11a | `PRD Genie - T1-T10 Baseline Release Evidence Evaluator v1.0` | Consolidate exact inputs, approved expectations, preserved v1.5 outputs, evaluator checks and trace acceptance into one fail-closed report | Inactive/unpublished `b57sxmwjazoXHd8R`; execution `9832` passed 10/10 in 1.643s | 100% |
| 11b | `PRD Genie - T1-T10 Google Drive Evaluation I-O v1.1` | Read the approved hashed control bundle from `Evaluation Controls`, revalidate T1–T10, and upload timestamped JSON/Markdown evidence to `Evaluation Results` | Inactive/unpublished `stmdp7YLv3zZxHM5`; execution `9833` passed 10/10 in 6.628s | 100% |
| 12 | `PRD Genie - Realistic Gap Analysis Canary v0.1` | Carry the accepted realistic extraction through Gap Analysis and the deterministic gate | Execution `9667` passed; 14 gaps, 12/12 missing-information coverage, 4/4 contradictions, 2/2 source risks; route `clarification` | 100% |
| 13 | `PRD Genie - Realistic Clarification v2 Canary v0.1` | Verify the approved four-source clarification packet through extraction, Gap Analysis and gate | Execution `9678` stopped in Requirement Extractor validation on an invalid line-23 conflict-ledger relationship; Gap Analysis was not invoked | Not accepted |
| 14 | `PRD Genie - Realistic Clarification v2 Canary v0.2` | Focused verification after deferred-decision ledger correction | Execution `9680` stopped in Requirement Extractor validation because MT line 94 was labeled missing without supporting an emitted missing-information record | Not accepted |
| 15 | `PRD Genie - Realistic Clarification v2 Canary v0.3` | Verify the four-source clarification packet with deterministic evidence-derived coverage routing | Execution `9684` passed Requirement Extraction and Gap Analysis; gate route `clarification`; stopped before Human Approval | 100% |
| 16 | `PRD Genie - Realistic Clarification v3 Canary v0.6` | Verify the five-source clarification plus final amendment packet through the Human Approval boundary | Execution `9692` passed Requirement Extraction and Gap Analysis; gate route `human_approval`; approval not submitted | 100% |
| 17 | `PRD Genie - Realistic Clarification v4 Deterministic Gate Canary v0.8` | Verify the six-source mobile clarification with an audit-preserving deterministic resolution boundary | Local export passes; n8n ID `PhT3aEnSrbEJnlgE`, executions `9700`–`9703`, rejected for source-adapter syntax failure before extraction | Runtime not evaluated; local 100% |
| 18 | `PRD Genie - Realistic Clarification v4 Deterministic Gate Canary v0.8` | Controlled manual import of the exact six-node export | n8n ID `mJRvWwPZrPgwQWwW`; adapter execution `9704` passed; execution `9705` rejected by v1.9's legacy exactly-three-source validator before model execution | Runtime not evaluated; local 100% |
| 19 | `PRD Genie - Realistic Clarification v4 Deterministic Gate Canary v0.9` | Verify v4 through isolated Requirement Extractor v1.10, Gap Analysis and deterministic resolution | n8n ID `vMShSs7pPjzm7EWr`; adapter `9707` passed; extractor-only `9708`/child `9709` passed; full `9710`/child `9711` stopped on a stale five-source validator node reference before Gap Analysis | RE 100%; full run not accepted |
| 20 | `PRD Genie - Realistic Clarification v4 Deterministic Gate Canary v0.10` | Minimal corrected six-source validation boundary preserving v0.9 evidence | Local six-node/five-connection export passes syntax, topology, links, references, source count, schemas, negatives and semantic consistency; native import pending | Local 100%; runtime pending |
| 21 | `PRD Genie - Realistic Clarification v4 Deterministic Gate Canary v0.10` | Controlled live verification of corrected six-source validation | n8n ID `LuCOCCe1jRhb6g5o`; adapter `9712` and extractor-only `9713`/`9714` passed; full `9715` passed RE `9716` and GA `9717` but deterministic resolution failed on missing packet propagation | RE/GA 100%; gate not accepted |
| 22 | `PRD Genie - Realistic Clarification v4 Deterministic Gate Canary v0.11` | Preserve immutable `original_packet` context through the validated extraction and Gap Analysis boundary | Unpublished `ZUYumiSo2xdAJva5`; RE `9722`, GA `9723`; deterministic gate accepted and stopped at Human Approval | 100% |
| 23 | `PRD Genie - Realistic v4 Human Approval Tail v0.1` | Sign the exact accepted v0.11 allowlists and stop before PRD Generation | Unpublished `xcBnMPcnCI6xVS4h`; execution `9724` passed; trace `f4e298e120d6503b5dfac4688adae1db` accepted | 100% |
| 24 | `PRD Genie - Realistic v4 Production PRD Generator v0.1` | Produce one synchronized JSON/Markdown PRD and complete provenance ledger from signed approval `9724` | Unpublished `2K9dntvZDaUgudrl`; execution `9725` passed; trace `f8879ebe22d888152a77f892230c62ba`; stopped before Story Breakdown | 100% |
| 25 | `PRD Genie - Realistic v4 Story Breakdown Child v0.1` | Convert only PRD execution `9725` into a traceable epic/feature/story hierarchy | Unpublished `KKYU4QssjUTovd8U`; saved trigger passthrough and Langfuse credential verified; execution `9726` failed closed on false duplicate-parent-ID validation before trace construction | Runtime not evaluated; local 100% |
| 26 | `PRD Genie - Realistic v4 Story Breakdown Child v0.2` | Versioned correction with per-level hierarchy uniqueness | Local seven-node import candidate; no n8n identity; not executed or published | Local 100% |

## Integration-ready child exports

| Sequence | Child workflow | Parent supplies | Child returns | Status |
|---:|---|---|---|---|
| 1 | `PRD Genie - Requirement Extractor Child v1.0` | Workflow input plus orchestration context | Requirement Extraction stage envelope; next route `gap_analysis` | Imported; connected T1 canary passed |
| 1a | `PRD Genie - Requirement Extractor Child v1.1.1` | Either legacy workflow input or a canonical PB+MT+SN source packet, never combined | Unified Requirement Extraction envelope with preserved source packet and evidence provenance | Multi-source execution `9638` passed; legacy route retained |
| 1b | `PRD Genie - Requirement Extractor Child v1.5` | Approved realistic source packet plus complete candidate ledger | Canonical approved Requirement Extraction envelope; next route `gap_analysis` | Realistic execution `9661` passed with profile-bound normalization |
| 1c | `PRD Genie - Requirement Extractor Child v1.6` | Reviewed four-source packet including authoritative stakeholder clarifications | Candidate unified Requirement Extraction envelope with four-source provenance | Live execution `9678` rejected by deterministic citation-ledger validation; not promoted |
| 1d | `PRD Genie - Requirement Extractor Child v1.6.1` | Correct deferred technical-evaluation ledger classification | Candidate unified Requirement Extraction envelope | Live execution `9680` rejected a different MT line-94 ledger/evidence mismatch; not promoted |
| 1e | `PRD Genie - Requirement Extractor Child v1.7` | Derive the complete citation coverage ledger deterministically from emitted evidence | Validated four-source unified Requirement Extraction envelope | Execution `9684` passed with accepted Langfuse trace `8788033ddbc1d3d113d62f421902c363` |
| 1f | `PRD Genie - Requirement Extractor Child v1.9` | Hydrate exact canonical provenance deterministically for the approved five-source packet | Validated five-source unified Requirement Extraction envelope | Execution `9692` passed with accepted Langfuse trace `1b0f5b1c7c4ee1b2fce03db6d3fd1585` |
| 1g | `PRD Genie - Requirement Extractor Child v1.10` | Accept the unchanged eval route, the canonical three-source route, and versioned clarified production packets containing the three unique base sources plus authoritative clarification sources | Versioned unified Requirement Extraction envelope with preserved hashes, provenance, citations, decisions and supersessions | Unpublished workflow `eDAl2qSb4ai17JZk`; extractor-only child `9720` and full-run child `9722` passed at 100% groundedness with accepted Langfuse traces |
| 2 | `PRD Genie - Gap Analyzer Child v1.0` | Requirement Extraction plus orchestration context | Gap Analysis and Generation Gate stage envelope | Connected T1 passed; realistic execution `9667` passed and correctly routed to clarification |
| 3 | `PRD Genie - Human Approval Checkpoint Child v1.0.1` | Eligible extraction, Gap Analysis, gate and orchestration context | Validated Human Approval stage envelope after signed-form submission | Connected T1 pause/resume canary passed |
| 4 | `PRD Genie - PRD Generator Child v1.0.1` | Validated Human Approval stage and approved package | PRD Generation stage envelope; next route `story_breakdown` | Connected final canary passed; canonical TBD normalization added |
| 5 | `PRD Genie - Story Breakdown Child v1.0` | Validated T11 PRD stage | Validated T12 Story Breakdown stage envelope | Connected T1-to-T12 canary passed |
| 6 | `PRD Genie - Final Validator and Export Child v1.0` | Passed PRD and Story Breakdown stage envelopes | Final Validation envelope plus combined Markdown export | Connected execution `9578` passed; Langfuse accepted |

These child exports are integration interfaces, not additional AI agents. The standalone workflows remain the regression and release-evidence canvases.

## Cross-cutting workflow

| Workflow | Role | Status |
|---|---|---|
| `PRD Genie - Failure Observer v0.1` | Capture n8n execution failures and observability evidence | Implemented and published; applies across the pipeline rather than occupying one sequential stage |

## Retained diagnostic and superseded canvases

| Workflow | Reason retained | Run status |
|---|---|---|
| `PRD Genie - Requirement Extractor v0.1` | Original pre-Langfuse baseline | Superseded; do not use for final regression |
| `PRD Genie - PRD Generator Core v0.1 - PASSED` | Preserves the core T11 pass before the final observable workflow | Evidence only; do not use for release |
| `PRD Genie - PRD Generator v0.1 - SUPERSEDED - DO NOT RUN` | Preserves earlier failed/corrected PRD workflow history | Superseded |
| `PRD Genie - Story Breakdown + Langfuse v0.1` | Preserves T12 execution `8734`, safely rejected for nested-shape defects | Superseded; do not rerun |
| `S2_ Evaluation-Hardening T1-T10 Evaluator v0.3` | Intermediate isolated evaluator using Drive controls v1.0 and extractor clone `J2a4iyaPDWDtEKY5` | Superseded by evaluator v0.4; archived in `workflows/n8n/archive/evaluation-hardening/`; do not use for current evidence |

Current independent Requirement Extractor evaluation uses `S2_ Evaluation-Hardening T1-T10 Evaluator v0.4` (`lNRM0vzmggdpAoJe`) with Drive controls v1.2, the T3 and T10 human adjudications, and isolated extractor `CNZIUbNBFEap9ioy`.

## Connected target

`Source ingestion → Requirement Extractor → Gap Analyzer → Generation Gate → Human Approval → PRD Generator → Story Breakdown → Final validation/export`

Current realistic set: Requirement Extractor v1.10 `eDAl2qSb4ai17JZk`, Canary v0.11 `ZUYumiSo2xdAJva5`, and Human Approval Tail v0.1 `xcBnMPcnCI6xVS4h`. Approval execution `9724` preserved 17/17 dispositions and 15/15 effective decisions, and stopped before PRD Generation at 100% groundedness.

The isolated seven-node `Realistic v4 Production PRD Generator v0.1` is now runtime-validated as unpublished workflow `2K9dntvZDaUgudrl`. Execution `9725` produced the synchronized PRD and stopped before Story Breakdown.

The isolated seven-node `Realistic v4 Story Breakdown Child v0.1` is saved unpublished as `KKYU4QssjUTovd8U`. The trigger is `inputSource: passthrough`, the Langfuse credential is correct, and the corrected local export checksum is `70586ad1f8b8629d16c81d6df0c210ff93e2ca2ccce47eb3f340918a74234a39`. Execution `9726` failed closed before trace construction because the validator counted the same parent Epic/Feature ID once per story and misclassified the expected repetition as duplicate IDs. Preserve v0.1 as failed evidence and create a versioned correction before rerun.

The versioned v0.2 workflow checks identifiers independently at each hierarchy level and passes true-duplicate negatives for 4/4 levels while accepting valid repeated parent relationships. It retains the seven-node topology, passthrough trigger, Langfuse credential convention, full lineage/provenance, 19/19 coverage, and 100% groundedness. Native execution `9727` and trace `f772ec699a437bc70de67ac124976161` are accepted.

The Failure Observer and Langfuse operate across this sequence. Clarification, correction, rejection, and blocked routes must stop before unauthorized downstream generation.

## 2026-08-07 runtime and complete-list reconciliation

Story Breakdown v0.2 is runtime-validated as unpublished workflow `MEm1VyILsMyn53HU`. Execution `9727` and accepted trace `f772ec699a437bc70de67ac124976161` prove 3/4/7/12 hierarchy counts, 19/19 coverage, 6/6 sources, zero orphans, JSON/Markdown equivalence, 100% groundedness, and zero unsupported claims. Story Breakdown v0.1 `KKYU4QssjUTovd8U` / `9726` remains failed evidence.

The read-only n8n review enumerated 68 PRD Genie workflows: 18 current-active, 6 current-unpublished, 27 superseded evidence, 16 failed evidence, and 1 cleanup candidate. See [`COMPLETE_N8N_WORKFLOW_AUDIT_2026-08-07.md`](COMPLETE_N8N_WORKFLOW_AUDIT_2026-08-07.md).

The isolated realistic chain now ends at unpublished Final Validator/export `3A8biYxoQ7Q1E9FQ`. Execution `9728` passed with trace `4e1ef40a6da7a838ad9e9cc3a37a1a35`, final Markdown hash `82c614c0e6608c5b0010d22de6eb66ffa9def5600acb82fd80ebf1651756c5e1`, 100% groundedness, and zero unsupported claims. The existing connected Final Validator child remains unchanged.

## 2026-08-08 connected realistic production run

Inactive/unpublished main orchestrator v0.10 `Zh0BIOxTGyDyU4jB` completed execution `9785`. The connected chain succeeded as gate `9786`, Requirement Extractor `9787`, Gap Analyzer `9788`, Human Approval lineage verification `9789`, Production PRD `9790`, Story Breakdown `9791`, and Final Validator/export `9792`. The result reports seven connected stages, dynamic handoffs, 100% groundedness, zero unsupported claims, and final stage trace `bb1a0fe38750902d05c95c6e8d0cbd41`.

The parent remains inactive/unpublished. Required callable children are published for parent invocation. No workflow was activated, archived, or deleted.

## 2026-08-08 Google Drive production-input run

Published/inactive callable `WDrjaIMsrnF46q8b` reads and validates the exact six approved files from Google Drive before invoking Requirement Extractor v1.10, Gap Analyzer v1.0, and the deterministic gate. Direct execution `9797` passed.

Inactive/unpublished parent `YiWB9OxjvUyfxk53` completed execution `9800`, with connected executions `9801`–`9807`. The full run reports seven authoritative stages, dynamic handoffs, 6/6 source hashes, 17/17 decision dispositions, parent trace `26c7466f817aa1511f4a4e239bb52a62`, final stage trace `4130f84c1a99fc905436db7c06d98356`, 100% groundedness, and zero unsupported claims. No workflow was activated, archived, or deleted.

## 2026-08-08 Google Drive validated outputs

Inactive/unpublished parent `1iBHRurP8NLMW7BP` completed execution `9816`. After all seven authoritative stages and Final Validator/export passed, it uploaded exactly two timestamped files to `Production Outputs` folder `1DoTRyMj2ucxkD3B8_Oq5fc02TfS0rvVp`: final PRD Markdown (`1G2cd7xOyAj5J2-NpU4W8Eq-EwkgxFdh6`) and Story Breakdown JSON (`1eLQdPfHlsMcQOWB8x5BVie5nJaylKZCU`). Delivery is fail-closed and retains a structured receipt in the parent result.

Construction v0.12 `fZtwbTojKAgyfV0w` / execution `9808` remains failed evidence; it stopped before upload. No workflow was activated, archived, or deleted.
# S2 dynamic workflow family

The isolated S2 family was installed on 2026-08-08 with runtime Google Drive citation inventory creation and bidirectional traceability gates. The seven callable children are published/inactive; the main parent remains unpublished/inactive.

Versioned parent `qXwKh3NKS6DsATFs` execution `9842` passed in 1m 39.722s with run ID `RUN-S2-9843-16e7090e`, source packet `SP-S2-16e7090e7027e2d1`, and trace `31c935842eba067ff9ef372f1490f4ef`. It read 6 documents, indexed and dispositioned 145/145 citations, produced 35 PRD elements and 35 delivery items, and closed all four orphan classes at zero with 100% groundedness and zero unsupported claims. Four validated files—including a dedicated Story Breakdown JSON—were uploaded to Google Drive.

See `evaluation/results/s2-dynamic-workflow-family-static-validation-2026-08-08.md` and `evaluation/results/s2-dynamic-six-source-main-orchestrator-runtime-pass-2026-08-08.md`.
