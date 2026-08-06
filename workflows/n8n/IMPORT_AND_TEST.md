# Import and Test: Requirement Extractor v0.1

## Connected child wrappers

Import these files as new workflows; do not overwrite the validated standalone canvases:

1. `prd-genie-requirement-extractor-child-v1.0.json`
2. `prd-genie-gap-analyzer-child-v1.0.json`

After import, confirm the OpenAI and `Langfuse US - PRD Genie` credentials on each applicable node. The first node must read **When Executed by Parent Workflow**. These child workflows are invoked by the connected parent and do not use a Manual Trigger or fixed T-test loader.

The first canary will pass T1 through Requirement Extractor Child and Gap Analyzer Child. Both results must preserve the same `run_id` and `parent_trace_id`, report 100% groundedness, and the Gap Analyzer must route T1 to `human_approval`.

Import `prd-genie-connected-orchestrator-v0.1.json` after both child workflows are saved. Open its two Execute Sub-workflow nodes and select:

- `PRD Genie - Requirement Extractor Child v1.0`
- `PRD Genie - Gap Analyzer Child v1.0`

Save the parent and run it manually. The final node must return `execution_status: passed`, `next_route: human_approval`, `groundedness_percent: 100`, preserved run/trace checks, and accepted Langfuse ingestion for both child stages.

For the Human Approval increment, import these as new workflows:

1. `prd-genie-human-approval-checkpoint-child-v1.0.json`
2. `prd-genie-connected-orchestrator-v0.2.json`

In parent v0.2, select all three child workflows in their Execute Sub-workflow nodes. Run the parent. It must enter a waiting state at `Wait for Human Decision`; open the waiting form and submit the approved T1 decision with approved IDs `FR-001,NFR-001,STK-001,DDL-001` and all five verification boxes checked. After submission, the same execution must resume and end with `next_route: prd_generation`, 100% groundedness and accepted Human Approval Langfuse ingestion.

For the PRD Generation increment, import these as new workflows:

1. `prd-genie-prd-generator-child-v1.0.json`
2. `prd-genie-connected-orchestrator-v0.3.json`

In the PRD child, bind the existing OpenAI and `Langfuse US - PRD Genie` credentials. In parent v0.3, select all four child workflows in execution order: Requirement Extractor, Gap Analyzer, Human Approval Checkpoint v1.0.1, and PRD Generator Child v1.0. Run the parent and complete the new signed Human Approval form. The final node must report `current_stage: prd_generation`, `next_route: story_breakdown`, `groundedness_percent: 100`, a passed T11 contract, preserved run/parent trace IDs, and accepted PRD Langfuse ingestion.

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
