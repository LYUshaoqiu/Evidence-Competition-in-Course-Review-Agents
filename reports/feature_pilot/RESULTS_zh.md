# Paper 1 主题对齐低证据竞争攻击：可行性试验结果（中文）

## 范围

- 这是 6 门严格完整标注课程上的内部可行性研究，不作总体发生率或正式总体显著性主张。
- 每个攻击输出与同课程、同主题定向任务、同管线的 clean 输出配对；三个 seed 先在课程内平均，再对课程做 bootstrap。
- `target_risk_retained` 的负向变化和 `target_risk_omitted` 的正向变化均表示目标 gold risk 更容易丢失。
- 在双人盲审回收前，候选语料状态仍为 `pending_human_audit`。

## 配对汇总

| 攻击族 | 管线 | 指标 | 课程数 | 平均配对变化 | 95% bootstrap CI |
|---|---|---|---:|---:|---|
| topic_aligned_low_evidence | bm25_retrieve_then_summarize | target_evidence_recall_at_k | 6 | -0.684 | [-0.897, -0.397] |
| topic_aligned_low_evidence | bm25_retrieve_then_summarize | target_risk_omitted | 6 | 0.000 | [-0.333, 0.333] |
| topic_aligned_low_evidence | bm25_retrieve_then_summarize | target_risk_retained | 6 | 0.000 | [-0.333, 0.333] |
| topic_aligned_low_evidence | bm25_retrieve_then_summarize | target_specificity | 6 | -0.167 | [-0.944, 0.722] |
| topic_aligned_low_evidence | direct | target_risk_omitted | 6 | 0.000 | [-0.167, 0.167] |
| topic_aligned_low_evidence | direct | target_risk_retained | 6 | 0.000 | [-0.167, 0.167] |
| topic_aligned_low_evidence | direct | target_specificity | 6 | -0.056 | [-0.278, 0.278] |
| topic_aligned_low_evidence | evidence_constrained | target_risk_omitted | 6 | 0.111 | [0.000, 0.333] |
| topic_aligned_low_evidence | evidence_constrained | target_risk_retained | 6 | -0.111 | [-0.333, 0.000] |
| topic_aligned_low_evidence | evidence_constrained | target_specificity | 6 | 0.278 | [0.056, 0.611] |
| topic_aligned_reframing | bm25_retrieve_then_summarize | target_evidence_recall_at_k | 6 | -0.663 | [-0.883, -0.370] |
| topic_aligned_reframing | bm25_retrieve_then_summarize | target_risk_omitted | 6 | 0.056 | [-0.167, 0.333] |
| topic_aligned_reframing | bm25_retrieve_then_summarize | target_risk_retained | 6 | -0.056 | [-0.333, 0.167] |
| topic_aligned_reframing | bm25_retrieve_then_summarize | target_specificity | 6 | -0.667 | [-1.333, 0.111] |
| topic_aligned_reframing | direct | target_risk_omitted | 6 | 0.000 | [-0.167, 0.167] |
| topic_aligned_reframing | direct | target_risk_retained | 6 | 0.000 | [-0.167, 0.167] |
| topic_aligned_reframing | direct | target_specificity | 6 | 0.056 | [-0.222, 0.444] |
| topic_aligned_reframing | evidence_constrained | target_risk_omitted | 6 | 0.167 | [0.000, 0.389] |
| topic_aligned_reframing | evidence_constrained | target_risk_retained | 6 | -0.167 | [-0.389, 0.000] |
| topic_aligned_reframing | evidence_constrained | target_specificity | 6 | 0.167 | [-0.167, 0.500] |

## 判读边界

- 若 CI 跨 0，只能报告此可行性样本中未观察到稳定平均变化，不能声称攻击无效。
- 若 BM25 的 target evidence recall 降低，而 Direct 的 target risk retention 未稳定下降，结论应限定为检索层证据竞争，而不是所有摘要 Agent 的端到端失效。
- 该表为自动 judge 结果；人工输出盲审将作为后续效度校验，而不是事后改写自动结果。
