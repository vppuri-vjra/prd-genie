---
title: PRD Genie End-to-End Test Traceability Matrix
version: 1.0
status: Living Evidence Dashboard
last_updated: 2026-08-06
owner: Vipin Puri
---

# PRD Genie End-to-End Test Traceability Matrix

## Purpose

This matrix is the central test evidence chain for PRD Genie. It shows how each T1-T10 case progresses from approved Requirement Extraction through Gap Analysis, the deterministic generation gate, human review, PRD generation, downstream validation, and observability.

It distinguishes:

- **actual** execution evidence from approved but unexecuted ground truth;
- a successful Requirement Extraction from eligibility to generate a PRD;
- clarification or blocking decisions from workflow failures; and
- completed implementation from planned downstream stages.

## Current coverage summary

| Stage | Current coverage | Status |
|---|---:|---|
| Requirement Extractor ground truth | 10/10 | Approved |
| Requirement Extractor unchanged release regression | 10/10 | Passed at 100% |
| Gap Analyzer ground truth | 10/10 | Human-approved at 100% groundedness |
| Gap Analyzer end-to-end execution | 10/10 | Passed at 100% under prompt v1.0 |
| Gap Analyzer unchanged release regression | 10/10 | Passed at 100%; prompt v1.0 promoted |
| Deterministic generation-gate execution | 10/10 | Human review, clarification, explicit block, and human-review-with-TBD routes verified |
| T-tests eligible to reach Human Approval | 5/10 | T1, T4, T7, T8 and T10 |
| Human Approval route execution | 8/8 route-suite executions | Three standard approvals plus changes-requested, clarification, rejection, conditional approval, and controlled validation failure; all passed at 100% groundedness |
| Eligible for PRD after Human Approval | 4/5 eligible tests | T1, T7 and T8 approved; T10 conditionally approved; T4 returned to correction |
| PRD Generator evaluation | T11 observable release passed | Prompt v0.4 passed at 100% with ten sections and Langfuse trace `05e9aa534e4286e17ec65512a72e48ff` |
| Story Breakdown evaluation | T12 observable release passed | Prompt v0.2 passed at 100%; 1 epic, 1 feature, 1 story, 2 criteria, 2 unresolved questions; Langfuse trace `8e2078937f42afa208b3b2dc8d0f159b` |
| Connected final validation/export | T1-to-Final canary passed | n8n `9578`; all stage and cross-stage contracts passed; Markdown exported; Langfuse trace `a7722b22651568c775987fbb09e3be1c`; 100% groundedness |
| T1 multi-source parity | PB+MT+SN n8n canary passed | Execution `9638`; four approved facts, exact source traceability, 100% groundedness, 0 unsupported claims; Langfuse `2f0e20055d7765ca3bb0bb0d2bea866b` |
| Realistic multi-source intake v1 | Supplied PB+MT+SN Requirement Extraction canary passed | Three byte-identical resources; execution `9661`; 70/70 candidate and canonical citations; 44 items / 4 contradictions / 12 missing-information records; exact traceability and semantic parity passed; Langfuse accepted; 0 unsupported claims; 100% groundedness; next route `gap_analysis` |
| Realistic multi-source Gap Analysis v1 | Accepted extraction passed Gap Analysis and deterministic gate | Execution `9667`; 14 traceable gaps; 12/12 missing-information, 4/4 contradiction and 2/2 source-risk coverage; Langfuse `a727f4397ede1de96d15e18a78d6bdd0`; route `clarification`; Human Approval and PRD generation not invoked; 0 unsupported claims; 100% groundedness |
| Realistic four-source clarification v2 | Local packet accepted; live extraction rejected | Local 14/14 decision, citation, supersession and hash checks passed at 100%. n8n `9676` exposed a credential integration defect; after correction, n8n `9678` failed deterministic coverage-ledger validation for clarification line 23. No accepted extraction, Langfuse trace, Gap Analysis, gate decision, Human Approval or PRD generation is claimed. Runtime groundedness not accepted. |

## Status legend

| Indicator | Meaning |
|---|---|
| 🟢 | Passed, sufficient, or eligible |
| 🟡 | Partial, conditional, or proceed-with-TBD |
| 🔴 | Clarification required; downstream generation ineligible |
| ⛔ | Generation explicitly blocked |
| ⚪ | Not yet defined, approved, or executed |
| ⚫ | No meaningful requirements |

