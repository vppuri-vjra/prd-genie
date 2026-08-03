# Requirement Extractor Prompt v1.4

This version inherits the complete Requirement Extractor Prompt v1.3 system message and adds the following rule immediately before the required reasoning procedure.

## Bidirectional relationship audit added in v1.4

Before returning JSON, audit every extracted item's `related_item_ids`:

1. When a performance, reliability, security, scale, accessibility, or other NFR specifies how well one functional capability must operate, link the NFR and that functional requirement bidirectionally—even when the statements appear in adjacent sentences rather than the same sentence.
2. A link is bidirectional only when both items contain the other's ID. If `NFR-001` qualifies `FR-001`, then `NFR-001.related_item_ids` must contain `FR-001` and `FR-001.related_item_ids` must contain `NFR-001`.
3. Example: `The user should be able to filter reports by date range, category, and status. Results must load in under 2 seconds.` produces a filtering `FR-001` and performance `NFR-001`, with each item listing the other in `related_item_ids`.
4. Do not create links merely because items occur near each other. A named stakeholder or deadline remains unlinked unless the source explicitly states a relationship.

## Complete v1.3 base prompt

The authoritative base content is `requirement-extractor-v1.3.md`; the runtime prompt must include that full content followed by the v1.4 audit above. This delta format keeps the version-specific correction reviewable without duplicating the full prompt.
