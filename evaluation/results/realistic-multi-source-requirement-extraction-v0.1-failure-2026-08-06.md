# Realistic Multi-Source Requirement Extraction v0.1 — Acceptance Failure

## Evidence

| Field | Value |
|---|---|
| Parent workflow | `PRD Genie - Realistic Multi-Source Requirement Extraction Canary v0.1` |
| Parent workflow ID | `Me0VRHz1LQcXGU8q` |
| Child workflow | `PRD Genie - Requirement Extractor Child v1.2` |
| Child workflow ID | `E0jtyN9OItTGJ4Ck` |
| n8n execution | `9643` |
| Langfuse trace | `9b2c6137d836270f2b707d7f76f501b2` |
| Prompt version | `extractor-v1.7-realistic-multi-source` |
| Approved baseline SHA-256 | `aec924acffa6359bba0e0d73fdc4e5774db3e56a12c7ecff352e74b51a8111b8` |
| Result | **Failed; stopped without rerun** |

## Integration defect observed before the evaluated run

The first attempt stopped before model execution because the newly imported child
did not inherit the existing OpenAI credential binding. No extraction or Langfuse
trace was produced. The child was bound to the same approved project credential and
model configuration used by Child v1.1.1 before execution `9643` was started.

The n8n import UI also merged a parent import into the first temporary child workflow.
That mixed workflow was not executed. Clean, separate child and parent workflows were
created before execution `9643`.

## Acceptance failure in execution 9643

The child completed and preserved exact source identity, citations, locations and
hashes, but the parent ground-truth gate rejected the extraction. The gate reported:

- extracted-item count mismatch;
- contradiction-count mismatch;
- missing-information-count mismatch;
- semantic mismatch across the approved IDs;
- at least one unsupported extra item;
- contradiction and missing-information records that did not match the approved set.

The first visible divergence was deterministic: the model assigned `STK-001` to
Sarah, while the approved baseline assigns `STK-001` to Product Brief author Priya
Sharma and `STK-002` to Sarah. It then emitted the Business Analyst persona statement
again as `FR-001`, promoting a persona description into a functional requirement and
shifting later IDs.

## Grounding assessment

- Exact source-evidence traceability: **100%** at the child structural gate.
- Approved semantic parity: **failed**.
- Unsupported promoted/extra items: **at least 1**, so the required zero-unsupported-
  claim threshold was not met.
- Canary acceptance: **failed**.

No grounding percentage below 100 was fabricated: the source evidence remained exact,
but exact citations alone do not make an incorrectly classified or promoted item match
the approved ground truth.

## Stop decision

No automatic prompt correction or billable rerun was performed. The next change must
address stable canonical ID assignment, prevent persona-to-functional-requirement
duplication, and compare normalized semantic content without weakening the approved
counts, statuses, conflict preservation or source traceability requirements.
