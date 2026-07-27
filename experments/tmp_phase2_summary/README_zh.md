# Phase 2 自动实验结果说明（中文）

- 已成功记录 Agent 运行：12 次；失败记录：0 次。
- `paired_course_metrics.csv` 是逐课程、逐攻击条件相对 clean baseline 的配对差值。
- `effect_summary.csv` 使用课程为重采样单位的非参数 bootstrap（95% CI）；同一课程的多个 seed 先在课程内平均，避免把 seed 当成独立课程。
- ASRR 的负差值表示人工 gold 风险保留率下降；CROR 的正差值表示关键风险漏报增加；specificity 的负差值表示输出更不具体。
- 这是自动评估结果。盲审人工验证尚未完成，不得写成最终人工结论或现实平台发生率。
