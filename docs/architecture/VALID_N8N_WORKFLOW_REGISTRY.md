---
title: PRD Genie Valid n8n Workflow Registry
version: 1.0
status: Authoritative Allowlist
last_updated: 2026-08-06
owner: Vipin Puri
groundedness: 100%
---

# Valid n8n Workflow Registry

This is the authoritative allowlist for the PRD Genie workflows in the n8n Personal project. A workflow is valid only when both its name and immutable n8n workflow ID match a row below. Name matching alone is insufficient because duplicate names exist in the project.

The mirrored inactive n8n registry is `[REGISTRY] PRD Genie - VALID WORKFLOWS v1.0 - DO NOT EXECUTE AS PIPELINE`, workflow ID `isz9Jj1qVbwQVceS`. Verification execution `9640` returned all 15 allowlisted records successfully.

## Final runnable set

| Category | Workflow | n8n ID | Latest accepted evidence | Groundedness |
|---|---|---|---|---:|
| Standalone evaluation | `PRD Genie - Requirement Extractor + Langfuse v0.2` | `NXJLNsdf3N8HfrnQ` | Promoted v1.5 T1-T10 release gate 10/10 | 100% |
| Standalone evaluation | `PRD Genie - Gap Analyzer + Generation Gate v1.0` | `xrtf52GK57IRI1NI` | GA-T1-T10 release regression 10/10 | 100% |
| Standalone evaluation | `PRD Genie - Human Approval v0.3` | `hE3ekoftADwnQog2` | HA-R01 through HA-R06 route suite | 100% |
| Standalone evaluation | `PRD Genie - PRD Generator + Langfuse v0.1` | `30ZYQxRHWggFgrAe` | T11 execution `8621` | 100% |
| Standalone evaluation | `PRD Genie - Story Breakdown + Langfuse v0.2` | `sYjmLbuEQNhrm6xK` | T12 observable release | 100% |
| Cross-cutting | `PRD Genie - Failure Observer v0.1` | `ydNRRELKulEfzCeo` | Published error workflow | N/A |
| Connected child | `PRD Genie - Requirement Extractor Child v1.0` | `BTdoh2JW0mNlq9eT` | Connected T1-to-Final `9578` | 100% |
| Connected child | `PRD Genie - Requirement Extractor Child v1.1.1` | `f6W7bxcrodOPXh21` | Multi-source T1 `9638` | 100% |
| Connected child | `PRD Genie - Gap Analyzer Child v1.0` | `wGBE80XMjD5rTKql` | Connected T1-to-Final `9578` | 100% |
| Connected child | `PRD Genie - Human Approval Checkpoint Child v1.0.1` | `lx7vCf4zxBlBjveh` | Connected T1-to-Final `9578` | 100% |
| Connected child | `PRD Genie - PRD Generator Child v1.0.1` | `T07vf7xPOWegbCJk` | Connected T1-to-Final `9578` | 100% |
| Connected child | `PRD Genie - Story Breakdown Child v1.0` | `M85Dvpg0uriViX14` | Connected T1-to-Final `9578` | 100% |
| Connected child | `PRD Genie - Final Validator and Export Child v1.0` | `gPc9aTRQ8qLWdZgL` | Connected T1-to-Final `9578` | 100% |
| Final connected parent | `PRD Genie - Connected Orchestrator v0.5` | `OTmIj7I1AFVvCceV` | T1-to-Final execution `9578` | 100% |
| Multi-source canary | `PRD Genie - Multi-Source T1 Parity Canary v0.2` | `wXIY2Wn4umHsvWft` | Execution `9638`; trace `2f0e20055d7765ca3bb0bb0d2bea866b` | 100% |
| Connected child | `PRD Genie - Requirement Extractor Child v1.5` | `irsZec9KNFzxbcK2` | Realistic execution `9661`; trace `4adf60a1f5f83849170303de20471d81` | 100% |
| Multi-source canary | `PRD Genie - Realistic Multi-Source Requirement Extraction Canary v0.6` | `jQPnuwa0E759FoCC` | Execution `9661`; 44/4/12 semantic parity | 100% |
| Gap Analysis canary | `PRD Genie - Realistic Gap Analysis Canary v0.1` | `7Z9TRF8RIyqWNDCe` | Execution `9667`; trace `a727f4397ede1de96d15e18a78d6bdd0`; route `clarification` | 100% |

## Pending / not promoted

Current isolated realistic v4 set (saved and unpublished): Requirement Extractor Child v1.10 `eDAl2qSb4ai17JZk`; Deterministic Gate Canary v0.11 `ZUYumiSo2xdAJva5`; Human Approval Tail v0.1 `xcBnMPcnCI6xVS4h`; Production PRD Generator v0.1 `2K9dntvZDaUgudrl`. Accepted evidence is child executions `9722`/`9723`, Human Approval `9724`, and PRD Generation `9725`; groundedness 100%, unsupported claims 0. These isolated workflows are validated but are not published production workflows.

