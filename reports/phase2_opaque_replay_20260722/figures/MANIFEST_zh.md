# Phase 2 图表清单（中文）

- F1：当前成功运行覆盖度；属于执行监控图，不是效果结论。
- F2：direct-aggregator 的 clean-attack 配对效应与课程级 bootstrap 95% CI；标题强制显示当前课程覆盖量。仅在完整矩阵和人工盲审完成后可作为最终主图。
- F3：BM25 的 Evidence Recall@8；呈现可用运行的绝对均值，不能将缺失条件解释为零效果。
- 所有图均由 `scripts/generate_phase2_figures.py` 从落盘 CSV 重建；未使用 AI 生成图像。
