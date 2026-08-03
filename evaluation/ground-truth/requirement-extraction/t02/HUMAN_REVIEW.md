# T2 Human Ground-Truth Review

## Source

| Source ID | Source file | Location |
|---|---|---|
| `SRC-EVAL-T2` | `Resources/eval_prdgenie_inputs.txt` | T2 |

Authoritative source text:

> We need better reporting. Something like what Competitor X has.

## Canonical extraction review

| ID | Type | Proposed canonical interpretation | Source | Exact source evidence | Grounded? |
|---|---|---|---|---|---|
| `FR-001` | Ambiguous functional requirement | Better reporting similar to Competitor X is desired, but the required capability is not defined | `SRC-EVAL-T2` | “We need better reporting. Something like what Competitor X has.” | Yes |

## Missing-information review

| ID | Proposed gap | Basis in source | Source | Required? | Grounded handling? |
|---|---|---|---|---|---|
| `MISS-001` | Reporting metrics | No metrics are named | `SRC-EVAL-T2` | Yes | Ask; do not invent metrics |
| `MISS-002` | Report format or presentation | No format is named | `SRC-EVAL-T2` | Yes | Ask; do not invent a format |
| `MISS-003` | Target users | No users are identified | `SRC-EVAL-T2` | Yes | Ask; do not invent users |
| `MISS-004` | Reporting scope and specific Competitor X capabilities | “Something like” does not identify a capability | `SRC-EVAL-T2` | Appropriate additional gap | Ask what is intended; do not claim that Competitor X has any feature |

## Human interpretation decisions

| Review question | Proposed decision |
|---|---|
| Is there an extractable requirement? | Yes, but only the ambiguous desire for better reporting |
| Is `partial` the correct status? | Yes; the request is not specific or testable |
| Is Competitor X evidence or a factual capability? | It is a grounded reference only; no competitor capability is stated |
| Are there contradictions? | No |
| What is strictly required as missing? | Metrics, format, and users |
| What must never be invented? | Reporting features, competitor capabilities, users, metrics, formats, targets, or implementation |

## Human approval checklist

- [x] The ambiguous functional requirement correctly interprets the source.
- [x] `partial` is the correct extraction status.
- [x] Competitor X is preserved without inventing its capabilities.
- [x] Metrics, format, and users are correctly identified as mandatory gaps.
- [x] The reporting-scope/competitor-capability clarification is appropriate.
- [x] The allowed variations and prohibited claims in `case-metadata.json` are acceptable.
- [x] Approve T2 ground truth for dataset version `0.1.0`.

## Approval record

| Field | Value |
|---|---|
| Status | Approved |
| Reviewer | Vipin |
| Review date | 2026-08-03 |
| Dataset version | `0.1.0` |
