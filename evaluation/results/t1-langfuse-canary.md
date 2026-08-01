# T1 Langfuse Canary Result

## Outcome

**Passed** on 2026-07-31 (America/Los_Angeles).

The saved T1 extraction was sent from n8n to the Langfuse US project through the OTLP/HTTP traces endpoint. The trace appeared in Langfuse with the expected three-observation hierarchy. The trace-only retries reused saved workflow data and did not make another OpenAI call.

## Evidence

| Field | Result |
|---|---|
| n8n workflow | `PRD Genie - Requirement Extractor + Langfuse v0.2` |
| n8n workflow ID | `NXJLNsdf3N8HfrnQ` |
| Test | `T1` |
| Run ID | `RUN-T1-1785557630786` |
| Trace ID | `6509203ccdf044f9dd98047eda2c4a13` |
| Langfuse region | US |
| Extraction status | `complete` |
| Structural validation | `true` |
| Observations | 3 |
| Root observation | `prd-genie-run` (`chain`) |
| LLM observation | `requirement-extractor` (`generation`) |
| Validation observation | `validate-requirement-extraction` (`evaluator`) |
| Tags | `capstone`, `T1` |
| Environment | `evaluation` |

## Extracted Contract Items

- `FR-001` — functional filtering requirement
- `NFR-001` — results load in under two seconds
- `STK-001` — Sarah identified as PM
- `DDL-001` — Q3 deadline

## Issue and Resolution

The first ingestion attempts were rejected because the n8n Basic Auth credential did not contain the valid secret key for the current Langfuse PRD Genie project. The public key matched the project, but Langfuse returned `Authorization failed` during a strict minimal OTLP test.

A new Langfuse project API key pair was created and both values were replaced in the n8n credential `Langfuse US - PRD Genie`. The unchanged pinned T1 OTLP payload was then accepted and became visible in Langfuse.

## Workflow Hardening

The HTTP Request node is configured to:

- use Basic Auth with the Langfuse project keys;
- send to `https://us.cloud.langfuse.com/api/public/otel/v1/traces`;
- send `x-langfuse-ingestion-version: 4`;
- use `application/json`;
- treat non-2xx responses as errors; and
- read the response as text to handle an empty successful OTLP response safely.

Secrets are stored only in n8n credentials and are not present in this repository or result file.
