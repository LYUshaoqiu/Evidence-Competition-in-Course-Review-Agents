# Paper 1 v2：单标注者盲审探索性分析（中文）

## 使用边界

- 标注者：`shaoqiu`；候选评论 36 条，摘要对 72 对。
- 本报告已在标注完成后使用内部随机化 key 解盲，仅用于探索性判断；没有第二位标注者的一致性，不能作为正式人类效度结论。
- 候选缺失字段对应题目：无。
- 摘要缺失字段对应题目：FEATURE-SUM-026。

## 候选评论质量

- 总体决定：接受 34；待讨论 2；拒绝 0；缺失 0；在已决定题目中的接受率为 94.4%。
- 无依据具体断言：是 13；否 20；不确定 3。
- 模板化/近似重复：是 17；否 16；不确定 3。
- 解读：当前单标注者对候选池样本的接受率很高；这支持候选文本在该标注规则下基本可用。仍需第二位标注者复核，并单独处理“无依据具体断言”与“模板化”标签。
- 注意：本轮候选盲审抽自候选池，而不是逐条验证每个摘要条件实际注入的文本；它是候选分布的质量信号，不是对全部注入文本的逐条认证。

## 摘要配对效应

| 攻击族 | 比例 | 管线 | 人工指标 | 配对数 | 课程数 | 攻击−clean 平均变化 | 95% bootstrap CI |
|---|---:|---|---|---:|---:|---:|---|
| topic_aligned_low_evidence | 1 | bm25_retrieve_then_summarize | 风险表述强度 | 18 | 6 | -0.611 | [-1.111, -0.111] |
| topic_aligned_low_evidence | 1 | bm25_retrieve_then_summarize | 是否提及目标风险 | 17 | 6 | -0.056 | [-0.167, 0.000] |
| topic_aligned_low_evidence | 1 | bm25_retrieve_then_summarize | 攻击侧被判更弱的比例 | 18 | 6 | 0.611 | [0.333, 0.889] |
| topic_aligned_low_evidence | 8 | direct | 风险表述强度 | 18 | 6 | -0.333 | [-0.611, -0.111] |
| topic_aligned_low_evidence | 8 | direct | 是否提及目标风险 | 18 | 6 | 0.000 | [0.000, 0.000] |
| topic_aligned_low_evidence | 8 | direct | 攻击侧被判更弱的比例 | 18 | 6 | 0.278 | [0.111, 0.444] |
| topic_aligned_reframing | 1 | bm25_retrieve_then_summarize | 风险表述强度 | 18 | 6 | -0.333 | [-0.556, -0.111] |
| topic_aligned_reframing | 1 | bm25_retrieve_then_summarize | 是否提及目标风险 | 18 | 6 | 0.000 | [0.000, 0.000] |
| topic_aligned_reframing | 1 | bm25_retrieve_then_summarize | 攻击侧被判更弱的比例 | 18 | 6 | 0.444 | [0.167, 0.722] |
| topic_aligned_reframing | 8 | direct | 风险表述强度 | 18 | 6 | -0.667 | [-0.889, -0.389] |
| topic_aligned_reframing | 8 | direct | 是否提及目标风险 | 18 | 6 | 0.000 | [0.000, 0.000] |
| topic_aligned_reframing | 8 | direct | 攻击侧被判更弱的比例 | 18 | 6 | 0.611 | [0.278, 0.944] |

## 自动 Judge 与人工强度的方向核对

| 攻击族 | 比例 | 管线 | 人工强度变化 | 自动强度变化 | 方向一致？ |
|---|---:|---|---:|---:|---|
| topic_aligned_low_evidence | 1 | bm25_retrieve_then_summarize | -0.611 | -0.833 | 是 |
| topic_aligned_low_evidence | 8 | direct | -0.333 | -0.722 | 是 |
| topic_aligned_reframing | 1 | bm25_retrieve_then_summarize | -0.333 | -0.611 | 是 |
| topic_aligned_reframing | 8 | direct | -0.667 | -0.889 | 是 |

## 判读

- 负的强度或提及变化，表示攻击摘要相较 clean 更弱或更少提及目标风险；`攻击侧被判更弱的比例`高于 0.5 也支持相同方向。
- 由于仅有一位标注者、每个条件只有 6 门课程且候选质量尚未通过双人验证，CI 仅描述课程间不确定性，不能替代确认性显著性检验。
- 在第二位标注完成、缺失字段补齐之前，不应把本表写入论文主结果。
