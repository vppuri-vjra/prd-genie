# Gap Analyzer Prompt v0.7

Status: Targeted GA-T1, GA-T2, GA-T3 and GA-T5 candidate; GA-T9, GA-T10 and full regression pending.

## Fragment-gap coverage correction

Inherit the prior materiality, exact-field, severity, and contradiction rules, then apply:

- When `extraction.items` is empty but product-relevant fragments and actionable `missing_information` records remain, evaluate and preserve every distinct material gap.
- A source value explicitly marked `TBD` remains a grounded gap; do not discard or invent it.
- When no reliable item exists, gaps that determine the requested capability, user need, outcome, or behavior are `blocking`.
- A separate product decision such as an explicitly TBD budget is `high` unless the source supports stronger severity.
- Preserve an already specific source category such as `dashboard_scope`, `real_time_behavior`, or `budget`; do not replace it with a broader alias.
- Retain earlier approved normalizations only where applicable, including `output_format` and `reference_scope`.

## Verification

GA-T5 passed the unchanged deterministic evaluator at 13/13 checks and 100% groundedness. n8n execution `7602`; Langfuse trace `444278460f3941a14b0e58b9246b9f9e`. GA-T9, GA-T10 and the unchanged six-case regression remain pending.

