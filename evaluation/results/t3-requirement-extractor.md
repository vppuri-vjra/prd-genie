# T3 Requirement Extractor Result

## Outcome

**Contract pass; semantic partial pass** on 2026-08-01.

T3 used one billable OpenAI call. The workflow detected and preserved the unresolved tension between frequent dashboard refreshes and minimizing API calls. It did not choose an implementation. Two semantic mismatches prevent a full pass: the extraction was marked `complete` rather than `partial`, and the auto-refresh behavior was classified as non-functional rather than functional. The workflow's default T1 input was restored after the run.

## Identifiers

| Field | Value |
|---|---|
| Test | `T3` |
| Run ID | `RUN-T3-1785610425384` |
| Trace ID | `4d1d08ec201a3faa552101b307f0a27c` |
| Input | `The dashboard should auto-refresh every 5 seconds. [Later in same meeting] Performance is critical, minimize API calls.` |
| Extraction status | `complete` |
| Structural validation | `true` |
| Langfuse ingestion | `200`, accepted |

## Evaluation

| Expected behavior | Result | Evidence |
|---|---|---|
| Preserve the five-second refresh requirement | Pass | Extracted exactly as `The dashboard should auto-refresh every 5 seconds.` |
| Preserve the API-call constraint | Pass | Extracted as a requirement to minimize API calls |
| Classify auto-refresh as functional | **Fail** | Labeled `NFR-001`, `non_functional_requirement` |
| Classify API-call minimization as non-functional | Pass | Labeled `NFR-002` |
| Detect the interaction/conflict | Pass | `CTR-001` links both extracted items |
| Leave the conflict unresolved | Pass | `resolution_status: unresolved` |
| Ask for clarification | Pass | Asked how to satisfy five-second refresh while minimizing API calls |
| Mark the extraction partial | **Fail** | Returned `extraction_status: complete` |
| Avoid choosing an implementation | Pass | No caching, polling, push, batching, or other solution was selected |
| Contract/schema validation | Pass | `structurally_valid: true` |

The contradiction record states: `Auto-refreshing the dashboard every 5 seconds may increase API calls while API calls are to be minimized.` This is an appropriate unresolved tension rather than an invented resolution.

## Langfuse Evidence

| Check | Result |
|---|---|
| Root observation | `prd-genie-run` |
| Generation observation | `requirement-extractor` |
| Validation observation | `validate-requirement-extraction` |
| Tags | `capstone`, `T3` |
| Environment | `evaluation` |
| Input tokens | 41 |
| Output tokens | 338 |
| Total tokens | 379 |
| Estimated cost | `$0.004138` |
| Trace latency | 5.13 seconds |

## Recommended Correction

Strengthen the extractor prompt with two generic rules:

1. Behavior the product must perform, such as automatic refresh, is functional even when it includes a timing value.
2. Any unresolved contradiction or clarification dependency requires `extraction_status: partial`.

Do not rerun T3 until the prompt correction is approved, because another run would make an additional billable model call.
