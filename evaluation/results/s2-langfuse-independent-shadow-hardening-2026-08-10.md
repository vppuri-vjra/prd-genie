# S2 Langfuse Independent Shadow Hardening Result

Date: 2026-08-10  
n8n execution: `10300`
Extractor candidate: `CNZIUbNBFEap9ioy`  
Evaluator candidate: `lNRM0vzmggdpAoJe`  
Mode: Unpublished shadow

## Deterministic evaluation

The fresh S2 T1-T10 pipeline completed successfully: **10/10 passed**, **100% groundedness**, **0 unsupported claims**, and **10/10 Langfuse traces accepted**. Native deterministic scores were written to Langfuse.

## Independent Langfuse scores

| Test | Trace ID | Code pass | LLM faithfulness | LLM hallucination |
|---|---|---:|---:|---:|
| T1 | `cfbee7adf89e464f3d5b7ab5df6bdcd1` | true | 1.00 | 0.00 |
| T2 | `5c4fc53274333d1eb52100d413422fa7` | true | 1.00 | 0.00 |
| T3 | `d04a280c3131762cc2fd976bd55ca0d6` | true | 0.40 | 0.08 |
| T4 | `d6926d16c60391003edc23b6bd7cefb6` | true | 1.00 | 0.00 |
| T5 | `8dad926046c8e69c360ed88cf2d4d31c` | true | 1.00 | 0.00 |
| T6 | `ed93078d2fd4e7977fa7c8b36d2a578a` | true | 1.00 | 0.00 |
| T7 | `6e0ff0c42171e4c99233d34a0dbf1e2d` | true | 1.00 | 0.00 |
| T8 | `01be811c908df37c85c9d81fdba6961a` | true | 1.00 | 0.00 |
| T9 | `347a928ed7574e5e7f73185221a1840a` | true | 1.00 | 0.00 |
| T10 | `36ce470d3ba2cca7329444926b7237c7` | true | 1.00 | 0.00 |
| **Aggregate** | **10 traces** | **10/10** | **0.940 average** | **0.008 average** |

## T6 adjudication outcome

The reviewer confirmed that microservices and a single-page app can coexist. T6 remains `partial` because proposal approval status, the exact March deadline, and delivery scope remain unknown. The unsupported contradiction and constraint cross-links were removed.

This improved T6 hallucination from the first shadow baseline's `0.40` to `0.08`. Code evaluation passed, and the substantive Langfuse judge assessment no longer identifies the architecture interpretation as a contradiction hallucination.

## Promotion decision

Keep the agreement gate in shadow mode. The deterministic pipeline and Code Evaluator agree 10/10, and 9/10 cases meet both provisional LLM thresholds after separating evaluation inputs. The Code Evaluator receives the complete structured extraction. The two LLM judges receive the dedicated `requirement-extractor-semantic-evaluation` observation with the `substantive-v1` projection; administrative run and schema metadata remain on the auditable parent trace but are excluded from semantic scoring.

T3 is the sole threshold exception (`faithfulness 0.40`, `hallucination 0.08`). The faithfulness judge accepts both extracted requirements but does not believe the source itself establishes that five-second auto-refresh and minimizing API calls are contradictory. This is a substantive dataset-policy question, not an administrative-metadata artifact. Human adjudication is required before changing either the T3 ground truth or the extractor behavior.
