# T7 Human Ground-Truth Review

## Source

| Source ID | Source file | Location |
|---|---|---|
| `SRC-EVAL-T7` | `Resources/eval_prdgenie_inputs.txt` | T7 |

Authoritative source text:

> API must support 10,000 concurrent users. Response time < 200ms at p95. Must integrate with Salesforce REST API v52.

## Source and evidence review

| Item | Source | Exact evidence |
|---|---|---|
| Concurrent-user scale | `Resources/eval_prdgenie_inputs.txt`, T7 | “API must support 10,000 concurrent users.” |
| p95 response-time target | Same source | “Response time < 200ms at p95.” |
| Salesforce integration | Same source | “Must integrate with Salesforce REST API v52.” |

## Canonical item and direct evidence review

| Canonical item | Classification | Direct source evidence |
|---|---|---|
| Support 10,000 concurrent users | Scalability non-functional requirement | “API must support 10,000 concurrent users.” |
| Response time < 200ms at p95 | Performance non-functional requirement | “Response time < 200ms at p95.” |
| Integrate with Salesforce REST API v52 | Integration non-functional requirement | “Must integrate with Salesforce REST API v52.” |

## Human interpretation decisions

| Review question | Proposed decision |
|---|---|
| How is 10,000 concurrent users classified? | Scalability NFR |
| How is < 200ms at p95 classified? | Performance NFR |
| How is Salesforce REST API v52 classified? | One integration NFR for this evaluation contract |
| Should the integration also be an FR or acceptance criterion? | No; do not duplicate the same source statement |
| Must values remain exact? | Yes; preserve commas, comparison operator, unit, percentile, API type and version |
| Is `complete` the correct status? | Yes |
| Are there contradictions? | No |

## Human approval checklist

- [x] The scale, performance, and integration statements remain separate NFRs.
- [x] `10,000 concurrent users` is preserved exactly.
- [x] `< 200ms at p95` is preserved exactly.
- [x] `Salesforce REST API v52` is preserved exactly.
- [x] The integration is not duplicated as an FR, acceptance criterion, or dependency.
- [x] `complete` is the correct extraction status.
- [x] No additional performance, integration, or implementation requirement is introduced.
- [x] The allowed variations and prohibited claims in `case-metadata.json` are acceptable.
- [x] Approve T7 ground truth for dataset version `0.1.0`.

## Approval record

| Field | Value |
|---|---|
| Status | Approved |
| Reviewer | Vipin |
| Review date | 2026-08-03 |
| Dataset version | `0.1.0` |
