# PRD Genie v0.3.8 — Screenshots and Trace Evidence

This package documents the accepted v0.3.8 candidate in the visual-evidence format required by the Capstone Project Playbook and the PRD Genie Problem Statement submission guidelines.

## Accepted run identity

| Field | Value |
|---|---|
| Candidate | v0.3.8 |
| n8n parent workflow | `PRD Genie — Main Orchestrator — v0.3.8 Candidate` |
| n8n workflow ID | `YCgHHBa8xUvSOYGI` |
| Accepted n8n execution | `11901` |
| Run ID | `RUN-S2-11902-16e7090e` |
| Execution outcome | Succeeded |
| Release control | Agreement Gate authorized |

## Evidence register

| Item | File | What it proves | Rubric / submission use |
|---:|---|---|---|
| 1A | [`high-resolution/01a-n8n-parent-workflow-full.jpg`](./high-resolution/01a-n8n-parent-workflow-full.jpg) | Complete v0.3.8 parent-workflow overview, including governed stage calls, validation, score polling, Agreement Gate branching, Drive delivery, and non-blocking sizing. | Workflow canvas; architecture and implementation evidence. |
| 1B | [`high-resolution/01b-n8n-parent-workflow-left.jpg`](./high-resolution/01b-n8n-parent-workflow-left.jpg) | Readable left-side detail showing the manual trigger, parent context, Drive gate, approval, PRD generation, and Story Breakdown handoffs. | Detailed workflow implementation evidence. |
| 1C | [`high-resolution/01c-n8n-parent-workflow-right.jpg`](./high-resolution/01c-n8n-parent-workflow-right.jpg) | Readable right-side detail showing score polling, current-run Langfuse queries, Agreement Gate branching, validation, delivery, and downstream control flow. | Detailed validation, observability, and release-control evidence. |
| 1D | [`high-resolution/01d-n8n-parent-workflow-far-right.jpg`](./high-resolution/01d-n8n-parent-workflow-far-right.jpg) | Dedicated far-right workflow detail showing the authorized path, Final Validator, non-blocking sizing result handling, Google Drive upload, and delivery confirmation nodes. | Final validation, export, and delivery-control evidence. |
| 2A | [`high-resolution/02a-n8n-accepted-parent-execution-full.jpg`](./high-resolution/02a-n8n-accepted-parent-execution-full.jpg) | Complete accepted parent-execution overview for execution `11901`, which succeeded end to end in 2m 31.626s. | Successful execution overview. |
| 2B | [`high-resolution/02b-n8n-accepted-parent-execution-left.jpg`](./high-resolution/02b-n8n-accepted-parent-execution-left.jpg) | Readable left-side execution detail showing the trigger and upstream governed stages completing successfully. | Upstream execution evidence. |
| 2C | [`high-resolution/02c-n8n-accepted-parent-execution-right.jpg`](./high-resolution/02c-n8n-accepted-parent-execution-right.jpg) | Readable right-side execution detail showing score polling, Langfuse checks, Agreement Gate authorization, validation, export, and sizing. | Downstream evaluation and release evidence. |
| 2D | [`high-resolution/02d-n8n-accepted-parent-execution-output.jpg`](./high-resolution/02d-n8n-accepted-parent-execution-output.jpg) | Focused output-panel view for execution `11901`, including successful timing, final-validation output, run ID `RUN-S2-11902-16e7090e`, and delivery evidence. | Execution output and authorization evidence. |
| 2E | [`high-resolution/02e-n8n-accepted-parent-execution-far-right.jpg`](./high-resolution/02e-n8n-accepted-parent-execution-far-right.jpg) | Dedicated far-right execution view showing the final output-preparation, Google Drive upload, and delivery-confirmation nodes completing successfully. | Executed export and final-delivery evidence. |
| 3 | [`03-n8n-stage-execution-details-11907.jpg`](./03-n8n-stage-execution-details-11907.jpg) | Accepted Stage 6 child execution `11907` succeeded, shows every Story Breakdown node passing, and returns the parent run identity `RUN-S2-11902-16e7090e`. | Stage execution detail; input/output, grounding, trace-ingestion, and delivery evidence. |
| 7 | [`07-langfuse-trace-overview.jpg`](./07-langfuse-trace-overview.jpg) | Langfuse trace tree and semantic-evaluation observation for the governed Story Breakdown evaluation path, with environment, version, evaluator scores, and grounded input visible. | Observability trace; code/LLM evaluation evidence. |
| 10 | This `README.md` | Maps each screenshot to the run identity and the applicable submission requirement. | Reproducibility and rubric-to-evidence navigation. |

## Requirement mapping

| Source | Requirement | Evidence in this package |
|---|---|---|
| Capstone Project Playbook, Step 7 / submission package | Provide screenshots of the workflow canvas, system in action, and observability traces. | Items 1A–1D, 2A–2E, 3, and 7 respectively. |
| PRD Genie Problem Statement, Submission Guidelines | Provide screenshots of the canvas, PRD Genie in action, and traces. | Items 1A–1D, 2A–2E, 3, and 7 respectively. |
| Q3 — Build PRD Genie / PRD Orchestrator | Demonstrate architecture, implementation, observability, evaluation, and reproducible evidence. | Items 1A–1D, 2A–2E, 3, 7, and the accepted-run metadata above. |

## Interpretation notes

- Items 1A–1D are read-only views of the saved candidate workflow and do not execute or modify the system.
- Items 2A–2E document accepted parent execution `11901`; item 3 is its accepted Story Breakdown child execution `11907` carrying the same run identity.
- Item 7 is a read-only Langfuse trace view; the screenshot does not alter evaluator configuration.
- Credentials, secret values, and authentication material are intentionally excluded.

## Supplementary execution 11958

Execution `11958` / run `RUN-S2-11959-16e7090e` is a successful post-tidy-up verification run. Its evidence is supplementary: execution `11901` remains the formal v0.3.8 submission baseline.

- [Complete supplementary screenshot and trace package](supplementary-11958/README.md)
- [Complete Langfuse Trace Evidence — execution 11958](../evidence/langfuse/Langfuse-Complete-Trace-Evidence-11958.html)
- 15 n8n, Google Drive, artifact, and traceability screenshots
- 6 detailed Langfuse trace and evaluator screenshots
- Fully loaded usage: 541,720 tokens / `$1.460813`
- Modeled usage at one fully evaluated run per user per week: approximately `$0.21` per user per day / `$6.33` per user per month
- Agreement Gate: release authorized
- Delivery: seven validated artifacts; 145/145 citations dispositioned; zero orphans; sizing 11/11
