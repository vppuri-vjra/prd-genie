# HA-R05 / T10 Human Review — Approved With Conditions

## Purpose

Verify that T10 proceeds to PRD generation only with the explicitly unknown authentication-service ETA preserved as a controlled TBD.

## Grounded evidence

| Canonical item | Exact source evidence | Human decision |
|---|---|---|
| `FR-001` SSO login | “SSO login requires the new auth service which is being built by Team Alpha.” | Approve |
| `DEP-001` new auth service dependency owned by Team Alpha | Same evidence | Approve and preserve relationship to SSO |
| `RSK-001` unknown ETA risk | “ETA unknown.” | Approve as an explicit delivery risk |
| `GAP-001` dependency ETA gap | Derived only from “ETA unknown.” | Retain as a controlled TBD |

## Approved conditional decision

| Field | Expected value |
|---|---|
| Case / source test | `HA-R05 / T10` |
| Gate reviewed | `eligible_with_tbd` |
| Review status | `approved_with_conditions` |
| Approved IDs | `FR-001`, `DEP-001`, `RSK-001` |
| Reviewed gap | `GAP-001` |
| Controlled TBD IDs | `GAP-001`, `DEP-001`, `RSK-001` |
| Condition | Proceed with SSO documentation while preserving the new auth service ETA as TBD; do not invent an ETA. |
| Next route | `prd_generation_with_conditions` |
| PRD-generation eligible | `true` |
| Groundedness target | **100%** |

## Guardrails

- Preserve `SSO login`, `new auth service`, `Team Alpha`, and `ETA unknown`.
- Do not estimate an ETA or add a date, delivery window, mitigation, severity, owner, or escalation path.
- Do not convert `ETA unknown` into an approved fact.
- The controlled TBD remains visible in the PRD input and must not block documenting the grounded SSO requirement.

## Approval record

| Field | Value |
|---|---|
| Status | **Approved for execution** |
| Reviewer | Vipin |
| Approval date | 2026-08-05 |
| Approval statement | “Complete HA-R05 / T10” |
| Groundedness | **100%** |

## Execution evidence

| Field | Actual result |
|---|---|
| Execution / contract | `completed / passed` |
| Review status | `approved_with_conditions` |
| Approved IDs | `FR-001`, `DEP-001`, `RSK-001` |
| Reviewed gap | `GAP-001` |
| Controlled TBD IDs | `GAP-001`, `DEP-001`, `RSK-001` |
| Condition | `COND-001` — preserve the new auth service ETA as TBD; do not invent an ETA |
| Evidence checks | All five `true` |
| Validation | Structure, references and decision consistency all `true` |
| Route / eligibility | `prd_generation_with_conditions / true` |
| Langfuse ingestion | HTTP `200`, accepted |
| Langfuse trace | `4be0fcf52527b2ccb2797f71a7aaf389` |
| Model call / token usage | `false / 0` |
| Groundedness | **100%** |
