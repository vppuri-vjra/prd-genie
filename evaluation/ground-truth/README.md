# Ground Truth Dataset

## Purpose

This directory will contain the versioned, human-reviewed canonical expectations used to evaluate PRD Genie. Ground truth is independent of model output and must not be overwritten by a baseline result.

## Planned coverage

| Cases | Capability | Canonical artifact |
|---|---|---|
| T1-T10 | Requirement Extraction | Schema-valid expected JSON plus allowed variations and prohibited claims |
| T11 | PRD Generation | Approved ten-section Markdown/structured PRD grounded only in the approved T1 extraction |
| T12 | Story Breakdown | Approved epics, features, and stories linked to T11 and source requirement IDs |

## Required metadata

Every approved case must record:

- Dataset version.
- Test ID and exact source input or approved upstream artifact.
- Applicable schema and schema version.
- Canonical expected output.
- Required exact values, item types, relationships, and evidence.
- Allowed variations.
- Prohibited unsupported claims.
- Expected ambiguity, contradiction, missing-information, refusal, or TBD behavior.
- Reviewer, review date, approval status, and review notes.

## Change control

1. Draft canonical output from the authoritative source materials and contracts.
2. Review every factual element against its source.
3. Mark allowed semantic variations explicitly.
4. Approve and assign a dataset version.
5. Run actual outputs against the approved version.
6. Change ground truth only through a reviewed version update with rationale.

Model outputs, prompt changes, and evaluation failures may reveal a defect in ground truth, but they do not automatically redefine it.

## Requirement Extraction Review Register

| Test | Dataset version | Status | Source | Canonical output | Human review | Review metadata |
|---|---|---|---|---|---|---|
| T1 | `0.1.1` | Approved by Vipin on 2026-08-03; relationship scope clarified | `Resources/eval_prdgenie_inputs.txt`, T1 | `requirement-extraction/t01/expected-output.json` | `requirement-extraction/t01/HUMAN_REVIEW.md` | `requirement-extraction/t01/case-metadata.json` |
| T2 | `0.1.0` | Approved by Vipin on 2026-08-03 | `Resources/eval_prdgenie_inputs.txt`, T2 | `requirement-extraction/t02/expected-output.json` | `requirement-extraction/t02/HUMAN_REVIEW.md` | `requirement-extraction/t02/case-metadata.json` |
| T3 | `0.1.0` | Approved by Vipin on 2026-08-03 | `Resources/eval_prdgenie_inputs.txt`, T3 | `requirement-extraction/t03/expected-output.json` | `requirement-extraction/t03/HUMAN_REVIEW.md` | `requirement-extraction/t03/case-metadata.json` |
| T4 | `0.1.0` | Approved by Vipin on 2026-08-03 | `Resources/eval_prdgenie_inputs.txt`, T4 | `requirement-extraction/t04/expected-output.json` | `requirement-extraction/t04/HUMAN_REVIEW.md` | `requirement-extraction/t04/case-metadata.json` |
| T5 | `0.1.0` | Approved by Vipin on 2026-08-03 | `Resources/eval_prdgenie_inputs.txt`, T5 | `requirement-extraction/t05/expected-output.json` | `requirement-extraction/t05/HUMAN_REVIEW.md` | `requirement-extraction/t05/case-metadata.json` |
| T6 | `0.1.0` | Approved by Vipin on 2026-08-03 | `Resources/eval_prdgenie_inputs.txt`, T6 | `requirement-extraction/t06/expected-output.json` | `requirement-extraction/t06/HUMAN_REVIEW.md` | `requirement-extraction/t06/case-metadata.json` |
| T7 | `0.1.0` | Approved by Vipin on 2026-08-03 | `Resources/eval_prdgenie_inputs.txt`, T7 | `requirement-extraction/t07/expected-output.json` | `requirement-extraction/t07/HUMAN_REVIEW.md` | `requirement-extraction/t07/case-metadata.json` |
| T8 | `0.1.0` | Approved by Vipin on 2026-08-03 | `Resources/eval_prdgenie_inputs.txt`, T8 | `requirement-extraction/t08/expected-output.json` | `requirement-extraction/t08/HUMAN_REVIEW.md` | `requirement-extraction/t08/case-metadata.json` |
| T9 | `0.1.1` | Approved by Vipin on 2026-08-03; actual wording adjudicated as acceptable | `Resources/eval_prdgenie_inputs.txt`, T9 | `requirement-extraction/t09/expected-output.json` | `requirement-extraction/t09/HUMAN_REVIEW.md` | `requirement-extraction/t09/case-metadata.json` |
| T10 | `0.1.0` | Approved by Vipin on 2026-08-03 | `Resources/eval_prdgenie_inputs.txt`, T10 | `requirement-extraction/t10/expected-output.json` | `requirement-extraction/t10/HUMAN_REVIEW.md` | `requirement-extraction/t10/case-metadata.json` |

T1-T10 Requirement Extraction ground truth is complete at dataset version `0.1.1`. T1 and T9 contain approved adjudication updates; unchanged cases retain their original `0.1.0` case version. Every case has a schema-valid canonical output, source traceability, allowed variations, prohibited claims, and a recorded human approval.

## PRD Generation Review Register

| Test | Dataset version | Status | Source package | Canonical output | Review guide |
|---|---|---|---|---|---|
| T11 | `0.1.0-draft` | Awaiting human approval | Approved T1 package (`HA-R01 / approved`) | `prd-generation/t11/expected-output.json` and `.md` | `prd-generation/t11/REVIEW_GUIDE.md` |

## Automated evaluation

The deterministic evaluator is `scripts/evaluate_extraction.py`. It compares an actual extractor output with the approved source, canonical output, and case metadata. It checks schema validity, status, exact values, item types, verbatim evidence, canonical item coverage, relationships, contradictions, missing-information coverage, and machine-detectable prohibited literals. Differences that require semantic judgment are marked `needs_review` rather than guessed.
