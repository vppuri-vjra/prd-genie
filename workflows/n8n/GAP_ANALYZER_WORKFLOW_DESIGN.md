# Gap Analyzer n8n Workflow Design

## Status

Approved design for workflow version `v0.1.0`; the promoted prompt baseline is `gap-analyzer-v1.0-missing-information-coverage`.

Implementation status: **Complete for the T1-T10 release baseline** in n8n workflow `xrtf52GK57IRI1NI`, named **PRD Genie - Gap Analyzer + Generation Gate v1.0**.

Validated recovery export: `workflows/n8n/prd-genie-gap-analyzer-generation-gate-v1.0.json` (11 nodes, 10 connections, inactive by default, credential references only; no embedded secrets).

## Purpose

Run the Gap Analyzer as a separately testable n8n workflow before connecting it to the full PRD Genie pipeline. The workflow consumes validated Requirement Extractor JSON, produces schema-valid Gap Analysis JSON, applies a deterministic generation gate, and records an observable Langfuse trace.

## Workflow

```text
Manual Trigger
→ Load Gap Analyzer Test Input
→ Validate Requirement Extraction Input
→ Create Gap Trace Context
→ Gap Analyzer Agent
→ Parse and Validate Gap Analysis
→ Deterministic Generation Gate
→ Build Langfuse Trace
→ Send Trace to Langfuse
→ Record Gap Analysis Result
```

## Node responsibilities

| # | Node | Responsibility |
|---|---|---|
| 1 | Manual Trigger | Start a controlled development or evaluation run. |
| 2 | Load Gap Analyzer Test Input | Load one approved Requirement Extractor output without adding a wrapper. |
| 3 | Validate Requirement Extraction Input | Reject input that does not conform to `schemas/requirement-extraction.schema.json`. |
| 4 | Create Gap Trace Context | Preserve `run_id` and attach test, workflow, prompt, environment, and trace metadata. |
| 5 | Gap Analyzer Agent | Apply the versioned Gap Analyzer prompt and return only the requested Gap Analysis object. |
| 6 | Parse and Validate Gap Analysis | Parse model output and validate it against `schemas/gap-analysis.schema.json`. |
| 7 | Deterministic Generation Gate | Verify the decision combination and convert it into a controlled routing outcome without another LLM call. |
| 8 | Build Langfuse Trace | Create the parent run and `gap-analyzer` generation observation payload, including input, output, model, latency, usage when available, and success or failure status. |
| 9 | Send Trace to Langfuse | Send the trace to the configured Langfuse US project. |
| 10 | Record Gap Analysis Result | Return and retain the final result required for evaluation and later pipeline integration. |

## Approved design decisions

| Decision | Approved approach | Basis |
|---|---|---|
| Initial deployment | Separate Gap Analyzer workflow | Allows isolated contract, prompt, trace, and ground-truth testing before pipeline integration. |
| Input contract | Direct Requirement Extraction JSON | Matches the approved Gap Analyzer contract and avoids duplicate `run_id` values. |
| Run identity | Preserve the extractor's `run_id` throughout | Required for end-to-end traceability and Langfuse correlation. |
| Model calls | One Gap Analyzer model call | The subsequent gate is deterministic and must not reinterpret the model result. |
| Gate authority | Validate and route from schema-valid decision fields | The analyzer recommends; deterministic code enforces consistency. |
| Human authority | Human approval still controls PRD generation | `generation_allowed: true` means eligible for review, not automatic approval. |
| Observability | Langfuse generation observation named `gap-analyzer` | Makes the model step distinct and auditable within the parent run. |
| Versioning | Workflow `v0.1.0`; prompt `gap-analyzer-v0.1` | Separates workflow and prompt changes for reproducible evaluation. |

## Deterministic gate rules

| Gap Analyzer decision | Gate result |
|---|---|
| `sufficient` + `true` + `proceed` | Eligible for human approval. |
| `partially_sufficient` + `true` + `proceed_with_tbd` | Eligible for human approval with explicit TBDs. |
| `insufficient` + `false` + `request_clarification` | Route to clarification; do not generate a PRD. |
| `insufficient` + `false` + `block_generation` | Block PRD generation. |
| Any inconsistent or schema-invalid combination | Fail validation and record the failure path. |

## Initial execution sequence

