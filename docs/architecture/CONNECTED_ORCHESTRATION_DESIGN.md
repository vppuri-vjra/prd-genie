---
title: PRD Genie Connected Orchestration Design
version: 0.1
status: Approved-stage integration design
last_updated: 2026-08-05
owner: Vipin Puri
---

# Connected Orchestration Design

## Objective

Connect the separately validated PRD Genie workflows into one sequential, route-aware parent workflow while preserving each stage as an independently testable subworkflow.

## Target sequence

```text
Source Ingestion
→ Requirement Extractor
→ Gap Analyzer + Generation Gate
→ route decision
   ├─ clarification → stop and return questions
   ├─ blocked → stop
   ├─ correction → return to correction
   └─ human review / human review with TBD
      → Human Approval
         ├─ changes requested → correction
         ├─ rejected → stop
         ├─ clarification required → clarification
         └─ approved / approved with conditions
            → PRD Generator
            → Story Breakdown
            → Final Validator and Export
```

The Failure Observer and Langfuse span the entire run.

## Parent-child architecture

The connected solution uses an n8n parent workflow with Execute Sub-workflow nodes. It does not copy all agent logic into one canvas.

| Workflow | Parent responsibility | Child responsibility |
|---|---|---|
| Connected Orchestrator | Own run ID, source reference, route state, parent trace, and final status | None |
| Requirement Extractor | Pass validated source input | Extract and validate requirements |
| Gap Analyzer + Gate | Pass approved extraction | Analyze readiness and emit deterministic route |
| Human Approval | Persist the eligible package and wait for a human decision | Validate and record the decision |
| PRD Generator | Pass only the approved package | Generate, validate, render and trace PRD |
| Story Breakdown | Pass only the passed PRD release | Generate, validate, render and trace stories |
| Final Validator | Supply all stage results | Verify cross-stage IDs, route compliance and artifacts |

## Standard stage envelope

Every child returns `schemas/orchestration-stage-result.schema.json` with:

- the unchanged `run_id`;
- stage name and execution status;
- deterministic decision and next route;
- groundedness percentage;
- the validated stage output; and
- parent/stage trace identifiers and prompt metadata.

The parent must reject a result whose `run_id` differs from the active run.

## Human checkpoint

Human Approval cannot be treated as an ordinary synchronous model call. The parent stores the eligible run state and pauses. A reviewer receives a form containing the grounded extraction, Gap Analysis, route basis, approved IDs, controlled TBDs, and conditions. Form submission resumes the same `run_id`; the validated decision then selects correction, clarification, stop, PRD generation, or conditional PRD generation.

No timeout or missing response may silently become approval.

## Integration impact on current workflows

The current canvases are standalone evaluation harnesses. They use Manual Trigger or Form Trigger and load fixed test packages. Preserve them as release evidence. Create integration-ready child exports that:

1. add an Execute Sub-workflow Trigger;
2. accept the parent payload instead of loading embedded test data;
3. retain the already validated prompt and deterministic validator;
4. return the standard stage envelope; and
5. carry the parent trace ID into stage observability.

The validated agent logic and approved ground truth do not change.

## T1 connected canary

The first connected canary uses the existing approved T1 evidence and must reproduce:

| Stage | Expected result |
|---|---|
| Requirement Extraction | Complete; 100% |
| Gap Analysis | Sufficient / proceed; 100% |
| Generation Gate | Human review |
| Human Approval | Approved |
| PRD Generator | T11 contract passed; 100% |
| Story Breakdown | T12 contract passed; 100% |
| Final status | Completed |

The canary passes only when all child `run_id` values match, all stage groundedness values are 100%, unauthorized branches are not invoked, and one parent trace links the stage traces.

## Implementation sequence

1. Build the standard stage-result schema and validator.
2. Create integration-ready Requirement Extractor and Gap Analyzer child wrappers.
3. Implement the parent through route selection and stop paths.
4. Add persistent Human Approval pause/resume behavior.
5. Create PRD and Story child wrappers.
6. Add Final Validator/export and the parent Langfuse trace.
7. Run the connected T1 canary.
8. Run clarification, correction, conditional and blocked route canaries.
9. Add shared-source ingestion and realistic multi-source regression.

Groundedness target for every generated artifact: **100%**.
