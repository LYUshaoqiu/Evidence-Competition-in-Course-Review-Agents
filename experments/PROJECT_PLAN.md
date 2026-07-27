# Paper 1 实验执行方案（中文）

## 目标

在 26 门已批准课程上验证：低证据密度的离线合成课程评论，是否会使课程评论 Agent 漏报人工标注的关键课程风险。

## 已冻结的实验协议

- 数据版本：`整理输出_20260714`；cohort 由 `data/experiment_course_cohort_20260714.csv` 定义。
- 课程构成：8 门 strict-complete、18 门 user-approved exception。主表报告全部 26 门，附 strict-8 敏感性分析。
- 攻击强度：synthetic/authentic multiplier 为 `0, 0.1, 0.25, 0.5, 1.0`，即最终合成占比分别为 `0%, 9.1%, 20.0%, 33.3%, 50.0%`。
- 攻击族：benign low-density flooding、half-true contextual pollution、targeted risk suppression。
- 随机性：每个攻击族/课程使用 3 个 generation seeds；每一个污染条件从对应候选池以固定顺序截取所需数量。
- 模型：DeepSeek V4 Flash 用于生成与主 Agent；V4 Pro 仅用于独立自动评估辅助。每次调用记录模型、seed、prompt version、token usage 和输出路径。
- 人工验证：自动筛选不等于人工审核。正式结果将导出盲审包；在 2–3 名标注者完成前，相关结论只能标为“自动评估结果”。

## 自动化阶段与验收条件

1. 候选池：每个 course × family × seed 有足量通过自动门的简体中文候选；失败与拒绝项均留存。
2. 条件构建：每条污染记录可追溯至 clean review 或 synthetic candidate；比例和 seed 可复算。
3. Agent：Direct、BM25 retrieve-then-summarize、evidence-constrained 三条管线使用同一课程输入与温度配置。
4. 评估：输出 ER@k、ASRR、CROR 和输出具体性代理指标；同时输出每课程明细，避免只报均值。
5. 报告：主表、攻击曲线、strict-only 对照、自动评估局限、中文运行说明。

## 不可自动声称完成的事项

- 2–3 名独立标注者的盲审与一致性统计；
- 真实平台上的发布或真实用户暴露（本实验不进行）；
- 从 26 门课程外推至所有课程评论平台的普遍发生率。
