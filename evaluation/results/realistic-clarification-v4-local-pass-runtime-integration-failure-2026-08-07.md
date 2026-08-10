# Realistic Clarification v4 — Local Pass / Runtime Integration Failure

## Authoritative decision

`DEC-2026-08-07-MOBILE-LAUNCH-001` requires responsive web access in the 2026-09-30 first production release. Desktop-first sequencing is permitted, but post-launch mobile fast-follow is not. Product Brief line 25 and Stakeholder Notes line 26 remain immutable audit evidence.

## Local acceptance

- Packet: `SP-REALISTIC-PB-MT-SN-CLAR-V4` / six sources.
- Original v3 packet and all five prior sources are byte-for-byte preserved.
- Deterministic classifications: churn alerting `deferred/non-blocking`; undefined AI `deferred/non-blocking`; churn prediction `deferred/non-blocking`; mobile responsiveness `resolved` for 2026-09-30.
- Gate expectation: `eligible_for_human_approval` / `human_review`.
- Schema, contract, citation, hash, supersession, negative, semantic-gate, normalization, and coverage-ledger validations passed.
- Groundedness: **100%**.
- Unsupported decisions/claims: **0**.

## Rejected n8n evidence

- Workflow: `PRD Genie - Realistic Clarification v4 Deterministic Gate Canary v0.8`.
- n8n workflow ID: `PhT3aEnSrbEJnlgE`.
- Executions `9700`–`9703` failed in the source adapter with `SyntaxError: Unexpected identifier 'source_id'` after the UI deployment malformed the inline packet edit.
- Requirement Extractor, Gap Analyzer, Generation Gate, Human Approval, PRD Generator, and Langfuse ingestion were not invoked.
- Runtime groundedness: **not evaluated**; no runtime acceptance is claimed.

## Defect classification

This is an n8n deployment/integration defect, not a grounding failure. The local canonical v4 artifacts remain accepted. The n8n workflow is not allowlisted and must not be used until its adapter is replaced by the exact locally generated export and a fresh end-to-end execution passes.

## Controlled manual-import recovery

- Exact export manually imported as workflow `mJRvWwPZrPgwQWwW` with six nodes and five connections.
- Requirement Extractor child link: `DJvhjvzsVF3EamEM`; Gap Analyzer child link: `wGBE80XMjD5rTKql`.
- Adapter-only execution `9704` passed syntax and emitted packet `SP-REALISTIC-PB-MT-SN-CLAR-V4`, run `RUN-REALISTIC-MULTI-SOURCE-V4`, source `SRC-REALISTIC-CLAR-MOBILE-001`, decision `DEC-2026-08-07-MOBILE-LAUNCH-001`, and mobile-source hash `sha256:390014408db99fa1f85d469d269c0819f002f63ab41ae7738b287fc3bcdbc883`.
- Full execution `9705` stopped in Requirement Extractor v1.9 input validation: `exactly three sources are required; source types do not match the selected production packet contract`.
- No model call, Gap Analysis, Langfuse ingestion, Human Approval, or PRD generation occurred.
- This is a Requirement Extractor input-contract integration defect. Runtime groundedness remains not evaluated; local groundedness remains **100%** with zero unsupported decisions/claims.
