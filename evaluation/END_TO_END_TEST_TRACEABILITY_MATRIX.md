---
title: PRD Genie End-to-End Test Traceability Matrix
version: 0.7
status: Living Evidence Dashboard
last_updated: 2026-08-04
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
| Human Approval route execution | 2/5 eligible tests | T1 approved; T4 changes requested; both passed at 100% groundedness |
| Eligible for PRD after Human Approval | 1/5 eligible tests | T1 approved; T4 returned to correction; T7, T8 and T10 pending |
| PRD Generator evaluation | 0/10 | Not yet implemented or executed |
| Story Generator evaluation | 0/10 | Not yet implemented or executed |

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
| T1 | 🟢 `complete` | Actual pass, 100% | Actual GA execution | 🟢 `sufficient / proceed`, 100% | `eligible_for_human_approval`; `human_review` | 🟢 Actual `HA-R01 / approved`, 100% | Eligible; PRD Generator not yet executed |
| T2 | 🟡 `partial` | Actual pass, 100% | Actual GA execution | 🔴 `insufficient / request_clarification`, 100% | `clarification_required`; `clarification` | Not applicable until clarified | Blocked pending clarification |
| T3 | 🟡 `partial` | Actual pass, 100% | Actual GA execution | 🔴 `insufficient / request_clarification`, 100% | `clarification_required`; `clarification` | Not applicable until clarified | Blocked pending contradiction resolution |
| T4 | 🟢 `complete` | Actual pass, 100% | Actual GA execution | 🟢 `sufficient / proceed`, 100% | `eligible_for_human_approval`; `human_review` | 🔴 Actual `HA-R02 / changes_requested`, 100% | Not eligible; routed to correction |
| T5 | 🟡 `partial` | Actual pass, 100% | Actual GA execution | 🔴 `insufficient / request_clarification`, 100% | `clarification_required`; `clarification` | Not applicable until clarified | Blocked pending substantive source clarification |
| T6 | 🟡 `partial` | Actual pass, 100% | Actual GA execution | 🔴 `insufficient / request_clarification`, 100% | `clarification_required`; `clarification` | Not applicable until clarified | Blocked pending scope, decision, and deadline clarification |
| T7 | 🟢 `complete` | Actual pass, 100% | Actual GA execution | 🟢 `sufficient / proceed`, 100% | `eligible_for_human_approval`; `human_review` | Pending | Eligible only after human approval |
| T8 | 🟢 `complete` | Actual pass, 100% | Actual GA execution | 🟢 `sufficient / proceed`, 100% | `eligible_for_human_approval`; `human_review` | Pending | Eligible only after human approval |
| T9 | ⚫ `no_requirements` | Actual pass, 100% | Actual GA execution | ⛔ `insufficient / block_generation`, 100% | `generation_blocked`; `blocked` | Not applicable | Must not be invoked |
| T10 | 🟢 `complete` | Actual pass, 100% | Actual GA execution | 🟡 `partially_sufficient / proceed_with_tbd`, 100% | `eligible_with_tbd`; `human_review_with_tbd` | Pending required human approval | Eligible only after human approval; ETA remains TBD |

## Human Approval to PRD progression view

This view makes the stage boundary explicit. A Human Approval route test must be based on a T-test that actually reaches the Human Approval checkpoint under its approved Gap Analysis and deterministic gate. Tests stopped by clarification or blocking remain valuable end-to-end tests, but they are not Human Approval inputs.

| Test | Reaches Human Approval? | Gate basis | Human Approval case/status | Reaches PRD Generator? | Reason/current action | Groundedness |
|---|---|---|---|---|---|---:|
| T1 | Yes | `eligible_for_human_approval / human_review` | `HA-R01 / approved` — passed | Yes, eligible | Approved package is ready; PRD Generator not yet implemented | 100% |
| T2 | No | `clarification_required / clarification` | Not applicable | No | Clarify metrics, format, target users and intended reporting capability | 100% |
| T3 | No | `clarification_required / clarification` | Not applicable | No | Resolve the explicit refresh contradiction | 100% |
| T4 | Yes | `eligible_for_human_approval / human_review` | `HA-R02 / changes_requested` — passed | No | Correct classification and relationships for `FR-002` and `FR-003`, then re-review | 100% |
| T5 | No | `clarification_required / clarification` | Not applicable | No | Source contains fragments but lacks a reliable requirement | 100% |
| T6 | No | `clarification_required / clarification` | Not applicable | No | Clarify scope, architecture decision and deadline | 100% |
| T7 | Yes | `eligible_for_human_approval / human_review` | Pending | No, pending approval | Candidate for an untested Human Approval route | 100% |
| T8 | Yes | `eligible_for_human_approval / human_review` | Pending | No, pending approval | Candidate for an untested Human Approval route | 100% |
| T9 | No | `generation_blocked / blocked` | Not applicable | No | No meaningful requirements; generation must remain blocked | 100% |
| T10 | Yes, with TBD | `eligible_with_tbd / human_review_with_tbd` | `HA-R05 / approved_with_conditions` — planned | No, pending approval | Human must approve the controlled dependency TBD and conditions | 100% |

### Human Approval route-test allocation rule

- `HA-R01`, `HA-R02` and future positive/conditional Human Approval cases must use only T1, T4, T7, T8 or T10 because these are the five tests that reach Human Approval.
- T2, T3, T5 and T6 test the earlier clarification route and must not be shown as reaching Human Approval.
- T9 tests the explicit generation-blocked route and must not be shown as reaching Human Approval.
- A controlled validation-failure case may corrupt a package derived from an eligible test, but its source T-test and the deliberate mutation must both be recorded.

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

Matrix groundedness: **100% for the recorded Requirement Extractor results, all ten human-approved GA ground-truth decisions, the unchanged GA-T1-T10 v1.0 release regression, and the executed HA-R01 and HA-R02 decisions**. PRD and Story stages are marked unexecuted rather than projected as completed.
