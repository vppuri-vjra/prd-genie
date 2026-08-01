# T4 Requirement Extractor Result

## Outcome

**Contract pass; semantic partial pass** on 2026-08-01.

T4 used one billable OpenAI call. The output preserved the requested export formats and format-specific conditions without introducing XLSX or additional conditions. It failed the fixture's required acceptance-criterion classification: all three items were returned as functional requirements, and the two criterion statements were lightly rewritten instead of preserved verbatim as statements. The workflow's default T1 input was restored after the run.

## Identifiers

| Field | Value |
|---|---|
| Test | `T4` |
| Run ID | `RUN-T4-1785612043425` |
| Trace ID | `5afe3913965ca6bbf5177b3e67a2c6d3` |
| Input | `Users need to export reports as PDF and CSV. PDF must include company logo. CSV must preserve formulas.` |
| Extraction status | `complete` |
| Structural validation | `true` |
| Langfuse ingestion | `200`, accepted |
| Prompt version | `extractor-v0.2-classification-status-fix` |

## Extracted Items

| ID | Returned type | Statement |
|---|---|---|
| `FR-001` | `functional_requirement` | `Users need to export reports as PDF and CSV.` |
| `FR-002` | `functional_requirement` | `PDF exports must include company logo.` |
| `FR-003` | `functional_requirement` | `CSV exports must preserve formulas.` |

## Evaluation

| Expected behavior | Result | Evidence |
|---|---|---|
| Return `complete` | Pass | `extraction_status: complete` |
| Extract export behavior as functional | Pass | `FR-001` |
| Preserve `PDF` | Pass | Present in extracted output |
| Preserve `CSV` | Pass | Present in extracted output |
| Preserve `company logo` | Pass | Present in `FR-002` |
| Preserve `preserve formulas` | Pass | Present in `FR-003` |
| Represent PDF condition as acceptance criterion | **Fail** | Returned `FR-002`, not an `acceptance_criterion` |
| Represent CSV condition as acceptance criterion | **Fail** | Returned `FR-003`, not an `acceptance_criterion` |
| Preserve criterion statements without modification | **Fail** | Added `exports` to both criterion statements |
| Avoid additional acceptance criteria | Pass | None added |
| Avoid XLSX | Pass | `XLSX` does not appear |
| Avoid inferred priority | Pass | All priorities remained `Unspecified` |
| Contract/schema validation | Pass | `structurally_valid: true` |

## Langfuse Evidence

| Check | Result |
|---|---|
| Root observation | `prd-genie-run` |
| Generation observation | `requirement-extractor` |
| Validation observation | `validate-requirement-extraction` |
| Tags | `capstone`, `T4` |
| Environment | `evaluation` |
| Input tokens | 39 |
| Output tokens | 346 |
| Total tokens | 385 |
| Estimated cost | `$0.00423` |
| Trace latency | 3.65 seconds |

## Recommended Correction

Add a generic acceptance-criterion rule: when a statement gives a testable condition that qualifies an already extracted behavior, preserve it verbatim as a separate `acceptance_criterion` and link it to the functional requirement. Do not rerun T4 without explicit approval because another run would make an additional billable model call.

## Correction Applied

Approved and applied on 2026-08-01 without a model call. The canonical and live n8n prompts now require qualifying testable conditions to be preserved verbatim as separate acceptance criteria linked to their functional requirement. Langfuse prompt metadata was advanced to `extractor-v0.3-acceptance-criteria-fix`. T4 was not rerun; the original result above remains the evaluation evidence.
