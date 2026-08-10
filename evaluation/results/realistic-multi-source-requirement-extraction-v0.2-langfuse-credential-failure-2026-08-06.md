# Realistic Multi-Source Requirement Extraction v0.2 — Langfuse Credential Failure

## Execution evidence

| Field | Value |
|---|---|
| Parent workflow | `PRD Genie - Realistic Multi-Source Requirement Extraction Canary v0.2` |
| Parent workflow ID | `CjFL8HuoCT57jbHT` |
| Child workflow | `PRD Genie - Requirement Extractor Child v1.3` |
| Child workflow ID | `AEbgqRpfeRMvv4va` |
| n8n execution | `9647` |
| Prompt version | `extractor-v1.8-canonical-source-order` |
| Result | **Integration failure after local child validation** |
| Failed node | `Send Trace to Langfuse` |
| Error | `Credentials not found` |
| Constructed trace ID | `0d2d5b50b31180a5f9f81d99fe5b0855` |
| Accepted Langfuse trace | None; transmission did not occur |
| Additional retry | None |

The OpenAI model, extraction parsing, structural validation and OTLP payload build
completed. The child then stopped in `Send Trace to Langfuse` because the imported
workflow did not have a usable saved Langfuse credential binding. The parent semantic
gate did not receive a completed child stage, so semantic parity was not evaluated.

## Grounding status

The child validation record reported:

- exact source traceability: `true`;
- unsupported claims: `0` at the structural evidence gate;
- groundedness: **100%**;
- semantic parity: not evaluated (`null`).

This remains an integration/observability failure. It is not an accepted canary pass,
because an authoritative Langfuse trace and the parent semantic-gate result are both
required. No rerun was performed.
