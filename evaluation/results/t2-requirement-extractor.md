# T2 Requirement Extractor Result

## Outcome

**Contract pass; semantic partial pass** on 2026-08-01.

T2 used one billable OpenAI call. A stale pinned T1 OTLP payload initially intercepted the downstream trace-building step. The pin was removed, and the saved T2 extraction was then traced without a second model call. The workflow's default T1 input was restored after the run.

## Identifiers

| Field | Value |
|---|---|
| Test | `T2` |
| Run ID | `RUN-T2-1785608475806` |
| Trace ID | `a0857ea498c09dd4c36fdf2c18ad0244` |
| Input | `We need better reporting. Something like what Competitor X has.` |
| Extraction status | `partial` |
| Structural validation | `true` |
| Langfuse ingestion | `200`, accepted |

## Evaluation

| Expected behavior | Result | Evidence |
|---|---|---|
| Preserve `Competitor X` | Pass | Preserved exactly in the summary and extracted evidence |
| Extract a functional reporting requirement | Pass | `FR-001`, better reporting |
| Flag the request as ambiguous/partial | Pass | `extraction_status: partial`; competitor comparison treated as non-specific |
| Identify missing metrics | Pass | Extractor notes identify missing metrics |
| Identify missing users | Pass | Extractor notes identify missing users |
| Identify missing format | **Fail** | Format was not explicitly identified |
| Avoid invented reporting requirements | Pass | No detailed reporting capability was invented |
| Avoid invented competitor capabilities | Pass | Competitor X capabilities were requested as missing information rather than fabricated |
| Evidence grounding | Pass | Extracted items retain source evidence |

The output included missing-information records for reporting scope and the unidentified Competitor X capabilities. It also noted that reporting features, metrics, users, and acceptance criteria were absent. The required missing `format` dimension was omitted, so T2 should not be counted as a full semantic pass yet.

## Langfuse Evidence

| Check | Result |
|---|---|
| Root observation | `prd-genie-run` |
| Generation observation | `requirement-extractor` |
| Validation observation | `validate-requirement-extraction` |
| Tags | `capstone`, `T2` |
| Environment | `evaluation` |
| Inferred input tokens | 30 |
| Inferred output tokens | 346 |
| Estimated cost | `$0.004212` |

## Recommended Correction

Strengthen the generic ambiguity rule so that, when relevant, the extractor checks for missing actors/users, scope, metrics or measures, output format, timing, and acceptance criteria without inventing values. A T2 rerun should only occur after explicit approval because it would make another billable model call.
