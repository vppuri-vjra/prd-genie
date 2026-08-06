# Connected Orchestrator T1 Human Approval Canary — 2026-08-05

## Outcome

The connected T1 run passed Requirement Extraction, Gap Analysis, the deterministic generation gate, persistent Human Approval, Langfuse ingestion and final PRD-route validation at **100% groundedness**.

| Evidence | Value |
|---|---|
| Parent workflow | `PRD Genie - Connected Orchestrator v0.2` |
| Human Approval child | `PRD Genie - Human Approval Checkpoint Child v1.0.1` |
| Human Approval child execution | `9170` |
| Run ID | `RUN-T1-CONNECTED-1785976225480` |
| Parent trace ID | `bf7baca7f89710c926bbb053a1b3b904` |
| Human Approval stage trace ID | `810191523bb85a5d806cc0f19b267a55` |
| Gate | `eligible_for_human_approval / human_review` |
| Human decision | `approved` |
| Final route | `prd_generation` |
| Groundedness | `100%` |
| Langfuse ingestion | Accepted |
| Recorded at | `2026-08-06T00:35:20.329Z` |

## Approved evidence IDs

- `FR-001`
- `NFR-001`
- `STK-001`
- `DDL-001`

## Final deterministic checks

| Check | Result |
|---|---|
| `run_id_preserved` | Pass |
| `parent_trace_id_preserved` | Pass |
| `human_approval_passed` | Pass |
| `expected_route_reached` | Pass |
| `langfuse_ingestion_accepted` | Pass |

## Runtime form-link correction

The initial checkpoint export paused correctly but did not expose n8n's signed runtime form URL. Manually constructed `/form-waiting/{execution_id}` links were invalid because the required signature was absent. The child export was corrected by inserting `Expose Human Approval Form URL` immediately before the Wait node and recording `{{ $execution.resumeFormUrl }}` as `approval_form_url`. The reviewer used that exact signed URL; form submission resumed the same child and parent executions.

The signed URL itself is intentionally not retained because it is transient authorization data. No timeout or missing response can create approval.

## Release decision

Connected Orchestrator v0.2 with Human Approval Checkpoint Child v1.0.1 is accepted for the T1 connected canary. The next integration increment is the PRD Generator child wrapper.
