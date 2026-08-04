# Gap Analyzer Prompt v0.6

Status: Targeted GA-T1, GA-T2 and GA-T3 candidate; remaining approved GA regression cases pending.

## Contradiction-contract correction

Inherit the v0.2 materiality boundary, v0.4 exact-field and decision rules, and v0.5 severity boundary, then apply:

- Every contradiction object contains exactly `id`, `description`, `severity`, and `related_item_ids`.
- Do not copy extraction-only `clarification_question`, `resolution_status`, `item_ids`, or other fields into the Gap Analysis contradiction object.
- Map the extraction contradiction's `item_ids` to `related_item_ids` and preserve all affected IDs.
- Preserve the contradiction without resolving it or creating a downstream risk unless the extraction contains an explicit risk.
- Use `insufficient / false / request_clarification` when an unresolved blocking contradiction affects whether core requirements can coexist or be represented safely.
- Do not use `partially_sufficient` when a core blocking contradiction must be resolved before the PRD can state approved behavior.

## Verification

GA-T3 passed the unchanged deterministic evaluator at 13/13 checks and 100% groundedness. n8n execution `7600`; Langfuse trace `e277c0f2afa297cd37d33f243e5dc714`. Remaining approved Gap Analyzer cases must pass under the same prompt before promotion.

