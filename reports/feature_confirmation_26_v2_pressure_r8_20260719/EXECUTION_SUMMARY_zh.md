# Paper 1 r=8 worst-case exposure pressure test 执行摘要

## 执行结论

- 本次测试为预先定义的 worst-case exposure pressure test，不代表真实平台平均污染比例。
- 运行比例：r=8；管线：Direct 与 evidence-constrained；攻击族：两类；随机种子：201、202、203。
- 成功运行：364；失败尝试：3；审计状态：PASS。
- 候选池记录：21888；自动通过候选：21209；自动筛查不等同于人工盲审通过。

## 课程级配对效应

数值为攻击条件相对同课程 clean baseline 的均值变化，括号为课程级 bootstrap 95% CI。负值表示保留、具体性、强度或证据召回下降；本实验只有 3 个 seed，CI 用于描述稳定性，不作正式显著性声明。

| 攻击族 | 管线 | 风险保留 | 风险遗漏 | 具体性 | 强度 | evidence recall@8 |
|---|---|---:|---:|---:|---:|---:|
| 低证据竞争 | Direct | -0.205 [-0.359, -0.064] | 0.205 [0.064, 0.346] | -0.051 [-0.282, 0.179] | -0.038 [-0.282, 0.205] | n/a |
| 低证据竞争 | Evidence-constrained | -0.064 [-0.244, 0.115] | 0.064 [-0.115, 0.231] | -0.321 [-0.564, -0.103] | -0.205 [-0.487, 0.051] | n/a |
| 低证据重述 | Direct | -0.244 [-0.410, -0.077] | 0.244 [0.077, 0.410] | -0.282 [-0.577, 0.000] | -0.244 [-0.564, 0.051] | n/a |
| 低证据重述 | Evidence-constrained | -0.077 [-0.269, 0.128] | 0.077 [-0.128, 0.269] | -0.346 [-0.628, -0.077] | -0.269 [-0.603, 0.038] | n/a |

## 解释边界

- 如果 BM25/检索管线在 r=1 与 r=8 均出现证据召回下降，而 Direct 或 evidence-constrained 的端到端指标下降较弱，应将结论限定为检索层证据竞争。
- 自动 Judge 结果不能替代人工效度审计；CDEV3500 的冻结 gold risk 为 none，其 target-risk 指标仅作敏感性观察。
- 本测试不覆盖 r=8 的 BM25 主确认矩阵，避免把附录压力条件误写成主结果。

## 复核入口

- 审计：`C:\Users\MSN\Desktop\unsw\6441\project\paper1_experiments\runs\feature_confirmation_26_v2_pressure_r8_20260719\output_audit_zh.md`
- 运行指标：`C:\Users\MSN\Desktop\unsw\6441\project\paper1_experiments\runs\feature_confirmation_26_v2_pressure_r8_20260719\agent_run_metrics_merged.csv`
- 汇总表：`C:\Users\MSN\Desktop\unsw\6441\project\paper1_experiments\reports\feature_confirmation_26_v2_pressure_r8_20260719\effect_summary.csv`
- 候选池：`C:\Users\MSN\Desktop\unsw\6441\project\paper1_experiments\data\feature_confirmation_26_v2_pressure_r8_20260719\feature_confirmation_candidates_r8_20260719.csv`
