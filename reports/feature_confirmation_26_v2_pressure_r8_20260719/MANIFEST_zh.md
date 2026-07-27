# Paper 1 r=8 worst-case exposure pressure test reproducibility manifest

- 执行时间：2026-07-19T15:27:14.344743+10:00
- 研究边界：仅 Paper 1；本地离线保存 Agent/Judge 输出；record ID 使用 opaque review_###。
- 压力条件：r=8；Direct 与 evidence-constrained；两类攻击族；seed=201,202,203；26 门课程。
- 成功 run：364；失败尝试：0；候选记录：21888。
- `.env` 仅在运行时加载；未写入本 manifest，也未输出 API key。

## 输入文件 SHA-256

| 文件 | 绝对路径 | SHA-256 |
|---|---|---|
| experiment_course_cohort_20260714.csv | `C:\Users\MSN\Desktop\unsw\6441\project\paper1_experiments\data\experiment_course_cohort_20260714.csv` | `6c263049af0134ec772f288a3d2474cafb772819ab6ccc6a3932792f639fdbe6` |
| combined_review_annotations_clean_dedup.csv | `C:\Users\MSN\Desktop\unsw\6441\project\回收标注\整理输出_20260714\combined_review_annotations_clean_dedup.csv` | `688385d92691517b8e0bb3d964de923aa850252b95fd5ba0052026be256f6ce4` |
| combined_course_gold_risks_clean_dedup.csv | `C:\Users\MSN\Desktop\unsw\6441\project\回收标注\整理输出_20260714\combined_course_gold_risks_clean_dedup.csv` | `dbc5a3e259f069825c15ad4445b7dc99e4e6e8d2e08d8241c3bbb1b18469d970` |
| tmp_course_comments.sql | `C:\Users\MSN\Desktop\unsw\6441\tmp_course_comments.sql` | `8f0a1b5f2b1a91386a1643ce3ca3e1f25bbde455d060f5071341e4ce2fdb137e` |
| tmp_courses.sql | `C:\Users\MSN\Desktop\unsw\6441\tmp_courses.sql` | `836f88a2fa19e3db3bc13cdd949b77fdda35c22b77369aa1bb53f05df8acc47f` |
| target_specs.json | `C:\Users\MSN\Desktop\unsw\6441\project\paper1_experiments\data\feature_confirmation_26_v2_20260719\target_specs.json` | `1290c1c7eda71211e0f31f67ae3830fe1fd92d7de8725e117c648b458ffb6db2` |
| context_cards.json | `C:\Users\MSN\Desktop\unsw\6441\project\paper1_experiments\data\feature_confirmation_26_v2_20260719\context_cards.json` | `579d057944c9b98b7ec99910680c4751603b9ac1e244f27e5ad1fe15476bc786` |
| feature_confirmation_candidates_r8_20260719.csv | `C:\Users\MSN\Desktop\unsw\6441\project\paper1_experiments\data\feature_confirmation_26_v2_pressure_r8_20260719\feature_confirmation_candidates_r8_20260719.csv` | `c96c9af3a0504c0db629961c93d73912d01ed6d285ab93bc543bda7c4eb74ad8` |

## 输出

- 指标：`C:\Users\MSN\Desktop\unsw\6441\project\paper1_experiments\runs\feature_confirmation_26_v2_pressure_r8_20260719\agent_run_metrics_merged.csv`
- 候选池：`C:\Users\MSN\Desktop\unsw\6441\project\paper1_experiments\data\feature_confirmation_26_v2_pressure_r8_20260719\feature_confirmation_candidates_r8_20260719.csv`
- 运行目录中的 conditions、agent_outputs、judge_outputs 与日志用于逐 run 复核。
