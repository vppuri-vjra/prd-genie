# T1 Requirement Extractor Rerun

## Run metadata

| Field | Value |
|---|---|
| Test | T1 |
| Run ID | `RUN-T1-1785540525021` |
| Executed | 2026-07-31T23:28:45.021Z |
| Workflow | `PRD Genie - Requirement Extractor v0.1` |
| Workflow ID | `Vvqr8ybO1jfB9UN7` |
| Model | `gpt-5.6-terra` |
| Reasoning effort | `medium` |
| Prompt state | Corrected contract instructions after initial T1 failure |

## Result

**Baseline outcome: Pass.** The final Parse and Validate Extraction node completed successfully with one output item and no validation alert.

| Check | Result | Observed value |
|---|---|---|
| Extraction status | Pass | `complete` |
| Functional requirement | Pass | `FR-001`, `functional_requirement` |
| Performance requirement | Pass | `NFR-001`, `non_functional_requirement`, under 2 seconds |
| Stakeholder | Pass | `STK-001`, `stakeholder`, Sarah |
| Deadline | Pass | `DDL-001`, `deadline`, Q3 |
| Evidence grounding | Pass | Each item contains an exact source quote |
| Confidence contract | Pass | Numeric `1` for each item |
| Contradictions | Pass | Empty array |
| Unsupported requirements | Pass | None observed |

The model also produced one grounded missing-information record, `MISS-001`, asking which year and calendar dates define Q3. This does not modify or resolve the stated deadline.

## Learning from the baseline

The first run demonstrated accurate semantic extraction but failed deterministic validation because the abbreviated live prompt did not fully enumerate schema values. Adding exact status enums, ID formats, item-type values, numeric confidence, and missing-information conventions corrected the issue on the next run. This demonstrates the value of typed contracts and deterministic validation between agents.

## Next action

Connect Langfuse tracing before expanding execution to T2-T10 so later runs capture model, prompt, timing, token, error, and evaluation evidence consistently.