1. Run `GA-T1` to validate the sufficient/proceed path.
2. Run `GA-T2` to validate the insufficient/request-clarification path.
3. Compare both actual outputs with approved ground truth using `scripts/evaluate_gap_analysis.py`.
4. Confirm parent trace, `gap-analyzer` generation, token/usage capture when exposed, and failure-path visibility in Langfuse.
5. Run the remaining approved Gap Analyzer regression cases before connecting the workflow to PRD generation.

## Implementation checkpoint — 2026-08-03

The first four nodes are implemented and connected:

1. `When clicking ‘Execute workflow’` (Manual Trigger).
2. `Load Gap Analyzer Test Input`, containing the human-approved T1 canonical extraction.
3. `Validate Requirement Extraction Input`, performing deterministic contract checks before any model call.
4. `Create Gap Trace Context`, separating the unchanged extraction from approved execution and Langfuse metadata.

The connected four-node path completed successfully with one item and preserved `RUN-T1-GROUND-TRUTH`. The trace context records `GA-T1`, workflow version `0.1.0`, prompt version `gap-analyzer-v0.1`, the development environment, n8n execution/workflow identifiers, start time, and the `gap-analyzer` Langfuse observation name. An initial unconnected validator run correctly exercised the failure path by rejecting missing required fields; the node was then connected and the workflow rerun successfully.

Input groundedness: **100%**. The loader content exactly represents the approved T1 canonical extraction stored in `evaluation/ground-truth/requirement-extraction/t01/expected-output.json`.

Trace-context groundedness: **100% (9/9 metadata fields)**. Every field is inherited from the approved extraction or defined by the approved workflow design; no product requirement content is introduced.

## Gap Analyzer Agent checkpoint — 2026-08-03

`Gap Analyzer Agent` and `OpenAI - Gap Analyzer Model` are implemented and connected. The model configuration mirrors the proven Requirement Extractor setup: OpenAI account 25, `gpt-5.6-terra`, and medium reasoning effort. The approved `gap-analyzer-v0.1` rules are configured as the system message, and the user message passes the canonical extraction plus approved trace identifiers.

The first connected `GA-T1` model run completed successfully in 14.497 seconds using approximately 1,429 tokens. The raw result was fully source-grounded but did not agree with approved ground truth:

| Field | Actual | Approved ground truth |
|---|---|---|
| `information_sufficiency` | `partially_sufficient` | `sufficient` |
| `generation_allowed` | `false` | `true` |
| `recommended_action` | `request_clarification` | `proceed` |
| `gaps` | Persona and Q3-date gaps | Empty |

Actual-output groundedness: **100% (2/2 gap claims)** because both actual gaps trace to `MISS-001` or `MISS-002` and no new fact was invented. Canonical decision agreement: **0% (0/3 decision fields)**.

Required prompt correction before formal parsing: an extractor `missing_information` record must become a Gap Analyzer gap only when it materially affects faithful, grounded PRD generation. The agent must not automatically promote every extractor clarification into a blocking or reportable gap when the stated requirement and deadline can be preserved exactly without invention.

## Gap Analyzer v0.2 targeted rerun — 2026-08-03

The approved materiality-boundary correction was versioned as `gap-analyzer-v0.2-materiality-boundary`, applied to both the n8n system prompt and trace metadata, and rerun against unchanged `GA-T1` input.

The run completed successfully in 5.222 seconds using approximately 1,519 tokens. It returned `sufficient`, `generation_allowed: true`, `proceed`, and empty gap, contradiction, and risk arrays while preserving `RUN-T1-GROUND-TRUTH`.

- Groundedness: **100%**.
- Canonical decision agreement: **100% (3/3)**.
- Automated evaluator: **Pass (100.0%)**.

Prompt v0.2 is verified for targeted `GA-T1` but remains a candidate until the remaining approved Gap Analyzer cases pass an unchanged regression batch.

## Parse and Validate Gap Analysis checkpoint — 2026-08-03

`Parse and Validate Gap Analysis` is implemented and connected immediately after `Gap Analyzer Agent`. It deterministically parses the model response and rejects output that violates the approved contract. The validation covers:

