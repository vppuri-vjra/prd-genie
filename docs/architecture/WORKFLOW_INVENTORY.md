---
title: PRD Genie Workflow Inventory
version: 1.0
status: Living Inventory
last_updated: 2026-08-05
owner: Vipin Puri
---

# PRD Genie Workflow Inventory

## Primary execution order

| Order | n8n workflow | Role | Current version/status | Groundedness evidence |
|---:|---|---|---|---:|
| 1 | `PRD Genie - Requirement Extractor + Langfuse v0.2` | Convert source text into structured, evidence-linked requirements | Active; Requirement Extractor prompt v1.5 passed T1-T10 regression | 100% |
| 2 | `PRD Genie - Gap Analyzer + Generation Gate v1.0` | Identify gaps/contradictions and deterministically decide the next route | Active; GA v1.0 passed GA-T1-T10 regression | 100% |
| 3 | `PRD Genie - Human Approval v0.1` | Record approve, approve-with-conditions, changes-requested, clarification, or rejection decisions | Active; all five eligible T-test routes passed | 100% |
| 4 | `PRD Genie - PRD Generator + Langfuse v0.1` | Generate and validate the ten-section PRD | Active; T11/T1 observable release passed | 100% |
| 5 | `PRD Genie - Story Breakdown + Langfuse v0.2` | Generate and validate epics, features, user stories, criteria, and unresolved questions | Active; T12/T1 observable release passed | 100% |
| 6 | `PRD Genie - Connected Orchestrator` | Pass one run envelope through the separate workflows and enforce route stops | Design v0.1 complete; integration-ready child wrappers and parent canvas pending | — |

## Integration-ready child exports

| Sequence | Child workflow | Parent supplies | Child returns | Status |
|---:|---|---|---|---|
| 1 | `PRD Genie - Requirement Extractor Child v1.0` | Workflow input plus orchestration context | Requirement Extraction stage envelope; next route `gap_analysis` | Built; import test pending |
| 2 | `PRD Genie - Gap Analyzer Child v1.0` | Requirement Extraction plus orchestration context | Gap Analysis and Generation Gate stage envelope | Built; import test pending |

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

## Connected target

`Source ingestion → Requirement Extractor → Gap Analyzer → Generation Gate → Human Approval → PRD Generator → Story Breakdown → Final validation/export`

The Failure Observer and Langfuse operate across this sequence. Clarification, correction, rejection, and blocked routes must stop before unauthorized downstream generation.
