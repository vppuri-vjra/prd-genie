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
| Unknown ETA fact | Same source | “ETA unknown.” |

## Canonical item and direct evidence review

| Canonical item | Classification | Direct source evidence |
|---|---|---|
| Provide SSO login | Functional requirement | “SSO login requires the new auth service which is being built by Team Alpha.” |
| SSO login requires the new auth service being built by Team Alpha | Dependency linked to SSO | Same evidence |
| The new auth service ETA is unknown | Stated dependency uncertainty | “ETA unknown.” |
| The unknown ETA may create delivery risk for SSO login | Derived risk linked to the dependency | Inference grounded in “ETA unknown.”; the source does not explicitly state delivery impact |

## Human interpretation decisions

| Review question | Proposed decision |
|---|---|
| Is SSO login a functional requirement? | Yes |
| Is the new auth service a dependency? | Yes; SSO login explicitly requires it |
| Is Team Alpha grounded? | Yes; the source states that Team Alpha is building the service |
| Is unknown ETA a risk or only missing information? | `ETA unknown` is a stated fact. Potential delivery impact is a grounded inference, not a source-stated conclusion; clarification may supplement but cannot replace it |
| Why is status `complete`? | Every stated capability, dependency, team and explicit uncertainty is captured; the unknown value itself is not an unresolved interpretation |
| May an ETA be estimated? | No |
| Are there contradictions? | No |

## Human approval checklist

- [x] SSO login is correctly represented as a functional requirement.
- [x] The new auth service is correctly represented as a linked dependency.
- [x] Team Alpha and the being-built status are preserved without embellishment.
- [x] `ETA unknown` is preserved as a stated fact and the linked delivery risk is explicitly identified as derived.
- [x] `complete` is the correct extraction status.
- [x] No ETA, service status, mitigation, severity, or delivery conclusion is invented.
- [x] A clarification does not replace the explicit risk.
- [x] The allowed variations and prohibited claims in `case-metadata.json` are acceptable.
- [x] Approve T10 ground-truth adjudication for dataset version `0.1.1`.

## Approval record

| Field | Value |
|---|---|
| Status | Approved |
| Reviewer | Vipin |
| Review date | 2026-08-10 |
| Dataset version | `0.1.1` |
| Adjudication reason | Langfuse LLM judge identified that delivery risk was presented as stated although the source states only that the ETA is unknown |