## T1-T10 progression matrix

`Expected` identifies human-approved ground truth that has not yet been executed in n8n. `Actual` identifies completed end-to-end workflow evidence.

| Test | Requirement Extractor status | RE evaluation | Gap Analyzer coverage | GA status and decision | Generation-gate outcome | Human-review status | PRD Generator status |
|---|---|---|---|---|---|---|---|
| T1 | 🟢 `complete` | Actual pass, 100% | Actual GA execution | 🟢 `sufficient / proceed`, 100% | `eligible_for_human_approval`; `human_review` | 🟢 Actual `HA-R01 / approved`, 100% | 🟢 T11 observable release passed at 100%; Langfuse ingestion accepted |
| T2 | 🟡 `partial` | Actual pass, 100% | Actual GA execution | 🔴 `insufficient / request_clarification`, 100% | `clarification_required`; `clarification` | Not applicable until clarified | Blocked pending clarification |
| T3 | 🟡 `partial` | Actual pass, 100% | Actual GA execution | 🔴 `insufficient / request_clarification`, 100% | `clarification_required`; `clarification` | Not applicable until clarified | Blocked pending contradiction resolution |
| T4 | 🟢 `complete` | Actual pass, 100% | Actual GA execution | 🟢 `sufficient / proceed`, 100% | `eligible_for_human_approval`; `human_review` | 🔴 Actual `HA-R02 / changes_requested`, 100% | Not eligible; routed to correction |
| T5 | 🟡 `partial` | Actual pass, 100% | Actual GA execution | 🔴 `insufficient / request_clarification`, 100% | `clarification_required`; `clarification` | Not applicable until clarified | Blocked pending substantive source clarification |
| T6 | 🟡 `partial` | Actual pass, 100% | Actual GA execution | 🔴 `insufficient / request_clarification`, 100% | `clarification_required`; `clarification` | Not applicable until clarified | Blocked pending scope, decision, and deadline clarification |
| T7 | 🟢 `complete` | Actual pass, 100% | Actual GA execution | 🟢 `sufficient / proceed`, 100% | `eligible_for_human_approval`; `human_review` | 🟢 Actual `HA-R01 / approved`, 100% | Eligible; PRD Generator not yet executed |
| T8 | 🟢 `complete` | Actual pass, 100% | Actual GA execution | 🟢 `sufficient / proceed`, 100% | `eligible_for_human_approval`; `human_review` | 🟢 Actual `HA-R01 / approved`, 100% | Eligible; PRD Generator not yet executed |
| T9 | ⚫ `no_requirements` | Actual pass, 100% | Actual GA execution | ⛔ `insufficient / block_generation`, 100% | `generation_blocked`; `blocked` | Not applicable | Must not be invoked |
| T10 | 🟢 `complete` | Actual pass, 100% | Actual GA execution | 🟡 `partially_sufficient / proceed_with_tbd`, 100% | `eligible_with_tbd`; `human_review_with_tbd` | 🟡 Actual `HA-R05 / approved_with_conditions`, 100% | Eligible with controlled TBD; PRD Generator not yet executed |

## Human Approval to PRD progression view

This view makes the stage boundary explicit. A Human Approval route test must be based on a T-test that actually reaches the Human Approval checkpoint under its approved Gap Analysis and deterministic gate. Tests stopped by clarification or blocking remain valuable end-to-end tests, but they are not Human Approval inputs.

