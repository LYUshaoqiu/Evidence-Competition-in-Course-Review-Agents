# Phase 3 防御基线与推断计划（中文）

## 范围与当前状态

Phase 2 的 2,850 条预注册运行是“无过滤/原始输入”的主实验矩阵。Phase 3 不会替换或覆盖该矩阵；它在**完全相同的已保存污染条件**上增加防御干预，并将所有输出写入独立目录 `runs/phase3/`。截至本计划版本，Phase 3 尚未启动：当前环境没有可版本化的中文嵌入模型或 AI 文本检测器，因此不能把字符规则伪称为“语义去重”或“AI 检测”。

## 冻结资源

| 用途 | 资源 | 运行时 | 固定方式 | 已知限制 |
|---|---|---|---|---|
| 语义去重与 MMR | `BAAI/bge-m3` | `sentence-transformers` | 下载后记录 Hugging Face snapshot commit 与本地 SHA-256 | 通用多语种嵌入，不是 UNSW 课程评论专训模型 |
| AI 文本检测过滤 | `Hello-SimpleAI/chatgpt-detector-roberta-chinese` | `transformers` | 下载后记录 snapshot commit、标签映射与阈值 | 训练于 HC3/ChatGPT 类型文本；对 DeepSeek 生成文本可能分布外，不能将其检测率泛化为真实平台检测率 |

模型来源与使用接口见各自模型卡：[BGE-M3](https://huggingface.co/BAAI/bge-m3)、[中文检测器](https://huggingface.co/Hello-SimpleAI/chatgpt-detector-roberta-chinese)。下载脚本必须在运行时保存实际 commit；不得只记录浮动的 `main` 标签。

Phase 2 最终审计通过后，使用下列命令安装并冻结模型（不要在 Phase 2 队列运行时执行）：

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements-phase3.txt
.\.venv\Scripts\python.exe scripts\prepare_phase3_models.py
```

第二条命令会产生 `data/phase3_models/MODEL_MANIFEST.json`，其中包含实际 Hugging Face commit、本地路径与目录 SHA-256；Phase 3 runner 只接受该 manifest 中的本地模型。

## 干预定义（预注册）

1. **No defence**：Phase 2 原始结果，不重跑。
2. **AI-detector filtering**：对每条输入评论用冻结二分类器获得 AI 概率；概率 `>=0.50` 的评论被过滤。报告被过滤的真实/合成比例，防止只报告攻击是否被拦截。
3. **Low-quality filtering**：仅用输入文本的、与 gold risk 无关的规则分数（长度、重复字符率、词汇多样性）；阈值仅在 clean 评论的 10% 分位上校准并固定。该基线是可解释的低质量过滤，不宣称是 AI 检测。
4. **Semantic deduplication**：按确定性记录顺序贪婪保留评论；若与已保留评论的 BGE-M3 cosine 相似度 `>=0.92`，则过滤后者。阈值与记录顺序写入条件 JSON。
5. **MMR retrieval**：仅作用于 retrieve-then-summarize；用 BGE-M3 dense relevance 与已选证据的最大相似度计算 MMR，`λ=0.70`、`k=8`。它替代 BM25 top-k，不改变污染集合。
6. **Prompt-only citations**：Phase 2 的 `evidence_constrained` pipeline 已是此基线：要求每项风险给出评论 ID/证据。它不重新命名为新方法，Phase 3 表中仅引用对应 Phase 2 结果。

所有干预仅基于评论文本、固定查询和预先定义的阈值；不得读取 gold risk、攻击族或人工标注标签来决定过滤。

## 运行矩阵与统计口径

- 检测过滤、低质量过滤、语义去重：对 Phase 2 的三条 pipeline 重跑 26 课程 × 3 攻击族 × 4 非零比例 × 3 seeds；CDEV3500 targeted-suppression 仍不适用。
- MMR：对同一非零条件的 retrieve-then-summarize 运行；No-defence BM25 作为直接对照。
- Prompt-only citations：复用 Phase 2 evidence-constrained 输出，避免不必要的重复 API 调用。
- 每个干预保留过滤前/后 record IDs、被移除评论 ID 与原因、检索排名、模型 commit、prompt version、Agent JSON 与 judge JSON。
- 主比较是相同 course × family × ratio × seed × pipeline 下的“干预 − 无防御”差；按课程聚合 seed，再做配对 bootstrap 95% CI。26-course 为内部基准；strict-8 为敏感性分析。报告所有课程值，不做总体发生率宣称。

完整执行量为 **9,240 条新增 Agent 运行**：3 个过滤防御 × 3 pipelines × 924 个非零污染条件 = 8,316 条，外加 MMR × 924 条。除 CDEV3500 的 240 条无 gold 条件外，绝大多数 Agent 输出还会触发独立 judge 调用。因此，在 Phase 2 最终审计、模型准备和实际 API 余额确认后，必须再次确认此项显著的付费调用扩展再启动；不能将“已实现 runner”写成“已完成 Phase 3 实验”。

## 验收门槛

1. Phase 2 完整矩阵审计 PASS（2,850 条、无失败、产物完整）后才启动 Phase 3。
2. 每个模型下载有确定 commit 和本地哈希；缺失模型时 Phase 3 明确为未运行，而非降级伪实现。
3. 每个防御条件都有输入集合哈希、过滤日志和 Agent/judge JSON；无重复 run ID。
4. 对于 AI-detector filtering，必须同时报告真实评论误过滤率与合成评论过滤率。
5. 人工盲审仍独立于 Phase 3：未完成时，所有合成文本继续标为 `pending_human_audit`，不写作“已人工验证”。

## 资源与执行风险

安装 `torch`、`transformers`、`sentence-transformers` 和下载两份模型会占用较大磁盘/网络，并可能与正在进行的 DeepSeek 队列争用资源。因此只在 Phase 2 队列结束且系统完成最终审计后下载模型、开始 Phase 3。若模型下载、许可证或硬件不足，则 Phase 3 保持未运行，并在论文中将防御比较写为后续工作，不能用规则近似替代。
