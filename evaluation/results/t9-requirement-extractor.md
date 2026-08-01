# T9 Requirement Extractor Result

## Outcome

**Contract and official fixture pass; prompt-policy partial** on 2026-08-01.

T9 used one billable OpenAI call. The extractor returned `no_requirements`, an empty items array, an empty contradictions array, and a clear statement that no meaningful product requirements were provided. It generated no requirements or PRD content. The official T9 fixture therefore passes. The output left `missing_information` empty, so it did not include the clarification request required by the canonical prompt and shown in the pre-run expected example. The workflow's default T1 input was restored.

## Identifiers

| Field | Value |
|---|---|
| Test | `T9` |
| Run ID | `RUN-T9-1785617421456` |
| Trace ID | `326222fa59c41c3854d4e087a00fc1dd` |
| Input | `Meeting happened. Notes: none.` |
| Extraction status | `no_requirements` |
| Structural validation | `true` |
| Langfuse ingestion | `200`, accepted |
| Prompt version | `extractor-v0.6-integration-nfr-fix` |

## Evaluation

| Expected behavior | Result | Evidence |
|---|---|---|
| Return `no_requirements` | Pass | Exact status returned |
| Return empty items | Pass | `items: []` |
| State no requirements are extractable | Pass | Summary states no meaningful product requirements were provided |
| Avoid generated requirements | Pass | No items generated |
| Avoid generated PRD content | Pass | None generated |
| Return empty contradictions | Pass | `contradictions: []` |
| Use array-shaped notes | Pass | `extractor_notes` is an array |
| Include a source-content clarification request | **Gap** | `missing_information` is empty |
| Contract/schema validation | Pass | `structurally_valid: true` |

The clarification-request gap does not fail the official T9 fixture, whose required behaviors are an empty items array and an explicit no-requirements statement. It does differ from the canonical prompt's stronger refusal behavior and the expected JSON reviewed before execution.

## Langfuse Evidence

| Check | Result |
|---|---|
| Root observation | `prd-genie-run` |
| Generation observation | `requirement-extractor` |
| Validation observation | `validate-requirement-extraction` |
| Tags | `capstone`, `T9` |
| Environment | `evaluation` |
| Input tokens | 26 |
| Output tokens | 72 |
| Total tokens | 98 |
| Estimated cost | `$0.000916` |
| Trace latency | 2.13 seconds |

## Recommended Correction

Mirror the canonical refusal rule in the live compressed system prompt: for `no_requirements`, keep `items` empty and add one grounded `missing_information` record asking for a source that contains product requirements. Do not rerun T9 without explicit approval because another run would make an additional billable model call.

## Correction Applied

Approved and applied on 2026-08-01 without a model call. The canonical and live n8n prompts now require at least one grounded missing-information record for `no_requirements`, asking for a source that contains product requirements without inventing its contents. Langfuse prompt metadata was advanced to `extractor-v0.7-no-requirements-clarification-fix`. T9 was not rerun; the original result above remains the evaluation evidence.
