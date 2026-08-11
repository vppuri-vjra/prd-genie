# S2 Gap Analyzer Adjudicated Langfuse v2 Shadow Result

Evaluation date: 2026-08-11  
Mode: shadow  
Dataset: unchanged GA-T1–GA-T10  
Agreement Gate enforced: no

## Outcome

| Evaluation layer | Result |
|---|---:|
| PRD Genie / n8n deterministic | 10/10 passed |
| Unsupported claims | 0 |
| Langfuse traces accepted | 10/10 |
| Langfuse Code Evaluator | 10/10 new observations evaluated |
| LLM faithfulness v2 | 10/10 at 1.00; average 1.00 |
| LLM hallucination v2 | 10/10 at 0.00; average 0.00 |

## Evaluator policy

The v2 judges incorporate the governed GA-T1, GA-T3, GA-T4, GA-T6, GA-T8, and GA-T10 human adjudications. They distinguish:

- product and business facts that require source support;
- deterministic sufficiency, severity, and routing conclusions derived from the approved Gap Analyzer policy;
- mandatory human-review boundaries; and
- external feasibility commentary that must not be introduced as source-grounded evidence.

Active rules:

- `prd_genie_gap_analyzer_code_controls_v1`
- `ga_llm_faithfulness_v2` using `prd_genie_ga_faithfulness_policy_v2`
- `ga_llm_hallucination_v2` using `prd_genie_ga_hallucination_policy_v2`

Superseded v1 faithfulness and hallucination rules are inactive and retained for historical evidence.

## Trace receipts

| Case | Langfuse trace | Code | Faithfulness v2 | Hallucination v2 |
|---|---|---:|---:|---:|
| GA-T1 | `b5a2625eececf136b6537c000999a4ae` | Pass | 1.00 | 0.00 |
| GA-T2 | `59a3329fee407f0a7bf1c56d46d0ad73` | Pass | 1.00 | 0.00 |
| GA-T3 | `3fc618b2a35810be925dfbb19524ef22` | Pass | 1.00 | 0.00 |
| GA-T4 | `f497acb662250343488589d1269c5347` | Pass | 1.00 | 0.00 |
| GA-T5 | `4c07b8c4de11faa500a3e01882d3574d` | Pass | 1.00 | 0.00 |
| GA-T6 | `eaba1883a7828f20b14ab5f1423f58c6` | Pass | 1.00 | 0.00 |
| GA-T7 | `616a19837d2b2b05c7103d9a0e9cae20` | Pass | 1.00 | 0.00 |
| GA-T8 | `ec310bf5a934e544cb42f5674539e0cd` | Pass | 1.00 | 0.00 |
| GA-T9 | `2f26f60f95dd691677c2fb399c2a5d7f` | Pass | 1.00 | 0.00 |
| GA-T10 | `42ba8ac023a57eecb77202a65b95ec98` | Pass | 1.00 | 0.00 |

## Release interpretation

The unchanged canonical dataset passing after evaluator-policy refinement demonstrates that the earlier semantic disagreement was evaluator-policy misalignment rather than a ground-truth or Gap Analyzer defect. The Agreement Gate remains in shadow mode until its production acceptance thresholds and release authority are explicitly approved.
