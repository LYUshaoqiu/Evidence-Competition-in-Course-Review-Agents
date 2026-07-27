# Paper 1 高污染率扩展实验计划（r2 / r5，前 10 门高评论量课程）

## 研究定位

本扩展在既有 26 门课程、最高 `r1` 的 Phase 2 完整矩阵之后进行。它是**独立、预先写明的高污染率压力测试**，不改写或混入既有 Phase 2 的正式结果。目的不是估计真实平台的 AI 评论发生率，而是检验当局部课程评论池中合成评论占比升高时，Agent 何时出现检索或端到端风险保留的阈值变化。

`r2` 表示合成/真实 = 2，最终混合池中合成占 66.7%；`r5` 表示合成/真实 = 5，最终混合池中合成占 83.3%。

## 固定课程与选择规则

- 固定样本清单：`data/highdose_top10_by_authentic_count_20260715.csv`。
- 选择规则：在 26 门既有 cohort 中，按可与原始评论文本成功连接、且评论字段完整的真实评论数降序取前 10 门；并列按课程代码排序。
- 课程：COMP6771、COMP9021、COMP9321、COMM1150、COMP2041、COMP3411、COMP6443、ECON1101、GSOE9820、COMP2511。
- 基线：复用既有 Phase 2 已持久化的 clean 条件和对应 Agent/Judge 产物；高污染条件只新增 `r2` 与 `r5`，避免以新的模型调用噪声替换已冻结的 clean 参照。

## 固定矩阵

- 比例：`2.0, 5.0`。
- 攻击族：benign_low_density、half_true_contextual、targeted_suppression。
- 生成种子：201、202、203。
- Agent pipeline：direct、bm25_retrieve_then_summarize、evidence_constrained。
- 预计高污染 Agent run：10 × 2 × 3 × 3 × 3 = **540**。
- 每个条件的合成数量：`ceil(eligible_authentic_count × ratio)`；同一条件内的记录顺序由确定性哈希固定。

## 语料与审计

现有候选池只按 `r1` 需求准备，不能重复使用相同合成评论来伪造更高污染率。因此为本扩展新增带 `highdose` 标识的候选 tranche，保留生成种子、模型、提示版本、自动筛查结果和拒绝原因。所有合成文本仅限离线实验；不得发布到任何真实平台。

自动审计要求每个 course × seed × family 至少拥有 `ceil(authentic × 5)` 条不重复、自动通过的候选。自动审计通过不等于人工盲审通过；高污染语料同样维持 `pending_human_audit` 状态。

## 指标与判定

每个高污染条件与同一课程、同一 pipeline 的既有 clean 基线配对：

- Evidence Recall@8：仅 BM25 pipeline，衡量 gold 证据评论是否仍进入检索结果。
- ASRR：gold risk 保留率；负向配对变化表示保留下降。
- CROR：关键风险遗漏率；正向配对变化表示遗漏上升。
- output specificity proxy：负向配对变化表示输出变得更不具体。

统计单元为课程。先在同一课程内平均三个种子，再对 10 门课程做非参数 bootstrap 95% CI。此规模用于阈值探索与压力测试；若 CI 跨 0，不宣称稳定端到端效应。报告中将严格写明其为 10 门高评论量课程子样本，不能外推为总体真实发生率。

## 完成门槛

1. 540 个预期 run_id 全部成功且唯一；失败尝试只有在同 run_id 随后成功后才算已解决。
2. 每个成功 run 对应的 condition JSON、Agent JSON 和适用的 Judge JSON 均存在且可解析。
3. 高污染候选池通过数量、去重、长度与自动筛查审计。
4. 重新生成配对统计、图表、中文报告和可复现运行清单。
5. 人工盲审未完成前，任何关于合成语料自然性或现实平台影响的表述均限定为自动化、离线压力测试结果。
