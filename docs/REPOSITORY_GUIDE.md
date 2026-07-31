# Repository Guide

## Purpose

This repository is organized for straightforward grading, reproducibility, and traceability. A reviewer should be able to understand the problem, inspect the design, import the workflow, review prompts and schemas, reproduce baseline cases, and verify results without searching through unrelated files.

## Folder responsibilities

| Folder | Contents |
|---|---|
| `docs/architecture/` | Architecture diagram, orchestration rationale, agent responsibilities, human approval design, and tool rationale |
| `docs/assignments/` | Q1 Ideation, Q2 Program Charter, Q3 Build write-up, and Q4 Reflection |
| `docs/decisions/` | Short architecture decision records for consequential design choices |
| `docs/submission/` | Final checklist, links, grader guide, and packaged submission notes |
| `workflows/n8n/` | Importable n8n workflow JSON exports and workflow-specific setup notes |
| `prompts/` | Versioned system prompts for each agent and validation step |
| `schemas/` | Machine-readable JSON schemas and supporting field documentation |
| `evaluation/fixtures/` | Baseline test inputs and expected checks, subject to source-sharing rules |
| `evaluation/results/` | Baseline summary and per-run outputs |
| `evaluation/scorecards/` | Evaluation rubric, automated checks, and reviewer scorecards |
| `examples/inputs/` | Demonstration-safe example inputs |
| `examples/outputs/` | Corresponding extraction, PRD, and story outputs |
| `assets/diagrams/` | Source and exported architecture diagrams |
| `assets/screenshots/` | Workflow, execution, and observability screenshots |
| `demo/` | Demo plan, script, test sequence, and final video link |

## Naming conventions

- Use lowercase kebab-case for implementation artifacts: `requirement-extractor.schema.json`.
- Use stable test identifiers in evaluation files: `t01-extraction.json` through `t12-stories.json`.
- Include a version in workflow exports: `prd-genie-n8n-v0.1.json`.
- Keep prompt version history in Git; do not create files named `final-final`.
- Use relative Markdown links so navigation works on GitHub.

## Evidence standards

Every baseline case should include:

1. Test ID and exact input
2. Workflow and prompt version
3. Raw structured output
4. Expected elements
5. Prohibited behavior checks
6. Pass, fail, or needs-review result
7. Langfuse trace ID or link with secrets removed
8. Latency, token usage, and estimated cost
9. Reviewer notes where applicable

## Security and privacy

- Never commit API keys, n8n credentials, Langfuse secret keys, or unredacted private data.
- Inspect n8n exports before committing because some node parameters may contain identifiers or sample content.
- Use `.env.example` only to document required variable names.
- Redact account IDs, email addresses, and secret-bearing URLs from screenshots.

