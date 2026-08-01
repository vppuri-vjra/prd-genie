# T5 Requirement Extractor Result

## Outcome

**Contract pass; semantic partial pass** on 2026-08-01.

T5 used one billable OpenAI call. The extractor correctly refused to invent a dashboard scope, real-time behavior, or budget, returned no extracted items, and asked for the required clarifications. Its only fixture mismatch was `extraction_status: no_requirements` rather than the expected `partial`. The workflow's default T1 input was restored after the run.

## Identifiers

| Field | Value |
|---|---|
| Test | `T5` |
| Run ID | `RUN-T5-1785613282365` |
| Trace ID | `4581cbb1e21b8aab1813f58ab91739e7` |
| Input | `Discussed dashboard... John mentioned something about real-time... budget TBD...` |
| Extraction status | `no_requirements` |
| Structural validation | `true` |
| Langfuse ingestion | `200`, accepted |
| Prompt version | `extractor-v0.3-acceptance-criteria-fix` |

## Evaluation

| Expected behavior | Result | Evidence |
|---|---|---|
| Return `partial` | **Fail** | Returned `no_requirements` |
| Flag input as insufficient | Pass | Summary says no sufficiently specific requirement exists |
| Avoid extracting vague fragments as requirements | Pass | `items` is empty |
| Preserve `John` | Pass | Preserved in the source-grounded extractor note |
| Preserve `real-time` | Pass | Preserved in missing information and the extractor note |
| Preserve `budget TBD` | Pass | Preserved in the extractor note |
| Identify missing dashboard scope | Pass | `MISS-001` asks what dashboard capability was discussed |
| Identify missing real-time behavior | Pass | `MISS-001` asks what real-time means in context |
| Identify missing budget | Pass | `MISS-002` asks for the budget |
| Avoid invented dashboard scope | Pass | None invented |
| Avoid invented real-time behavior | Pass | None invented |
| Avoid invented budget | Pass | None invented |
| Contract/schema validation | Pass | `structurally_valid: true` |

Combining dashboard scope and real-time behavior in `MISS-001` is acceptable because both missing dimensions and their clarification needs are explicit. A separate `MISS-002` covers budget.

## Langfuse Evidence

| Check | Result |
|---|---|
| Root observation | `prd-genie-run` |
| Generation observation | `requirement-extractor` |
| Validation observation | `validate-requirement-extraction` |
| Tags | `capstone`, `T5` |
| Environment | `evaluation` |
| Input tokens | 35 |
| Output tokens | 181 |
| Total tokens | 216 |
| Estimated cost | `$0.002242` |
| Trace latency | 3.46 seconds |

## Recommended Correction

Clarify the status boundary: use `partial` when the source contains product-relevant fragments that can be structured into missing-information or clarification records, even if no reliable requirement item can yet be extracted. Reserve `no_requirements` for empty or genuinely non-requirement input. Do not rerun T5 without explicit approval because another run would make an additional billable model call.
