# Story Breakdown T12-S2 Evaluation Evidence

Date: 2026-08-11  
Mode: isolated evaluation hardening / shadow  
Production impact: none

## Outcome

The approved T12-S2 Story Breakdown contract passed all deterministic and independent Langfuse evaluations.

| Evaluation layer | Score | Result |
|---|---:|---|
| n8n deterministic controls | 10/10 | Pass |
| Langfuse Code Evaluator | 5/5 true | Pass |
| Langfuse LLM Faithfulness | 1.00 | Fully faithful |
| Langfuse LLM Hallucination | 0.00 | No hallucination detected |

## Langfuse Code Evaluator controls

| Control | Result |
|---|---|
| `story_lf_code_schema_valid` | True |
| `story_lf_code_item_coverage` | True |
| `story_lf_code_citation_coverage` | True |
| `story_lf_code_unsupported_zero` | True |
| `story_lf_code_evaluation_pass` | True |

## LLM evaluator usage

| Evaluator | Prompt tokens | Completion tokens | Total tokens | Cost |
|---|---:|---:|---:|---:|
| Faithfulness | 1,273 | 71 | 1,344 | $0.004033 |
| Hallucination | 1,372 | 79 | 1,451 | $0.004377 |
| **Total** | **2,645** | **150** | **2,795** | **$0.008410** |

## Runtime references

| Item | Reference |
|---|---|
| Evaluation case | `T12-S2` |
| Isolated Story Breakdown child | n8n `lNUVzUwSRdExt2UK` |
| Isolated evaluator | n8n `t6cQGS3KbqMhVr32` |
| Langfuse target trace | `217a4f140046c5e1633152f2cd2b0cda` |
| Langfuse target observation | `ad0b92ede3360ff1` |
| Code evaluator configuration | `22d80bac-251b-4079-bbcf-11e714ca7d1d` |
| Faithfulness configuration | `8456cb98-32e1-4a40-8e2d-57008e1dfb5d` |
| Hallucination configuration | `5ff7c228-5452-4b2d-a7c4-2a479d9900be` |

Langfuse trace: https://us.cloud.langfuse.com/project/cms9sudes0u9rad0h4fvs3r6n/traces/217a4f140046c5e1633152f2cd2b0cda?traceTab=scores

## Contract summary

| Approved PRD item | Story Breakdown mapping |
|---|---|
| FR-001 report filtering | `EPIC-001 / FEAT-001 / US-001 / AC-001` |
| NFR-001 under two seconds | `US-001 / AC-002` |
| STK-001 Sarah is PM | `GOV-001` stakeholder mapping |
| DDL-001 deadline Q3 | `GOV-002` deadline mapping |

Expected quantities: one epic, one feature, one story, two acceptance criteria, and two governance mappings. Coverage is 4/4, groundedness is 100%, and unsupported claims and orphans are zero.

## Release posture

- The Agreement Gate remains in shadow mode.
- The isolated workflows remain unpublished.
- No production n8n workflow was changed.
