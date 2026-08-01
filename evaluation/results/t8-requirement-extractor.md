# T8 Requirement Extractor Result

## Outcome

**Contract and semantic pass** on 2026-08-01.

T8 used one billable OpenAI call. The extractor kept Admins, End users, and Auditors separate, created three persona items and three matching functional requirements, preserved each requested capability, and did not merge the personas into a generic user. The workflow's default T1 input was restored after the run.

## Identifiers

| Field | Value |
|---|---|
| Test | `T8` |
| Run ID | `RUN-T8-1785617146784` |
| Trace ID | `0773d9e9cbed86f174fcf30be8c42b10` |
| Input | `Admins need bulk user management. End users need a simplified view. Auditors need read-only access with full history.` |
| Extraction status | `complete` |
| Structural validation | `true` |
| Langfuse ingestion | `200`, accepted |
| Prompt version | `extractor-v0.6-integration-nfr-fix` |

## Evaluation

| Expected behavior | Result | Evidence |
|---|---|---|
| Return `complete` | Pass | `extraction_status: complete` |
| Keep Admins separate | Pass | `PER-001` plus matching functional requirement |
| Keep End users separate | Pass | `PER-002` plus matching functional requirement |
| Keep Auditors separate | Pass | `PER-003` plus matching functional requirement |
| Preserve `bulk user management` | Pass | Functional statement retains the exact capability |
| Preserve `simplified view` | Pass | Functional statement retains the exact capability |
| Preserve `read-only access with full history` | Pass | Functional statement retains the exact capability |
| Include persona items | Pass | Three `persona` items |
| Include functional requirements | Pass | Three `functional_requirement` items |
| Avoid generic merged user | Pass | No generic user persona created |
| Evidence and notes shapes | Pass | Arrays used correctly |
| Contract/schema validation | Pass | `structurally_valid: true` |

The functional statements were normalized into directive wording such as `Provide bulk user management for admins`, while the exact source wording remained in evidence. This preserves meaning without merging or inventing capabilities.

## Langfuse Evidence

| Check | Result |
|---|---|
| Root observation | `prd-genie-run` |
| Generation observation | `requirement-extractor` |
| Validation observation | `validate-requirement-extraction` |
| Tags | `capstone`, `T8` |
| Environment | `evaluation` |
| Input tokens | 43 |
| Output tokens | 582 |
| Total tokens | 625 |
| Estimated cost | `$0.00707` |
| Trace latency | 5.70 seconds |

No prompt correction is required for T8.
