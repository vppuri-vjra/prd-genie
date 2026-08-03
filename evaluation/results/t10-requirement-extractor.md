# T10 Requirement Extractor Result

## Outcome

**Initial semantic fail; corrected rerun pass** as of 2026-08-02.

T10 used one billable OpenAI call. The extractor correctly captured the dependency on the new authentication service, preserved `SSO login`, `new auth service`, and `Team Alpha`, and asked for the unknown ETA. However, it returned only a `dependency` item with `partial` status. The official fixture requires `complete` status plus `functional_requirement`, `dependency`, and `risk` items, including the exact value `ETA unknown`. The workflow's default T1 input was restored after execution.

The approved v0.8 correction was subsequently rerun using one additional billable call. The corrected output passes the contract and official semantic fixture. The original failed run remains below as the before evidence.

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

## Correction Applied

Approved and applied on 2026-08-02 without a model call. Canonical prompt v0.8 and the live n8n Requirement Extractor now require:

- Separate `functional_requirement` and linked `dependency` items when the source explicitly states both a capability and its prerequisite relationship.
- A grounded `risk` when an explicitly unknown ETA or comparable uncertainty can affect delivery.
- Preservation of the exact unknown wording.
- A clarification may supplement, but never replace, the risk.
- `complete` status when all stated requirements, dependencies, risks, and explicit uncertainties are captured and no separate material ambiguity or unresolved contradiction remains.

Prompt metadata was advanced to `extractor-v0.8-dependency-risk-fix`. The original failed trace remains the before evidence. At the time of correction, T10 had not yet been rerun; the subsequently approved rerun is documented below.

## Corrected Rerun

T10 was rerun on 2026-08-02 with prompt `extractor-v0.8-dependency-risk-fix` and passed.

| Field | Corrected value |
|---|---|
| Run ID | `RUN-T10-1785719384377` |
| Trace ID | `ca05ea0e1c143d6f1a9fe8e66fc8fe8a` |
| Extraction status | `complete` |
| Structural validation | `true` |
| Langfuse ingestion | `200`, accepted |
| Functional requirement | `FR-001`: Provide SSO login |
| Dependency | `DEP-001`: SSO login requires the new auth service being built by Team Alpha |
| Risk | `RSK-001`: The ETA for the new auth service is unknown |
| Exact ETA evidence | `ETA unknown.` |
| Contradictions | Empty |
| Missing information | Empty |
| Unsupported ETA or service status | None |

### Before-and-after comparison

| Evaluation check | v0.7 before | v0.8 after |
|---|---|---|
| Status | `partial` | `complete` |
| Functional requirement | Missing | `FR-001` pass |
| Dependency | `DEP-001` pass | `DEP-001` pass and linked to FR/risk |
| Unknown ETA risk | Missing; clarification only | `RSK-001` pass |
| Exact `ETA unknown` | Not returned in an item | Preserved verbatim in risk evidence |
| Item relationships | None | FR ↔ dependency ↔ risk linked through `related_item_ids` |
| Contract validation | Pass | Pass |
| Official fixture | Fail | Pass |

### Corrected Langfuse evidence

| Check | Result |
|---|---|
| Root observation | `prd-genie-run` |
| Generation observation | `requirement-extractor` |
| Validation observation | `validate-requirement-extraction` |
| Tags | `capstone`, `T10` |
| Environment | `evaluation` |
| Input tokens | 37 |
| Output tokens | 356 |
| Total tokens | 393 |
| Estimated cost | `$0.004346` |
| Trace latency | 7.94 seconds |

The workflow's default T1 input was restored after the corrected run. T10 is closed as a full contract and semantic pass.
