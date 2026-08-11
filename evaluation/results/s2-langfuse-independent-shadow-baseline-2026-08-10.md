# S2 Langfuse Independent Shadow Baseline

Date: 2026-08-10
Scope: S2 Requirement Extractor, T1–T10
Mode: Shadow; no production release impact
Judge model: `openai / gpt-5.6-terra`

## Completion

| Evaluator | Completed | Errors | Cost |
|---|---:|---:|---:|
| Langfuse Code Evaluator | 10/10 | 0 | $0.00 |
| `llm_faithfulness` | 10/10 | 0 | $0.064964 |
| `llm_hallucination` | 10/10 | 0 | $0.025040 |
| **Total** | **30 evaluator executions** | **0** | **$0.090004** |

## Scores

| Test | Trace ID | Code pass | LLM faithfulness | LLM hallucination |
|---|---|---:|---:|---:|
| T1 | `f1825529b659ce5f62976eabc889b60f` | true | 0.55 | 0.12 |
| T2 | `d0f3aa6961d0d9a87538b9702464eb5e` | false | 0.82 | 0.01 |
| T3 | `3f5f4137a2fecab3d35365caaa153175` | true | 0.50 | 0.02 |
| T4 | `947870b278731ef02f7e24dd64e7571c` | true | 0.80 | 0.03 |
| T5 | `49d77f52ac9770175b42533c4cf1352b` | false | 1.00 | 0.00 |
| T6 | `7f693f2503b51fcd738f2eb9d8a05e99` | true | 0.55 | 0.40 |
| T7 | `5ac59bb3f55c0e729eca1acbc3d7e0cb` | true | 1.00 | 0.00 |
| T8 | `871b5a30ef9033ba6b62e58bb617d6a0` | true | 0.90 | 0.00 |
| T9 | `84f1264d63454c75a83d9bfbd4c93ea8` | true | 0.78 | 0.00 |
| T10 | `8ba0d99c47c9e11f1c1cdd1d4f083b67` | true | 0.98 | 0.02 |
| **Aggregate** | 10 traces | **8/10** | **0.788 average** | **0.060 average** |

Higher faithfulness is better. Lower hallucination is better.

## LLM token usage

| Evaluator | Calls | Input tokens | Output tokens | Total tokens | Cost |
|---|---:|---:|---:|---:|---:|
| `llm_faithfulness` | 10 | 6,094 | 4,398 | 10,492 | $0.064964 |
| `llm_hallucination` | 10 | 7,084 | 906 | 7,990 | $0.025040 |
| **Total** | **20** | **13,178** | **5,304** | **18,482** | **$0.090004** |

The Code Evaluator used no LLM tokens.

## Calibration findings

1. **T2 exact-value failure:** `Competitor X` occurs in the source but is absent from the generated output.
2. **T5 false failure:** the Code Evaluator requires at least one evidence string for a `partial` result. T5 intentionally extracts no items from insufficient source material, so an empty evidence set should pass when there are no extracted claims.
3. **T6 semantic concern:** the extractor labels microservices and a single-page application as contradictory even though they can be compatible backend and frontend choices. The hallucination judge scored this case 0.40.
4. **Faithfulness calibration:** administrative metadata such as run IDs, source filenames, generated locations, and confidence values reduced several scores even when substantive product claims were supported.

## Promotion decision

Do not activate the Agreement Gate yet. Preserve this run as the immutable first independent baseline, correct the evaluator policy and isolated extractor behavior, then rerun T1–T10 under the same evaluator versions and mappings.

## Post-baseline hardening status

- Code Evaluator version 3 (`cmsnk60ao0idzad0krzyrwtbh`) fixes the T5 claim-free false failure.
- The unpublished extractor candidate `CNZIUbNBFEap9ioy` preserves `Competitor X` and keeps T2 `partial`; T2 and T5 passed the latest ground-truth rerun.
- The unpublished evaluator candidate `lNRM0vzmggdpAoJe` has its Langfuse Basic Auth binding refreshed.
- T6 was human-adjudicated on 2026-08-10. It remains `partial` for missing approval, deadline, and scope information, while the unsupported contradiction and cross-links were removed because microservices and a single-page app can coexist.
- Post-adjudication execution `10256` passed T1-T10 at 10/10. The full independent result is recorded in `evaluation/results/s2-langfuse-independent-shadow-hardening-2026-08-10.md`.
- No candidate workflow was published and no workflow was deleted.
