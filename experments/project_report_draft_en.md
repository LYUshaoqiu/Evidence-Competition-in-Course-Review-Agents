# Project Report: Evidence-Integrity Stress Testing for Course-Review Agents

**Student:** [Your name]  
**Student ID:** [Your student ID]  
**Course / project unit:** [Unit code and name]  
**Supervisor:** [Supervisor name]  
**Submission date:** [Date]

## Executive Summary

This project investigated a practical integrity question for course-review decision-support systems: can course-level risks become less visible when a review collection contains topical text that is fluent and plausible but provides little concrete evidence? The work was motivated by the development of a student-facing course-review service. While collecting reviews, I observed two recurring features of public review environments: some contributors voluntarily use AI to polish their writing, and some posts are promotional, broadly positive, or weakly evidenced. These observations are motivation rather than labels: the project does not attempt to identify any individual review as AI-generated, deceptive, or malicious. Instead, it uses an offline, controlled stress-test design to examine an attack-inspired mechanism in which semantically nearby low-information content competes with evidence in an LLM-based course-review agent.

I consolidated a review corpus of more than 1,200 student course reviews, created an auditable cohort of 26 courses, and implemented a reproducible evaluation pipeline. The pipeline constructs paired clean and intervention conditions, evaluates Direct, BM25 retrieve--then--summarize, and evidence-constrained summary pipelines, saves every condition and model output, and computes course-level paired bootstrap confidence intervals. The final v2 confirmation experiment showed that, at an equal synthetic-to-observed-review ratio ($r=1$), BM25 target-evidence recall@8 declined by 0.670 and 0.674 for two controlled content families. Target-risk retention also declined by 0.423 and 0.359, respectively. In contrast, Direct and evidence-constrained systems did not show stable retention loss at the same exposure. An extreme $r=8$ pressure test affected Direct summaries but was not interpreted as a real-world prevalence estimate.

An important professional outcome was the discovery that an early experimental version exposed condition metadata through review identifiers. I excluded those results, implemented neutral opaque review identifiers, and completed a separate 2,850-condition opaque-ID replay. This replay reproduced the main architectural pattern: BM25 was more sensitive than Direct and evidence-constrained summarization. The project therefore delivered an auditable prototype, a validated experimental workflow, a set of results with carefully stated boundaries, and a clearer understanding of how evidence provenance and retrieval design affect course-review agents. It also motivates a defensive research agenda: how to identify, preserve, and expose the most decision-relevant evidence under topic-specific information pressure.

## 1. Introduction and Project Scope

Students often rely on informal comments when selecting courses. A course-review service can make those comments more useful by retrieving relevant reviews and producing concise summaries of workload, assessment, teaching, prerequisites, and other decision-relevant risks. However, summarisation compresses a heterogeneous review collection into a small amount of text. If the system retrieves only a limited number of reviews, broadly topical but weakly supported statements may compete with concrete evidence for space in the retrieved context.

This concern arose from product practice rather than from an abstract threat model alone. A contributor may use AI merely to make a review sound smoother; a tutor or intermediary may publish promotional content; and a genuine user may write an impressionistic comment with no concrete support. These sources are different in intent and should not be conflated. Nevertheless, they can create the same system-level condition: topic vocabulary is plentiful while decision-relevant evidence is scarce. For a system that exposes only a small retrieved subset to an Agent, even low-cost additions of topical material may be worth studying as an evidence-integrity threat. The project did **not** measure the relative cost of attack and defence; it investigates whether the mechanism exists under controlled conditions.

The original project goal was to test, in a controlled offline setting, whether synthetic low-evidence course-review content could cause a course-review agent to omit or weaken a human-annotated course risk. The intended output was not a production attack tool and not a claim that a real reviewer has attacked a system. It was an evidence-integrity evaluation framework for a student-facing review system: a way to make a plausible threat mechanism measurable before designing defences.

The final scope included five connected deliverables:

