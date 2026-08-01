# Import and Test: Requirement Extractor v0.1

## Compatibility target

- n8n Cloud `2.31.5`
- Select an existing OpenAI credential after import (the live draft uses `OpenAI account 25`; no secret is stored in this repository)
- Workflow remains inactive until evaluation is complete

## Import

Import `prd-genie-requirement-extractor-v0.2.json` into the Personal project. The v0.1 baseline remains available in Git history. After import:

1. Open `OpenAI - Extractor Model`.
2. Select the existing `OpenAI account 25` credential.
3. Confirm model expression `{{ 'gpt-5.6-terra' }}` and reasoning effort `medium`.
4. n8n Cloud `2.31.5` did not list Terra in its model selector, so the workflow intentionally uses expression mode with the exact model ID. Do not silently substitute a different model.
5. Save the workflow without publishing it.
6. Open `Send Trace to Langfuse` and select the existing `Langfuse US - PRD Genie` Basic Auth credential.
7. Confirm the endpoint is `https://us.cloud.langfuse.com/api/public/otel/v1/traces` and the `x-langfuse-ingestion-version` header is `4`.

## First test

The draft contains the exact T1 baseline input in `Normalize T1 Input`.

Expected extraction:

- `FR-001`: date range, category, and status filters
- `NFR-001`: under 2 seconds
- `STK-001`: Sarah
- `DDL-001`: Q3
- No unsupported requirements

Run manually, inspect `Parse and Validate Extraction`, and confirm the workflow returns `structurally_valid: true`. A successful structural result does not yet equal a baseline pass; semantic evaluation and Langfuse evidence still need to be added.

## Known limitations of v0.1

- The workflow exercises T1 only.
- Validation is a deterministic subset of the full repository JSON Schema because n8n Cloud Code nodes do not import repository dependencies.
- Schema-correction retry and structured error routing are not implemented yet.
- The workflow builds a v4-ready OTLP canary containing a root chain, extractor generation, and validation observation. Token and cost fields are not yet captured because the Basic LLM Chain does not expose them in its current output.
- The successful path is traced first; a dedicated failure-path trace will be added after the canary is verified.
- The workflow is intentionally inactive and must not be published during initial testing.
