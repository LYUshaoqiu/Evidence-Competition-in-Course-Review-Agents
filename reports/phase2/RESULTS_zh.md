# Paper 1 Phase 2 实验结果报告（中文）

## 1. 实验目的与范围

本实验在离线、受控条件下检验：低证据密度的合成课程评论，是否会改变课程评论 Agent 对既有人类课程级 gold risk 的保留情况。合成文本只用于内部基准，不会发布到任何真实平台。

- 课程 cohort：26 门（8 门严格完整课程与 18 门经用户批准的带例外课程）。
- 攻击族：benign low-density、half-true contextual、targeted suppression；CDEV3500 没有可评估 gold risk，因此预注册为 targeted-suppression 不适用。
- 条件：clean；以及合成/真实评论比例 0.1、0.25、0.5、1.0，种子 201、202、203。
- Agent 管线：direct、BM25 retrieve-then-summarize、evidence-constrained。

## 2. 最终执行与审计状态

- 预注册矩阵：2850 个唯一 run；最终成功：2850 个唯一 run。
- 成功记录重复：0；未解决失败：0。
- 历史失败尝试：66 条；其中 66 条已由同 run_id 的成功重跑覆盖，仍保留在原始 metrics 中以便追溯。
- 课程覆盖：26/26；三条管线分别为：bm25_retrieve_then_summarize=950，direct=950，evidence_constrained=950。
- 严格矩阵状态：通过（完整、唯一且无未解决失败）。

## 3. 合成攻击语料审计

- 协议要求的 course×seed×family 组合自动审计通过：231/231。
- 自动审计只验证语言、长度、重复、显性考试术语等规则；不等同于人工有效性审查。
- 盲审材料已经导出；在至少两名独立标注者完成盲审前，合成文本仍标记为 `pending_human_audit`。

## 4. 自动评估结果（direct 管线，比例 1.0）

下表是课程级 clean–attack 配对差及 95% bootstrap CI。它们是自动评估结果，不替代尚未完成的人类盲审。

| 攻击族 | 指标 | 覆盖课程数 | 配对均值差 | 95% bootstrap CI |
|---|---|---:|---:|---|
| benign_low_density | asrr | 25 | -0.018 | [-0.137, 0.086] |
| benign_low_density | cror | 16 | 0.069 | [-0.056, 0.226] |
| benign_low_density | output_specificity_proxy | 25 | 0.051 | [-0.196, 0.292] |
| half_true_contextual | asrr | 25 | -0.043 | [-0.160, 0.081] |
| half_true_contextual | cror | 16 | 0.056 | [-0.139, 0.229] |
| half_true_contextual | output_specificity_proxy | 25 | 0.011 | [-0.240, 0.309] |
| targeted_suppression | asrr | 25 | -0.001 | [-0.143, 0.148] |
| targeted_suppression | cror | 16 | 0.105 | [-0.076, 0.289] |
| targeted_suppression | output_specificity_proxy | 25 | 0.030 | [-0.215, 0.314] |

## 5. 解释边界

- 本报告证明 Phase 2 的自动化矩阵已完整执行，并不将自动判定外推为人类感知或真实平台效果。
- 课程级 gold risk 来自当前标注版本；带例外课程的标注覆盖限制必须在论文中明示。
- 人工盲审、一致性统计及后续防御基线（Phase 3）应与本阶段结果分开报告。

## 6. 可复现产物

- `runs/phase2/agent_run_metrics.csv`：逐 run 记录与历史尝试。
- `runs/phase2/conditions/`、`agent_outputs/`、`judge_outputs/`：确定性输入、Agent 输出和 judge 输出。
- `reports/phase2/paired_course_metrics.csv`、`effect_summary.csv`：课程配对统计与汇总。
- `figures/phase2/`：执行覆盖、配对效应、Evidence Recall@8 图。
- `human_audit/synthetic_blind_round1/`：待完成的人类盲审包。
