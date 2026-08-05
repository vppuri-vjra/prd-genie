# T11 PRD Generator Initial Executions — 2026-08-05

## Workflow

| Field | Value |
|---|---|
| Workflow | `PRD Genie - PRD Generator v0.1` |
| n8n workflow ID | `eQRkZR8t6VS4q1Xu` |
| Source package | Approved T1 / `HA-R01` |
| Ground-truth version | `0.1.0` |

## Execution 1 — prompt v0.1

The model returned a generic PRD structure rather than `prd-output.schema.json`. The deterministic parser stopped the workflow because required top-level arrays were absent. No invalid PRD was accepted.

## Execution 2 — prompt v0.2

The exact top-level correction allowed all workflow nodes to complete, but independent review found nested contract and canonical defects that the initial parser did not detect:

- document date and status used the TBD string instead of schema-valid operational metadata;
- sourced-text status used `approved` instead of `grounded` or `tbd`;
- Product Overview omitted approved FR and NFR content;
- the grounded user goal and success metric were omitted;
- both approved direct-restatement acceptance criteria were omitted; and
- timeline used sourced-text fields instead of `milestone`, `target_date`, `status`, and `source_requirement_ids`.

## Adjudication

| Measure | Result |
|---|---|
| Workflow execution | Completed on the second attempt |
| T11 contract result | **Fail** |
| Ground-truth agreement | **Fail** |
| Accepted as T11 baseline | **No** |
| Langfuse | Not yet enabled for this workflow |

The next correction must strengthen both the prompt and deterministic nested-schema validator. Ground truth remains unchanged.
