---
title: PRD Genie Connected Orchestration Design
version: 0.5
status: Human Approval pause/resume increment built; n8n canary pending
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

## Implementation status

| Component | Export | Status | Groundedness target |
|---|---|---|---:|
| Requirement Extractor child | `workflows/n8n/prd-genie-requirement-extractor-child-v1.0.json` | Imported and passed connected T1 canary | 100% |
| Gap Analyzer child | `workflows/n8n/prd-genie-gap-analyzer-child-v1.0.json` | Imported and passed connected T1 canary | 100% |
| Connected parent | `workflows/n8n/prd-genie-connected-orchestrator-v0.1.json` | Passed through Gap Analyzer and Human Approval route validation | 100% |
| Human Approval checkpoint child | `workflows/n8n/prd-genie-human-approval-checkpoint-child-v1.0.json` | Built with persistent Wait-form resume; n8n canary pending | 100% |
| Connected parent with approval | `workflows/n8n/prd-genie-connected-orchestrator-v0.2.json` | Built through validated Human Approval and PRD route validation; n8n canary pending | 100% |

The child exports do not contain fixed T-test loaders. They start with an Execute Sub-workflow Trigger, validate the parent payload, preserve `run_id` and `parent_trace_id`, execute the validated agent and deterministic controls, send the stage trace to Langfuse, and return the standard orchestration stage envelope.

The Requirement Extractor child identifies the promoted prompt as `extractor-v1.5-product-fragment-status-boundary` and contains the inherited v1.3 prompt plus the documented v1.4 relationship audit and v1.5 product-fragment boundary. The standalone release-evidence workflow remains unchanged.

The v0.1 parent canary loads approved T1 source evidence, creates one `run_id` and parent trace ID, invokes both child workflows, validates both stage envelopes, rejects ID or trace mismatches, requires 100% groundedness and accepted Langfuse ingestion, and passes only when the deterministic Gap Analyzer route is `human_review` / `human_approval`. Human Approval is intentionally the next integration increment rather than being bypassed.

Actual connected-canary evidence is recorded in `evaluation/results/connected-orchestrator-t1-two-child-canary-2026-08-05.md`.

The v0.2 parent invokes a dedicated Human Approval checkpoint child. Its Wait node keeps both child and parent executions waiting until an actual form submission arrives. The submitted decision is validated against upstream item and gap IDs, the five evidence checks and the approved decision matrix. No response, timeout or malformed decision can produce an approval route.
