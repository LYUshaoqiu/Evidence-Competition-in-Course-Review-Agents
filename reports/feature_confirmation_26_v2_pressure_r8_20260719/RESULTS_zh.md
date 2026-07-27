# Paper 1 26 门课程 v2：r=8 worst-case exposure pressure test结果

## 统计协议

- 每门课的三个攻击 seed 先做课程内平均，再对课程均值进行 bootstrap 95% CI；课程是主检验单位。
- 配对基线为同课程、同目标主题、同管线的 clean 条件。负向 retained / specificity / evidence recall 变化表示目标证据或风险保留下降；正向 omitted 变化表示遗漏上升。
- 结果来自自动 Agent/Judge；候选文本的自动通过状态不等于人工盲审通过。

## 总体配对效应

| 攻击族 | 比例 | 管线 | 指标 | 课程数 | 平均变化 | 95% bootstrap CI |
|---|---:|---|---|---:|---:|---|
| topic_aligned_low_evidence | 8 | direct | target_risk_omitted | 26 | 0.205 | [0.064, 0.346] |
| topic_aligned_low_evidence | 8 | direct | target_risk_retained | 26 | -0.205 | [-0.359, -0.064] |
| topic_aligned_low_evidence | 8 | direct | target_specificity | 26 | -0.051 | [-0.282, 0.179] |
| topic_aligned_low_evidence | 8 | direct | target_strength_0_to_3 | 26 | -0.038 | [-0.282, 0.205] |
| topic_aligned_low_evidence | 8 | evidence_constrained | target_risk_omitted | 26 | 0.064 | [-0.115, 0.231] |
| topic_aligned_low_evidence | 8 | evidence_constrained | target_risk_retained | 26 | -0.064 | [-0.244, 0.115] |
| topic_aligned_low_evidence | 8 | evidence_constrained | target_specificity | 26 | -0.321 | [-0.564, -0.103] |
| topic_aligned_low_evidence | 8 | evidence_constrained | target_strength_0_to_3 | 26 | -0.205 | [-0.487, 0.051] |
| topic_aligned_reframing | 8 | direct | target_risk_omitted | 26 | 0.244 | [0.077, 0.410] |
| topic_aligned_reframing | 8 | direct | target_risk_retained | 26 | -0.244 | [-0.410, -0.077] |
| topic_aligned_reframing | 8 | direct | target_specificity | 26 | -0.282 | [-0.577, 0.000] |
| topic_aligned_reframing | 8 | direct | target_strength_0_to_3 | 26 | -0.244 | [-0.564, 0.051] |
| topic_aligned_reframing | 8 | evidence_constrained | target_risk_omitted | 26 | 0.077 | [-0.128, 0.269] |
| topic_aligned_reframing | 8 | evidence_constrained | target_risk_retained | 26 | -0.077 | [-0.269, 0.128] |
| topic_aligned_reframing | 8 | evidence_constrained | target_specificity | 26 | -0.346 | [-0.628, -0.077] |
| topic_aligned_reframing | 8 | evidence_constrained | target_strength_0_to_3 | 26 | -0.269 | [-0.603, 0.038] |

## 敏感性切片

- `strict_complete` 为预先冻结的 8 门严格完整课程；`user_approved_exception` 为预先批准的 18 门例外课程。两者均保留在分析中，例外课程不是事后删除条件。
- 详细切片结果见 `effect_summary_by_tier.csv`。

## 解释边界

- 若 BM25 的 evidence recall 下降而 Direct / evidence-constrained 的端到端保留没有稳定下降，应限定为检索层证据竞争，而不是摘要 Agent 的普遍失效。
- 自动 Judge 结果不能替代人工效度审计；本扩展不把既有 6-course pilot 的人审结果外推为 26-course 人类效度结论。
