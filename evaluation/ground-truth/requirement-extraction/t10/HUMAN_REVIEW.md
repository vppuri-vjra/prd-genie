# T10 Human Ground-Truth Review

## Source

| Source ID | Source file | Location |
|---|---|---|
| `SRC-EVAL-T10` | `Resources/eval_prdgenie_inputs.txt` | T10 |

Authoritative source text:

> SSO login requires the new auth service which is being built by Team Alpha. ETA unknown.

## Source and evidence review

| Item | Source | Exact evidence |
|---|---|---|
| SSO login capability | `Resources/eval_prdgenie_inputs.txt`, T10 | “SSO login requires the new auth service which is being built by Team Alpha.” |
| New-auth-service dependency | Same source | “SSO login requires the new auth service which is being built by Team Alpha.” |
| Team Alpha ownership/build context | Same source | “which is being built by Team Alpha.” |
| Unknown ETA risk | Same source | “ETA unknown.” |

## Canonical item and direct evidence review

| Canonical item | Classification | Direct source evidence |
|---|---|---|
| Provide SSO login | Functional requirement | “SSO login requires the new auth service which is being built by Team Alpha.” |
| SSO login requires the new auth service being built by Team Alpha | Dependency linked to SSO | Same evidence |
| The new auth service ETA is unknown | Delivery risk linked to the dependency | “ETA unknown.” |

## Human interpretation decisions

| Review question | Proposed decision |
|---|---|
| Is SSO login a functional requirement? | Yes |
| Is the new auth service a dependency? | Yes; SSO login explicitly requires it |
| Is Team Alpha grounded? | Yes; the source states that Team Alpha is building the service |
| Is unknown ETA a risk or only missing information? | A grounded delivery risk; clarification may supplement but cannot replace it |
| Why is status `complete`? | Every stated capability, dependency, team and explicit uncertainty is captured; the unknown value itself is not an unresolved interpretation |
| May an ETA be estimated? | No |
| Are there contradictions? | No |

## Human approval checklist

- [x] SSO login is correctly represented as a functional requirement.
- [x] The new auth service is correctly represented as a linked dependency.
- [x] Team Alpha and the being-built status are preserved without embellishment.
- [x] `ETA unknown` is preserved as a linked risk.
- [x] `complete` is the correct extraction status.
- [x] No ETA, service status, mitigation, severity, or delivery conclusion is invented.
- [x] A clarification does not replace the explicit risk.
- [x] The allowed variations and prohibited claims in `case-metadata.json` are acceptable.
- [x] Approve T10 ground truth for dataset version `0.1.0`.

## Approval record

| Field | Value |
|---|---|
| Status | Approved |
| Reviewer | Vipin |
| Review date | 2026-08-03 |
| Dataset version | `0.1.0` |
