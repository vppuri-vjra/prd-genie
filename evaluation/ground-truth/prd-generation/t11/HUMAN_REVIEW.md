# T11 PRD Ground-Truth Human Review

## Approval record

| Field | Value |
|---|---|
| Status | **Approved** |
| Reviewer | Vipin Puri |
| Approval date | 2026-08-05 |
| Approval statement | “Approve T11 ground truth” |
| Dataset version | `0.1.0` |
| Source package | T1 after `HA-R01 / approved` |
| Groundedness | **100%** |

## Canonical evidence

| PRD content | Upstream ID | Exact source evidence | Approved treatment |
|---|---|---|---|
| Report filtering | `FR-001` | “The user should be able to filter reports by date range, category, and status.” | Functional requirement, user goal and directly restated acceptance criterion |
| Performance | `NFR-001` | “Results must load in under 2 seconds.” | NFR, success metric and directly restated acceptance criterion |
| PM | `STK-001` | “PM: Sarah.” | Product Overview because the official template has no stakeholder section |
| Deadline | `DDL-001` | “Deadline: Q3.” | Timeline milestone; preserve Q3 exactly |

## Approved empty or TBD treatment

| Area | Approved result | Rationale |
|---|---|---|
| Product name | Explicit TBD | No name supplied |
| Business goal | Explicit TBD | No business outcome supplied |
| Personas | Empty | “The user” is generic, not an approved persona |
| Out of scope | Empty | No exclusions supplied |
| Dependencies | Empty | No dependencies supplied |
| Assumptions | Empty | No assumptions supplied |
| Open questions | Empty | Gap Analysis approved no unresolved material gaps |

## Prohibited claims

- Do not invent a product name, persona, business KPI, priority, dependency, assumption, exclusion, exact Q3 dates or year.
- Do not treat Sarah as the document author.
- Do not convert “under 2 seconds” into “2 seconds or less.”
- Do not add filtering dimensions or report behaviors.
- Do not introduce open questions that were not approved by Gap Analysis or Human Approval.

## Approval conclusion

The canonical JSON and Markdown represent the same ten-section PRD, preserve all four approved facts, and contain zero unsupported product claims. They are approved as the T11 evaluation ground truth.
