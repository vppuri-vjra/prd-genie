---
title: PRD Genie End-to-End Test Traceability Matrix
version: 0.2
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
| Gap Analyzer ground truth | 6/10 | T1, T2, T3, T5, T9 and T10 approved |
| Gap Analyzer end-to-end execution | 3/10 | GA-T1, GA-T2 and GA-T3 passed at 100% |
| Deterministic generation-gate execution | 3/10 | Positive/human-review and two clarification conditions verified |
| Human approval for PRD generation | 0/10 | Not yet executed as a workflow stage |
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
| T1 | 🟢 `complete` | Actual pass, 100% | Actual GA execution | 🟢 `sufficient / proceed`, 100% | `eligible_for_human_approval`; `human_review` | Pending | Not executed; eligible only after approval |
| T2 | 🟡 `partial` | Actual pass, 100% | Actual GA execution | 🔴 `insufficient / request_clarification`, 100% | `clarification_required`; `clarification` | Not applicable until clarified | Blocked pending clarification |
| T3 | 🟡 `partial` | Actual pass, 100% | Actual GA execution | 🔴 `insufficient / request_clarification`, 100% | `clarification_required`; `clarification` | Not applicable until clarified | Blocked pending contradiction resolution |
| T4 | 🟢 `complete` | Actual pass, 100% | Deferred GA candidate | ⚪ No approved GA decision | Pending GA ground truth | Pending | Pending GA decision |
| T5 | 🟡 `partial` | Actual pass, 100% | Approved GA ground truth | 🔴 Expected `insufficient / request_clarification` | Expected clarification route | Not applicable until clarified | Blocked pending GA execution and clarification |
| T6 | 🟡 `partial` | Actual pass, 100% | Deferred GA candidate | ⚪ No approved GA decision | Pending GA ground truth | Pending | Pending GA decision |
| T7 | 🟢 `complete` | Actual pass, 100% | Deferred GA candidate | ⚪ No approved GA decision | Pending GA ground truth | Pending | Pending GA decision |
| T8 | 🟢 `complete` | Actual pass, 100% | Deferred GA candidate | ⚪ No approved GA decision | Pending GA ground truth | Pending | Pending GA decision |
| T9 | ⚫ `no_requirements` | Actual pass, 100% | Approved GA ground truth | ⛔ Expected `insufficient / block_generation` | Expected blocked route | Not applicable | Must not be invoked |
| T10 | 🟢 `complete` | Actual pass, 100% | Approved GA ground truth | 🟡 Expected `partially_sufficient / proceed_with_tbd` | Expected human review with TBD | Pending GA execution | Candidate only after GA execution and approval |

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

Matrix groundedness: **100% for the recorded Requirement Extractor results, approved GA ground truth, and actual GA-T1/GA-T2/GA-T3 executions**. T4, T6, T7, and T8 are intentionally marked pending rather than assigned inferred GA decisions. PRD and Story stages are marked unexecuted rather than projected as completed.
