# Schema Contracts

These JSON Schema Draft 2020-12 files are the machine-readable contracts between PRD Genie workflow stages.

| Schema | Producer | Consumer |
|---|---|---|
| `workflow-input.schema.json` | Input normalization | Requirement Extractor |
| `source-packet.schema.json` | Multi-source ingestion/normalization | Requirement Extractor |
| `clarification-decisions.schema.json` | Stakeholder clarification capture | Requirement Extractor and clarification-resolution evaluator |
| `requirement-extraction.schema.json` | Requirement Extractor | Gap Analyzer and human review |
| `gap-analysis.schema.json` | Gap Analyzer | Generation gate |
| `human-review.schema.json` | Human approval step | PRD Generator |
| `prd-output.schema.json` | PRD Generator | Story Breakdown |
| `story-breakdown.schema.json` | Story Breakdown | Final validator/exporter |
| `evaluation-result.schema.json` | Evaluation workflow | Baseline report and Langfuse evidence |
| `orchestration-stage-result.schema.json` | Every connected child | Connected Orchestrator |

All contracts use `schema_version: 1.0.0`, reject unknown properties, and constrain status fields to controlled values. The source-packet contract additionally binds raw source text to SHA-256 hashes and exact line citations. Examples live under `examples/contracts/`; the controlled T1 multi-source packet lives under `evaluation/fixtures/multi-source/t1/`.

Run `python3 scripts/validate_contracts.py` from the repository root to validate all schemas and examples. Run `python3 scripts/validate_t1_multi_source_parity.py` for T1 PB+MT+SN integrity, parity and negative tests. Run `python3 scripts/validate_realistic_clarification_artifacts.py` for the dated realistic stakeholder decisions, v2 packet integrity, exact source citations, supersession and fail-closed mutation tests.
