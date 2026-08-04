# Gap Analyzer Prompt v1.0

Status: **Promoted baseline.** GA-T6 targeted validation and the unchanged T1-T10 release regression passed at 100% groundedness.

## Missing-information coverage correction

Inherit every approved v0.9 rule, including materiality, exact-field preservation, severity, contradiction handling, product-fragment handling, no-requirements blocking, and dependency uncertainty. Then apply:

- Evaluate every upstream `missing_information` record independently.
- Emit one traceable gap for every upstream `MISS-###` record that represents information required to write an accurate, testable, or schedulable PRD without invention.
- Do not silently omit a missing-information record merely because its related source value can be copied verbatim into a PRD.
- A date or month without a year or exact date remains a material deadline gap when the approved extraction records it as missing information.
- When the deliverable is unidentified, use a `blocking` scope gap.
- When architecture or technology preferences remain unapproved and must be reconciled before they can become PRD constraints, use a `blocking` decision-status gap.
- When a stated delivery month lacks its approved year or exact-date clarification, use a `high` deadline gap.
- Preserve every upstream contradiction neutrally. Do not claim that preferences are technically incompatible unless the approved extraction establishes incompatibility.
- A gap may be omitted only when an explicit approved materiality rule applies, such as GA-T1's intentionally non-material unknowns or GA-T10's approved controlled-TBD rule. The decision reason must not contradict any retained upstream missing-information record.

## GA-T6 expected behavior

For the approved GA-T6 input:

- Return `insufficient / false / request_clarification`.
- Cover `MISS-001` with a blocking `decision_status` gap linked to `CON-001` and `CON-002`.
- Cover `MISS-002` with a high `deadline` gap linked to `DDL-001`.
- Cover `MISS-003` with a blocking `scope` gap linked to `DDL-001`.
- Preserve `CTR-001` with high severity and both constraint IDs.
- Add no risk, select no architecture, and do not assert technical incompatibility.

## Verification

Targeted GA-T6 execution `7629` passed 13/13 evaluator checks at 100% groundedness. Langfuse accepted trace `a7d21c4d84862669fdda7d9429488bf2`.

The unchanged T1-T10 release regression then passed 10/10 cases at 100% average groundedness under the same prompt, model, workflow, schema, and evaluator. See `evaluation/results/gap-analysis-v1.0-release-gate-2026-08-04.md`.
