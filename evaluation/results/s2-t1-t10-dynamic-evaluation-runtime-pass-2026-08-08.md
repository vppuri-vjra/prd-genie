# S2 Dynamic T1–T10 Evaluation Runtime Pass

- Workflow: `S2_ Dynamic T1-T10 Google Drive Evaluation Orchestrator v0.1`
- Workflow ID: `yF1xQLKZyNyrpaT9`
- Lifecycle: inactive and unpublished
- Accepted execution: `9872`
- Execution result: succeeded
- Duration: `1m 4.815s`
- Evaluated release: `S2 dynamic bidirectional traceability`
- S2 Requirement Extractor workflow: `IiXGaUC7gCHwZmzI`
- Test result: `10/10 passed`
- Groundedness: `100%`
- Unsupported claims: `0`
- Accepted Langfuse traces: `10/10`

## Runtime input and evaluation boundary

The workflow reads the approved T1–T10 control bundle from the Google Drive Evaluation Controls folder at runtime. It discards the bundle's prerecorded `actual`, `metadata`, and `evaluation` objects and retains only each approved fixture and its ground-truth expectations. Each fixture is then sent through a fresh execution of the published S2 Requirement Extractor.

Absence-based `missing_information` records without model-emitted evidence are deterministically normalized to cite the complete, exact evaluation input. All evidence is then checked against the source input before the fail-closed 10-of-10 consolidation gate.

## Delivered artifacts

The accepted execution uploaded two files to Google Drive folder `13bPMdqA4lc9EsXwcQeHaPm3ABmfStI8A`:

- JSON: `s2-t1-t10-evaluation-2026-08-09T02-30-49-259Z.json` (`1IICnuToIgoWIckQudEjEIyTRiKODcUlE`)
- Markdown: `s2-t1-t10-evaluation-2026-08-09T02-30-49-259Z.md` (`1SCvfBCPuefqKasPgOnbm1Zj2VhMaf63c`)

Two preceding fail-closed executions (`9850` and `9861`) correctly rejected missing evidence before the deterministic normalization was completed. They are retained as audit evidence and were not used as accepted results.
