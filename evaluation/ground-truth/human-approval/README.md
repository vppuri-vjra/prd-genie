# Human Approval Ground Truth

This dataset validates deterministic Human Approval decisions and routes. Human Approval creates no product content and makes no model call. A case passes only when the decision is grounded in its aligned upstream package, conforms to `schemas/human-review.schema.json`, preserves `run_id`, references only valid upstream IDs, and selects the exact contract route.

| Route case | Source T-test | Human decision/path | Expected route | Groundedness target | Status |
|---|---|---|---|---:|---|
| `HA-R01` | T1, T7, T8 | `approved` | `prd_generation` | 100% | T1 and T7 passed; T8 planned |
| `HA-R02` | T4 | `changes_requested` | `correction` | 100% | **Passed — 2026-08-04** |
| `HA-R03` | T7 or T8 — selection pending | `clarification_required` | `clarification` | 100% | Pending |
| `HA-R04` | T7 or T8 — selection pending | `rejected` | `stopped` | 100% | Pending |
| `HA-R05` | T10 | `approved_with_conditions` | `prd_generation_with_conditions` | 100% | Pending |
| `HA-R06` | Controlled invalid variant of T1, T4, T7, T8 or T10 | validation failure | No route | 100% | Pending |

T2, T3, T5, T6 and T9 are not Human Approval route cases because their approved Gap Analyzer results stop them before this checkpoint.

Route-test allocation must follow the end-to-end progression matrix: only T1, T4, T7, T8 and T10 reach Human Approval. A validation-failure case may use a deliberately corrupted variant of one of those eligible tests, provided the source test and exact mutation are recorded.
