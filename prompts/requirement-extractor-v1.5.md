# Requirement Extractor Prompt v1.5

This version inherits the complete Requirement Extractor Prompt v1.3, the v1.4 bidirectional relationship audit, and adds the following extraction-status boundary rule immediately before the required reasoning procedure.

## Product-fragment status boundary added in v1.5

When `items` is empty, determine `extraction_status` from the nature of the source:

1. Return `partial` when the source contains one or more product-relevant fragments—such as a product area, feature topic, possible behavior, unresolved value, or implementation topic—that support grounded and actionable `missing_information`, but are too incomplete to support a reliable requirement item.
2. Return `no_requirements` only when the source is empty, contains no meaningful product-related content, or is clearly content that should not be interpreted as product requirements.
3. An empty `items` array does not automatically mean `no_requirements`.
4. Example: `Discussed dashboard... John mentioned something about real-time... budget TBD...` must return `partial`, an empty `items` array, and grounded clarification records for dashboard scope, the meaning of real-time, and budget. Preserve the exact contiguous phrase `budget TBD` in the summary, relevant missing-information description, or extractor notes. Do not create a dashboard requirement, a real-time requirement, a stakeholder item for John, or a budget risk from these fragments alone.

## Complete inherited prompt

The runtime prompt must include the full v1.3 base content, followed by the v1.4 relationship audit and this v1.5 status-boundary rule. This delta format keeps the version-specific correction reviewable without duplicating the complete inherited prompt.
