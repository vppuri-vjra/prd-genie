# n8n Requirement Extractor Mapping

## Initial workflow segment

```text
Manual Trigger / Form / Webhook
  -> Normalize Input
  -> Validate Workflow Input
  -> Requirement Extractor LLM
  -> Parse JSON
  -> Validate Requirement Extraction
  -> Success or Structured Error
```

## Node responsibilities

| Node | Responsibility | Contract |
|---|---|---|
| Trigger | Receive source content or baseline fixture | Raw input |
| Normalize Input | Create stable run metadata and normalized source envelope | `workflow-input.schema.json` |
| Validate Workflow Input | Reject missing or malformed input before an LLM call | `workflow-input.schema.json` |
| Requirement Extractor LLM | Apply prompt v0.1 and produce JSON only | `requirement-extraction.schema.json` |
| Parse JSON | Convert the model response into an n8n object | JSON syntax |
| Validate Requirement Extraction | Enforce the schema and grounding invariants | `requirement-extraction.schema.json` |
| Structured Error | Preserve run ID, stage, error type, and validation details | Workflow error record |

## Prompt variables

| Prompt variable | n8n value |
|---|---|
| `run_id` | Normalized input `run_id` |
| `source_name` | Normalized input `source_name` |
| `source_location` | `test_id` when present; otherwise document location metadata |
| `input_type` | Normalized input `input_type` |
| `source_text` | Normalized input `source_text` |

Use n8n expressions to map these values at implementation time. Do not hard-code baseline content into the prompt.

## Validation and retry behavior

1. Validate normalized input before calling the model.
2. Request structured JSON output using the schema when the selected model/node supports it.
3. Parse the response without silently repairing semantic content.
4. Validate against `requirement-extraction.schema.json`.
5. If invalid, retry once with concise schema errors plus the original prompt inputs.
6. If the retry fails, stop the branch and record the failure for Langfuse and evaluation.
7. Do not send invalid extraction data to the Gap Analyzer.

## Semantic checks beyond JSON Schema

- Every extracted item has verbatim evidence found in the source text.
- Exact-value strings expected by the evaluation fixture are preserved.
- No prohibited content appears.
- Contradiction records reference existing item IDs.
- `no_requirements` has an empty `items` array.
- No downstream generation occurs for an invalid extraction.
