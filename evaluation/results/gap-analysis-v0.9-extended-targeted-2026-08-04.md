# Gap Analyzer v0.9 Extended Targeted Evaluation

Date: 2026-08-04

Prompt: `gap-analyzer-v0.9-dependency-uncertainty`

Workflow: `xrtf52GK57IRI1NI`

## Outcome

| Case | n8n execution | Expected decision | Actual decision | Gate and route | Evaluator | Langfuse trace |
|---|---:|---|---|---|---|---|
| GA-T4 | `7625` | `sufficient / proceed` | `sufficient / proceed` | `eligible_for_human_approval / human_review` | Pass, 100% | `c8f9d1836ec4c727c5cda5168b010e91` |
| GA-T6 | `7626` | `insufficient / request_clarification` | `insufficient / request_clarification` | `clarification_required / clarification` | **Fail, 84.62%** | `139eedec8897a7244f805c20d3467794` |
| GA-T7 | `7627` | `sufficient / proceed` | `sufficient / proceed` | `eligible_for_human_approval / human_review` | Pass, 100% | `298185f15d7c33ba4ab5a11a56c75b36` |
| GA-T8 | `7628` | `sufficient / proceed` | `sufficient / proceed` | `eligible_for_human_approval / human_review` | Pass, 100% | `dcafc5130a4822ffd8ae380d32f8c7e2` |

## GA-T6 variance

The overall decision and deterministic route were correct, but the actual output did not fully match the approved canonical semantics:

1. It omitted the approved `deadline` gap linked to `MISS-002` for the missing March year and exact date.
2. It returned the architecture `decision_status` gap as `high`; the approved documentation-readiness severity is `blocking`.
3. Its decision reason asserted that March could be preserved without an exact date, contradicting the approved need for clarification.

The neutral contradiction was preserved correctly, neither architecture was selected, no incompatibility was invented, and no unsupported risk was added.

## Release decision

Do not run or promote the full T1-T10 regression yet. Add a focused prompt rule requiring coverage of every upstream `missing_information` record unless an explicit approved materiality rule permits omission. For T6, `MISS-002` must be retained as a high-severity deadline gap, while architecture approval and unidentified scope remain blocking. Rerun GA-T6, then run the unchanged T1-T10 release regression only if the targeted rerun passes at 100%.