- the exact top-level and nested fields in `schemas/gap-analysis.schema.json`;
- schema version, allowed decision values, and approved decision combinations;
- preservation of the same `run_id` across extraction, trace context, and Gap Analysis;
- ID formats, uniqueness, severity values, and array types;
- trace links from gaps, contradictions, and risks to known extraction IDs; and
- the rule that high or critical gaps or contradictions cannot permit generation.

The connected `GA-T1` execution passed and returned one validated item. The parser preserved the approved v0.2 result and recorded:

- `structurally_valid: true`;
- `decision_consistent: true`; and
- `traceability_valid: true`.

Validation groundedness: **100%**. Every check is derived from the approved Gap Analysis schema, approved decision table, extraction identifiers, and preserved run identity; the node does not add or reinterpret product requirements.

## Deterministic Generation Gate checkpoint — 2026-08-03

`Deterministic Generation Gate` is implemented and connected after `Parse and Validate Gap Analysis`. It performs no model call and routes only from the validated combination of `information_sufficiency`, `generation_allowed`, and `recommended_action`.

The gate supports these controlled outcomes:

| Validated decision | Gate status | Route | PRD eligible |
|---|---|---|---:|
| `sufficient` + `true` + `proceed` | `eligible_for_human_approval` | `human_review` | Yes |
| `partially_sufficient` + `true` + `proceed_with_tbd` | `eligible_with_tbd` | `human_review_with_tbd` | Yes |
| `partially_sufficient` + `false` + `request_clarification` | `clarification_required` | `clarification` | No |
| `insufficient` + `false` + `request_clarification` | `clarification_required` | `clarification` | No |
| `insufficient` + `false` + `block_generation` | `generation_blocked` | `blocked` | No |

Unsupported combinations fail rather than being guessed. An eligible result explicitly requires later human approval; the gate does not initiate PRD generation by itself.

The connected `GA-T1` rerun completed successfully as n8n execution `7246` and preserved `RUN-T1-GROUND-TRUTH`. Its deterministic result was:

- `gate_status: eligible_for_human_approval`;
- `route: human_review`;
- `prd_generation_eligible: true`;
- `requires_tbd: false`; and
- `human_approval_required: true`.

Gate groundedness: **100%**. The gate copies the validated decision fields, applies only the approved routing table, preserves run identity, and introduces no product claim or LLM interpretation.

## Langfuse observability checkpoint — 2026-08-03

`Build Langfuse OTLP Payload` and `Send Trace to Langfuse` are implemented and connected after the deterministic gate. The payload uses nanosecond timestamps represented as `BigInt` strings to avoid the timestamp precision defect previously found in the Requirement Extractor workflow.

The OTLP trace contains four observations under one parent trace:

| Observation | Langfuse type | Purpose |
|---|---|---|
| `prd-genie-gap-analysis-run` | Span | Parent run containing extraction input and final analyzed/gated output |
| `gap-analyzer` | Generation | The only model call, including prompt version, model, input and output |
| `validate-gap-analysis` | Span | Deterministic schema, decision and traceability validation |
| `deterministic-generation-gate` | Span | Deterministic routing result and source decision fields |

The sender uses the existing `Langfuse US - PRD Genie` Basic Auth credential, the US OTLP endpoint, and ingestion version `4`. The connected GA-T1 execution was accepted with `validKey: true` and produced Langfuse trace `bda605bd0ef08c537ffd3c7aaf6691d4`.

Langfuse verification showed:

- parent trace `prd-genie-gap-analysis-run`;
- generation observation `gap-analyzer`;
- validation and gate child spans;
- latency of approximately 3.54 seconds;
- 523 input tokens and 96 output tokens, 619 total; and
- recorded model cost of approximately $0.002198.

Observability groundedness: **100%**. Trace content is copied from the validated extraction, Gap Analysis, gate result and approved execution metadata. No product requirement is generated or modified during trace construction.

## Final result-recording checkpoint — 2026-08-03

`Record Gap Analysis Result` is implemented and connected after Langfuse ingestion. It confirms ingestion from either Langfuse's validated API-key response or its accepted `otel-ingestion-job` response, then returns one evaluation-ready execution record containing the validated Gap Analysis, deterministic gate, workflow/model metadata and Langfuse evidence.

The final end-to-end `GA-T1` run completed successfully as n8n execution `7282` and produced trace `76d44c23ccd385be8973435d7886aef2`. The recorded result confirms:

