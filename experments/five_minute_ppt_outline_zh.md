# 5 分钟项目汇报 PPT 大纲：攻击视角版

**建议主标题：**

> **不说谎，也能让课程风险“消失”吗？**  
> *Stress-testing evidence integrity in course-review agents*

**核心叙事：** 这不是“模型会不会被欺骗”的泛泛展示，而是一个更具体的问题：当系统只能检索有限数量的评论作为证据时，主题相关但信息稀薄的内容，能否通过竞争有限证据位来弱化一个原本有充分支持的课程风险？结论是：**对 BM25 这类词法检索链路，攻击可见；对直接总结和证据约束链路，效果并不稳定。**

建议共 **6 页**；每页 40--55 秒。PPT 页面只保留结论、图和少量数字，细节用口头说明。

## Slide 1｜不说谎，也能让课程风险“消失”吗？（35 秒）

**这一页的任务：制造问题与风险感。**

- 视觉：左右两列的概念图。
  - 左：几条具体评论，如“assessment task 很难、feedback 很少” → Agent 摘要：`Assessment workload is a well-supported risk.`
  - 右：加入大量看似相关但空泛的评论，如“assessment 其实因人而异”“认真准备就还好” → 同一个 Agent 的摘要：`Assessment can be challenging for some students.`
- 页面大字：**攻击不需要伪造事实；它可能只需要挤走事实。**
- 口头转场：学生会用摘要做选课决策。问题不在于评论是否“流畅”，而在于摘要所依据的有限证据位是否还能被真正有信息的评论占据。
- 小字边界：`Controlled offline stress test; no claim about the authorship or intent of real reviews.`

## Slide 2｜攻击模型：争夺有限的“证据预算”（45 秒）

**这一页的任务：把攻击说清楚。**

- 视觉：`真实评论池 + 主题对齐低信息文本 → Top-8 检索位 → 摘要 Agent`。
- 三个简短标签：
  - **Target:** 已标注的课程风险，例如 assessment 难度。
  - **Attack:** 同主题、表面合理、但缺少可核验细节的评论。
  - **Goal:** 让目标风险在摘要中更弱、更不具体，或被遗漏。
- 关键一句：**攻击的是检索阶段的注意力／证据槽位，而不是直接命令模型输出某句话。**
- 口头说明：每一个攻击条件都与同一门课程的 clean 条件配对，所以看到的是加入内容后的变化，而不是课程之间本身的差异。

## Slide 3｜我如何把这个攻击变成可检验的实验？（50 秒）

**这一页的任务：建立可信度。**

- 左侧：`26 门课程`、`220 条完整评论标注`、`206 个证据单元`、`54 个课程级风险`。
- 中间：两种受控内容家族：`low evidence` 与 `mild reframing`；主实验为 $r=1$（合成内容数 = 原始评论数）。
- 右侧：同样的输入，测试三条系统设计：
  1. Direct summarization
  2. BM25 retrieve-then-summarize
  3. Evidence-constrained summarization
- 页面底部：**我评估“真实证据有没有被检索到”，也评估“最终风险有没有被保留”。**
- 口头说明：条件标签不暴露给 Agent；旧实验发现 record-ID 泄露风险后被排除，并用 opaque IDs 重新运行。

## Slide 4｜主结果：BM25 的有限检索位确实可被挤占（60 秒）

**这一页的任务：给出最有力的一击。**

- 放置图：`F2_course_level_bm25_r1_effects.png`（或论文包中对应的 BM25 $r=1$ 配对效应图）。
- 图旁只放两行数字：
  - Target-evidence recall@8：约 **−0.67**
  - Target-risk retention：**−0.423**（low evidence） / **−0.359**（reframing）
- 讲述标题：**同主题但低证据的内容，能挤掉 BM25 top-8 中支持真实风险的评论。**
- 口头解释：这不是“风险一定消失”；更精确地说，是可支持风险的原始证据显著退出有限 top-$k$，并且最终摘要中风险保留程度下降。

## Slide 5｜这不是“所有 LLM 都能被打穿”：攻击取决于系统设计（55 秒）

**这一页的任务：把结果从“炫技攻击”升级成“有机制的发现”。**

- 放置图：`F3_pipeline_r1_forest.png`。
- 页面结论：
  - **BM25：稳定下降**
  - **Direct / evidence-constrained：置信区间跨 0**
- 右下角可小幅加图：`F5_opaque_replay_bm25_dose_response.png`，并标注：
  - `Independent condition-blind replay`（更准确可写为 `condition-blind opaque-ID replay`）
  - `Higher tested exposure → generally larger BM25 loss`
- 口头解释：真正值得带走的不是“LLM 很脆弱”，而是 **检索器的证据选择机制决定攻击是否传导至最终摘要**。证据约束是一个值得继续验证的防护方向。

## Slide 6｜我完成了什么，以及下一步如何把它做成可靠系统（45 秒）

**这一页的任务：以项目产出和专业反思收尾。**

- 三项产出：
  - 可复现的 26 课程压力测试框架与审计记录；
  - 经过 condition-blind 执行的主实验和 replay；
  - 候选评论与摘要的探索性人工盲审材料。
- 三项专业反思：
  - 发现标签泄露后，**不保留旧结论，而是排除并复跑**；
  - 不将真实评论作者武断归因于 AI、广告或恶意行为；
  - 原始评论受控保存，合成内容不投放真实平台。
- 下一步：第二位标注者与一致性分析、v1 候选文本人工审核、hybrid retriever 与防御机制比较。
- 结尾句：**可信的课程摘要，不只取决于模型是否会写，更取决于系统是否守得住它的证据。**

## 呈现风格

- 主视觉采用“干净的真实证据”与“橙色低信息干扰内容”的对比；蓝色代表证据，橙色代表受控干预，绿色代表防护或 evidence-constrained pipeline。
- 少用表格，不列文件路径、不展示 API/seed/脚本细节；Slide 4 和 5 只让图承担证据任务。
- 标题必须是结论句，而非“Method / Result”等章节名。
- 不建议使用“AI 生成内容一定是攻击”或“攻击可操控所有 LLM”之类的表述；本项目证明的是特定受控条件下的**证据竞争机制**。
