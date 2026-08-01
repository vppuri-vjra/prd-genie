# T10 Requirement Extractor Result

## Outcome

**Contract pass; semantic fail** on 2026-08-01.

T10 used one billable OpenAI call. The extractor correctly captured the dependency on the new authentication service, preserved `SSO login`, `new auth service`, and `Team Alpha`, and asked for the unknown ETA. However, it returned only a `dependency` item with `partial` status. The official fixture requires `complete` status plus `functional_requirement`, `dependency`, and `risk` items, including the exact value `ETA unknown`. The workflow's default T1 input was restored after execution.

## Identifiers

| Field | Value |
|---|---|
| Test | `T10` |
| Run ID | `RUN-T10-1785617952639` |
| Trace ID | `1eacb1ba799432413f48e6887c261c97` |
| Input | `SSO login requires the new auth service which is being built by Team Alpha. ETA unknown.` |
| Extraction status | `partial` |
| Structural validation | `true` |
| Langfuse ingestion | `200`, accepted |
| Prompt version | `extractor-v0.7-no-requirements-clarification-fix` |

## Evaluation

| Expected behavior | Result | Evidence |
|---|---|---|
| Return `complete` | **Fail** | Returned `partial` |
| Capture an SSO functional requirement | **Fail** | No `functional_requirement` item |
| Capture the auth-service dependency | Pass | `DEP-001` states that SSO login requires the new auth service being built by Team Alpha |
| Capture unknown ETA as a risk | **Fail** | No `risk` item; ETA represented only as missing information |
| Preserve `SSO login` | Pass | Present in dependency target and statement |
| Preserve `new auth service` | Pass | Present in dependency statement |
| Preserve `Team Alpha` | Pass | Present in dependency statement |
| Preserve exact `ETA unknown` | **Fail** | Meaning preserved, but exact phrase not returned in an item |
| Avoid invented ETA or service status | Pass | No unsupported value or status introduced |
| Contract/schema validation | Pass | `structurally_valid: true` |

## Actual Extraction

- One `dependency` item: SSO login depends on the new auth service being built by Team Alpha.
- One missing-information record: the ETA is unknown, with a clarification question asking for it.
- No contradictions and no extractor notes.

## Langfuse Evidence

| Check | Result |
|---|---|
| Root observation | `prd-genie-run` |
| Generation observation | `requirement-extractor` |
| Validation observation | `validate-requirement-extraction` |
| Tags | `capstone`, `T10` |
| Environment | `evaluation` |
| Input tokens | 40 |
| Output tokens | 220 |
| Total tokens | 260 |
| Estimated cost | `$0.00272` |
| Trace latency | 3.97 seconds |

## Recommended Correction

Add a focused dependency/risk rule to the extractor prompt: when a sentence states that a user capability requires another service, emit both the capability as a `functional_requirement` and the service relationship as a `dependency`. When the same source explicitly says an ETA is unknown, emit a grounded `risk` item preserving that wording; a clarification may also be included, but it must not replace the risk. Do not rerun T10 without explicit approval because another run would make an additional billable model call.
