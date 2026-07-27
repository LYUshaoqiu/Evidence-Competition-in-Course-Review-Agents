# Data feasibility: Paper 1 pilot

- Q1 — sufficient clean data for the pilot: **OK**. The approved cohort contains 26 courses with raw-text joins and at least one complete review annotation.
- Q2 — annotation quality: **WARN**. The integrity gate passes, but `COMP9021-R001` cites comment ID 11, which is absent from this course's completed annotation set. Resolve or document this before confirmatory evaluation.
- Q3 — sample scale: **WARN**. 26 courses support the expanded internal experiment, but 18 have user-approved annotation exceptions. Use strict-only sensitivity analysis and avoid population-prevalence claims until the 38-course set is complete.
- Q4 — measurement value: **OK**. Review-level evidence/specificity fields and course-level critical/low-frequency gold risks directly support the proposed retention and omission metrics.

Overall: **usable_with_caveats** for the expanded Phase 0 baseline and an internal 26-course attack evaluation. Synthetic attack data, agent outputs, and independent summary audits are still required for the paper's causal claims.
