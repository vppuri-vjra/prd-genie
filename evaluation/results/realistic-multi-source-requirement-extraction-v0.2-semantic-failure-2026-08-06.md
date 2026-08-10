# Realistic Multi-Source Requirement Extraction v0.2 — Semantic Acceptance Failure

## Authoritative evidence

| Field | Value |
|---|---|
| Parent workflow | `PRD Genie - Realistic Multi-Source Requirement Extraction Canary v0.2` |
| Parent workflow ID | `CjFL8HuoCT57jbHT` |
| Child workflow | `PRD Genie - Requirement Extractor Child v1.3` |
| Child workflow ID | `AEbgqRpfeRMvv4va` |
| n8n execution | `9649` |
| Accepted Langfuse trace | `4bc3d8dff7266ed76f8f6aadf251aed1` |
| Prompt version | `extractor-v1.8-canonical-source-order` |
| Langfuse ingestion | Accepted |
| Parent semantic gate | **Failed** |
| Additional rerun | None |

## Acceptance result

The child completed extraction, exact-evidence validation and Langfuse transmission.
The recovered output contains **31 items, 3 contradictions and 7 missing-information
records**, compared with the approved **44 / 4 / 12** baseline.
The parent then rejected the output for:

- extracted-item, contradiction and missing-information count mismatches;
- multiple item type/status semantic mismatches;
- multiple approved-evidence mapping mismatches;
- at least one unsupported extra item;
- all four approved contradiction records not matching their approved membership; and
- eleven of twelve missing-information records not matching the approved category and
  evidence contract (`MISS-003` was the only missing-information ID not reported by the
  gate).

## Grounding distinction

The child structural evidence gate reported:

- exact source traceability: `true`;
- unsupported claims: `0` at that evidence-only gate;
- groundedness: **100%**.

The parent semantic gate still failed. Therefore the output is source-cited but not
semantically equivalent to the approved ground truth and is not accepted. Exact
citations do not cure wrong classification, wrong canonical identity, missing approved
coverage or unsupported extra records.

No retry or automatic prompt change was performed after execution `9649`.
