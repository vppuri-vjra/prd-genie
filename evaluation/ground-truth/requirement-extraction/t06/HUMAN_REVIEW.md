# T6 Human Ground-Truth Review

## Source

| Source ID | Source file | Location |
|---|---|---|
| `SRC-EVAL-T6` | `Resources/eval_prdgenie_inputs.txt` | T6 |

Authoritative source text:

> Engineering wants microservices. Design wants single-page app. PM wants it shipped by March.

## Source and evidence review

| Item | Source | Exact evidence |
|---|---|---|
| Engineering preference | `Resources/eval_prdgenie_inputs.txt`, T6 | “Engineering wants microservices.” |
| Design preference | Same source | “Design wants single-page app.” |
| PM deadline viewpoint | Same source | “PM wants it shipped by March.” |
| Missing approval/reconciliation decision | Same source | Derived from multiple preferences being stated without approval or prioritization |
| Missing March year/date | Same source | Derived from the source stating only “March” |
| Missing deliverable identity | Same source | Derived from the source referring only to “it” |

## Canonical item and direct evidence review

| Canonical item | Classification | Direct source evidence |
|---|---|---|
| Engineering wants microservices | Suggested constraint, attributed to Engineering | “Engineering wants microservices.” |
| Design wants a single-page app | Suggested constraint, attributed to Design | “Design wants single-page app.” |
| PM wants delivery by March | Deadline, attributed to PM | “PM wants it shipped by March.” |

## Human interpretation decisions

| Review question | Proposed decision |
|---|---|
| Are microservices and single-page app approved requirements? | No; they are stakeholder preferences and remain suggested constraints |
| Should Engineering and Design remain separate? | Yes |
| Are the preferences inherently incompatible? | Not established; they may concern different system layers |
| What relationship should be recorded? | A neutral unresolved need to evaluate and reconcile both viewpoints |
| Is March a deadline? | Yes, but the year and exact date are unknown |
| Is the deliverable identified? | No; the source says only “it” |
| Is `partial` the correct status? | Yes; approval, reconciliation, scope and precise deadline remain unresolved |
| May PRD Genie choose an architecture? | No |

## Human approval checklist

- [x] Engineering and Design are preserved as separate viewpoints.
- [x] Both architecture preferences are classified as suggested constraints.
- [x] PM and March are preserved in a deadline item.
- [x] The unresolved relationship is neutral and does not claim incompatibility.
- [x] `partial` is the correct extraction status.
- [x] No architecture is selected or favored.
- [x] Approval status, March timing, and deliverable identity are correctly identified as gaps.
- [x] The allowed variations and prohibited claims in `case-metadata.json` are acceptable.
- [x] Approve T6 ground truth for dataset version `0.1.0`.

## Approval record

| Field | Value |
|---|---|
| Status | Approved |
| Reviewer | Vipin |
| Review date | 2026-08-03 |
| Dataset version | `0.1.0` |
