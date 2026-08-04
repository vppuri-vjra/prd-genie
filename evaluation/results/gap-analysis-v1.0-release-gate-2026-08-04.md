# Gap Analyzer v1.0 T1-T10 Release Gate

Date: 2026-08-04

Prompt: `gap-analyzer-v1.0-missing-information-coverage`

Model: `gpt-5.6-terra`, medium reasoning

Workflow: `xrtf52GK57IRI1NI`

## Targeted correction gate

GA-T6 targeted execution `7629` passed 13/13 deterministic evaluator checks at **100% groundedness**. It covered all three approved missing-information records, preserved the neutral contradiction, selected no architecture, introduced no risk, and routed to clarification. Langfuse trace: `a7d21c4d84862669fdda7d9429488bf2`.

## Unchanged complete regression

| Test | Execution | Expected and actual decision | Gate/route | Evaluator | Langfuse trace |
|---|---:|---|---|---|---|
| GA-T1 | `7630` | `sufficient / proceed` | `eligible_for_human_approval / human_review` | Pass, 100% | `f0b80250cb7c13efb2e025e03c39de1e` |
| GA-T2 | `7631` | `insufficient / request_clarification` | `clarification_required / clarification` | Pass, 100% | `812557d70b66f3edae7d4b8703964150` |
| GA-T3 | `7632` | `insufficient / request_clarification` | `clarification_required / clarification` | Pass, 100% | `a901c5b3a01a2d1330ff30821d91cd43` |
| GA-T4 | `7633` | `sufficient / proceed` | `eligible_for_human_approval / human_review` | Pass, 100% | `692aab1bda05acad2118f9a83fd51e06` |
| GA-T5 | `7634` | `insufficient / request_clarification` | `clarification_required / clarification` | Pass, 100% | `22f26c6eb05af43e2e5c8f7143d323c1` |
| GA-T6 | `7635` | `insufficient / request_clarification` | `clarification_required / clarification` | Pass, 100% | `107c7e1b1c45e57ba3823ba90706a787` |
| GA-T7 | `7636` | `sufficient / proceed` | `eligible_for_human_approval / human_review` | Pass, 100% | `c1bb59f5ed2feab4c9a6a38dcfadf660` |
| GA-T8 | `7637` | `sufficient / proceed` | `eligible_for_human_approval / human_review` | Pass, 100% | `33831f84b07b18fc3cb1bc6c96d56901` |
| GA-T9 | `7638` | `insufficient / block_generation` | `generation_blocked / blocked` | Pass, 100% | `52466facd1650beec8cd0f0f42658f3d` |
| GA-T10 | `7639` | `partially_sufficient / proceed_with_tbd` | `eligible_with_tbd / human_review_with_tbd` | Pass, 100% | `d975a5fc176633dcc1e6dd4bb336804f` |

## Release decision

- Cases passed: **10/10**
- Average groundedness: **100%**
- Schema, decision, gap, contradiction, risk, severity, question, and traceability checks: Passed
- Langfuse ingestion: Accepted for all ten cases
- Prompt status: **Promoted baseline**

The complete Gap Analyzer baseline is ready for the human-approval checkpoint and eligible-case PRD Generator work.