1. an auditable corpus and annotation cohort for course-review analysis;
2. a controlled candidate-generation and condition-construction workflow;
3. three LLM-agent pipelines with persisted outputs and paired evaluation;
4. automated and exploratory human validation materials; and
5. reproducible reports, figures, audits, and a paper draft.

The project did not publish synthetic content to a real platform, expose real students to manipulated reviews, estimate the prevalence of AI-written reviews or advertising, or attribute authorship or intent to individual reviewers.

## 2. Background and Rationale

Prior work has shown that deceptive opinion spam can affect the reliability of online reviews (Ott et al., 2011). Research on automated course-feedback summarisation shows the value of extracting decision-relevant signals from student comments (Luo et al., 2016). Retrieval-augmented systems introduce an additional design dependency: summaries can only reflect the evidence selected for the model context (Lewis et al., 2020). In particular, BM25-style lexical retrieval ranks documents by query--document term matching (Robertson & Zaragoza, 2009), which makes it suitable for a transparent mechanism study.

My project focuses on a narrower question than prompt injection or corpus poisoning. The concern is not that a review instructs a model to misbehave, nor that it must contain an obviously false fact. The concern is evidence competition: when generic statements use the same topic vocabulary as concrete course evidence, they may occupy positions in a limited retrieval context. If the remaining context contains less direct evidence, the final summary may describe a risk more weakly, less specifically, or not at all.

This framing was deliberately chosen to match the real service-development context while avoiding unsupported claims. Fluent or generic text is not inherently harmful. It becomes relevant to the project only when it affects the visibility of evidence supporting a consequential course-level statement. In security terms, the mechanism is attractive to study because an intervention need not fabricate a precise false claim or control the model's prompt; it may instead compete for a limited evidence budget. Whether this mechanism is economical for a real attacker, prevalent on a particular platform, or effective against a specific deployed system is outside the evidence collected here.

## 3. Original Proposal Compared with Delivered Outcomes

| Original objective | Delivered outcome | Evidence |
|---|---|---|
| Build a clean, annotated course-review cohort. | Constructed a 26-course cohort containing 220 complete review annotations, 206 evidence units, and 54 course-level gold risks. | `data_card.md`; `quality_report.md`; annotation outputs. |
| Generate controlled low-evidence review conditions. | Built deterministic candidate selection, ratio-controlled condition construction, three seeds, and traceable local artefacts. | `scripts/`; `runs/.../conditions/`; candidate-audit materials. |
| Test whether agents retain important course risks. | Implemented Direct, BM25 retrieve--then--summarize, and evidence-constrained pipelines with an independent automated evaluator. | Persisted Agent/Judge JSON outputs and run metrics. |
| Evaluate robustness across conditions. | Completed v2 confirmation, pipeline robustness, $r=8$ pressure testing, and a 2,850-condition opaque-ID replay. | Audit reports and effect summaries listed in Appendix A. |
| Produce evidence suitable for a research paper and project demonstration. | Produced figures, Chinese/English documentation, a human-audit portal, reproducibility manifests, and an AAAI-style paper draft. | `paper_assets/`, `human_audit/`, `paper1_aaai27_overleaf/`. |

The most important change from the initial plan was methodological rather than conceptual. I found that an early version of the experiment exposed synthetic-condition labels through review IDs. Rather than attempting to reinterpret those results, I excluded them and reran the broader matrix with opaque Agent-visible identifiers. This strengthened the integrity of the project and changed the final evidence standard from "many runs completed" to "audited runs whose condition metadata could not affect the Agent input."

## 4. Methodology and Implementation

### 4.1 Data and annotations

The observed corpus contains more than 1,200 independently collected student course reviews, primarily concerning courses at one Australian university. Raw text is access-controlled. For the experimental cohort, I used 26 courses: eight with strict-complete annotations and eighteen included under a documented exception policy because a limited number of individual comments had annotation-quality issues. The data card records 220 complete review annotations, 206 evidence units, and 54 course-level gold risks.

