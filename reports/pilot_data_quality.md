# Pilot data-quality gate

Status: PASS WITH USER-APPROVED EXCEPTIONS — 26 courses are eligible; 18 use the manual-exception policy recorded in `data/experiment_course_cohort_20260714.csv`.

## Checks performed

- Strict courses require status `complete_review_and_gold_risk`; manual-exception courses may retain status `partial_review_annotation`.
- Evidence statistics include only rows with every required annotation field; excluded rows are counted in `pilot_course_metrics.csv`.
- Every complete annotation used in metrics joins to a raw comment by `(course_code, comment_id)`.
- Course-level gold-risk rows are audited separately; a `none` label is not an ASRR/CROR target.

## Non-blocking gold-support audit warnings

- COMP9021/COMP9021-R001: supporting IDs absent from pilot annotations: ['11']
- COMP2041/COMP2041-R001: supporting IDs absent from pilot annotations: ['434']
- COMP3121/COMP3121-R002: supporting IDs absent from pilot annotations: ['1118', '1194']
- COMP1521/COMP1521-R001: supporting IDs absent from pilot annotations: ['344']
- COMP4920/COMP4920-R001: multiple distinct risk labels share one gold-risk ID: ['content_too_shallow / 内容过浅', '期末线下手写论文高门槛与巨额写作量 / Unreasonable Handwritten Essay Exam with High Hurdle']
- COMP2511/COMP2511-R001: supporting IDs absent from pilot annotations: ['616']
- COMP2511/COMP2511-R002: supporting IDs absent from pilot annotations: ['616']
- COMP2521/COMP2521-R001: supporting IDs absent from pilot annotations: ['1033']
- COMP2521/COMP2521-R005: supporting IDs absent from pilot annotations: ['223']