| Test | Reaches Human Approval? | Gate basis | Human Approval case/status | Reaches PRD Generator? | Reason/current action | Groundedness |
|---|---|---|---|---|---|---:|
| T1 | Yes | `eligible_for_human_approval / human_review` | `HA-R01 / approved` — passed | Yes—executed | T11 observable release passed; actual JSON and Markdown preserved; Langfuse ingestion accepted | 100% |
| T2 | No | `clarification_required / clarification` | Not applicable | No | Clarify metrics, format, target users and intended reporting capability | 100% |
| T3 | No | `clarification_required / clarification` | Not applicable | No | Resolve the explicit refresh contradiction | 100% |
| T4 | Yes | `eligible_for_human_approval / human_review` | `HA-R02 / changes_requested` — passed | No | Correct classification and relationships for `FR-002` and `FR-003`, then re-review | 100% |
| T5 | No | `clarification_required / clarification` | Not applicable | No | Source contains fragments but lacks a reliable requirement | 100% |
| T6 | No | `clarification_required / clarification` | Not applicable | No | Clarify scope, architecture decision and deadline | 100% |
| T7 | Yes | `eligible_for_human_approval / human_review` | `HA-R01 / approved` — passed | Yes, eligible | Approved package is ready; PRD Generator not yet implemented | 100% |
| T8 | Yes | `eligible_for_human_approval / human_review` | `HA-R01 / approved` — passed | Yes, eligible | Approved persona-to-capability package is ready; PRD Generator not yet implemented | 100% |
| T9 | No | `generation_blocked / blocked` | Not applicable | No | No meaningful requirements; generation must remain blocked | 100% |
| T10 | Yes, with TBD | `eligible_with_tbd / human_review_with_tbd` | `HA-R05 / approved_with_conditions` — passed | Yes, conditionally eligible | Carry `GAP-001`, `DEP-001` and `RSK-001` forward; ETA remains TBD | 100% |

### Human Approval route-test allocation rule

- `HA-R01`, `HA-R02` and future positive/conditional Human Approval cases must use only T1, T4, T7, T8 or T10 because these are the five tests that reach Human Approval.
- T2, T3, T5 and T6 test the earlier clarification route and must not be shown as reaching Human Approval.
- T9 tests the explicit generation-blocked route and must not be shown as reaching Human Approval.
- A controlled validation-failure case may corrupt a package derived from an eligible test, but its source T-test and the deliberate mutation must both be recorded.

### Human Approval actual executions

| Test | Case / decision | n8n execution | Contract | PRD route | Evaluator | Langfuse trace |
|---|---|---:|---|---|---|---|
| T1 | `HA-R01 / approved` | `7832` | Passed | `prd_generation` | Pass, 100% | `04c6b3386a8197b7c553429a57b75bc8` |
| T4 | `HA-R02 / changes_requested` | `7941` | Passed | `correction` | Pass, 100% | `d7b8a4a6fe2f356d5f6b9101994074b3` |
| T7 | `HA-R01 / approved` | `8376` | Passed | `prd_generation` | Pass, 100% | `ef61a737842a797efd6f1818ac6854af` |
| T8 | `HA-R01 / approved` | `8615` | Passed | `prd_generation` | Pass, 100% | `2f6530b30b1180af0acf3e234aa19ac6` |
| T8 | `HA-R03 / clarification_required` | `9518` | Passed | `clarification` | Pass, 100% | `da9636799e681033008b70cd8c5ab065` |
| T8 | `HA-R04 / rejected` | `9521` | Passed | `stopped` | Pass, 100% | `f28fc75639f5aeffa9525c8501c6a0b9` |
| T10 | `HA-R05 / approved_with_conditions` | `8616` | Passed | `prd_generation_with_conditions` | Pass, 100% | `4be0fcf52527b2ccb2797f71a7aaf389` |
| T8 controlled invalid variant | `HA-R06 / validation failure` | `9551` | Passed negative case | No route | Pass, 100% | Not emitted by design |

## Execution and observability evidence

### Requirement Extractor v1.5 release gate

| Test | Evaluator | Langfuse trace |
|---|---|---|
| T1 | Pass, 100% | `f14cabccaaea5d00e29f27373adb0002` |
| T2 | Pass, 100% | `1149173aaec8ae6537ae1473c5224b95` |
| T3 | Pass, 100% | `1d107c61ea7d1b41cd95ac1ee3387d9d` |
| T4 | Pass, 100% | `119cf3a477d60ff2db2554ab62230901` |
| T5 | Pass, 100% | `e6fd722a4449e6447b486cfd567038e1` |
| T6 | Pass, 100% | `4df9435c66949989a0993ea70134f4d7` |
| T7 | Pass, 100% | `f1f4b66ca431fae3690b53289d26f56f` |
| T8 | Pass, 100% | `29a07897e56f78b18882549f29b2ab6e` |
| T9 | Pass, 100% | `3c54e41412a6b0a1538b9f1bb227205c` |
| T10 | Pass, 100% | `0c99f045579f328bd5a97b05dbb61bb5` |