Each target risk was frozen before the main evaluation. Supporting review IDs, risk labels, and annotation metadata were retained locally so that retrieval and summary outputs could be compared against a consistent reference. The data-quality process also identified limitations, such as incomplete support-ID links and the lower interpretability of the course whose gold risk was labelled `none`.

### 4.2 Controlled conditions

For a course--risk condition, the clean version contains the observed eligible reviews. The intervention version adds controlled topical content at a specified synthetic-to-observed-review ratio $r$. Two v2 content families were used for the main paper analysis: topic-aligned low-evidence content and mild reframing. The candidate-generation process used high-level public course-outline context only to ensure topic relevance; course outlines were not added as hidden evidence to the final summary agent.

The study used three summary designs:

- **Direct:** summarises the available review collection.
- **BM25 retrieve--then--summarize:** retrieves the top $k=8$ lexical matches before summarisation.
- **Evidence-constrained:** requires risk statements to be grounded in review evidence.

For BM25, target-evidence recall@8 measured whether annotated target evidence remained in the retrieved context. End-to-end outcomes included target-risk retention or omission, specificity, and risk strength. Each intervention was compared with its matched clean condition for the same course and pipeline; seed-level effects were averaged within course before course-level bootstrap confidence intervals were calculated.

### 4.3 Reproducibility and opaque identifiers

The implementation was designed to preserve a separate artefact for each condition, Agent output, and automated evaluation. It also supported retries without silently deleting failed attempts. The following simplified code illustrates the opaque-ID remedy used in the corrected workflow:

```python
ordered = sorted(internal_records, key=stable_order)
agent_visible_records = [
    {"record_id": f"review_{i:03d}", **record}
    for i, record in enumerate(ordered, start=1)
]
```

The Agent sees only neutral identifiers such as `review_001`. Internal source identifiers remain local and are used only for retrieval scoring and audit checks. This separation prevented a review ID from disclosing whether the record was authentic or synthetic, which content family created it, or which generation seed was used.

## 5. Evaluation and Findings

### 5.1 v2 confirmation at $r=1$

The main v2 confirmation evaluated 26 courses at $r=1$, where the controlled added-review count equals the observed-review count for a course. The BM25 main matrix completed 182/182 planned runs and passed the opaque-ID audit. Both controlled content families substantially reduced target-evidence recall@8: low-evidence competition produced a mean paired change of $-0.670$ [95% CI: $-0.748$, $-0.582$], while mild reframing produced $-0.674$ [$-0.765$, $-0.572$].

The retrieval loss also reached the final summary outcome in BM25. Target-risk retention changed by $-0.423$ [$-0.628$, $-0.205$] for low-evidence competition and $-0.359$ [$-0.538$, $-0.179$] for mild reframing. This supports a focused conclusion: topic-aligned low-evidence content can compete for a limited lexical retrieval budget and make a supported course risk less likely to be retained in a BM25 retrieve--then--summarize system. The experiment therefore validates a controlled evidence-competition attack mechanism, rather than claiming a universal attack against LLM agents.

### 5.2 Pipeline dependence

The result was not universal across all summarisation designs. In the 364-run v2 robustness matrix, Direct summarisation had risk-retention intervals crossing zero for both content families: $-0.051$ [$-0.179$, $0.077$] and $-0.128$ [$-0.269$, $0.013$]. Evidence-constrained summarisation also had intervals crossing zero: $-0.051$ [$-0.192$, $0.103$] and $-0.038$ [$-0.167$, $0.103$].

This negative result was important. It showed that simply adding generic text does not reliably make every LLM summary fail. Instead, the observed vulnerability is associated with retrieval-stage evidence selection. This finding changed the project recommendation: practical mitigation should prioritise evidence provenance, retrieval diversity, source-level controls, and interfaces that expose supporting review units. In other words, the security question is not only whether a summary model is fluent or aligned, but whether the system preserves the evidence required to justify its summary.

### 5.3 Extreme pressure test