- `execution_status: completed`;
- `contract_status: passed`;
- `groundedness_percent: 100`;
- `information_sufficiency: sufficient`;
- `recommended_action: proceed`;
- `gate_status: eligible_for_human_approval`;
- `route: human_review`;
- `prd_generation_eligible: true`;
- `human_approval_required: true`; and
- Langfuse ingestion accepted and authenticated, job `3b2b605e-e187-436e-a4ec-2414fff515af`.

Result-recording groundedness: **100%**. The node copies approved workflow state and confirmed ingestion metadata; it adds no product fact and performs no model interpretation.

## GA-T2 clarification-path checkpoint — 2026-08-04

GA-T2 exercised the `insufficient / false / request_clarification` path using the corrected canonical T2 extraction. The test exposed and corrected an outdated parser lookup that still expected separate extraction arrays instead of canonical `items[]`. Parser severity validation was also reconciled with the authoritative schema values `low`, `medium`, `high`, and `blocking`.

Prompt iterations v0.3 and v0.4 corrected gap decomposition, exact nested fields, source traceability, material missing-information coverage, and the insufficient-versus-partially-sufficient decision boundary. v0.5 added the approved severity boundary between high missing dimensions and genuinely blocking absence or contradiction.

The final execution `7595` returned all four approved high-severity gaps, preserved `FR-001` plus `MISS-001` through `MISS-004`, and routed to clarification with PRD generation ineligible. Langfuse accepted trace `7c39feb2c77de8b7467cccbd37737208`. The independent evaluator passed 13/13 checks at **100% groundedness**.

Prompt v0.5 remains a candidate until the remaining approved Gap Analyzer cases pass unchanged.

## GA-T3 contradiction-path checkpoint — 2026-08-04

GA-T3 exercised an unresolved contradiction between five-second dashboard refresh and minimizing API calls. The unchanged v0.5 prompt preserved the contradiction but copied the extraction-only clarification field into the Gap Analysis object and returned `partially_sufficient`; strict validation stopped the workflow.

Prompt v0.6 enforced the exact four-field contradiction contract and the approved insufficiency boundary for a core blocking contradiction. Final execution `7600` returned `insufficient / false / request_clarification`, preserved `CTR-001` with `FR-001` and `NFR-001`, emitted no gap or risk, and routed to clarification with PRD generation ineligible.

Langfuse accepted trace `e277c0f2afa297cd37d33f243e5dc714`. Independent evaluation passed 13/13 checks at **100% groundedness**. Prompt v0.6 remains a candidate pending GA-T5, GA-T9, GA-T10, and the unchanged six-case regression.

## GA-T5 product-fragment checkpoint — 2026-08-04

GA-T5 exercised a partial extraction with no reliable items and three product-relevant missing-information records. The unchanged v0.6 run passed structural validation but omitted the explicit budget-TBD gap, generalized `dashboard_scope`, and understated the no-item real-time behavior gap. Independent evaluation failed at 76.92%.

Prompt v0.7 preserved all three distinct gaps and their exact source links. Final execution `7602` returned `blocking` dashboard scope, `blocking` real-time behavior, and `high` budget, routed to clarification, and kept PRD generation ineligible. No item, requirement, contradiction, risk, or budget value was invented.

Langfuse accepted trace `444278460f3941a14b0e58b9246b9f9e`. Independent evaluation passed 13/13 at **100% groundedness**. Prompt v0.7 remains a candidate pending GA-T9, GA-T10, and the unchanged six-case regression.

## GA-T9 no-requirements checkpoint — 2026-08-04

GA-T9 exercised the explicit no-meaningful-requirements path using the approved `no_requirements` extraction with an empty item array and `MISS-001` requesting substantive product material.

The test found two deterministic workflow-contract defects before final semantic verification. `Validate Requirement Extraction Input` used outdated statuses and rejected `no_requirements`; it now accepts exactly `complete`, `partial`, and `no_requirements`. `Create Gap Trace Context` contained stale hard-coded test ID `GA-T5`; it now derives `GA-T#` from the preserved `RUN-T#-...` identifier. These corrections change no product content and improve contract consistency and trace identity.

The v0.7 semantic run returned the approved blocked decision and preserved `MISS-001`, but copied extractor category `requirements_source` instead of the approved Gap Analysis category `requirements`. Independent evaluation failed at 84.62% (11/13). Prompt v0.8 added the bounded no-requirements category normalization.

