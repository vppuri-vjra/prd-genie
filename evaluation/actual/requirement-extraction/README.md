# Actual Requirement Extraction Outputs

Place versioned n8n outputs under one directory per test:

```text
requirement-extraction/
  t01/output.json
  t02/output.json
  ...
  t10/output.json
```

Actual outputs are run evidence. Never overwrite a committed baseline result with a corrected rerun; use a versioned run directory when retaining multiple batches and point the evaluator at that root with `--actual-root`.

Do not place credentials, API keys, or full Langfuse exports containing secrets here.
