# Human Approval Contract

## Approval record

| Field | Value |
|---|---|
| Contract version | `1.0.0` |
| Status | **Approved** |
| Approved by | Vipin Puri, Project Owner / Human Reviewer |
| Approval date | 2026-08-04 |
| Approval statement | “Approve Human Approval contract” |
| Scope of approval | Contract semantics, decisions, validations, routing and grounding controls |
| Implementation status | n8n checkpoint implemented; HA-R01 through HA-R06 route suite executed at 100% groundedness |

This approved version is the implementation baseline. Any material change to its decision meanings, validation rules or downstream routes requires a new version and approval record.

## Purpose

Human Approval is a deterministic, auditable checkpoint between the Gap Analyzer generation gate and the PRD Generator. It is not an AI agent. A human reviewer decides which grounded upstream items may enter PRD generation and whether controlled TBD conditions must be preserved.

## Eligible inputs

The checkpoint receives one aligned bundle containing:

- the validated Requirement Extraction output;
- the validated Gap Analysis output;
- the deterministic generation-gate result;
- the same `run_id` across all three records; and
- source/evidence traceability for every proposed item.

Only these upstream gate results may enter review:

| Gate status | Review mode |
|---|---|
| `eligible_for_human_approval` | Standard approval |
| `eligible_with_tbd` | Approval with explicit conditions/TBDs |

Clarification and blocked routes do not enter this checkpoint.

## Human Approval entry criteria

A package reaches Human Approval only when every mandatory entry criterion passes. Reaching Human Approval means the package is eligible for human governance review; it does not mean the package is approved for PRD generation.

| Criterion | Required condition |
|---|---|
| Requirement Extraction | Execution completed and the output is contract-valid |
| Source grounding | Proposed factual items carry valid source/evidence traceability |
| Gap Analysis contract | Gap Analysis output is structurally valid |
| Gap Analysis sufficiency | `sufficient` or `partially_sufficient` |
| Gap Analysis action | `proceed` or `proceed_with_tbd` |
| Generation allowed | `true` |
| Generation gate | `eligible_for_human_approval` or `eligible_with_tbd` |
| Gate route | `human_review` or `human_review_with_tbd` |
| Material blockers | No unresolved material issue requiring the upstream `clarification` or `blocked` route |
| Run alignment | Outer package, extraction and Gap Analysis `run_id` values match |
| Reference integrity | Required schemas pass and all referenced IDs exist upstream |

The deterministic entry decision is:

| Approved Gap Analysis outcome | Gate result | Enters Human Approval? |
|---|---|---:|
| `sufficient / proceed` | `eligible_for_human_approval / human_review` | Yes |
| `partially_sufficient / proceed_with_tbd` | `eligible_with_tbd / human_review_with_tbd` | Yes, conditionally |
| `insufficient / request_clarification` | `clarification_required / clarification` | No |
| `insufficient / block_generation` | `generation_blocked / blocked` | No |

Under the approved T1–T10 baseline, T1, T4, T7, T8 and T10 reach Human Approval. T2, T3, T5 and T6 route to clarification before Human Approval; T9 is explicitly blocked before Human Approval.

## Human review responsibilities

The reviewer verifies:

1. Every approved item is grounded in supplied evidence.
2. Exact names, dates, values, thresholds, units and API versions are preserved.
3. Item relationships and Gap Analyzer findings are correct.
4. No unsupported claim, inferred answer or silent contradiction resolution exists.
5. Rejected items are excluded downstream.
6. Controlled TBDs and conditions are explicit and bounded.

## Output

The decision conforms to `schemas/human-review.schema.json` and records:

- reviewer identity and timestamp;
- upstream gate status reviewed;
- approved and rejected item IDs;
- reviewed gap IDs;
- controlled TBD IDs and conditions;
- five mandatory evidence checks;
- human notes; and
- the deterministic next route.

## Decision matrix

| Review status | Required outcome | Next route | PRD eligible |
|---|---|---|---:|
| `approved` | At least one approved item; all evidence checks pass; no condition or TBD | `prd_generation` | Yes |
| `approved_with_conditions` | At least one approved item, condition and controlled TBD; all checks pass | `prd_generation_with_conditions` | Yes |
| `changes_requested` | Reviewer identifies an upstream correction | `correction` | No |
| `clarification_required` | Reviewer cannot approve without stakeholder input | `clarification` | No |
| `rejected` | Reviewer rejects the package | `stopped` | No |

## Deterministic validations

- All upstream and review `run_id` values must match.
- Every approved/rejected ID must exist in the validated extraction.
- Approved and rejected ID sets must not overlap.
- Every reviewed gap and controlled TBD ID must exist upstream.
- `approved` requires all five evidence checks to be `true`.
- `approved_with_conditions` additionally requires at least one condition and controlled TBD.
- Only the two approval statuses may route to the PRD Generator.
- The PRD Generator receives only approved item IDs and approved controlled TBDs.
- Human revisions are not silently written into the approval record; material content changes return to correction and must be re-extracted/evaluated.

## Grounding rationale

The checkpoint does not create product content. It records human authority over already-grounded content, preventing an LLM from automatically promoting proposed, incomplete or contradictory material into a PRD.
