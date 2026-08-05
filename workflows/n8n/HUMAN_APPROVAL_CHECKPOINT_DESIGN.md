# Human Approval Checkpoint — n8n Design

## Design status

The Human Approval contract version `1.0.0` was approved by Vipin Puri on 2026-08-04. The T1 standard-approval path (`HA-R01`) and T4 changes-requested path (`HA-R02`) are implemented in n8n workflow `L3J0nRWdKhs46wxF`; both passed at 100% groundedness with accepted Langfuse traces. The T10 conditional path, remaining negative-route tests, and upstream/downstream integration remain pending.

## Scope

Implement the mandatory human-in-the-loop boundary between the Gap Analyzer and PRD Generator. This workflow performs no model call.

## Entry-rule implementation

The canonical entry criteria are defined in `docs/architecture/HUMAN_APPROVAL_CONTRACT.md`. This workflow must enforce them deterministically before presenting a review form.

The `Validate Review Eligibility` step must:

1. validate the Requirement Extraction, Gap Analysis and gate structures;
2. verify aligned `run_id` values and valid upstream references;
3. accept only `eligible_for_human_approval / human_review` or `eligible_with_tbd / human_review_with_tbd`;
4. reject clarification and blocked routes without invoking Human Approval; and
5. distinguish checkpoint eligibility from downstream PRD eligibility.

PRD eligibility is set only after a valid Human Approval decision: `approved` or `approved_with_conditions`. All other review decisions remain ineligible for PRD generation.

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

## T1 canary evidence

On 2026-08-04, Vipin submitted the T1 human decision through the n8n form. The complete workflow passed: contract status `passed`, groundedness `100`, approved IDs `FR-001`, `NFR-001`, `STK-001`, and `DDL-001`, all five evidence checks `true`, and deterministic route `prd_generation`. The audit payload recorded `model_call: false` and zero token usage. See `evaluation/results/human-approval-t1-canary-2026-08-04.md`.

## HA-R02 correction-route evidence

On 2026-08-04, Vipin submitted the T4-derived `HA-R02` decision. The workflow passed at 100% groundedness, approved `FR-001`, rejected `FR-002` and `FR-003` for relationship/classification correction, set `relationships_verified: false`, routed to `correction`, and kept PRD generation ineligible. Langfuse US accepted the non-LLM trace with HTTP 200 and zero token usage. See `evaluation/results/human-approval-ha-r02-changes-requested-2026-08-04.md`.
