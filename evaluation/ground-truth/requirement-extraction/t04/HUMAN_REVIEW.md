# T4 Human Ground-Truth Review

## Source

| Source ID | Source file | Location |
|---|---|---|
| `SRC-EVAL-T4` | `Resources/eval_prdgenie_inputs.txt` | T4 |

Authoritative source text:

> Users need to export reports as PDF and CSV. PDF must include company logo. CSV must preserve formulas.

## Source and evidence review

| Item | Source | Exact evidence |
|---|---|---|
| PDF and CSV report export | `Resources/eval_prdgenie_inputs.txt`, T4 | “Users need to export reports as PDF and CSV.” |
| PDF company-logo condition | Same source | “PDF must include company logo.” |
| CSV formula-preservation condition | Same source | “CSV must preserve formulas.” |

## Canonical item and direct evidence review

| Canonical item | Classification | Direct source evidence |
|---|---|---|
| Users need to export reports as PDF and CSV | Functional requirement | “Users need to export reports as PDF and CSV.” |
| PDF must include company logo | Acceptance criterion linked to report export | “PDF must include company logo.” |
| CSV must preserve formulas | Acceptance criterion linked to report export | “CSV must preserve formulas.” |

## Human interpretation decisions

| Review question | Proposed decision |
|---|---|
| What is the product behavior? | Export reports as PDF and CSV |
| How should the PDF condition be classified? | Acceptance criterion linked to report export |
| How should the CSV condition be classified? | Acceptance criterion linked to report export |
| Must the criterion statements remain exact? | Yes; preserve the source wording verbatim |
| Is `complete` the correct status? | Yes; all explicit requirements and criteria are extractable |
| Are there contradictions? | No |
| May XLSX or other formats be added? | No |
| May additional logo/formula behavior be inferred? | No |

## Human approval checklist

- [x] The export functional requirement correctly interprets the source.
- [x] The two qualifying conditions are correctly classified as acceptance criteria.
- [x] Each criterion is correctly linked to the export behavior.
- [x] PDF, CSV, company logo, and preserve formulas are retained exactly.
- [x] `complete` is the correct extraction status.
- [x] No additional format, criterion, or implementation is introduced.
- [x] The allowed variations and prohibited claims in `case-metadata.json` are acceptable.
- [x] Approve T4 ground truth for dataset version `0.1.0`.

## Approval record

| Field | Value |
|---|---|
| Status | Approved |
| Reviewer | Vipin |
| Review date | 2026-08-03 |
| Dataset version | `0.1.0` |
