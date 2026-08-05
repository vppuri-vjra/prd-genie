# Human Approval HA-R05 / T10 — Approved With Conditions

## Result

The T10 conditional Human Approval route completed successfully and passed its contract and ground-truth checks at **100% groundedness**.

| Field | Actual value |
|---|---|
| Workflow / ID | `PRD Genie - Human Approval v0.1` / `L3J0nRWdKhs46wxF` |
| Case / test | `HA-R05 / T10` |
| Run ID | `RUN-T10-GROUND-TRUTH` |
| Reviewer | Vipin |
| Decision | `approved_with_conditions` |
| Approved IDs | `FR-001`, `DEP-001`, `RSK-001` |
| Rejected IDs | None |
| Reviewed gap | `GAP-001` |
| Controlled TBD IDs | `GAP-001`, `DEP-001`, `RSK-001` |
| Condition | `COND-001`: Proceed with SSO documentation while preserving the new auth service ETA as TBD; do not invent an ETA. |
| Evidence checks | All five `true` |
| Structural / reference / decision validation | All `true` |
| Route | `prd_generation_with_conditions` |
| PRD-generation eligible | `true` |
| Model call / token usage | `false / 0` |
| Langfuse region / ingestion | US / HTTP `200`, accepted |
| Langfuse trace | `4be0fcf52527b2ccb2797f71a7aaf389` |
| Contract status | `passed` |
| Groundedness | **100%** |

## Controlled downstream rule

PRD generation may document the grounded SSO capability and its Team Alpha dependency. It must preserve the dependency ETA as TBD and must not add an ETA, delivery date, mitigation, severity, owner, escalation path, or other unsupported claim.
