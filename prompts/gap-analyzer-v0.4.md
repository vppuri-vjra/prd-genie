# Gap Analyzer Prompt v0.4

Status: Superseded targeted candidate.

## Schema-and-decision correction

Inherit the complete v0.2 materiality boundary and additionally:

- require every gap to contain exactly `id`, `category`, `description`, `severity`, `clarification_question`, `related_item_ids`, and `source_missing_information_ids`;
- prohibit aliases such as `affected_item_ids`;
- return both trace-link fields as arrays;
- evaluate every material extraction `missing_information` record;
- keep distinct decision topics as separate gaps;
- use `insufficient / false / request_clarification` when the core capability is undefined and multiple material dimensions are missing; and
- normalize the GA-T2 categories to `users`, `metrics`, `output_format`, and `reference_scope`.

## Verification

The corrected workflow passed its structural contract and all four gaps, decisions, trace links, and clarification checks. After the parser was reconciled to the authoritative `blocking` schema value, the final v0.4 run returned four `blocking` severities rather than the four approved `high` severities. Independent evaluation result: `needs_review`, 12/13 checks, 92.31% groundedness.

