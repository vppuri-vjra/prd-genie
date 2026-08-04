# Human Approval Checkpoint — n8n Design

## Scope

Implement the mandatory human-in-the-loop boundary between the Gap Analyzer and PRD Generator. This workflow performs no model call.

## Proposed node sequence

| Order | Node | Responsibility |
|---:|---|---|
| 1 | `Receive Eligible Generation Package` | Receive extraction, gap analysis and deterministic gate output |
| 2 | `Validate Review Eligibility` | Enforce matching `run_id` and allow only the two human-review gate routes |
| 3 | `Build Human Review Packet` | Present source evidence, items, gaps, risks, contradictions and TBDs |
| 4 | `Human Review Form` | Collect reviewer decision, item selections, checks, conditions and notes |
| 5 | `Parse and Validate Human Approval` | Validate against `human-review.schema.json` and verify every referenced ID |
| 6 | `Deterministic Approval Router` | Route strictly from validated `review_status` and `next_route` |
| 7 | `Build Approval Trace Payload` | Create non-LLM approval audit event for Langfuse |
| 8 | `Record Approval Result` | Persist the review record and downstream eligibility |

## Human-facing review packet

The form should show, without asking the reviewer to inspect raw workflow internals:

- authoritative source and exact evidence quotes;
- extracted items with IDs, type, status and relationships;
- Gap Analyzer decision and reason;
- gaps, contradictions and risks with trace links;
- generation-gate status;
- proposed approved-item list;
- any controlled TBDs and conditions; and
- five required verification checkboxes.

## Routing

| Validated decision | Route |
|---|---|
| `approved / prd_generation` | Build approved PRD Generator input |
| `approved_with_conditions / prd_generation_with_conditions` | Build PRD input containing only approved conditions/TBDs |
| `changes_requested / correction` | Return to controlled correction path |
| `clarification_required / clarification` | Stop and request stakeholder clarification |
| `rejected / stopped` | Stop the run |

Any inconsistent combination fails validation rather than being guessed.

## Initial evaluation scope

| Case | Expected checkpoint behavior |
|---|---|
| T1 | Standard approval candidate |
| T4 | Standard approval candidate |
| T7 | Standard approval candidate |
| T8 | Standard approval candidate |
| T10 | Approval-with-conditions candidate; dependency ETA remains TBD |
| T2, T3, T5, T6 | Must not enter; upstream route is clarification |
| T9 | Must not enter; upstream route is blocked |

## Observability

Record `run_id`, reviewer, review status, approved/rejected IDs, condition IDs, next route, workflow/execution IDs, start/end timestamps and validation outcome. Do not record secrets. Human approval has no model token usage and must be distinguishable from LLM observations in Langfuse.
