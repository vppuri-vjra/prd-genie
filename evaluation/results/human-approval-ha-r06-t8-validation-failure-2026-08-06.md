# Human Approval HA-R06 / T8 — Controlled Validation Failure

## Result

| Field | Value |
|---|---|
| Date | 2026-08-06 |
| Workflow | `PRD Genie - Human Approval v0.3` |
| Workflow ID | `hE3ekoftADwnQog2` |
| n8n execution ID | `9551` |
| Case / source test | `HA-R06 / T8` |
| Run ID | `RUN-T8-HA-R06-INVALID-GATE` |
| Controlled mutation | `generation_gate.gate_status` changed to `generation_blocked` |
| Required outcome | Validation failure with no route |
| Observed failure node | `Parse and Validate Human Approval` |
| Observed error | `HA-R06 is not eligible for Human Approval.` |
| Router / trace / Langfuse nodes | Not executed |
| PRD generation eligible | `false` |
| Model call / token usage | No / `0` |
| Groundedness | **100%** |
| Overall result | **Passed negative case** |

The controlled invalid package stopped at the entry validator. No route, approval trace, Langfuse request, result record, or downstream generation was produced.
