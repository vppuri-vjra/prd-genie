# Import and Test: Requirement Extractor v0.1

## Compatibility target

- n8n Cloud `2.31.5`
- Select an existing OpenAI credential after import (the live draft uses `OpenAI account 25`; no secret is stored in this repository)
- Workflow remains inactive until evaluation is complete

## Import

Import `prd-genie-requirement-extractor-v0.1.json` into the Personal project. After import:

1. Open `OpenAI - Extractor Model`.
2. Select the existing `OpenAI account 25` credential.
3. Confirm model expression `{{ 'gpt-5.6-terra' }}` and reasoning effort `medium`.
4. n8n Cloud `2.31.5` did not list Terra in its model selector, so the workflow intentionally uses expression mode with the exact model ID. Do not silently substitute a different model.
5. Save the workflow without publishing it.

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
- Langfuse tracing is not connected yet.
- The workflow is intentionally inactive and must not be published during initial testing.
