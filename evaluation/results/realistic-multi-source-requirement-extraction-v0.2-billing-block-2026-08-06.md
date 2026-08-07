# Realistic Multi-Source Requirement Extraction v0.2 — Billing Block

## Authorized targeted rerun

| Field | Value |
|---|---|
| Parent workflow | `PRD Genie - Realistic Multi-Source Requirement Extraction Canary v0.2` |
| Parent workflow ID | `CjFL8HuoCT57jbHT` |
| Child workflow | `PRD Genie - Requirement Extractor Child v1.3` |
| Child workflow ID | `AEbgqRpfeRMvv4va` |
| n8n execution | `9645` |
| Result | **Blocked before extraction** |
| n8n error | `OpenAI: Rate limit reached` / no credits remaining |
| Langfuse extraction trace | None created |
| Additional rerun attempted | No |

The user authorized exactly one targeted billable rerun. Execution `9645` is that
attempt. It stopped in the OpenAI model sub-node before an extraction response was
produced, so the semantic gate did not run and no extraction was accepted.

## Grounding status

- Approved baseline groundedness: **100%**.
- Locally validated semantic gate unsupported-claim allowance: **0**.
- Execution `9645` groundedness: **not evaluated**, because no model output existed.
- Grounding defect observed: **none**.
- Integration/billing defect observed: OpenAI credential had no remaining credits.

No retry was performed. A future run requires restored API credits and separate
authorization for another billable attempt.
