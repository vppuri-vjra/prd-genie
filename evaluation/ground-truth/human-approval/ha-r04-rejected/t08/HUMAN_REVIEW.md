# HA-R04 / T8 Human Review — Rejected

## Purpose

Verify that a human reviewer can reject an otherwise eligible package, stop progression, and prevent every upstream item from entering PRD generation without changing the grounded source content.

## Review boundary

The unchanged upstream package is `../../ha-r01-approved/t08/input-packet.json`. It contains six grounded items forming three exact persona-to-capability pairs. HA-R04 does not dispute or rewrite those items; it records the human authorization decision that none may progress in this run.

## Canonical decision

- `review_status`: `rejected`
- `approved_item_ids`: empty
- `rejected_item_ids`: `PER-001`, `FR-001`, `PER-002`, `FR-002`, `PER-003`, `FR-003`
- all five evidence checks: `true`
- `next_route`: `stopped`
- PRD Generator invocation: prohibited
- unsupported product claims: zero

## Prohibited outcomes

- Routing to either PRD-generation path.
- Omitting any of the six rejected upstream IDs.
- Reclassifying, rewriting, or replacing an upstream item.
- Adding a factual rationale not supplied by the reviewer.
- Treating rejection as a correction or clarification request.

## Groundedness calculation

All six item IDs, their three relationships, the stopped route, and the absence of downstream authorization are supported by the approved T8 package and Human Approval contract. Groundedness target: **100%**, with zero unsupported product claims.

## Runtime evidence

| Field | Observed result |
|---|---|
| Workflow | `PRD Genie - Human Approval v0.3` |
| Workflow ID | `hE3ekoftADwnQog2` |
| n8n execution | `9521` |
| Run ID | `RUN-T8-HA-R04-REJECTED` |
| Review status / route | `rejected / stopped` |
| Rejected IDs | All six canonical T8 IDs |
| PRD generation eligible | `false` |
| Contract / groundedness | `passed / 100%` |
| Model call / tokens | `false / 0` |
| Langfuse trace | `f28fc75639f5aeffa9525c8501c6a0b9` |
| Langfuse ingestion | Accepted — HTTP `200`, US region |
| Runtime result | **Passed — 2026-08-06** |

The execution matched the canonical decision exactly and stopped the package without creating replacement product content.
