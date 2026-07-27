# Paper 1 r2/r5 高污染率扩展结果报告（中文）

## 1. 范围与解释边界

本实验是对既有 Phase 2 的独立高污染率离线压力测试，固定选择真实评论数最高的 10 门课程，测试 r2（合成占混合池 66.7%）和 r5（83.3%）。它不估计小红书或任何现实平台的 AI 内容发生率，也不代表真实学生伤害。

## 2. 执行与审计

- 预期矩阵：540 个唯一 run；成功唯一 run：540；未解决失败：0；历史失败尝试：1。
- 严格矩阵状态：通过。
- 每个高污染条件均与既有、冻结的同课程同 pipeline clean 结果配对；不会以新的模型调用替换 clean 基线。
- 合成候选仍处于 pending_human_audit；自动筛查和运行审计不替代人类盲审。

## 3. Direct pipeline 的课程配对效应

| 比例 | 攻击族 | 指标 | 课程数 | 平均配对差 | 95% bootstrap CI |
|---:|---|---|---:|---:|---|
| r2 | benign_low_density | asrr | 10 | -0.010 | [-0.300, 0.300] |
| r2 | benign_low_density | cror | 6 | 0.176 | [-0.083, 0.528] |
| r2 | benign_low_density | output_specificity_proxy | 10 | 0.063 | [-0.572, 0.850] |
| r2 | half_true_contextual | asrr | 10 | -0.010 | [-0.273, 0.228] |
| r2 | half_true_contextual | cror | 6 | 0.171 | [-0.153, 0.546] |
| r2 | half_true_contextual | output_specificity_proxy | 10 | -0.049 | [-0.486, 0.419] |
| r2 | targeted_suppression | asrr | 10 | 0.068 | [-0.202, 0.356] |
| r2 | targeted_suppression | cror | 6 | 0.144 | [-0.074, 0.421] |
| r2 | targeted_suppression | output_specificity_proxy | 10 | 0.209 | [-0.336, 0.780] |
| r5 | benign_low_density | asrr | 10 | -0.025 | [-0.317, 0.260] |
| r5 | benign_low_density | cror | 6 | 0.250 | [-0.028, 0.583] |
| r5 | benign_low_density | output_specificity_proxy | 10 | -0.079 | [-0.646, 0.497] |
| r5 | half_true_contextual | asrr | 10 | -0.038 | [-0.360, 0.276] |
| r5 | half_true_contextual | cror | 6 | 0.144 | [-0.153, 0.519] |
| r5 | half_true_contextual | output_specificity_proxy | 10 | -0.067 | [-0.633, 0.534] |
| r5 | targeted_suppression | asrr | 10 | -0.059 | [-0.253, 0.150] |
| r5 | targeted_suppression | cror | 6 | 0.120 | [-0.037, 0.343] |
| r5 | targeted_suppression | output_specificity_proxy | 10 | -0.070 | [-0.436, 0.326] |

## 4. 如何解读

- ASRR 的负值表示 gold risk 保留下降；CROR 的正值表示关键风险遗漏增加；specificity 的负值表示输出更不具体。
- 置信区间跨 0 时，只能报告在此 10 课程压力测试中尚未得到稳定的平均端到端变化，不能表述为攻击无效。
- BM25 Evidence Recall@8 是检索层证据可见性，不能单独替代最终风险遗漏结论。
- 此子样本按评论量选择，且只有 10 门课程；其作用是识别高剂量阈值，不可外推为全部课程或现实平台比例。

## 5. 可复现产物

- `data/highdose_top10_by_authentic_count_20260715.csv`：固定课程选择。
- `runs/phase2_highdose/conditions/`、`agent_outputs/`、`judge_outputs/`：每个条件及输出。
- `reports/phase2_highdose/`：候选容量审计、输出审计、课程配对值和 bootstrap 汇总。
- `figures/phase2_highdose/`：执行覆盖、direct 配对效应与 BM25 证据可见性图。