Final execution `7608` returned `insufficient / false / block_generation`, one blocking `requirements` gap linked to `MISS-001`, no contradictions or risks, and gate result `generation_blocked / blocked`. PRD generation remained ineligible.

Langfuse accepted trace `25629f451f919250ca70c259f8712e3d`. Independent evaluation passed 13/13 at **100% groundedness**. Prompt v0.8 remains a candidate pending GA-T10 and the unchanged six-case regression.

## GA-T10 proceed-with-TBD checkpoint — 2026-08-04

GA-T10 exercised the `partially_sufficient / true / proceed_with_tbd` path using a grounded SSO requirement, linked authentication-service dependency, and explicit unknown-ETA risk.

The initial v0.8 output returned fully sufficient, omitted the ETA gap, and produced a risk without `source_risk_ids`. Strict parser validation stopped the workflow before gating and tracing. The preserved raw output scored 61.54% in independent evaluation.

Prompt v0.9 added the bounded dependency-uncertainty rule. Final execution `7611` returned one medium `dependency_eta` gap linked to `DEP-001` and `RSK-001`, preserved risk `RSK-001` with exact source-risk traceability, and introduced no ETA, mitigation, status, or delivery conclusion.

The deterministic gate returned `eligible_with_tbd / human_review_with_tbd`, marked PRD generation eligible, required the TBD, and retained mandatory human approval. Langfuse accepted trace `1afc44d756a9c866627facc805b95a7a`. Independent evaluation passed 13/13 at **100% groundedness**.

All six approved targeted Gap Analyzer cases passed, qualifying prompt v0.9 for the unchanged six-case release regression documented below.

## Gap Analyzer v0.9 release regression — 2026-08-04

The six human-approved cases GA-T1, GA-T2, GA-T3, GA-T5, GA-T9, and GA-T10 were rerun as one unchanged release batch under prompt `gap-analyzer-v0.9-dependency-uncertainty`, `gpt-5.6-terra`, medium reasoning, workflow `xrtf52GK57IRI1NI`, and the unchanged Gap Analysis schema and evaluator.

All six cases passed at **100% groundedness**. The batch verified sufficient/human-review, clarification, blocking, contradiction, no-item fragments, no-requirements, source-linked risk, and proceed-with-TBD routes. Every case passed strict contract and traceability validation and produced authenticated Langfuse US evidence.

Prompt v0.9 is therefore promoted as the Gap Analyzer baseline. Full evidence is recorded in `evaluation/results/gap-analysis-v0.9-release-gate-2026-08-04.md` and `evaluation/reports/gap-analysis-v0.9-regression/`.

## Gap Analyzer v1.0 complete release regression — 2026-08-04

After human approval extended canonical Gap Analysis coverage to all T1-T10 cases, the first GA-T6 execution under v0.9 returned the correct clarification route but omitted the approved deadline gap and understated the architecture decision-status severity. Independent evaluation failed at 84.62%.

Prompt v1.0 added bounded material missing-information coverage while retaining every v0.9 materiality and controlled-TBD exception. Targeted GA-T6 execution `7629` covered `MISS-001`, `MISS-002`, and `MISS-003` with approved severities, preserved the neutral contradiction, selected no architecture, added no risk, and passed 13/13 checks at 100%. Langfuse accepted trace `a7d21c4d84862669fdda7d9429488bf2`.

The unchanged complete GA-T1-T10 regression then ran under prompt `gap-analyzer-v1.0-missing-information-coverage`, `gpt-5.6-terra`, medium reasoning, workflow `xrtf52GK57IRI1NI`, and the unchanged schema and deterministic gate. All ten cases passed independent evaluation at 100% groundedness and produced authenticated Langfuse US traces. Prompt v1.0 is promoted as the complete Gap Analyzer baseline. Evidence is stored in `evaluation/results/gap-analysis-v1.0-release-gate-2026-08-04.md` and `evaluation/reports/gap-analysis-v1.0-regression/`.

## Groundedness

Design groundedness: **100% (8/8 decisions)**. Each approved decision is traceable to the Gap Analyzer contract, approved prompt, architecture/ADR, evaluation requirements, or the established Requirement Extractor observability pattern. This percentage assesses design traceability; actual workflow quality will be measured separately through execution and regression evaluation.