### Gap Analyzer actual executions

| Test | Prompt | n8n execution | Decision | Gate/route | Evaluator | Langfuse trace |
|---|---|---:|---|---|---|---|
| GA-T1 | `gap-analyzer-v0.2-materiality-boundary` | `7282` | `sufficient / proceed` | `eligible_for_human_approval / human_review` | Pass, 100% | `76d44c23ccd385be8973435d7886aef2` |
| GA-T2 | `gap-analyzer-v0.5-severity-boundary` | `7595` | `insufficient / request_clarification` | `clarification_required / clarification` | Pass, 100% | `7c39feb2c77de8b7467cccbd37737208` |
| GA-T3 | `gap-analyzer-v0.6-contradiction-contract` | `7600` | `insufficient / request_clarification` | `clarification_required / clarification` | Pass, 100% | `e277c0f2afa297cd37d33f243e5dc714` |
| GA-T5 | `gap-analyzer-v0.7-fragment-gap-coverage` | `7602` | `insufficient / request_clarification` | `clarification_required / clarification` | Pass, 100% | `444278460f3941a14b0e58b9246b9f9e` |
| GA-T9 | `gap-analyzer-v0.8-no-requirements-category` | `7608` | `insufficient / block_generation` | `generation_blocked / blocked` | Pass, 100% | `25629f451f919250ca70c259f8712e3d` |
| GA-T10 | `gap-analyzer-v0.9-dependency-uncertainty` | `7611` | `partially_sufficient / proceed_with_tbd` | `eligible_with_tbd / human_review_with_tbd` | Pass, 100% | `1afc44d756a9c866627facc805b95a7a` |

### Gap Analyzer v0.9 unchanged release regression

| Test | n8n execution | Evaluator | Langfuse trace |
|---|---:|---|---|
| GA-T1 | `7614` | Pass, 100% | `d79e95c9fcd703319496abfd757d3311` |
| GA-T2 | `7617` | Pass, 100% | `1e6357e7ec3e60155a48a537c1240388` |
| GA-T3 | `7618` | Pass, 100% | `454ba7971bc86f6cf72bb1044a76be22` |
| GA-T5 | `7619` | Pass, 100% | `eb4d94ec687f49f70cd7297a7d3edd9d` |
| GA-T9 | `7620` | Pass, 100% | `6f3121dc8e7a6391160465fb8d832a7d` |
| GA-T10 | `7621` | Pass, 100% | `3ba5da4fb2b9ac3e9a6a00c1beb7bb6d` |

### Gap Analyzer v1.0 unchanged T1-T10 release regression

| Test | n8n execution | Decision | Gate/route | Evaluator | Langfuse trace |
|---|---:|---|---|---|---|
| GA-T1 | `7630` | `sufficient / proceed` | `eligible_for_human_approval / human_review` | Pass, 100% | `f0b80250cb7c13efb2e025e03c39de1e` |
| GA-T2 | `7631` | `insufficient / request_clarification` | `clarification_required / clarification` | Pass, 100% | `812557d70b66f3edae7d4b8703964150` |
| GA-T3 | `7632` | `insufficient / request_clarification` | `clarification_required / clarification` | Pass, 100% | `a901c5b3a01a2d1330ff30821d91cd43` |
| GA-T4 | `7633` | `sufficient / proceed` | `eligible_for_human_approval / human_review` | Pass, 100% | `692aab1bda05acad2118f9a83fd51e06` |
| GA-T5 | `7634` | `insufficient / request_clarification` | `clarification_required / clarification` | Pass, 100% | `22f26c6eb05af43e2e5c8f7143d323c1` |
| GA-T6 | `7635` | `insufficient / request_clarification` | `clarification_required / clarification` | Pass, 100% | `107c7e1b1c45e57ba3823ba90706a787` |
| GA-T7 | `7636` | `sufficient / proceed` | `eligible_for_human_approval / human_review` | Pass, 100% | `c1bb59f5ed2feab4c9a6a38dcfadf660` |
| GA-T8 | `7637` | `sufficient / proceed` | `eligible_for_human_approval / human_review` | Pass, 100% | `33831f84b07b18fc3cb1bc6c96d56901` |
| GA-T9 | `7638` | `insufficient / block_generation` | `generation_blocked / blocked` | Pass, 100% | `52466facd1650beec8cd0f0f42658f3d` |
| GA-T10 | `7639` | `partially_sufficient / proceed_with_tbd` | `eligible_with_tbd / human_review_with_tbd` | Pass, 100% | `d975a5fc176633dcc1e6dd4bb336804f` |

