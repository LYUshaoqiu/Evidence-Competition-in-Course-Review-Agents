# Paper 1 pilot experiment plan

## Scope and decision rule

This plan uses a 26-course approved cohort recorded in `data/experiment_course_cohort_20260714.csv`. Eight courses are strictly complete. Eighteen are user-approved as `complete_with_exceptions`: their 1–5 incomplete or anomalous review annotations are excluded from annotation-derived statistics, but do not block inclusion. The original status export remains unchanged as the provenance record.

The pilot asks whether low-evidence synthetic review mass causes course-review agents to omit clean-set gold risks. The clean corpus and human gold risks are fixed before synthetic generation and agent evaluation. Exploratory analyses are explicitly labelled as exploratory.

## Hypotheses

- H1: Clean course corpora contain concrete evidence and decision-relevant risks that are concentrated in a subset of reviews.
- H2: Increasing low-evidence synthetic-review mass decreases Authentic Signal Retention Rate (ASRR) and increases Critical Risk Omission Rate (CROR).
- H3: Half-true contextual pollution and targeted-risk suppression are at least as harmful as generic low-density flooding at the same final synthetic share.
- H4: Evidence-constrained generation improves but does not eliminate risk omission; retrieval-focused baselines improve evidence visibility but may not fully preserve gold risks.

## Phase 0 — clean pilot (execute now)

Inputs are the 20260714 deduplicated annotations plus the raw review corpus. Strict courses require complete review fields; manual-exception courses require at least one complete review annotation and a raw-comment join for every row used in metrics. Gold-risk-free courses are retained only for descriptive/negative-control analysis, never as ASRR/CROR denominators.

Outputs:

- Course-level descriptive statistics: evidence-unit density, review specificity, low-evidence share, first-hand share, evidence concentration HHI, aspect entropy, gold-risk counts, critical-risk counts, and low-frequency-risk counts.
- A data-quality report and input checksums.
- No agent outputs, dilution claims, p-values, or attack results.

Success criterion: the integrity gate passes under the versioned cohort policy and the clean baseline can be reproduced byte-for-byte from the checked input files.

## Phase 1 — synthetic attack corpus

For every course and attack family, create synthetic reviews using a fixed generation prompt version and retain the model identifier, seed, generated text, and screening decisions. Do not write a course-specific fabricated event, numeric assessment detail, named staff member, or direct contradiction of authentic evidence. Human audit must confirm `low_evidence_general=yes` and reject duplicates, prompt injections, abuse, advertising, and specific unsupported claims.

Attack families:

1. Benign low-density flooding: mild, course-relevant, general comments with no concrete incident.
2. Half-true contextual pollution: general comments using only safe course context supplied from a structured public/course metadata sheet, never from a gold-risk span.
3. Targeted risk suppression: non-target, low-evidence comments that avoid a predeclared gold risk without asserting that it is false.

Use synthetic-to-authentic multipliers of 0, 0.1, 0.25, 0.5, and 1.0. Their resulting final synthetic shares are 0%, 9.1%, 20.0%, 33.3%, and 50.0%; this avoids the undefined “100% final synthetic share” condition. For each non-zero condition, run three independent generation seeds. Retain all rejected candidates in a private audit log; never silently replace them.

## Phase 2 — agent systems and evaluation

Evaluate the same contaminated review set with three pipelines:

1. Direct aggregator: all reviews supplied to an LLM with a fixed course-summary prompt.
2. Retrieve-then-summarize: retrieval at k=8 followed by the same summary prompt. Start with BM25; record query and ranked identifiers.
3. Evidence-constrained agent: direct aggregation with an instruction requiring comment IDs/evidence for every risk.

Primary metrics:

- Evidence Recall@8: share of gold-supporting comments present in retrieval output; not applicable to direct aggregation.
- ASRR: fraction of clean gold risks retained in the summary.
- CROR: fraction of critical gold risks omitted from the summary.
- Specificity Degradation Score: clean minus attacked output specificity, scored from cited evidence units and blinded human audit.

Secondary metrics are output evidence citations, recommendation/opinion shift, and detector bypass. They must not substitute for the four primary metrics.

## Phase 3 — baselines and inference

Compare no defence, AI-text detector filtering, low-quality filtering, semantic deduplication, MMR retrieval, and prompt-only citations. Each intervention receives the identical review set and generation budget.

The analysis unit is the course × attack family × ratio × seed × pipeline. Report paired clean-versus-attacked differences across courses with bootstrap confidence intervals. Use the 26-course cohort for the internal benchmark, report every per-course value and effect size, and include a strict-eight-course sensitivity analysis. Do not make population-prevalence claims until the wider 38-course set is complete.

## Stopping conditions and expansion

Advance to the full 38-course evaluation only when the clean pilot passes, the synthetic audit is complete, and every agent run is reproducible. If ASRR/CROR are unstable across seeds or the attack corpus fails the low-evidence audit, revise the attack protocol before collecting additional courses. When a new course is complete, rerun Phase 0 and add it only in the next predeclared dataset version.

## Ethical and reporting boundary

All synthetic content is offline experimental material, not content for posting to course-review platforms. Generated text is labelled synthetic in every internal file. The study measures agent behaviour under controlled contamination; it must not claim real-world prevalence or student harm beyond the observed benchmark evidence.
