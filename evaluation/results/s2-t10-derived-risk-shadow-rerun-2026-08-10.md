# S2 T10 Derived-Risk Shadow Rerun — 2026-08-10

## Scope

- Isolated extractor: `PRD Genie - S2 Evaluation Hardening Requirement Extractor Child v0.2`
- Live child workflow ID: `CNZIUbNBFEap9ioy`
- Shadow evaluator: `S2_ Evaluation-Hardening T1-T10 Evaluator v0.4`
- Evaluator workflow ID: `lNRM0vzmggdpAoJe`
- n8n execution: `10344`
- T10 Langfuse trace: `ee3cbb0e083b2f122a457dbd35abac25`
- Agreement Gate: shadow mode; no production release decision was changed

## T10 correction

The source-stated fact remains `ETA unknown`. The extractor may retain the useful delivery-risk interpretation only when it is conditional and explicitly identified as derived rather than source-stated.

Fresh T10 output:

- risk statement: `The unknown ETA for the new auth service may create delivery risk for SSO login.`
- status: `ambiguous`
- category: `Derived delivery risk`
- note: delivery impact is an inference from the stated dependency uncertainty

## Verified results

| Evaluation layer | Result |
|---|---|
| PRD Genie / n8n deterministic | Pass; 100% groundedness; 0 unsupported claims; no hallucination detected |
| Langfuse Code Evaluator | Pass; evidence grounded; exact value preserved; schema valid; 0 unsupported evidence strings |
| Langfuse LLM faithfulness | `0.88` |
| Langfuse LLM hallucination | `0.01` |
| Complete T1–T10 deterministic suite | `10/10` passed |

## Comparison with prior T10 run

| Metric | Before | After |
|---|---:|---:|
| LLM faithfulness | `0.75` | `0.88` |
| LLM hallucination | `0.08` | `0.01` |

The LLM judge accepted that the new output clearly labels delivery risk as a reasonable inference rather than a stated fact. Its faithfulness comment still notes that delivery risk is not directly present in the source, explaining why the score is `0.88` rather than `1.00`.

## Decision

Retain the derived risk because it is useful, conditional, grounded in the unknown dependency ETA, and explicitly separated from source-stated facts. Keep the Agreement Gate in shadow mode until the acceptance policy and Drive-controlled T10 ground-truth revision are synchronized and reviewed.

## Drive-controlled v1.2 verification

- Control bundle: `PRD-GENIE-S2-T1-T10-CONTROLS-V1.2`
- Case-payload SHA-256: `1b54cf7725ee321dccd53f9deb6b8f35feb968b8a2b74a0f9615dd0204432092`
- T10 adjudication: `T10-HUMAN-ADJUDICATION-2026-08-10`
- Final n8n execution: `10366`
- Final T10 trace: `e369ef62f324256e7c3defae5effb3db`
- n8n deterministic: `10/10`, 100% groundedness, 0 unsupported claims
- Langfuse Code Evaluator: pass
- Langfuse LLM faithfulness: `0.90`
- Langfuse LLM hallucination: `0.01`

The final extractor output retains the conditional derived risk and includes a grounded missing-information question for the dependency ETA. The Agreement Gate remains shadow-only.

## Unchanged stability reruns

| Run | n8n execution | T10 trace | Deterministic | Code Evaluator | Faithfulness | Hallucination |
|---:|---:|---|---|---|---:|---:|
| 1 | `10377` | `4bab4395cd7b9410cfea0cdcb7fc8f9f` | 10/10; 100% grounded; 0 unsupported | Pass | `0.80` | `0.03` |
| 2 | `10388` | `d2410ab3c96768d998a85888b9523e2e` | 10/10; 100% grounded; 0 unsupported | Pass | `0.86` | `0.08` |

Both unchanged repetitions meet the provisional T10 policy of faithfulness `>= 0.80` and hallucination `<= 0.10`. The observed semantic-score variation supports retaining shadow mode while the evaluation is extended to the other processing agents.