I also ran a separate $r=8$ pressure test, where the controlled content volume was approximately eight times the observed-review count. Direct summarisation then showed risk-retention declines of $-0.205$ [$-0.359$, $-0.064$] for low-evidence content and $-0.244$ [$-0.410$, $-0.077$] for mild reframing. Evidence-constrained retention intervals remained compatible with zero, although specificity decreased.

This test does not estimate the real-world proportion of advertising, promotional text, or AI-polished reviews. Its value is as a bounded worst-case stress condition showing that load matters and that evidence-constrained instructions can mitigate, but not necessarily eliminate, degradation.

### 5.4 Opaque-ID replay of the broader matrix

The condition-blind replay completed all 2,850 planned conditions, covering 26 courses, three controlled content families, four non-zero ratios ($r=0.1$, $0.25$, $0.5$, and $1.0$), three seeds, and three pipelines. The final audit reported no missing conditions, no unresolved failures, and no non-opaque Agent-visible identifiers.

At $r=1$, BM25 ASRR declined by $-0.399$ [$-0.532$, $-0.280$] for benign low-density content, $-0.342$ [$-0.472$, $-0.221$] for half-true contextual content, and $-0.370$ [$-0.498$, $-0.244$] for targeted suppression. Direct and evidence-constrained pipelines again had confidence intervals crossing zero. The replay therefore provides convergent automated evidence for the architectural pattern identified in v2.

I report this replay separately because it uses different controlled content families, a generic course-summary prompt, and automated ASRR/CROR endpoints. In addition, its candidate-level human audit remains pending. It is therefore an audited automated robustness analysis, not a pooled estimate with the v2 confirmation results.

### 5.5 Exploratory human checks

For the six-course v2 pilot, I exported blinded candidate and summary-pair materials through a local annotation portal. The final single-rater candidate audit accepted 34 of 36 sampled synthetic candidates, marked two for discussion, and rejected none. A separate audit of 72 clean--intervention summary pairs found that human risk-strength changes agreed in direction with the automated score in all four audited content--pipeline cells.

These checks support candidate plausibility and the direction of the pilot signal. However, they are exploratory. They do not establish inter-rater reliability, validate every candidate, or justify a human-validity claim for the 26-course confirmation matrix.

## 6. Challenges, Reflection, and Professional Development

The most significant challenge was learning that a technically complete experiment can still be methodologically invalid. Early Phase 2 outputs contained review identifiers that encoded course, family, and seed information. This created a condition-label leakage risk because an LLM could potentially infer metadata from the identifier rather than from the review content. I treated this as a validity problem rather than a formatting defect: I excluded the affected historical outputs, redesigned the record construction process, and reran the broader matrix with opaque IDs. This was the most important professional learning outcome of the project.

A second challenge was working with imperfect annotations. The cohort was useful but not uniformly complete: eighteen courses were included under a documented exception policy, and several support-ID links required explicit warnings. Rather than hiding these issues, I separated strict-complete and exception-inclusive interpretations, kept data-quality reports, and avoided claiming that the dataset represents every course or platform.

A third challenge was interpreting negative and mixed results responsibly. The initial intuition was that generic content might weaken all summary systems. The evidence did not support that claim at ordinary exposure. Direct and evidence-constrained pipelines did not show stable $r=1$ risk-retention loss. Learning to preserve this negative result improved the project: it moved the conclusion from a broad "all agents are vulnerable" narrative to a more useful design insight about retrieval-stage evidence competition.

The project also developed my practical research skills. I gained experience in data quality assessment, versioned experimental protocols, prompt and output persistence, API failure handling, bootstrap uncertainty estimation, figure design, blind-audit preparation, and research writing. It also changed my view of the practical problem: an apparently simple question of "can a model summarise reviews?" is really a question of which evidence enters the context, which language is specific enough to justify a claim, and which system controls make that process auditable. I learned that privacy, provenance, and reproducibility are not optional documentation tasks: they determine whether an experimental result can be trusted and responsibly communicated.

## 7. Limitations and Boundaries