### Connected Orchestrator T1 two-child canary

| Run | Connected stages | Result | Route | Groundedness | Parent trace | Requirement Extractor trace | Gap Analyzer trace |
|---|---|---|---|---:|---|---|---|
| `RUN-T1-CONNECTED-1785970186388` | Requirement Extractor → Gap Analyzer → Generation Gate | Pass | `human_review` → `human_approval` | 100% | `b995873732fcebdc16daa9b573b4cba5` | `2d28f18c2c61fed623dfd96c25ee3fb4` | `20f91a743e6c98cdc55a7b8807b811a8` |

### Connected Orchestrator T1-to-T11 PRD canary

| Run | Connected stages | Result | Final route | Groundedness | Parent trace | PRD trace |
|---|---|---|---|---:|---|---|
| `RUN-T1-CONNECTED-1786024618558` | Requirement Extractor → Gap Analyzer → Generation Gate → signed Human Approval → PRD Generator → PRD Validator | Pass | `story_breakdown` | 100% | `bf02a72bc3e9bf90963c0baebf15f367` | `16e338b742209d0345456aa43dbdf565` |

### Connected Orchestrator T1-to-Final export canary

| n8n execution | Run | Connected stages | Result | Final route | Groundedness | Parent trace | Final Validation trace | Export |
|---:|---|---|---|---|---:|---|---|---|
| `9578` | `RUN-T1-CONNECTED-1786039807443` | Requirement Extractor → Gap Analyzer → Generation Gate → signed Human Approval → PRD Generator → Story Breakdown → Final Validator/export | Pass | `completed` | 100% | `d9b944978c5ad2078c639dda899399e0` | `a7722b22651568c775987fbb09e3be1c` | `prd-genie-t1-final.md` |

### Realistic PB+MT+SN Requirement Extraction canary

| n8n execution | Workflow | Result | Canonical counts | Citation coverage | Semantic parity | Groundedness | Unsupported claims | Langfuse trace |
|---:|---|---|---|---:|---|---:|---:|---|
| `9661` | `Realistic Multi-Source Requirement Extraction Canary v0.6` | Pass | 44 items / 4 contradictions / 12 missing | 70/70 | Pass | 100% | 0 | `4adf60a1f5f83849170303de20471d81` |

### Realistic PB+MT+SN Gap Analysis canary

| n8n execution | Workflow | Result | Gaps | Missing coverage | Contradictions | Source risks | Gate route | Human Approval invoked | Groundedness | Unsupported claims | Langfuse trace |
|---:|---|---|---:|---:|---:|---:|---|---|---:|---:|---|
| `9667` | `Realistic Gap Analysis Canary v0.1` | Pass | 14 | 12/12 | 4/4 | 2/2 | `clarification` | No | 100% | 0 | `a727f4397ede1de96d15e18a78d6bdd0` |

### Realistic PB+MT+SN+clarification v2 canary

