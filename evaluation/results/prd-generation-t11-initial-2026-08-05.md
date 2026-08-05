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

## Execution 3 — prompt v0.3 on clean workflow

| Field | Value |
|---|---|
| Clean n8n workflow ID | `NcqReOJGoKkyNh4S` |
| Canvas | 8 nodes; no duplicate suffixes |
| Prompt verified live | `prd-generator-v0.3-nested-schema-and-t11-mapping` |
| Outcome | Controlled failure at `Parse and Validate PRD` |

The model correctly produced document metadata, grounded Product Overview, business-goal TBD, user goal, FR-001, NFR-001, two acceptance-criterion concepts, empty unsupported sections, and the Q3 milestone. Two shape defects remained:

1. `success_metrics` was a sourced-text object rather than an array containing that object.
2. `AC-001` and `AC-002` omitted the required `feature` field.

The validator also exposed a robustness defect: after recording the wrong array type, it attempted iteration and raised a technical `TypeError` instead of the intended consolidated contract error. No PRD was accepted. Prompt v0.4 must correct only the two remaining shapes, and the validator must guard iteration behind `Array.isArray`.

## Execution 4 — prompt v0.4 core pass

| Field | Result |
|---|---|
| n8n execution | `8620` |
| Workflow | `NcqReOJGoKkyNh4S` |
| Execution status | `completed` |
| Contract status | `passed` |
| Groundedness | **100%** |
| Nested schema valid | `true` |
| Approved IDs only | `true` |
| Canonical T11 coverage | `true` |
| Template sections | `10` |
| Markdown rendered | Yes |
| Langfuse | Not yet enabled |

Prompt v0.4 corrected `success_metrics` to a one-element array and added `feature` to both acceptance criteria. The generated JSON is schema-compatible and matches the approved T11 facts and empty/TBD treatment.

The live Agent used prompt v0.4, but the separately loaded Trace Context still reported `prd-generator-v0.3-nested-schema-and-t11-mapping`. This does not alter the generated PRD, but it is a reproducibility metadata defect. Correct the Trace Context to `prd-generator-v0.4-array-and-feature-shape` and perform an unchanged release rerun before enabling Langfuse or promoting the workflow baseline.
