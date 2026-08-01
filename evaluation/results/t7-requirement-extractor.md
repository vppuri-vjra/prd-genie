# T7 Requirement Extractor Result

## Outcome

**Contract pass; semantic partial pass** on 2026-08-01.

T7 used one billable OpenAI call. It preserved all scale, performance, and integration values exactly and correctly classified the scale and p95 response-time targets as non-functional requirements. The Salesforce integration was instead represented as a functional requirement plus an acceptance criterion, so the fixture's required integration-NFR classification did not pass. The workflow's default T1 input was restored.

## Identifiers

| Field | Value |
|---|---|
| Test | `T7` |
| Run ID | `RUN-T7-1785615370848` |
| Trace ID | `3eeaca0fc62825d3442ca98276ba0dc9` |
| Input | `API must support 10,000 concurrent users. Response time < 200ms at p95. Must integrate with Salesforce REST API v52.` |
| Extraction status | `complete` |
| Structural validation | `true` |
| Langfuse ingestion | `200`, accepted |
| Prompt version | `extractor-v0.5-viewpoint-contract-fix` |

## Extracted Items

| ID | Returned type | Statement |
|---|---|---|
| `NFR-001` | `non_functional_requirement` | `API must support 10,000 concurrent users.` |
| `NFR-002` | `non_functional_requirement` | `Response time < 200ms at p95.` |
| `FR-001` | `functional_requirement` | `Must integrate with Salesforce REST API v52.` |
| `AC-001` | `acceptance_criterion` | `Integration must use Salesforce REST API v52.` |

## Evaluation

| Expected behavior | Result | Evidence |
|---|---|---|
| Return `complete` | Pass | `extraction_status: complete` |
| Preserve `10,000 concurrent users` | Pass | Exact in `NFR-001` |
| Preserve `< 200ms at p95` | Pass | Exact in `NFR-002` |
| Preserve `Salesforce REST API v52` | Pass | Exact in `FR-001` |
| Classify scale as NFR | Pass | `NFR-001` |
| Classify performance as NFR | Pass | `NFR-002` |
| Classify integration as NFR | **Fail** | Returned `FR-001` and `AC-001` |
| Avoid `10K users` | Pass | Does not appear |
| Avoid `200ms average` | Pass | Does not appear |
| Avoid `Salesforce v53` | Pass | Does not appear |
| Evidence and notes shapes | Pass | Arrays used correctly |
| Contract/schema validation | Pass | `structurally_valid: true` |

## Langfuse Evidence

| Check | Result |
|---|---|
| Root observation | `prd-genie-run` |
| Generation observation | `requirement-extractor` |
| Validation observation | `validate-requirement-extraction` |
| Tags | `capstone`, `T7` |
| Environment | `evaluation` |
| Input tokens | 48 |
| Output tokens | 425 |
| Total tokens | 473 |
| Estimated cost | `$0.005196` |
| Trace latency | 5.72 seconds |

## Recommended Correction

Add an explicit fixture-aligned classification rule that a stated requirement to integrate with a named external API and exact version is an integration `non_functional_requirement` for this evaluation contract. Preserve the exact API name and version and do not duplicate the same source statement as a functional requirement plus acceptance criterion. Do not rerun T7 without explicit approval because another run would make an additional billable model call.