The strongest finding concerns a controlled mechanism, not the prevalence of attacks in the wild. The corpus is drawn primarily from one university context, and the study does not estimate what fraction of public course-review content is AI-polished, promotional, low-evidence, or adversarial. My observations of these phenomena motivated the study, but they do not establish authorship, intent, frequency, or causal effect on a live platform.

The synthetic families are deliberately bounded approximations. They do not represent every form of deceptive, promotional, AI-assisted, or genuine low-detail communication. The main $r=1$ condition is an interpretable experimental exposure, not a claim that synthetic and observed review counts are equal in a deployed service. Likewise, $r=8$ is an explicitly non-prevalence pressure test rather than an estimate of a real-world ratio.

The main evidence applies most directly to the tested models, prompts, annotation protocol, courses, and retrieval designs. It shows a large BM25 retrieval-stage effect, but it cannot establish the same magnitude for dense retrieval, hybrid search, different LLMs, changing production corpora, or interfaces in which students inspect raw evidence themselves. The broad opaque-ID replay is useful convergent automated evidence, but its candidate-level human audit remains incomplete and it is therefore not pooled with the v2 result.

Finally, the human checks were exploratory and single-rater. They support the plausibility of sampled v2 candidates and the direction of sampled summary effects, but they do not provide inter-rater reliability or a complete human validation of all generated content. These limitations define the next experiments rather than invalidate the controlled result.

## 8. Ethical and Professional Considerations

The project involved student-generated course reviews and synthetic text. Raw review text remains access-controlled and is not included in this report, figures, or public code. Synthetic content was used only in local offline conditions and was never published as a review or used to influence course-selection decisions. The work does not infer that any real reviewer used AI, acted deceptively, or intended to manipulate a system.

The project also required careful handling of external model services. Raw data access, data handling, and any third-party processing must remain subject to the applicable platform terms, institutional expectations, and consent or ethics requirements. Before public release or submission of a final research paper, I would document collection modality, de-identification, platform terms, data-retention practice, and the basis for any ethics approval or exemption.

## 9. Conclusion and Next Steps

This project delivered a reproducible evidence-integrity stress-test framework for course-review agents. It identified and, under controlled conditions, validated an evidence-competition attack mechanism: topical text that is plausible but weakly evidenced can displace concrete target evidence from a limited lexical retrieval budget and weaken the resulting course-risk summary. This is not a claim that every LLM Agent is easily manipulated, nor a claim that all real low-information reviews are attacks. It is a demonstrated system-level vulnerability in a BM25 retrieve--then--summarize design under the studied conditions.

The practical implication is security-oriented but constructive. A threat does not need to erase a risk in every setting to matter: where a review Agent has a small evidence budget, a low-cost addition of topical material may be enough to change which evidence becomes visible. The appropriate response is not to assume malicious intent in real authors, but to make evidence manipulation harder and more detectable through provenance, diversity, grounding, and transparent evidence displays.

The project met its core proposal objectives by creating an audited cohort, implementing controlled evaluation pipelines, producing course-level paired evidence, and documenting limitations. It also produced a stronger methodological outcome than originally anticipated: the ability to detect, correct, and transparently exclude a condition-label leakage problem.

The next stage moves from demonstrating the threat to designing defences. I plan to complete multi-rater human audits and agreement statistics; audit the broader replay candidate pool; test neural and hybrid retrievers; and evaluate source-provenance displays, diversity-aware retrieval, and evidence-grounding controls. At a deeper technical level, future work can decompose how query terms, document representations, retrieval scores, and summary-generation mechanisms jointly determine evidence visibility. Where model access permits, this could include representation- and weight-level analysis; where it does not, carefully designed behavioural ablations can still test the same mechanisms. The overarching goal is to extract genuinely useful, supportable information for a specific course topic even when the surrounding corpus contains abundant topical but low-value text.

## 10. Estimated Work Record (Approximately 30 Hours)

