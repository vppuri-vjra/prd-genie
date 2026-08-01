# Failure-Path and Usage Observability

## Outcome

Failure-path tracing passed a controlled, non-billable canary on 2026-07-31. Token and cost visibility was also confirmed on the successful T1 generation.

## Failure-Path Canary

| Field | Result |
|---|---|
| Workflow | `PRD Genie - Failure Observer v0.1` |
| n8n workflow ID | `ydNRRELKulEfzCeo` |
| Trigger used | `Manual Canary Trigger` |
| Source workflow ID | `NXJLNsdf3N8HfrnQ` |
| Simulated failed node | `Validate Workflow Input` |
| Failure run ID | `CONTROLLED-FAILURE-1785559825080` |
| Langfuse trace ID | `e745629cb9472768ad0f5cf567e5ce2d` |
| Langfuse level | `ERROR` |
| Ingestion status | `200`, accepted |
| Environment | `evaluation` |
| Tags | `capstone`, `failure-path`, `FAILURE-CANARY` |
| OpenAI calls | None |

Langfuse displayed the expected safe diagnostic context:

- source workflow ID and name;
- execution/run ID and mode;
- failed node;
- error category;
- sanitized error message;
- environment, observer version, and failure tags.

The observer contains both an n8n `Error Trigger` for real production failures and a separate manual canary branch. The published observer is selected as the extractor workflow's Error Workflow. n8n invokes error workflows for production executions; the manual branch exists because a controlled manual test does not exercise the production Error Trigger path.

## T1 Token and Cost Visibility

Langfuse displays the following values for T1 generation observation `requirement-extractor`:

| Metric | Value |
|---|---:|
| Input tokens | 52 |
| Output tokens | 416 |
| Total tokens | 468 |
| Estimated cost | $0.005096 |
| Model | `gpt-5.6-terra` |

The n8n Basic LLM Chain output currently exposes the generated text but not provider-returned usage fields. Therefore, the T1 token and cost values are Langfuse-inferred from the generation's model, input, and output rather than explicitly copied from the OpenAI response.

This is sufficient for baseline cost observability and comparative evaluation. Provider-reported token counts remain a future accuracy enhancement if a later n8n node/version exposes usage metadata. Ingested provider usage should take precedence over inferred usage when available.

## Security and Operating Notes

- Langfuse keys remain in the n8n credential store.
- No credential value is present in the workflows, Git repository, or evidence files.
- Error messages are truncated before ingestion.
- The controlled failure includes no production or personal data.
- The main extractor remains inactive and unpublished while evaluation continues.
