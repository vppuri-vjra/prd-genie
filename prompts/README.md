# Agent Prompts

Prompts are versioned implementation artifacts. Each prompt file contains the system message, runtime input template, expected schema, and failure behavior.

| Prompt | Status | Output contract |
|---|---|---|
| `requirement-extractor-v0.1.md` | Superseded working file; retained for repository continuity | `schemas/requirement-extraction.schema.json` |
| `requirement-extractor-v0.8.md` | Current canonical prompt; dependency/risk correction verified by passing T10 rerun | `schemas/requirement-extraction.schema.json` |

Prompt versions should also be recorded in Langfuse and attached to every evaluation result.
