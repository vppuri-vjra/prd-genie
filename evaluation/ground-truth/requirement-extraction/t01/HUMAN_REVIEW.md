# T1 Human Ground-Truth Review

## Source

| Source ID | Source file | Location |
|---|---|---|
| `SRC-EVAL-T1` | `Resources/eval_prdgenie_inputs.txt` | T1 |

Authoritative source text:

> The user should be able to filter reports by date range, category, and status. Results must load in under 2 seconds. PM: Sarah. Deadline: Q3.

## Canonical extraction review

| ID | Type | Proposed canonical interpretation | Source | Exact source evidence | Grounded? |
|---|---|---|---|---|---|
| `FR-001` | Functional requirement | Users should be able to filter reports by date range, category, and status | `SRC-EVAL-T1` | “The user should be able to filter reports by date range, category, and status.” | Yes |
| `NFR-001` | Non-functional requirement | Results must load in under 2 seconds | `SRC-EVAL-T1` | “Results must load in under 2 seconds.” | Yes |
| `STK-001` | Stakeholder | Sarah is the PM | `SRC-EVAL-T1` | “PM: Sarah.” | Yes |
| `DDL-001` | Deadline | The deadline is Q3 | `SRC-EVAL-T1` | “Deadline: Q3.” | Yes |

## Missing-information review

Missing-information entries identify absent details; they do not assert answers.

| ID | Proposed gap | Basis in source | Source | Grounded handling? |
|---|---|---|---|---|
| `MISS-001` | The specific user persona is unknown | The source states only “The user” and names no persona | `SRC-EVAL-T1` | Yes—ask for clarification; do not invent a persona |
| `MISS-002` | The year and calendar dates represented by Q3 are unknown | The source states only “Q3” | `SRC-EVAL-T1` | Yes—ask for clarification; do not invent dates |

## Human approval checklist

- [x] The four canonical items correctly interpret the source.
- [x] The classifications are correct.
- [x] The exact source evidence supports every factual item.
- [x] The two missing-information entries identify genuine omissions without inventing answers.
- [x] `complete` is the correct extraction status because all explicit content was extracted.
- [x] The allowed variations and prohibited claims in `case-metadata.json` are acceptable.
- [x] Approve T1 ground truth for dataset version `0.1.0`.

## Approval record

| Field | Value |
|---|---|
| Status | Approved |
| Reviewer | Vipin |
| Review date | 2026-08-03 |
| Dataset version | `0.1.0` |

## Dataset 0.1.1 adjudication

On 2026-08-03, Vipin clarified that only the performance NFR must link to the report-filtering FR. Sarah and the Q3 deadline remain standalone grounded items because the source does not explicitly assign Sarah or Q3 to this specific requirement.
