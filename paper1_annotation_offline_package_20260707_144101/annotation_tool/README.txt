Paper 1 课程评论标注工具

打开方式：
1. 双击 index.html。
2. 在页面右上角填写 annotator_id / 标注人 ID，例如 alice、bob、zhangsan。
3. 点击“导入评论 CSV”。
4. 选择 data/selected_38_courses_ge8_comments_20260706.csv，或选择你本机上的 selected_38_courses_ge8_comments_20260706.csv。

主要功能：
- 按 course_code 合并后的课程列表浏览。
- 逐条评论做评论级标注。
- 多选 aspect labels / risk labels。
- 标签管理里可以新增、修改、删除多选标签。
- 添加 evidence units / 证据片段。
- 添加课程级 must-report risks / 必须报告风险。
- 标注自动保存在浏览器 localStorage。
- 可导出三份 CSV：
  1. review_annotations_<annotator_id>.csv
  2. evidence_units_<annotator_id>.csv
  3. course_gold_risks_<annotator_id>.csv

注意：
- localStorage 绑定当前浏览器和当前本地页面来源。正式标注时请定期导出 CSV 备份。
- 每个人只标自己分配到的课程，不要改动其他人的课程。
- 当前工具是静态前端版本，不会自动写回磁盘。
- 如果要多人协作，请每个人导出自己的 CSV，再由负责人统一合并。