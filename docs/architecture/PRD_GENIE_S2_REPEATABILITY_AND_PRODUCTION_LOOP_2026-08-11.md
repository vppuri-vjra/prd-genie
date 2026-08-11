# PRD Genie S2 — Agreement Gate Repeatability and Production Loop

Status: **Positive canary and fail-closed verification complete; production-loop candidate remains unpublished with enforcement off**

## Three-run repeatability evidence

| Run | Trace | Langfuse Code | LLM faithfulness | LLM hallucination | Agreement | Approx. duration |
|---|---|---:|---:|---:|---:|---:|
| `RUN-S2-10682-16e7090e` | `600942eba05699d1de93859c9c9356f0` | Pass | 1.00 | 0.00 | Agreement | 2m39s |
| `RUN-S2-10690-16e7090e` | `43c163416197f56c13b1b82b84bcaa3a` | Pass | 1.00 | 0.03 | Agreement | 2m42s |
| `RUN-S2-10698-16e7090e` | `4c64471bf5ab7f79921d2ac1db09797a` | Pass | 1.00 | 0.01 | Agreement | 2m20s |

## Acceptance summary

- Three of three production-style shadow runs completed successfully.
- Every run returned all required Langfuse scores before the gate evaluated.
- Langfuse Code Evaluator passed in all three runs.
- LLM faithfulness remained at 1.00.
- LLM hallucination remained between 0.00 and 0.03, below the 0.10 threshold.
- The Agreement Gate returned `agreement`, `score_completeness = complete`, and `would_release = true` in all three runs.

## Production-loop candidate

Candidate file: `prd-genie-s2-main-orchestrator-v0.3.0-production-loop-candidate.json`

The candidate preserves the validated seven-stage connected pipeline and adds a versioned production-loop policy to the Agreement Gate:

1. Require deterministic controls, Langfuse Code Evaluator, LLM faithfulness, and LLM hallucination.
2. Treat missing or late required scores as incomplete evidence.
3. In enforced mode, release only after complete agreement.
4. In enforced mode, hold disagreements, failures, or timeouts for human review.
5. After an approved correction, rerun the affected stage and all downstream validation.
6. Require explicit owner approval before enabling enforcement.

The candidate defaults to `enforcement_enabled = false`. It therefore remains non-blocking and must stay unpublished until the production release review is approved.

### v0.3.1 branch candidate

`prd-genie-s2-main-orchestrator-v0.3.1-production-loop-branch-candidate.json` adds two explicit post-agreement routes:

- **Release Authorized Path** continues to Final Validator/export only when `production_loop.release_authorized = true`.
- **Hold for Human Review Path** terminates before Final Validator/export and records failed layers, review status, correction policy, and `release_blocked = true`.

The candidate still defaults to shadow mode. The current 45-second evaluator settlement delay is explicitly labeled as an initial wait; bounded retry polling remains the next hardening step and is not represented as complete.

### v0.3.2 bounded-polling candidate

`prd-genie-s2-main-orchestrator-v0.3.2-bounded-polling-candidate.json` replaces the fixed delay with a bounded loop:

- Poll every 10 seconds.
- Stop polling immediately when Code, faithfulness, and hallucination scores are all present.
- Permit no more than six attempts (approximately 60 seconds of evaluator settlement time).
- Route complete evidence to the Agreement Gate.
- Route exhausted polling to the Agreement Gate with `evaluation_poll.status = timeout`; enforced mode then blocks release and enters Human Review Hold.

The workflow remains unpublished and defaults to shadow/non-blocking mode.

## v0.3.2 positive-path canary

The imported v0.3.2 candidate (`GJQP84WazB8v1we1`) completed successfully on 11 August 2026.

| Evidence | Result |
|---|---|
| n8n run | `RUN-S2-10706-16e7090e` |
| Langfuse trace | `12704d89a7bc4e6cdbef327bf3f4d735` |
| Duration | 2m 12.039s |
| Polling | Complete on attempt 2 of 6 |
| Required correlated scores | 3/3 |
| Langfuse Code | Pass |
| LLM faithfulness | 1.00 |
| LLM hallucination | 0.00 |
| Deterministic controls | Pass; 100% groundedness and 0 unsupported claims |
| Agreement Gate | `agreement`; `would_release = true` |
| Release path | Authorized; Final Validator/export completed |
| Enforcement | Off; shadow mode |

