# T6 Requirement Extractor Result

## Outcome

**Contract fail; semantic partial pass** on 2026-08-01.

T6 used one billable OpenAI call. The saved model response preserved all three stakeholder viewpoints, returned `partial`, avoided selecting an architecture, and captured the March deadline. The workflow stopped at `Parse and Validate Extraction` because every item's `evidence` was an object rather than the required array. `extractor_notes` was also a string rather than the schema's array. No success trace reached Langfuse, and no second model call was made. The workflow's default T1 input was restored.

## Identifiers

| Field | Value |
|---|---|
| Test | `T6` |
| Run ID | `RUN-T6-1785614685653` |
| Generated trace ID | `bf53aa54535811717a34c15de015110b` |
| Input | `Engineering wants microservices. Design wants single-page app. PM wants it shipped by March.` |
| Extraction status | `partial` |
| Prompt version | `extractor-v0.4-status-boundary-fix` |
| Workflow outcome | Failed at structural validation |
| Langfuse success trace | Not created |

## Saved Model Output Summary

| ID | Returned type | Statement |
|---|---|---|
| `STK-001` | `stakeholder` | `Engineering wants microservices.` |
| `STK-002` | `stakeholder` | `Design wants single-page app.` |
| `DDL-001` | `deadline` | `PM wants it shipped by March.` |

The response also created missing-information records asking whether the stakeholder preferences were approved, which year March refers to, and what product `it` refers to.

## Evaluation

| Expected behavior | Result | Evidence |
|---|---|---|
| Return `partial` | Pass | `extraction_status: partial` |
| Preserve Engineering and microservices | Pass | Preserved exactly in `STK-001` and evidence |
| Preserve Design and single-page app | Pass | Preserved exactly in `STK-002` and evidence |
| Preserve PM and March | Pass | Preserved exactly in `DDL-001` and evidence |
| Capture all three viewpoints separately | Pass | Three separate items |
| Capture architecture preferences as constraints | **Fail** | Returned `stakeholder`, not `constraint` |
| Capture March as deadline | Pass | `DDL-001` |
| Identify unresolved stakeholder tension | Partial | Asked whether proposals are approved, but did not explicitly record their relationship/tension |
| Avoid favoring a stakeholder | Pass | No viewpoint favored |
| Avoid choosing microservices | Pass | Not selected |
| Avoid choosing single-page app | Pass | Not selected |
| Evidence contract | **Fail** | Objects returned instead of arrays |
| Extractor-notes contract | **Fail** | String returned instead of array |

## Observability

The model call completed and its raw response remains visible in the n8n execution. Structural validation failed before the OTLP payload and Langfuse ingestion nodes. The automatic error observer did not add a new Langfuse failure span for this manual execution; the Langfuse project still showed only the earlier controlled failure canary. Token and cost figures are therefore unavailable for T6 from the current instrumentation.

## Recommended Corrections

1. State explicitly that `evidence` must always be a JSON array, even for one quote, and `extractor_notes` must always be an array.
2. Clarify that explicit stakeholder technology or architecture preferences should be represented as suggested `constraint` items while preserving the stakeholder in evidence.
3. Require a neutral unresolved relationship record when multiple stakeholder architecture preferences need reconciliation, without asserting that different system layers are inherently incompatible.

Do not rerun T6 without explicit approval because another run would make an additional billable model call.
