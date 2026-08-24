# ADR-003: OpenAI Model Baseline for Requirement Extraction

- **Status:** Accepted
- **Date:** 2026-07-31

> **Final-state note — 2026-08-24:** The selected model configuration remains accepted. The credential blocker described in the original consequences was resolved before v0.3.8 acceptance. Formal runtime evidence is execution `11901` / `RUN-S2-11902-16e7090e`; see ADR-004 for the final submission topology and release baseline.

## Context

The Requirement Extractor must distinguish stated, suggested, ambiguous, and contradictory content; preserve exact values; produce strict JSON; and remain cost-conscious across baseline and regression runs.

Current OpenAI model guidance positions GPT-5.6 Sol for frontier capability, GPT-5.6 Terra for a balance of intelligence and cost, and GPT-5.6 Luna for cost-sensitive high-volume workloads. All three support structured outputs.

## Decision

| Setting | Value |
|---|---|
| Provider | OpenAI |
| Model | `gpt-5.6-terra` |
| Reasoning effort | `medium` |
| Preferred API | Responses API |
| Output mode | Strict structured JSON |
| Schema | `requirement-extraction.schema.json` |
| Evaluation set | T1-T10 |

## Rationale

- Terra is designed to balance intelligence and cost, which fits repeated extraction and evaluation runs.
- Medium reasoning is the documented balanced starting point and gives the model room to analyze ambiguity and contradictions.
- Structured outputs reduce parsing failures and enforce the existing stage contract.
- The Responses API is OpenAI's recommended API for reasoning workflows.

## Evaluation plan

Run T1-T10 with the fixed baseline and record quality, unsupported claims, exact-value preservation, latency, tokens, and cost. Test `gpt-5.6-sol` only if Terra fails cases after prompt-focused iteration. Consider a lower-cost or lower-reasoning configuration only after the quality release gate is met.

## Consequences

- The n8n workflow must expose the model ID and reasoning effort as configuration, not hide them inside prompts.
- If the installed n8n OpenAI node lacks the required API parameters or strict schema support, use an authenticated HTTP Request node rather than weakening the contract.
- At the time of this decision, execution depended on configuring the OpenAI credential in n8n. That prerequisite was subsequently satisfied and is no longer an active blocker.

## Sources

- OpenAI model guidance: https://developers.openai.com/api/docs/guides/latest-model
- GPT-5.6 Terra model page: https://developers.openai.com/api/docs/models/gpt-5.6-terra
