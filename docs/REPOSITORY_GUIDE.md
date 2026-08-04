# Repository Guide

## Purpose

This repository is organized for straightforward grading, reproducibility, and traceability. A reviewer should be able to understand the problem, inspect the design, import the workflow, review prompts and schemas, reproduce baseline cases, and verify results without searching through unrelated files.

## Folder responsibilities

| Folder | Contents |
|---|---|
| `docs/requirements/` | Business Requirements Document and project Product Requirements Document |
| `docs/architecture/` | Architecture diagram, orchestration rationale, agent responsibilities, human approval design, and tool rationale |
| `docs/planning/` | Four-iteration plan, compressed execution tracking, and delivery checkpoints |
| `docs/assignments/` | Q1 Ideation, Q2 Program Charter, Q3 Build write-up, and Q4 Reflection |
| `docs/decisions/` | Short architecture decision records for consequential design choices |
| `docs/submission/` | Final checklist, links, grader guide, and packaged submission notes |
| `workflows/n8n/` | Importable n8n workflow JSON exports and workflow-specific setup notes |
| `prompts/` | Versioned system prompts for each agent and validation step |
| `schemas/` | Machine-readable JSON schemas and supporting field documentation |
| `evaluation/fixtures/` | Baseline test inputs and expected checks, subject to source-sharing rules |
| `evaluation/ground-truth/` | Versioned, human-reviewed canonical expected outputs, allowed variations, and prohibited claims |
| `evaluation/results/` | Baseline summary and per-run outputs |
| `evaluation/scorecards/` | Evaluation rubric, automated checks, and reviewer scorecards |
| `evaluation/END_TO_END_TEST_TRACEABILITY_MATRIX.md` | Central T1-T10 progression, eligibility, evaluator, and observability evidence dashboard |
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
- Use stable names for living foundation documents (`BRD.md`, `PRODUCT_PRD.md`, and `ARCHITECTURE_DESIGN.md`) and maintain version/status metadata inside each document.

## GitHub and Obsidian alignment

GitHub is the version-controlled source for implementation and submission artifacts. Core planning documents are mirrored into the Obsidian project folder using matching titles, versions, statuses, and substantive content. At each meaningful checkpoint:

1. Update the GitHub document.
2. Mirror the approved content into Obsidian.
3. Confirm both copies show the same version and last-updated date.
4. Commit and push the GitHub change.

Evaluation data, workflow exports, schemas, prompts, and code remain canonical in GitHub and may be summarized or linked from Obsidian rather than duplicated in full.

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
