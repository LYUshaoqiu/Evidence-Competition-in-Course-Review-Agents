# Paper 1 26 门课程 v2 确认性扩展运行清单

- 执行日期：2026-07-19T14:08:54.310229+10:00
- 研究边界：仅 Paper 1；离线实验；Agent 可见 ID 为 opaque `review_###`；未向任何课程评论平台发布文本。
- 生成模型：`deepseek-v4-flash`；Judge 模型：`deepseek-v4-pro`。
- 候选提示版本：`feature_pilot_candidate_outline_context_v2`；Agent 提示版本：`feature_pilot_targeted_agent_v1`；Judge 提示版本：`feature_pilot_targeted_judge_v1`。
- 攻击族：`topic_aligned_low_evidence`、`topic_aligned_reframing`；seed：201、202、203；主比例：r=1。
- 主矩阵成功 run：182；稳健性矩阵成功 run：364；候选总行：2736；候选自动通过：2648。
- 主矩阵：26 × (1 clean + 2 攻击族 × 3 seed) = 182；管线为 BM25 retrieve-then-summarize。
- 稳健性矩阵：26 × 2 pipelines × (1 clean + 2 攻击族 × 3 seed) = 364；管线为 Direct 与 evidence-constrained。
- 压力测试 r=8：本次未运行，因其为可选附录条件。

## 输入文件哈希（SHA-256）

| 文件 | 绝对路径 | SHA-256 |
|---|---|---|
| experiment_course_cohort_20260714.csv | `C:\Users\MSN\Desktop\unsw\6441\project\paper1_experiments\data\experiment_course_cohort_20260714.csv` | `6c263049af0134ec772f288a3d2474cafb772819ab6ccc6a3932792f639fdbe6` |
| combined_review_annotations_clean_dedup.csv | `C:\Users\MSN\Desktop\unsw\6441\project\回收标注\整理输出_20260714\combined_review_annotations_clean_dedup.csv` | `688385d92691517b8e0bb3d964de923aa850252b95fd5ba0052026be256f6ce4` |
| combined_course_gold_risks_clean_dedup.csv | `C:\Users\MSN\Desktop\unsw\6441\project\回收标注\整理输出_20260714\combined_course_gold_risks_clean_dedup.csv` | `dbc5a3e259f069825c15ad4445b7dc99e4e6e8d2e08d8241c3bbb1b18469d970` |
| tmp_course_comments.sql | `C:\Users\MSN\Desktop\unsw\6441\tmp_course_comments.sql` | `8f0a1b5f2b1a91386a1643ce3ca3e1f25bbde455d060f5071341e4ce2fdb137e` |
| tmp_courses.sql | `C:\Users\MSN\Desktop\unsw\6441\tmp_courses.sql` | `836f88a2fa19e3db3bc13cdd949b77fdda35c22b77369aa1bb53f05df8acc47f` |
| target_specs.json | `C:\Users\MSN\Desktop\unsw\6441\project\paper1_experiments\data\feature_confirmation_26_v2_20260719\target_specs.json` | `1290c1c7eda71211e0f31f67ae3830fe1fd92d7de8725e117c648b458ffb6db2` |
| context_cards.json | `C:\Users\MSN\Desktop\unsw\6441\project\paper1_experiments\data\feature_confirmation_26_v2_20260719\context_cards.json` | `579d057944c9b98b7ec99910680c4751603b9ac1e244f27e5ad1fe15476bc786` |
| feature_confirmation_candidates_r1_20260719.csv | `C:\Users\MSN\Desktop\unsw\6441\project\paper1_experiments\data\feature_confirmation_26_v2_20260719\candidates_real\feature_confirmation_candidates_r1_20260719.csv` | `8d3b84c3ceeb82296290ea36126e9dff41d550c9017a6441c78f381cb0fb568f` |

## 环境与产物

- Python 环境：`C:\Users\MSN\Desktop\unsw\6441\project\paper1_experiments\.venv`。
- 主 run 目录：`C:\Users\MSN\Desktop\unsw\6441\project\paper1_experiments\runs\feature_confirmation_26_v2_20260719\main`。
- 稳健性 run 目录：`C:\Users\MSN\Desktop\unsw\6441\project\paper1_experiments\runs\feature_confirmation_26_v2_20260719\robustness`。
- 本地 `.env` 仅用于运行时加载，未打印、未写入 manifest、未计算哈希。
- 既有 `feature_pilot_outline_context_v2` 目录及 v1 结果未覆盖。