The first score query was incomplete. The workflow waited 10 seconds, retried, found the complete evaluator set on attempt 2, and only then evaluated the Agreement Gate. This verifies that bounded polling replaces dependency on a fixed evaluator delay.

## Fail-closed negative-path verification

Test harness: `prd-genie-s2-agreement-gate-negative-path-test-harness-v0.1.json`
Live n8n workflow ID: `2qVsEQZLx5urZbK5`

The deterministic harness ran in n8n in 3.035 seconds and passed 5/5 assertions:

| Scenario | Expected route | Observed route | Gate decision | Result |
|---|---|---|---|---|
| Positive control | Release | Release | Agreement | Pass |
| Missing faithfulness score | Hold for human review | Hold for human review | Insufficient evidence | Pass |
| Polling timeout / all required scores missing | Hold for human review | Hold for human review | Insufficient evidence | Pass |
| Hallucination = 0.25, above 0.10 threshold | Hold for human review | Hold for human review | Disagreement | Pass |
| Langfuse Code evaluator failure | Hold for human review | Hold for human review | Disagreement | Pass |

The harness is isolated from production and makes no OpenAI or Langfuse calls.

## Promotion decision checklist

| Control | Status | Required action |
|---|---|---|
| Positive-path orchestration | Verified | None |
| Bounded evaluator polling | Verified | None |
| Missing-score and timeout handling | Verified in deterministic n8n harness | Retain fail-closed behavior |
| Hallucination threshold | Verified at `<= 0.10` | Owner confirms threshold |
| Faithfulness threshold | Verified at `>= 0.90` | Owner confirms threshold |
| Evaluator disagreement handling | Verified | Retain human-review hold |
| Human-review correction loop | Policy defined; owner: **Vipin Puri** | Define operational response time during production operations |
| Rollback | v0.3.2 shadow workflow retained; owner: **Vipin Puri** | Use v0.3.2 if the enforced parent must be withdrawn |
| Enforcement | **Off** | Enable only after explicit owner approval |
| Publishing | **Unpublished** | Publish only after release approval |

## v0.3.3 enforcement candidate

`prd-genie-s2-main-orchestrator-v0.3.3-enforcement-candidate.json` is a separate promotion candidate derived from the verified v0.3.2 graph.

- Defaults to enforced Agreement Gate behavior.
- Remains inactive and unpublished.
- Preserves bounded polling: 10-second intervals, maximum six attempts.
- Sends complete agreement to Release Authorized and Final Validator/export.
- Sends missing evidence, timeout, threshold failure, or evaluator disagreement to Human Review Hold.
- Preserves v0.3.2 as the shadow-mode rollback version.
- Requires explicit owner approval before import, execution, activation, or publication.

### v0.3.3 enforced positive canary

The imported enforcement candidate (`XOHG5SsdddTKjDWY`) completed one controlled production-style canary on 11 August 2026.

| Evidence | Result |
|---|---|
| n8n run | `RUN-S2-10715-16e7090e` |
| Langfuse trace | `7ba53f3aafdd8fec491b6a637d436ab6` |
| Duration | 2m 33.15s |
| Polling | Complete on attempt 2 of 6 |
| Required correlated scores | 3/3; seven correlated score records |
| Langfuse Code | Pass |
| LLM faithfulness | 1.00 |
| LLM hallucination | 0.02 |
| Deterministic controls | Pass; 100% groundedness, zero unsupported claims, zero PRD/delivery orphans |
| Agreement Gate mode | Enforced |
| Agreement decision | `agreement`; `would_release = true` |
| Release action | `release`; Release Authorized path selected |
| Final Validator/export | Completed successfully |

This confirms that the enforcement candidate waits for complete evaluator evidence and permits delivery only after every required layer passes. Publication remains a separate owner decision.

## Remaining production work

| Priority | Work | Completion condition |
|---:|---|---|
| 1 | Complete owner release review | Thresholds, reviewer ownership, latency, cost, rollback, and workflow lifecycle are approved. |
| 2 | Import and inspect v0.3.3 enforcement candidate | Confirm it is inactive, unpublished, and references the approved child workflows and credentials. |
| 3 | Complete final owner release review | Confirm publishing, rollback owner, and human-review ownership. |
| 4 | Publish production version | Only after explicit owner approval. |
| 5 | Archive superseded candidates | Only after the final workflow list and retention policy are approved. |
