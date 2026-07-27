# Paper 1 实验状态与完成判据（中文）

更新日期：2026-07-14（Australia/Sydney）。本项目研究离线、受控的 Synthetic Signal Dilution 条件下，课程评论 Agent 是否会遗漏既有的人工 gold risk。所有合成文本仅用于内部实验；不得发布到真实课程评论平台。

## 已完成且可复核

- **研究 cohort**：冻结 26 门课程（8 门严格完整课程，以及 18 门由用户批准纳入的例外课程）。
- **正式候选语料池**：3 个独立生成种子共 3,099 条候选评论；3,082 条通过自动规则门；231 个必需的 course × seed × family 组合均满足最高 `synthetic/authentic=1.0` 的数量需求。CDEV3500 没有可评估的 gold risk，故预注册为 targeted-suppression 不适用。
- **实验程序**：已实现持久化条件构建、direct / BM25 retrieve-then-summarize / evidence-constrained 三条 Agent 管线、独立 LLM judge、逐次 JSON 产物、按课程配对 bootstrap 汇总、断点续跑与严格产物审计。
- **自动化验证**：当前 33 项单元测试通过。候选池自动审计通过；完整矩阵审计脚本会校验条件 JSON、Agent/Judge JSON、重复 run_id、失败记录和预注册覆盖度。
- **人类盲审材料**：`human_audit/synthetic_blind_round1/` 已导出盲化条目、中文说明与多标注者结果回收脚本；尚未收到人工标注结果。
- **Phase 3 防御基线**：过滤、语义去重和 MMR 的协议与代码已准备，但尚未运行；它必须在 Phase 2 完整通过审计后才可开始，并需另外安装/冻结本地模型。

## 正在执行：Phase 2 正式 Agent 矩阵

预注册矩阵为 2,850 次 Agent 运行：

- clean：26 门 × 3 pipelines = 78；
- 攻击：25 门有 gold risk 的课程 × 3 seeds × 3 families × 4 个非零比例 × 3 pipelines，加上 CDEV3500 的 2 个非 targeted families，共 2,772；
- 合计：2,850。

唯一权威的实时进度是 `runs/phase2/agent_run_metrics.csv`；后台队列日志为 `runs/phase2/remaining_matrix_queue.log`。任何尚未满足完整覆盖度的统计和图表都只能称为“中期监控”，不可写成 26 门课程的最终结论。

## Phase 2 正式完成门槛

只有同时满足以下条件，自动化结果才可标记为正式：

1. 精确存在 2,850 个预注册 `run_id`，没有额外或缺失项；
2. 每个成功 `run_id` 仅出现一次，且不存在失败运行；
3. 每个条件 JSON、Agent JSON，以及有 gold risk 时的 Judge JSON 均可解析且相互一致；
4. `scripts/audit_phase2_outputs.py --require-no-failures` 通过；
5. 审计后重新生成配对统计、中文报告和图表，并重新运行全套测试。

人类盲审属于独立的文本质量验证：在至少两位独立标注者的共识文件回收前，任何合成语料均不得表述为“人工审核通过”。

## 关键产物

- `reports/synthetic_audit/README_zh.md`：正式候选池自动审计结果。
- `runs/phase2/agent_run_metrics.csv`：逐次 Agent 运行和指标的权威记录。
- `reports/phase2/paired_course_metrics.csv`、`effect_summary.csv`：clean–attack 配对差值与课程级 bootstrap 汇总。
- `reports/phase2/RESULTS_zh.md`：自动生成的中文结果报告；会根据完整矩阵状态自动区分“中期”与“正式”。
- `figures/phase2/`：执行覆盖、配对效应和 BM25 Evidence Recall@8 图；图标题会标注中期或完整矩阵状态。
- `human_audit/synthetic_blind_round1/`：人工盲审文件、中文说明与回收指南。
- `PHASE3_BASELINES_PLAN_zh.md`：防御基线的冻结模型、矩阵、验收标准和资源边界。
