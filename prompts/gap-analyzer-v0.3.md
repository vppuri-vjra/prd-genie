# Gap Analyzer Prompt v0.3

Status: Superseded diagnostic candidate; not eligible for promotion.

## Trigger

The first GA-T2 run exposed an outdated parser item lookup and a severity mismatch between the parser and the authoritative JSON Schema.

## Attempted correction

v0.3 added explicit nested-field traceability and material-gap decomposition rules. It also incorrectly prohibited the schema-valid `blocking` severity because the live parser was configured with `critical` instead.

## Verification

The run improved gap decomposition but failed structural validation by using the alias `affected_item_ids`, omitting the material users gap, and returning `partially_sufficient`. The severity change was later reversed after reconciling the parser with `schemas/gap-analysis.schema.json`.