| Execution | Workflow | Result | Boundary reached | Gap Analyzer invoked | Human Approval invoked | Runtime groundedness | Langfuse |
|---|---|---|---|---|---|---|---|
| `9676` | `Realistic Clarification v2 Canary v0.1` | Integration failure | OpenAI model credential binding | No | No | Not evaluated | None |
| `9678` | `Realistic Clarification v2 Canary v0.1` | Deterministic rejection | Requirement Extractor citation-ledger validation | No | No | Not accepted | Not claimed |
| `9680` | `Realistic Clarification v2 Canary v0.2` | Deterministic rejection | Requirement Extractor MT line-94 ledger/evidence validation | No | No | Not accepted | Not claimed |
| `9684` | `Realistic Clarification v2 Canary v0.3` | Pass | Requirement Extractor → Gap Analyzer → Generation Gate | Yes | No; gate returned `clarification` | 100% | RE `8788033ddbc1d3d113d62f421902c363`; GA `0b1f4aa95724a894367f77f2cc44da84` |
| `9687` | `Realistic Clarification v3 Canary v0.4` | Deterministic rejection | Requirement Extractor provenance validation | No | No | Not accepted | Not claimed |
| `9692` | `Realistic Clarification v3 Canary v0.6` | Pass | Requirement Extractor → Gap Analyzer → Generation Gate | Yes | No; stopped at eligible Human Approval boundary | 100% | RE `1b0f5b1c7c4ee1b2fce03db6d3fd1585`; GA `b3ef34f731507c2570f240d86091c382` |
| `9700`–`9703` | `Realistic Clarification v4 Deterministic Gate Canary v0.8` | Integration failure | Source-packet adapter syntax | No | No | Not evaluated; local v4 baseline 100% | None; no observable stage invoked |
| `9704` | `Realistic Clarification v4 Deterministic Gate Canary v0.8` | Adapter pass | Six-source source-packet adapter only | No | No | Local/adapter contract 100%; no model grounding stage | None; intentionally syntax-only |
| `9705` | `Realistic Clarification v4 Deterministic Gate Canary v0.8` | Integration rejection | Requirement Extractor v1.9 legacy exactly-three-source validator | No | No | Not evaluated; local v4 baseline 100% | None; rejected before model stage |
| Pending native import | `Requirement Extractor Child v1.10` / `Realistic Clarification v4 Canary v0.9` | Local contract pass | Versioned production input boundary | Not yet | No | Local 100%; unsupported content 0 | Pending live execution |
| `9707` | `Realistic Clarification v4 Canary v0.9` | Adapter pass | Six-source packet adapter only | No | No | Adapter contract 100% | None by design |
| `9708` / child `9709` | `Realistic Clarification v4 Canary v0.9` | Extractor-only pass | Requirement Extraction v1.10 | No | No | 100%; unsupported content 0 | `c7a4403a6b558ff53db3ff2c755ca8f4` accepted |
| `9710` / child `9711` | `Realistic Clarification v4 Canary v0.9` | Integration rejection after accepted RE | Stale five-source reference in `Validate Six-Source Extraction`; Gap Analysis not invoked | No | No | RE 100%; full run not accepted | RE `4927a95c7a93422f2b2a83b14c534c95` accepted |
| Pending native import | `Realistic Clarification v4 Canary v0.10` | Local correction pass | Six-source validation boundary | Not yet | No | Local 100%; unsupported content 0 | Pending live execution |
| `9712` | `Realistic Clarification v4 Canary v0.10` | Adapter pass | Six-source adapter only | No | No | Adapter contract 100% | None by design |
| `9713` / child `9714` | `Realistic Clarification v4 Canary v0.10` | Extractor-only pass | Requirement Extraction v1.10 | No | No | 100%; unsupported claims 0 | `43699b4bf9b73fa97ea955a475459339` accepted |
| `9715` / children `9716`, `9717` | `Realistic Clarification v4 Canary v0.10` | Integration rejection after accepted RE and GA | Original packet not propagated to deterministic resolution boundary | Yes | No | RE 100%; GA 100%; gate not accepted | RE `7184f321485d2952f2a799a07cf8c3b0`; GA `982c0290088dcabb14c8d7ce652ed86d`; both accepted |
| Adapter-only; parent record not retained by save policy | `Realistic Clarification v4 Canary v0.11` | Pass | Canonical six-source packet adapter | No | No | Contract 100%; no model grounding stage | None by design |
| Extractor-only / child `9720` | `Realistic Clarification v4 Canary v0.11` | Pass | Requirement Extraction v1.10 | No | No | 100%; unsupported claims 0 | RE `6c94725e2a0151150cafe5c9f4566f7b` accepted; parent trace `aa4949051224a1f657367dfffa6c416d` |
| Full run / children `9722`, `9723` | `Realistic Clarification v4 Canary v0.11` | Pass; stopped at Human Approval boundary | Immutable six-source `original_packet` preserved through Requirement Extraction, Gap Analysis and deterministic resolution | Yes | No | RE 100%; GA 100%; unsupported claims/decisions 0 | RE `320fb727a808c8228001e1aef5de7d98`; GA `322897a2600add94152dbf938c837c00`; parent trace `26c7466f817aa1511f4a4e239bb52a62`; accepted |
| `9724` | `Realistic v4 Human Approval Tail v0.1` | Pass; signed approval completed | Exact v0.11 evidence plus 17/17 decision dispositions, 15/15 effective decisions and 19 approved item IDs | Yes | Yes; stopped immediately afterward | 100%; unsupported claims/decisions 0 | `f4e298e120d6503b5dfac4688adae1db` accepted; parent trace `26c7466f817aa1511f4a4e239bb52a62`; PRD Generator absent |
| `9725` | `Realistic v4 Production PRD Generator v0.1` | Pass | One schema-valid synchronized JSON/Markdown PRD; 19/19 items, 17/17 dispositions, 15/15 effective decisions, 2/2 superseded audit-only, 6/6 sources | Yes | PRD generated; Story Breakdown no | 100%; unsupported claims 0 | PRD trace `f8879ebe22d888152a77f892230c62ba` accepted; HTTP 200; parent trace preserved |
| `9726` | `Realistic v4 Story Breakdown Child v0.1` / `KKYU4QssjUTovd8U` | Integration-validator rejection | Trigger, loader and PRD entry passed; deterministic validator falsely treated repeated parent Epic/Feature references as duplicate IDs | N/A | Trace construction, Langfuse and downstream publication not invoked | Runtime not evaluated; upstream/local baseline 100% | No Story Breakdown trace; failed before ingestion |
| Local candidate; not executed | `Realistic v4 Story Breakdown Child v0.2` | Local remediation pass | Per-level uniqueness; 3 epics, 4 features, 7 stories, 12 criteria; 19/19 coverage; 4/4 true-duplicate negatives | N/A | No live invocation; native import pending | Local 100%; unsupported claims 0 | No runtime trace claimed |

