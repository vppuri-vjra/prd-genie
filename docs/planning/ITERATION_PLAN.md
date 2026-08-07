---
title: PRD Genie Iteration Plan
version: 0.2
status: Active
last_updated: 2026-08-05
owner: Vipin Puri
---

# PRD Genie Iteration Plan

The formal plan models four one-week iterations. Actual execution is intentionally compressed, with a target to complete all four iterations during the current week. Formal planned scope remains unchanged so planning discipline and actual delivery performance can be compared.

## Iteration plan

| Iteration | Formal week | Focus | Planned items | Exit criteria | Current status |
|---|---:|---|---|---|---|
| Iteration 1 | Week 1 | Foundation, planning, and Requirement Extraction | Review sources; create BRD, Product PRD, Architecture Design, diagram, and initial ADRs; select tools; define contracts; organize GitHub and Obsidian; build Requirement Extractor; connect Langfuse; run T1-T10 | Foundation documents exist; schemas validate; Requirement Extractor works; T1-T10 are documented; T10 correction passes | Complete |
| Iteration 2 | Week 2 | Ground truth and evaluation controls | Complete T10 before/after comparison; build and human-review the in-scope T1–T10 ground truth; reconcile prompt versions; strengthen deterministic evaluation and scorecards | Approved ground truth exists; automated evaluator runs against actual n8n outputs; v1.5 passes the unchanged T1–T10 release gate 10/10 with accepted Langfuse traces | Complete |
| Iteration 3 | Week 3 | Complete multi-agent pipeline | Build Gap Analyzer, Generation Gate, Human Approval, PRD Generator, Story Breakdown, final validation, Markdown export, and per-agent tracing; run T11-T12 | Core and extended capabilities work end-to-end; T11-T12 are documented; human approval is demonstrated | Complete: connected T1-to-Final execution `9578` passed at 100% groundedness |
| Iteration 4 | Week 4 | Final evaluation and submission | Ingest the supplied product brief, meeting transcript, and stakeholder notes; run multi-source and route regression; calculate metrics and cost per user; finish Q1-Q4, screenshots, architecture write-up, slides, demo, links, exports, and security audit | Three realistic source types pass through controlled extraction and routing; submission is complete, reproducible, public, and ready for grading | In progress: controlled T1 PB+MT+SN n8n parity execution `9638` passed at 100%; broader regression and submission work remain |

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
- Iterations 1 and 2 are complete.
- Gap Analyzer v1.0 passed its unchanged T1-T10 regression at 100% groundedness.
- All five eligible Human Approval routes are executed: T1/T7/T8 approved, T4 changes requested, and T10 approved with conditions; all passed at 100% groundedness.
- Realistic v4 Human Approval execution `9724` passed with Vipin's signed approval, 17/17 decision dispositions, 15/15 effective decisions, accepted Langfuse trace `f4e298e120d6503b5dfac4688adae1db`, and 100% groundedness. PRD Generation remains intentionally stopped.
- Realistic v4 PRD execution `9725` passed with synchronized JSON/Markdown, complete provenance coverage, accepted trace `f8879ebe22d888152a77f892230c62ba`, 100% groundedness, and zero unsupported claims. Story Breakdown remains stopped pending separate authorization.
- T11 generated and validated the actual ten-section T1 PRD at 100% groundedness. Langfuse US accepted trace `05e9aa534e4286e17ec65512a72e48ff`, and the actual JSON and Markdown are preserved.
- T12 Story Breakdown v0.2 passed at 100% groundedness with accepted Langfuse trace `8e2078937f42afa208b3b2dc8d0f159b`; actual JSON and Markdown are preserved.
- Connected Orchestrator v0.5 passed source-to-final Markdown export in execution `9578` at 100% groundedness with accepted Final Validation trace `a7722b22651568c775987fbb09e3be1c`.
- Controlled T1 Product Brief, Meeting Transcript and Stakeholder Notes fixtures, the canonical source-packet contract, and deterministic integrity/parity tests pass locally at 100% groundedness with zero unsupported claims.
- Controlled n8n multi-source ingestion passed execution `9638` at 100% groundedness with zero unsupported claims; broader full route regression, assignments, visuals, cost evidence, and the submission package remain open.
- The supplied realistic Product Brief, Meeting Transcripts and Stakeholder Notes are preserved in `realistic-v1` with verified hashes, route separation and 70 exact citations. Input grounding is 100%; expected extraction review remains open before n8n execution.
