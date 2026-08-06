# HA-R06 / T8 Human Review — Controlled Validation Failure

## Purpose

Verify that Human Approval rejects an ineligible gate before it can emit a route, build an audit trace, contact Langfuse, or authorize PRD generation.

## Controlled mutation

The canonical T8 upstream packet is unchanged except for `generation_gate.gate_status`, deliberately changed from `eligible_for_human_approval` to `generation_blocked`. The original packet hash and exact mutation are recorded in `input-packet.json`.

## Expected controls

- Validation fails at `Parse and Validate Human Approval`.
- The error identifies that HA-R06 is not eligible for Human Approval.
- No deterministic route is emitted.
- No PRD-generation path is eligible.
- No Langfuse ingestion is attempted because execution stops before trace construction.
- No model call occurs and token usage remains zero.

## Groundedness calculation

Every expected claim is derived from the recorded mutation, the Human Approval entry contract, and the workflow node order. Groundedness target: **100%**. A failed n8n execution is the required passing test outcome for this negative case.

## Runtime evidence

| Field | Observed result |
|---|---|
| Workflow | `PRD Genie - Human Approval v0.3` |
| Workflow ID | `hE3ekoftADwnQog2` |
| n8n execution | `9551` |
| Run ID | `RUN-T8-HA-R06-INVALID-GATE` |
| Controlled mutation | `generation_gate.gate_status: generation_blocked` |
| Failure node | `Parse and Validate Human Approval` |
| Error | `HA-R06 is not eligible for Human Approval.` |
| Executed nodes | Form trigger, packet builder, validator only |
| Route / PRD eligibility | None / `false` |
| Langfuse ingestion | Not attempted by design |
| Model call / tokens | `false / 0` |
| Groundedness | **100%** |
| Runtime result | **Passed negative case — 2026-08-06** |

Execution stopped before the router, trace builder, Langfuse request, and result recorder. The failed n8n status is the required successful outcome for HA-R06.
