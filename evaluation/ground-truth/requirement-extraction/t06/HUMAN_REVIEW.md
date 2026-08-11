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
| Missing approval decision | Same source | Derived from each preference being stated without an approval status |
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
| What relationship should be recorded? | None; the source does not state that the proposals conflict, and they can coexist across backend and frontend layers |
| Is March a deadline? | Yes, but the year and exact date are unknown |
| Is the deliverable identified? | No; the source says only “it” |
| Is `partial` the correct status? | Yes; approval status, scope and the precise deadline remain unresolved |
| May PRD Genie choose an architecture? | No |

## Human approval checklist

- [x] Engineering and Design are preserved as separate viewpoints.
- [x] Both architecture preferences are classified as suggested constraints.
- [x] PM and March are preserved in a deadline item.
- [x] No contradiction or cross-link is recorded because the source does not establish a conflict.
- [x] `partial` is the correct extraction status.
- [x] No architecture is selected or favored.
- [x] Approval status, March timing, and deliverable identity are correctly identified as gaps.
- [x] The allowed variations and prohibited claims in `case-metadata.json` are acceptable.
- [x] Approve the adjudicated T6 ground truth for dataset version `0.2.0`.

## Approval record

| Field | Value |
|---|---|
| Status | Approved |
| Reviewer | Vipin |
| Review date | 2026-08-10 |
| Dataset version | `0.2.0` |

## Adjudication note

On 2026-08-10, the reviewer confirmed that microservices and a single-page app can coexist. The earlier canonical contradiction and bidirectional cross-links were therefore unsupported by the authoritative source and were removed. The independent Langfuse LLM judge had raised the same semantic concern. T6 remains `partial` solely because approval status, the exact March deadline, and the delivery scope are still unknown.
