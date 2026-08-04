---
title: PRD Genie Iteration Plan
version: 0.1
status: Active
last_updated: 2026-08-02
owner: Vipin Puri
---

# PRD Genie Iteration Plan

The formal plan models four one-week iterations. Actual execution is intentionally compressed, with a target to complete all four iterations during the current week. Formal planned scope remains unchanged so planning discipline and actual delivery performance can be compared.

## Iteration plan

| Iteration | Formal week | Focus | Planned items | Exit criteria | Current status |
|---|---:|---|---|---|---|
| Iteration 1 | Week 1 | Foundation, planning, and Requirement Extraction | Review sources; create BRD, Product PRD, Architecture Design, diagram, and initial ADRs; select tools; define contracts; organize GitHub and Obsidian; build Requirement Extractor; connect Langfuse; run T1-T10 | Foundation documents exist; schemas validate; Requirement Extractor works; T1-T10 are documented; T10 correction passes | Complete |
| Iteration 2 | Week 2 | Ground truth and evaluation controls | Complete T10 before/after comparison; build and human-review the in-scope T1–T10 ground truth; reconcile prompt versions; strengthen deterministic evaluation and scorecards | Approved ground truth exists; automated evaluator runs against actual n8n outputs; v1.5 passes the unchanged T1–T10 release gate 10/10 with accepted Langfuse traces | Complete for current T1–T10 scope; T11–T12 remain deferred |
| Iteration 3 | Week 3 | Complete multi-agent pipeline | Build Gap Analyzer, Generation Gate, Human Approval, PRD Generator, Story Breakdown, final validation, Markdown export, and per-agent tracing; run T11-T12 | Core and extended capabilities work end-to-end; T11-T12 are documented; human approval is demonstrated | In progress: Gap Analyzer and gate complete; Human Approval contract/design complete |
| Iteration 4 | Week 4 | Final evaluation and submission | Run regression and three full-pipeline input types; calculate metrics and cost per user; finish Q1-Q4, screenshots, architecture write-up, slides, demo, links, exports, and security audit | Submission is complete, reproducible, public, and ready for grading | Not started |

## Compressed execution target

| Actual day | Target |
|---|---|
| Day 1 | Close Iteration 1, including T10 correction and documentation baseline |
| Day 2 | Complete ground truth and evaluation controls |
| Day 3 | Build Gap Analyzer, gate, Human Approval, and PRD Generator; execute T11 |
| Day 4 | Build Story Breakdown, execute T12, and test the connected pipeline |
| Day 5 | Final regression, cost, metrics, assignments, screenshots, slides, demo, and submission audit |

## Tracking rules

- Allowed status values: `Not started`, `In progress`, `At risk`, and `Complete`.
- An iteration is complete only when its exit criteria and evidence are complete.
- Planned scope changes must include a reason and impact.
- Actual completion date is recorded separately from the formal week.
- Documentation, GitHub, and Obsidian must remain synchronized at each meaningful checkpoint.

## Current checkpoint

- T1-T10 initial Requirement Extractor runs are documented.
- T10 passed its v0.8 corrected rerun with before-and-after Langfuse evidence.
- Langfuse traces Requirement Extractor success and failure paths.
- BRD, Product PRD, Architecture Design, diagram, and iteration plan are drafted as version 0.1.
- Iteration 1 is complete. Ground truth, later agents, assignments, visuals, and final submission package remain open.