| Type | Workflow | n8n ID | Evidence | Groundedness |
|---|---|---|---|---|
| Connected child | `PRD Genie - Requirement Extractor Child v1.6` | `GxK42oKysCS0ZHFC` | Execution `9678` rejected an invalid clarification line-23 conflict-ledger relationship | Not accepted |
| Clarification canary | `PRD Genie - Realistic Clarification v2 Canary v0.1` | `CEVm7KSZrdcfQ0qV` | Execution `9678`; stopped before Gap Analysis and Human Approval | Not accepted |
| Connected child | `PRD Genie - Requirement Extractor Child v1.6.1` | `GsJaBWKUXOw7EfX0` | Execution `9680` rejected an MT line-94 missing-ledger/evidence mismatch | Not accepted |
| Clarification canary | `PRD Genie - Realistic Clarification v2 Canary v0.2` | `pF7LmuLU9JRMiFmn` | Execution `9680`; stopped before Gap Analysis and Human Approval | Not accepted |

## Clarification v2 accepted workflows

| Type | Workflow | n8n ID | Evidence | Groundedness |
|---|---|---|---|---|
| Connected child | `PRD Genie - Requirement Extractor Child v1.7` | `Sdu0l5yYFn60RfvZ` | Execution `9684`; trace `8788033ddbc1d3d113d62f421902c363` | 100% |
| Clarification canary | `PRD Genie - Realistic Clarification v2 Canary v0.3` | `TfjJhfWDq3bZAPI2` | Execution `9684`; Gap trace `0b1f4aa95724a894367f77f2cc44da84`; route `clarification` | 100% |

## Final amendment v3 — accepted workflows

| Type | Workflow | n8n ID | Evidence | Groundedness |
|---|---|---|---|---|
| Connected child | `PRD Genie - Requirement Extractor Child v1.8` | `DLjawLd651ksC9Mp` | Execution `9687` rejected provenance mismatches on `PER-002`, `CON-005`, and `RSK-001` | Not accepted |
| Clarification canary | `PRD Genie - Realistic Clarification v3 Canary v0.4` | `5JDrnH6E4emJB7WD` | Execution `9687`; stopped before Gap Analysis and Human Approval | Not accepted |
| Connected child | `PRD Genie - Requirement Extractor Child v1.9` | `DJvhjvzsVF3EamEM` | Execution `9692`; trace `1b0f5b1c7c4ee1b2fce03db6d3fd1585`; deterministic provenance hydration passed | 100% |
| Clarification canary | `PRD Genie - Realistic Clarification v3 Canary v0.6` | `i6Tb2P6se5pwn5ad` | Execution `9692`; Gap trace `b3ef34f731507c2570f240d86091c382`; route `human_approval` | 100% |

## Do not use as final workflows

These canvases are retained only for diagnostic or historical evidence:

| Workflow/ID | Classification | Replacement |
|---|---|---|
| Requirement Extractor Child v1.1 — `Unz88umJAaPdrnpQ` | Diagnostic failed gate version | v1.1.1 — `f6W7bxcrodOPXh21` |
| Multi-Source T1 Parity Canary v0.1 — `e2EkaBwL1awV5Fa8` | Diagnostic failed canary | v0.2 — `wXIY2Wn4umHsvWft` |
| Connected Orchestrator v0.5 — `DRneGVklJT1DhDKv` | Duplicate/non-authoritative | v0.5 — `OTmIj7I1AFVvCceV` |
| Connected Orchestrators v0.1-v0.4 | Incremental evidence | v0.5 — `OTmIj7I1AFVvCceV` |
| Human Approval v0.1-v0.2 | Incremental evidence | v0.3 — `hE3ekoftADwnQog2` |
| PRD Generator Child v1.0 | Superseded | v1.0.1 — `T07vf7xPOWegbCJk` |
| Human Approval Checkpoint Child v1.0 | Superseded | v1.0.1 — `lx7vCf4zxBlBjveh` |
| Story Breakdown + Langfuse v0.1 | Diagnostic failed version | v0.2 — `sYjmLbuEQNhrm6xK` |
| PRD Generator Core v0.1 and PRD Generator v0.1 | Diagnostic/superseded | Observable workflow — `30ZYQxRHWggFgrAe` |
| Requirement Extractor v0.1 | Superseded baseline | v0.2 — `NXJLNsdf3N8HfrnQ` |
| Requirement Extractor Children v1.2-v1.4.2 and realistic canaries v0.1-v0.5 | Diagnostic/failed incremental evidence | Child v1.5 — `irsZec9KNFzxbcK2`; Canary v0.6 — `jQPnuwa0E759FoCC` |
| Merged Realistic Gap Analysis diagnostic canvas — `a7jOgippMt3Ovhfb` | Import-update merge retained a stale failing branch | Clean v0.1 — `7Z9TRF8RIyqWNDCe` |
| Realistic Clarification v4 Deterministic Gate Canary v0.8 — `PhT3aEnSrbEJnlgE` | UI deployment malformed the inline v4 source adapter; executions `9700`–`9703` stopped before extraction | Exact local export `workflows/n8n/prd-genie-realistic-clarification-v4-canary-v0.8.json`; rerun required before allowlisting |
| Realistic Clarification v4 Deterministic Gate Canary v0.8 — `mJRvWwPZrPgwQWwW` | Exact manual import; adapter `9704` passed, but execution `9705` hit v1.9's legacy exactly-three-source input validator before any model stage | Versioned six-source Requirement Extractor validator required before allowlisting |

## Operating rule

Before importing, invoking, or documenting a workflow, verify its ID against the final runnable set. New workflows enter the allowlist only after an accepted n8n execution, required Langfuse evidence, zero unsupported claims, and **100% groundedness** where grounding applies.
