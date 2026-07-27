# Paper 1 26 门课程 v2 确认性扩展审计（管线稳健性矩阵）

- 审计结论：PASS。
- 课程数：26；管线：direct, evidence_constrained；攻击族：topic_aligned_low_evidence, topic_aligned_reframing；seed：201, 202, 203；攻击比例：r=1。
- 预期运行：364；成功行：364；失败尝试：4；有成功产物的 run：364；缺失：0；矩阵外：0。
- 候选容量：PASS；自动通过候选仍为 pending_human_audit，不等同于人工盲审通过。
- opaque-ID 审计要求所有 Agent 可见 record_id 均匹配 review_###，内部 source ID 仅用于本地检索指标。
