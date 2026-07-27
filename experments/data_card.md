# Data card: Paper 1 clean pilot

## Purpose

A controlled, human-annotated clean set for testing whether course-review agents retain decision-relevant course risks under synthetic signal dilution.

## Contents and unit of analysis

- Version: 20260714, 26 eligible courses and 220 complete review annotations used for evidence statistics.
- Cohort policy: 18 courses are included under the user-approved `complete_with_exceptions` policy; 42 incomplete/anomalous annotation rows are excluded from annotation-derived metrics.
- Annotations: 206 evidence units and 54 course-level gold risks.
- Review fields include first-hand experience, concrete evidence, specificity, low-evidence-general status, aspect/risk labels, sentiment, and evidence span.
- Gold-risk fields include severity, criticality, low-frequency status, and supporting comment IDs.

## Provenance and access

- Review text is joined from the local PostgreSQL plain-dump snapshots recorded in `run_manifest.md`.
- Annotation source: `回收标注/整理输出_20260714`.
- Access level: `verified_only`. Raw review text and user identifiers must not be published or copied into a public repository without an explicit privacy and licence review.
- Licence/provenance for public release: not yet established.

## Recommended use and limitations

- Use the approved cohort for descriptive clean-set analysis and the preregistered internal attack evaluation.
- Keep strict-complete and manual-exception cohorts identifiable in every result table; report a strict-only sensitivity analysis.
- One gold-risk support reference (`COMP9021-R001` → comment ID 11) is not present in the completed annotation set; see `quality_report.md`.
