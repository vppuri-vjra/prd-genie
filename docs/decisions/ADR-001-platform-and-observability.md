# ADR-001: n8n Orchestration with Langfuse Observability

- **Status:** Accepted
- **Date:** 2026-07-31

## Context

PRD Genie requires a multi-agent workflow, documented orchestration, human review, observability, baseline evaluation, and an exportable implementation. The project owner has the most hands-on experience with n8n and prior project experience with Langflow and Langfuse.

## Decision

Use n8n for workflow orchestration and Langfuse for LLM observability and evaluation. Implement a sequential pipeline with a Gap Analyzer and a human approval checkpoint before PRD generation.

## Rationale

- n8n supports visible workflow orchestration, branching, approval gates, file handling, and JSON export.
- Existing n8n experience reduces delivery risk within the two-week capstone.
- Langfuse provides trace, prompt, latency, token, cost, and evaluation evidence required by the rubric.
- The sequential pipeline reflects the dependency chain from source extraction to approved PRD and stories.

## Consequences

- Langfuse tracing requires a deliberate integration because prompt management and full workflow tracing are separate concerns.
- Trace metadata and IDs must be designed before workflow implementation.
- Exported n8n JSON must be reviewed for credentials and environment-specific values before committing.

