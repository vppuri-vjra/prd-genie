# Requirement Extractor v1.10 Versioned Input Contract — Local Pass

Date: 2026-08-07

## Defect isolated

n8n execution `9705` failed before model execution because Requirement Extractor Child v1.9 applied a legacy exactly-three-source production rule to the valid six-source v4 clarification packet. This is an integration/schema defect, not a grounding failure. No Langfuse trace was created and runtime groundedness was not evaluated.

## Local correction

- New isolated child export: `workflows/n8n/prd-genie-requirement-extractor-child-v1.10.json`
- SHA-256: `7ec895f64b3d58937a6e51eb30babc2afd1ed02ddc91927f4510ab7b15dd1a8f`
- New isolated canary export: `workflows/n8n/prd-genie-realistic-clarification-v4-canary-v0.9.json`
- Imported child workflow ID: `eDAl2qSb4ai17JZk` (saved, unpublished, 10-node topology verified)
- SHA-256 after child-link hydration: `9da6537383966abff5000157f2ed7187819a51e453d52e844877f494c68e25b8`

The new production contract requires exactly one immutable Product Brief, Meeting Transcript, and Stakeholder Notes base source, then permits zero or more authoritative `stakeholder_clarification` sources. It validates source uniqueness, provenance, SHA-256 hashes, decision coverage, citations, and supersessions. The evaluation producer remains unchanged, the three-source route remains accepted, and mixed evaluation/production inputs fail closed.

## Deterministic validation

Passed locally:

- unchanged evaluation-route regression;
- unchanged three-source production packet;
- valid v4 clarified packet;
- missing and duplicate base-source rejection;
- malformed/tampered clarification rejection;
- mixed-producer rejection;
- citation, decision, and supersession-loss rejection;
- full schema, contract, grounding, clarification, canonical-normalization, candidate-coverage, and semantic-consistency suites.

Local groundedness: **100%**. Unsupported claims/decisions: **0**.

## Runtime boundary

Native n8n import is now required for the isolated v0.9 canary. Runtime extraction, Gap Analysis, deterministic resolution, and Langfuse acceptance remain pending. Human Approval and PRD generation remain uninvoked.