| Activity | Approximate hours | Evidence |
|---|---:|---|
| Project scoping, literature reading, and protocol design | 3 | `PROJECT_PLAN.md`; references; experiment plan. |
| Data consolidation, annotation review, and quality checks | 5 | `data_card.md`; `quality_report.md`; cohort files. |
| Candidate generation and controlled-condition implementation | 6 | candidate pools; condition builder scripts; run manifests. |
| Agent pipeline implementation and matrix execution | 6 | persisted condition, Agent, Judge, and metrics artefacts. |
| Audits, leakage remediation, and opaque-ID replay | 4 | opaque-ID audit; replay manifest; 2,850-run results. |
| Human-audit portal, result analysis, and visualisation | 3 | `human_audit/`; figures; reports. |
| Paper/report drafting, ethics review, and presentation preparation | 3 | paper draft; report; figure packages. |
| **Total** | **30** | |

*This reconstructed table should be checked against my own time log before submission and adjusted if the actual allocation differs.*

## References

Greshake, K., Abdelnabi, S., Mishra, S., Endres, C., Holz, T., & Fritz, M. (2023). *Not What You've Signed Up For: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection*. arXiv:2302.12173.

Lewis, P., Perez, E., Piktus, A., Petroni, F., Karpukhin, V., Goyal, N., Kuttler, H., Lewis, M., Yih, W.-t., Rocktäschel, T., Riedel, S., & Kiela, D. (2020). Retrieval-augmented generation for knowledge-intensive NLP tasks. *Advances in Neural Information Processing Systems, 33*, 9459--9474.

Luo, W., Liu, F., Liu, Z., & Litman, D. (2016). Automatic summarization of student course feedback. In *Proceedings of NAACL-HLT 2016* (pp. 80--85).

Ott, M., Choi, Y., Cardie, C., & Hancock, J. T. (2011). Finding deceptive opinion spam by any stretch of the imagination. In *Proceedings of ACL-HLT 2011* (pp. 309--319).

Robertson, S., & Zaragoza, H. (2009). The probabilistic relevance framework: BM25 and beyond. *Foundations and Trends in Information Retrieval, 3*(4), 333--389.

Zou, W., Geng, R.-Z., Wang, B., & Jia, J. (2024). *PoisonedRAG: Knowledge Corruption Attacks to Retrieval-Augmented Generation of Large Language Models*. arXiv:2402.07867.

## Appendix A. Evidence Artefact Index

| Item | Evidence location |
|---|---|
| Data cohort and limitations | `paper1_experiments/data_card.md`; `paper1_experiments/quality_report.md` |
| v2 main confirmation | `reports/feature_confirmation_26_v2_20260719/main/RESULTS_zh.md` |
| v2 main audit | `reports/feature_confirmation_26_v2_20260719/output_audit_zh.md` |
| v2 robustness | `reports/feature_confirmation_26_v2_20260719/robustness/RESULTS_zh.md` |
| v2 $r=8$ pressure test | `reports/feature_confirmation_26_v2_pressure_r8_20260719/RESULTS_zh.md` |
| Opaque-ID replay audit | `reports/phase2_opaque_replay_20260722/output_audit_zh.md` |
| Opaque-ID replay results | `reports/phase2_opaque_replay_20260722/RESULTS_zh.md` |
| Candidate and summary human checks | `reports/feature_pilot_outline_context_v2/human_audit_single_rater/` |
| Paper figures | `paper_assets/v2_figure_table_package_20260722/`; `paper_assets/opaque_replay_figure_package_20260723/` |
| Code and reproducibility scripts | `paper1_experiments/scripts/` |

## Appendix B. Recommended Figures and Screenshots

1. Introduction motivation diagram: clean evidence versus topical low-information competition for a limited retrieval budget.
2. v2 BM25 course-level paired effects at $r=1$.
3. v2 pipeline-dependence forest plot.
4. Opaque-ID replay BM25 ratio-sensitivity plot.
5. Screenshot of the blinded human-audit interface, with all review text and identifiers redacted.
6. Optional code excerpt showing opaque-ID construction or audit logic.
