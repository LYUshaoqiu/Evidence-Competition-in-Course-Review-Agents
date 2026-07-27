# Paper 1 26 门课程 v2 确认性扩展执行摘要

## 执行结论

- 主确认性矩阵：182 个预期 run 中 182 个成功；审计 PASS。失败尝试 1 条，均有成功重试记录。
- 管线稳健性矩阵：364 个预期 run 中 364 个成功；审计 PASS。失败尝试 4 条，均有成功重试记录。
- 本次没有运行可选的 r=8 worst-case exposure pressure test。
- 所有 Agent 可见评论 ID 均通过 opaque-ID 审计；候选文本仅在本地实验目录保存，未发布到外部平台。

## 主确认性结果（BM25，r=1）

以下为课程级配对均值及 bootstrap 95% CI；负向 evidence recall 表示目标证据进入 BM25 top-k 的比例下降。

| 攻击族 | target evidence recall@8 | target risk retained |
|---|---:|---:|
| topic_aligned_low_evidence | -0.670 [-0.748, -0.582] | -0.423 [-0.628, -0.205] |
| topic_aligned_reframing | -0.674 [-0.765, -0.572] | -0.359 [-0.538, -0.179] |

## 管线稳健性结果（r=1）

| 攻击族 | Direct retained | BM25 retained | Evidence-constrained retained |
|---|---:|---:|---:|
| topic_aligned_low_evidence | -0.051 [-0.179, 0.077] | -0.423 [-0.628, -0.205] | -0.051 [-0.192, 0.103] |
| topic_aligned_reframing | -0.128 [-0.269, 0.013] | -0.359 [-0.538, -0.179] | -0.038 [-0.167, 0.103] |

## 敏感性与解释边界

- `strict_complete` 8 门与 `user_approved_exception` 18 门均纳入分析；详细课程级结果见两阶段 `course_results.csv` 和 `effect_summary_by_tier.csv`。
- CDEV3500 按交接说明纳入，但其冻结 gold risk 的 `risk_label` 为 `none`，因此该课程的 target-risk Judge 指标应视为低可解释性敏感性观察，不宜单独作为风险效度证据。没有因该问题事后删除课程。
- 自动 Judge 结果不是人工效度结论；既有 6-course pilot 的单标注者人审未外推为本次 26-course 人审结果。
- 若 BM25 evidence recall 下降而 Direct/evidence-constrained 的端到端 retained 未同步稳定下降，结论应限定为检索层证据竞争，而不能表述为所有摘要 Agent 普遍失效。

## 复核入口

- 主审计：`C:\Users\MSN\Desktop\unsw\6441\project\paper1_experiments\reports\feature_confirmation_26_v2_20260719\output_audit_zh.md`
- 稳健性审计：`C:\Users\MSN\Desktop\unsw\6441\project\paper1_experiments\reports\feature_confirmation_26_v2_20260719\robustness_audit_zh.md`
- 主结果：`C:\Users\MSN\Desktop\unsw\6441\project\paper1_experiments\reports\feature_confirmation_26_v2_20260719\main\effect_summary.csv`
- 稳健性结果：`C:\Users\MSN\Desktop\unsw\6441\project\paper1_experiments\reports\feature_confirmation_26_v2_20260719\robustness\effect_summary.csv`
- 运行清单见同日期目录下 `MANIFEST_zh.md`。
