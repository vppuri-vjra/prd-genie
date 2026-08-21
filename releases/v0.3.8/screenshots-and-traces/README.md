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
| 1 | [`01-n8n-parent-workflow-canvas.jpg`](./01-n8n-parent-workflow-canvas.jpg) | The complete v0.3.8 parent workflow canvas, including governed stage calls, validation, score polling, Agreement Gate branching, Drive delivery, and non-blocking sizing. | Workflow canvas; architecture and implementation evidence. |
| 2 | [`02-n8n-accepted-parent-execution-11901.jpg`](./02-n8n-accepted-parent-execution-11901.jpg) | Accepted execution `11901` succeeded end to end and produced the current-run output identified as `RUN-S2-11902-16e7090e`. | PRD Genie in action; successful execution evidence. |
| 3 | [`03-n8n-stage-execution-details-11907.jpg`](./03-n8n-stage-execution-details-11907.jpg) | Accepted Stage 6 child execution `11907` succeeded, shows every Story Breakdown node passing, and returns the parent run identity `RUN-S2-11902-16e7090e`. | Stage execution detail; input/output, grounding, trace-ingestion, and delivery evidence. |
| 7 | [`07-langfuse-trace-overview.jpg`](./07-langfuse-trace-overview.jpg) | Langfuse trace tree and semantic-evaluation observation for the governed Story Breakdown evaluation path, with environment, version, evaluator scores, and grounded input visible. | Observability trace; code/LLM evaluation evidence. |
| 10 | This `README.md` | Maps each screenshot to the run identity and the applicable submission requirement. | Reproducibility and rubric-to-evidence navigation. |

## Requirement mapping

| Source | Requirement | Evidence in this package |
|---|---|---|
| Capstone Project Playbook, Step 7 / submission package | Provide screenshots of the workflow canvas, system in action, and observability traces. | Items 1, 2–3, and 7 respectively. |
| PRD Genie Problem Statement, Submission Guidelines | Provide screenshots of the canvas, PRD Genie in action, and traces. | Items 1, 2–3, and 7 respectively. |
| Q3 — Build PRD Genie / PRD Orchestrator | Demonstrate architecture, implementation, observability, evaluation, and reproducible evidence. | Items 1–3, 7, and the accepted-run metadata above. |

## Interpretation notes

- Item 1 is the saved candidate workflow and does not execute or modify the system.
- Item 2 is the accepted parent execution `11901`; item 3 is its accepted Story Breakdown child execution `11907` carrying the same run identity.
- Item 7 is a read-only Langfuse trace view; the screenshot does not alter evaluator configuration.
- Credentials, secret values, and authentication material are intentionally excluded.
