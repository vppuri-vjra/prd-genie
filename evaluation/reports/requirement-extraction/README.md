# Requirement Extraction Evaluation Reports

The evaluator writes:

- `cases/t01/evaluation.json` and `evaluation.md` through T10.
- `latest-scorecard.json` for machine-readable aggregation.
- `latest-scorecard.md` for graders and human review.

Generated reports state the workflow and prompt version. Observability values remain zero or null unless supplied from the associated run; they must not be fabricated.

Run one case:

```bash
.venv/bin/python scripts/evaluate_extraction.py \
  --test T1 \
  --actual evaluation/actual/requirement-extraction/t01/output.json
```

Run T1-T10:

```bash
.venv/bin/python scripts/evaluate_extraction.py --all
```

Regression-test the evaluator against the approved canonical outputs:

```bash
.venv/bin/python scripts/evaluate_extraction.py --all --self-check-ground-truth
```

Primary checks are deterministic. If wording or an additional item cannot be safely resolved by deterministic rules, the result is `needs_review` rather than an LLM-generated judgment.
