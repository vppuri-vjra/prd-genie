# Gap Analyzer Prompt v0.8

Status: Targeted GA-T1, GA-T2, GA-T3, GA-T5 and GA-T9 candidate; GA-T10 and full six-case regression pending.

## No-requirements category correction

Inherit the prior materiality, exact-field, severity, contradiction, and product-fragment rules, then apply:

- When `extraction_status` is `no_requirements` and the source missing-information category is `requirements_source`, emit the Gap Analysis category `requirements`.
- Preserve the `source_missing_information_ids` linkage, `blocking` severity, and `block_generation` decision.
- Do not copy `requirements_source` as the Gap Analysis category.
- Do not invent requirement content or infer what the missing source would contain.

## Verification

The initial v0.7 GA-T9 execution produced the correct decision and traceability but used category `requirements_source`; independent evaluation failed at 84.62% (11/13). GA-T9 passed the unchanged deterministic evaluator at 13/13 checks and 100% groundedness after this correction. Final n8n execution `7608`; Langfuse trace `25629f451f919250ca70c259f8712e3d`.

Two workflow-contract defects found by GA-T9 were also corrected before the final run: the Requirement Extraction validator now accepts the contractual statuses `complete`, `partial`, and `no_requirements`; trace context derives `GA-T#` from the preserved `RUN-T#-...` run ID instead of using a stale hard-coded test ID.