## Stage-entry rule

Passing Requirement Extraction does not authorize PRD generation. A case may enter the PRD Generator only when:

1. its Requirement Extraction has passed contract and ground-truth evaluation;
2. its approved Gap Analysis has been executed successfully;
3. the deterministic gate marks it PRD-generation eligible;
4. required human approval has been recorded; and
5. only approved source-linked items and controlled TBDs are supplied downstream.

Clarification and blocked cases must demonstrate that the PRD Generator was **not invoked**.

## Update protocol

Update this matrix after every evaluated agent execution. For each stage, record the actual or expected label, status/decision, groundedness, n8n execution ID, Langfuse trace, evaluator result, human decision, and downstream eligibility. Do not replace expected values with actual values until execution evidence exists, and preserve failed or superseded evidence in its versioned evaluation folder.

## Groundedness statement

Matrix groundedness: **100% for the recorded Requirement Extractor results, the n8n T1 and realistic PB+MT+SN parity canaries, realistic Gap Analysis execution `9667`, all ten human-approved GA ground-truth decisions, the unchanged GA-T1-T10 v1.0 release regression, the connected T1 two-child canary, all eight Human Approval route-suite executions, the connected T1-to-T11 and T1-to-Final canaries, the T11/T1 observable PRD release, and the T12/T1 observable Story Breakdown release**. Realistic extraction execution `9661` has 70/70 coverage and accepted trace `4adf60a1f5f83849170303de20471d81`; realistic Gap Analysis execution `9667` has 12/12 missing-information, 4/4 contradiction and 2/2 source-risk coverage with accepted trace `a727f4397ede1de96d15e18a78d6bdd0`. Both record zero unsupported claims and 100% groundedness. PRD generation for T7, T8 and T10 remains explicitly unexecuted rather than projected as completed.

## Realistic Story Breakdown v0.2 — accepted runtime evidence

| Stage | Workflow / execution | Assertions | Result |
|---|---|---|---|
| Story Breakdown | `MEm1VyILsMyn53HU` / `9727`; trace `f772ec699a437bc70de67ac124976161` | 3 epics; 4 features; 7 stories; 12 criteria; 19/19 scope; 6/6 sources; 0 orphans; no active deferred/superseded/controlled-TBD; JSON/Markdown equivalent; Langfuse accepted | Pass — groundedness 100%, unsupported claims 0 |
