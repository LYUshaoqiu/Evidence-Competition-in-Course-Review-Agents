# Paper 1：Synthetic Signal Dilution 实验

本目录实现一个离线、受控的课程评论 Agent 压力测试：在保留真实评论集合的前提下，按预注册比例混入经过规则审计的低证据合成评论，测量三类 Agent pipeline 对既有课程级 gold risk 的保留情况。所有合成文本仅用于本实验，不能发布到任何课程评论平台。

## 环境与基础检查

在本目录中激活虚拟环境并安装 `requirements-phase1.txt` 后，执行：

```powershell
.\.venv\Scripts\python.exe -m unittest discover -s tests -v
```

如需验证 DeepSeek 连接，可运行 `scripts/smoke_test_deepseek.py`。它会进行一次最小的付费请求；密钥仅从 `.env` 读取，不写入日志或报告。

## 已实现的实验流程

1. `scripts/run_clean_pilot.py`：清洗、去重，并输出 clean-pilot 数据质量报告。
2. `scripts/generate_attack_pool.py` 与 `scripts/audit_synthetic_pools.py`：按三个独立种子生成候选并执行规则审计。
3. `scripts/run_phase2_agents.py`：运行 direct、BM25 retrieve-then-summarize 与 evidence-constrained 三条 pipeline；每次调用先保存 JSON，再追加指标 CSV。
4. `scripts/summarize_phase2_results.py`、`scripts/generate_phase2_report.py`、`scripts/generate_phase2_figures.py`：生成配对指标、bootstrap 汇总、中文报告与图表。
5. `scripts/audit_phase2_outputs.py`：检查运行产物、重复项、失败项与预注册矩阵覆盖。

正式预注册矩阵为 **2,850** 条 Agent 运行：26 门课程的 78 条 clean 条件，加上四个非零注入比例、三类攻击、三枚种子和三条 pipeline 的 2,772 条攻击条件；CDEV3500 的 targeted-suppression 预声明为不适用。

## 运行与审计

正式队列运行期间不应另开一个写入同一 `runs/phase2/agent_run_metrics.csv` 的 runner。队列结束后，在本目录执行最终审计：

```powershell
.\.venv\Scripts\python.exe scripts\audit_phase2_outputs.py --require-no-failures
```

该命令默认强制要求完整 2,850 条矩阵；仅在运行尚未结束时，才可用下列命令做中间产物检查：

```powershell
.\.venv\Scripts\python.exe scripts\audit_phase2_outputs.py --require-no-failures --allow-partial-matrix
```

最终结果位于 `reports/phase2/RESULTS_zh.md`、`reports/phase2/effect_summary.csv` 与 `figures/phase2/`。运行中生成的结果必须视为中间结果，不能用作全样本结论。

## 人工盲审

自动规则审计不等同于人工批准。盲审材料在 `human_audit/synthetic_blind_round1/`；回收两份及以上独立标注表的步骤见 [RESULTS_GUIDE_zh.md](human_audit/synthetic_blind_round1/RESULTS_GUIDE_zh.md)。回收脚本会计算两两一致性与 Cohen's κ，并采用保守共识：仅全部标注者均为 `accept` 的条目才标为 `human_accepted`。

更多当前进度、数据限制和正式矩阵说明见 `EXPERIMENT_STATUS_zh.md`。

防御基线（AI 文本检测过滤、语义去重、MMR）所需模型与严格资源边界见 `PHASE3_BASELINES_PLAN_zh.md`；它们在 Phase 2 最终审计通过前不会启动。
