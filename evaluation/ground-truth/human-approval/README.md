# Human Approval Ground Truth

This dataset validates deterministic Human Approval decisions and routes. Human Approval creates no product content and makes no model call. A case passes only when the decision is grounded in its aligned upstream package, conforms to `schemas/human-review.schema.json`, preserves `run_id`, references only valid upstream IDs, and selects the exact contract route.

| Route case | Source T-test | Human decision/path | Expected route | Groundedness target | Status |
|---|---|---|---|---:|---|
| `HA-R01` | T1 | `approved` | `prd_generation` | 100% | Passed — T1 canary |
| `HA-R02` | T4 | `changes_requested` | `correction` | 100% | Approved by Vipin — 2026-08-04 |
| `HA-R03` | To be selected | `clarification_required` | `clarification` | 100% | Pending |
| `HA-R04` | To be selected | `rejected` | `stopped` | 100% | Pending |
| `HA-R05` | T10 | `approved_with_conditions` | `prd_generation_with_conditions` | 100% | Pending |
| `HA-R06` | Controlled invalid variant | validation failure | No route | 100% | Pending |

T2, T3, T5, T6 and T9 are not Human Approval route cases because their approved Gap Analyzer results stop them before this checkpoint.
