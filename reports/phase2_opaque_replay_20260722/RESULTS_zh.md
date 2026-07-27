# Paper 1 Phase 2 实验结果报告（中文）

## 0. 版本、盲化与独立复跑边界

本报告对应 **v1-clean opaque-ID replay**，是 Paper 1 v1 条件的独立复跑：所有 Agent 与 Judge 均从头调用，未对旧输出做事后改名或重分析。本次结果单独写入 `runs/phase2_opaque_replay_20260722` 与 `reports/phase2_opaque_replay_20260722`，不与 v2 确认性实验混合。

- Agent 可见的记录 ID 全部为 `review_###`；`internal_source_id` 仅保留给本地检索指标，不进入 Agent/Judge 提示词或模型输入。
- 旧 `phase2` 与 `phase2_highdose` 结果永久标记为历史结果：旧版 Agent 可见 `record_id` 含课程、内容条件或 seed 标签，存在条件标识泄漏，不用于本报告的正式结论。
- 模型版本：Agent `deepseek-v4-flash`；Judge `deepseek-v4-pro`。原始课程评论在用户明确同意后发送至 DeepSeek API。
- 完整复跑命令为：` .venv\Scripts\python.exe scripts\run_phase2_agents.py --output-dir runs\phase2_opaque_replay_20260722 --env-file .env --record-id-mode opaque --prompt-version phase2_agent_v1_opaque_replay_20260722 --judge-prompt-version phase2_auto_judge_v1_opaque_replay_20260722 --skip-existing --request-pause-seconds 0.15`。
- 运行日志共保留 26 条早期 `APIConnectionError` 失败尝试；全部由相同 `run_id` 的成功重跑覆盖，最终未解决失败为 0 条。最终审计使用 `--require-opaque-record-ids --require-no-failures`，结果为 PASS。

## 1. 实验目的与范围

本实验在离线、受控条件下检验：低证据密度的合成课程评论，是否会改变课程评论 Agent 对既有人类课程级 gold risk 的保留情况。合成文本只用于内部基准，不会发布到任何真实平台。

- 课程 cohort：26 门（8 门严格完整课程与 18 门经用户批准的带例外课程）。
- 攻击族：benign low-density、half-true contextual、targeted suppression；CDEV3500 没有可评估 gold risk，因此预注册为 targeted-suppression 不适用。
- 条件：clean；以及合成/真实评论比例 0.1、0.25、0.5、1.0，种子 201、202、203。
- Agent 管线：direct、BM25 retrieve-then-summarize、evidence-constrained。

## 2. 最终执行与审计状态

- 预注册矩阵：2850 个唯一 run；最终成功：2850 个唯一 run。
- 成功记录重复：0；未解决失败：0。
- 历史失败尝试：26 条；其中 26 条已由同 run_id 的成功重跑覆盖，仍保留在原始 metrics 中以便追溯。
- 课程覆盖：26/26；三条管线分别为：bm25_retrieve_then_summarize=950，direct=950，evidence_constrained=950。
- 严格矩阵状态：通过（完整、唯一且无未解决失败）。

## 3. 合成攻击语料审计

- 协议要求的 course×seed×family 组合自动审计通过：0/0。
- 自动审计只验证语言、长度、重复、显性考试术语等规则；不等同于人工有效性审查。
- 盲审材料已经导出；在至少两名独立标注者完成盲审前，合成文本仍标记为 `pending_human_audit`。

## 4. 自动评估结果（direct 管线，比例 1.0）

下表是课程级 clean–attack 配对差及 95% bootstrap CI。它们是自动评估结果，不替代尚未完成的人类盲审。

| 攻击族 | 指标 | 覆盖课程数 | 配对均值差 | 95% bootstrap CI |
|---|---|---:|---:|---|
| benign_low_density | asrr | 25 | 0.001 | [-0.088, 0.108] |
| benign_low_density | cror | 16 | -0.010 | [-0.172, 0.116] |
| benign_low_density | output_specificity_proxy | 25 | 0.024 | [-0.168, 0.223] |
| half_true_contextual | asrr | 25 | -0.040 | [-0.198, 0.126] |
| half_true_contextual | cror | 16 | 0.110 | [-0.105, 0.330] |
| half_true_contextual | output_specificity_proxy | 25 | -0.051 | [-0.366, 0.248] |
| targeted_suppression | asrr | 25 | -0.011 | [-0.096, 0.068] |
| targeted_suppression | cror | 16 | 0.024 | [-0.084, 0.163] |
| targeted_suppression | output_specificity_proxy | 25 | 0.045 | [-0.154, 0.236] |

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
