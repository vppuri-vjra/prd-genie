# Additional Instructor Requirements - Final Status

These requirements include the instructions communicated verbally on 2026-08-02 and the final Interview Kickstart submission-form requirements confirmed on 2026-08-24. They are tracked alongside the written Problem Statement, rubric, and Capstone Project Playbook.

| Required artifact | Final status | Evidence |
|---|---|---|
| Business Requirements Document | Complete | [BRD](../requirements/BRD.md) |
| Product Requirements Document | Complete | [Product PRD](../requirements/PRODUCT_PRD.md) |
| Architecture Design | Complete | [Consolidated Architecture Design](../architecture/ARCHITECTURE_DESIGN.md) |
| Architecture Decisions | Complete for the submitted scope | [ADR-001](../decisions/ADR-001-platform-and-observability.md), [ADR-002](../decisions/ADR-002-structured-contracts.md), and [ADR-003](../decisions/ADR-003-openai-model-baseline.md) |
| Ground Truth Dataset | Complete for T1-T12 | [Human-reviewed ground truth](../../evaluation/ground-truth/README.md) |
| Final baseline evaluation | Complete - 12/12 passed | [T1-T12 baseline summary](../../evaluation/results/baseline-summary.md) |
| Accepted implementation package | Complete | [v0.3.8 release](../../releases/v0.3.8/README.md) |
| Presentation and demonstration | Complete | [Presentation package](../../releases/v0.3.8/presentation/README.md) and [Complete Demo with Artifacts](https://github.com/vppuri-vjra/prd-genie/releases/tag/v0.3.8-complete-demo) |

## Interview Kickstart upload requirements

The final delivery channel is the [Applied Agentic AI Capstone Project — Final Submission form](https://forms.gle/oRqsBx2i6fZFnkhS9).

| Form requirement | Submission control | Status |
|---|---|---|
| Email | Enter the learner email associated with the submission account | Pending final form submission |
| Learner name | Enter the learner's full name | Pending final form submission |
| Capstone Project Name | Use the final PRD Genie project name consistently | Pending final form submission |
| Project files | Create and upload one ZIP containing all final project files | ZIP creation pending |
| File count and type | The form accepts one supported file; the project package must therefore be a single ZIP | Pending |
| Maximum upload size | ZIP must be no larger than 1 GB | Pending ZIP size verification |
| Submission finality | Once submitted, the uploaded file cannot be edited or removed | Do not submit until final audit and ZIP verification pass |

If the form or upload fails, the published instruction directs learners to `operations@interviewkickstart.com`.

## Ground-truth quality controls

The final evaluation package provides:

- Stable T1-T12 test identifiers and preserved source inputs.
- Canonical expected structured outputs using the applicable workflow contracts.
- Exact-value preservation for names, numbers, dates, versions, units, and source evidence.
- Required classifications, traceable relationships, and explicit allowed variation.
- Prohibited unsupported claims and hallucination controls.
- Expected ambiguity, contradiction, missing-information, clarification, and refusal behavior.
- Human-review records, dataset versions, and approval status.
- Deterministic controls plus applicable Langfuse semantic-evaluation receipts.

## Final verification sequence

1. The corrected extraction, gap-analysis, approval, PRD, story, validator, sizing, and delivery stages were preserved in the nine-workflow v0.3.8 package.
2. The T1-T12 baseline was completed against approved ground truth with 12/12 passing, 100% groundedness, and zero unsupported claims.
3. Parent execution `11901` / `RUN-S2-11902-16e7090e` was retained as the formal submission baseline.
4. Execution `11958` / `RUN-S2-11959-16e7090e` was published as supplementary demonstration evidence without changing the baseline.
5. The public repository, Q1-Q4 submission portal, presentation, evidence files, and complete demo were linked for reviewer access.
6. The final submission must be packaged as one ZIP under 1 GB and uploaded through the Interview Kickstart form only after the closure audit and archive-integrity checks pass.

## Final disposition

The instructor-required documents and evaluation controls are complete for the v0.3.8 scope. Final administrative closure remains pending until the single ZIP is created, verified below 1 GB, uploaded through the Interview Kickstart form, and the form submission is confirmed. Future model optimization or workflow expansion belongs to a later version and is not required to validate this submission.
