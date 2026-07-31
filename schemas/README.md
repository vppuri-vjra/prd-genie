# Schema Contracts

These JSON Schema Draft 2020-12 files are the machine-readable contracts between PRD Genie workflow stages.

| Schema | Producer | Consumer |
|---|---|---|
| `workflow-input.schema.json` | Input normalization | Requirement Extractor |
| `requirement-extraction.schema.json` | Requirement Extractor | Gap Analyzer and human review |
| `gap-analysis.schema.json` | Gap Analyzer | Generation gate |
| `human-review.schema.json` | Human approval step | PRD Generator |
| `prd-output.schema.json` | PRD Generator | Story Breakdown |
| `story-breakdown.schema.json` | Story Breakdown | Final validator/exporter |
| `evaluation-result.schema.json` | Evaluation workflow | Baseline report and Langfuse evidence |

All contracts use `schema_version: 1.0.0`, reject unknown properties, and constrain status fields to controlled values. Examples live under `examples/contracts/`.

Run `python3 scripts/validate_contracts.py` from the repository root to validate all schemas and examples.
