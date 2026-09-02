# 中文文档 AI 味重写待办清单

> 生成时间：2026-09-02。来源：第二轮全站句子级扫描（104 篇全覆盖）。
> 第一轮已完成的 17 篇重写见文末"已完成记录"。

## 改写原则

- 面向中文用户的产品化表述，专业、对用户友好的用词
- 只改文字表达，保留原有加粗、引号等强调标记；强调本身是空话营销时才连标记一起删
- 数据、命令、hash、链接、实验数字、Mintlify 组件不动
- 技术博客保留作者第一人称，只校对不改文风
- 先改中文，英文待用户确认后再动

## P0 成片重灾区（整节改）

| 文章 | 问题规模 | 典型证据 |
| --- | --- | --- |
| zh/concepts/faq.mdx | 9 处 | "散文 `PRECHECK`"（prose 误译）、"制品 DAG"（与全站"产物"术语冲突）、"自然语言触发会漏气"（leaky）、"前门问题"（front-door）、"自动提交为Superpowers源码行为"整句机翻、您/你混用 |
| zh/tech-blog/comet-beyond-skill.mdx | 约 24 处（校对，不改文风） | GroudTruth、浅尝即止→浅尝辄止、撇见→瞥见、"状态扭转"→"状态转移"、SKill 大小写、编号跳号 1/2/4/5、多段句末缺句号、"他"指代工具应为"它"、半角括号 |
| zh/plugins/project-knowledge-principles.mdx | 9 处 | "形成项目意义的工程经验"、"有界检索链"×2（同文又用"有限"，前后不一）、"用户明确权威"、"精确工程证据""广域探索"直译 |
| zh/concepts/auto-transition.mdx | 11 行半角标点 + 1 处缺宾语 | 全篇半角逗号/冒号（全站唯一系统性重灾区）；"继续还是创建新"缺宾语 |
| zh/concepts/workflow.mdx | 7 处 | "物理对接"、"两个世界的显式链接"、"Fable 5、GPT-5.6 以下"含本数歧义（与同段"及同档更适合 Native"矛盾）、"确定性"×2、"一等产物" |
| zh/concepts/review-mode.mdx | 6 处 | "task reviewer 合同"（contract 误译，应为"契约"）×2、"没有隔离实现者可逐任务审查"语法不通、"`thorough` 它是有代价的"衍字 |

## P1 中等（每篇约 5 处）

| 文章 | 处数 | 要点 |
| --- | --- | --- |
| zh/guides/resuming-workflow.mdx | 9 | "按阶段确定性路由"、"不会被自动猜测"、标题"跨设备 0 上下文断点恢复现场"、"拦截……的进入"、半角引号 |
| zh/guides/prd-splitting.mdx | 9 | 2 句直译（description 英文压缩式、"这里依赖"缺"的"）+ 7 处半角引号 |
| zh/plugins/project-rules.mdx | 5 | "执行确定性边界"、"形成项目意义"、长定语"确定性验证入口"、"额外路径相对项目根目录"缺谓语 |
| zh/eval/scoring.mdx | 4 | "运行器噪声"、"被要求："悬空被动、"产物的实质深度"、"浅薄"形容产物 |
| zh/tech-blog/comet-0.3.9-to-0.4.0.mdx | 6 | "最受 Windows 用户欢迎"（无数据）、"四个桶"（bucket）、"被证据门禁"不成句、"低成本发现预检查"、半角引号 |
| zh/eval/comet-baseline-experiment.mdx | 5 | 中英缺空格×4（"在LangSmith中"类）、半角引号 |
| zh/plugins/agent-learning-loop.mdx | 4 | 开头与上文重复的总结句、"可确定判断的边界"、"获得更高权威"缺中心词 |
| zh/skill-creator/engine.mdx | 3 | 10 处破折号、"为什么重要"三连同构列表、"不能协商扩大" |
| zh/concepts/decision-points.mdx | 4 | 停顿点编号错误（"5"出现两次）、"0 上下文"压缩语、"调和可验证状态"直译 |
| zh/native/scenarios/requirement-changes.mdx + zh/native/safety-and-recovery.mdx | 5 | "归档授权"术语 5 处（archive approval 直译，统一改"归档批准"） |
| zh/guides/existing-project.mdx | 4 | description 英文压缩式残留、半角引号×2、"官方数据约为 2 倍速度"主谓不匹配 |

## P2 句级点改（每篇 1-3 处）

### 直译词

- zh/cli/creator.mdx、zh/cli/bundle.mdx："用户 CLI 表面"（surface）→"入口"；bundle 另有"薄确定性外壳"
- zh/cli/dashboard.mdx："有界汇总"
- zh/cli/publish.mdx："预设的心智模型"
- zh/cli/skill.mdx："所有文件 IO 都沙箱化在"
- zh/cli/init.mdx："事实源"（source of truth）
- zh/cli/doctor.mdx："需要授权的项目修复"→"需要确认"
- zh/scripts/comet-handoff.mdx："物理对接"
- zh/scripts/comet-archive.mdx："稳定、确定性入口"、"悬在工作树"
- zh/scripts/comet-native.mdx："会等待用户"
- zh/scripts/comet-state.mdx："进入明确的工作目标后先执行"拗口定语
- zh/skill-creator/overview.mdx："状态表面"、"负责……的确定性"、"确定性后端"
- zh/eval/eval-driven-evolution.mdx 残留："一等评测对象"、长定语链（169 行）
- zh/eval/comet-native-clarification-experiment.mdx："失败面"
- zh/eval/comet-native-vs-rc1-beta16-experiment.mdx："噪声壳"、"经验性 trade-off"、"说明……参考值"动宾不搭
- zh/classic/configuration.mdx："逃逸口"（escape hatch）、description 名词串
- zh/native/native-loop.mdx：标题"闭环式实现与验收"（第一轮漏改）
- zh/native/recovery-playbook.mdx:46："从仓库中可以证明的状态"
- zh/native/scenarios/requirement-changes.mdx:141："可证明仍然有效的事实"
- zh/native/scenarios/parallel-changes.mdx:101："不会授权清理无关修改"
- zh/native/configuration.mdx:107："不会替你授权 merge"
- zh/concepts/state-management.mdx："失败关闭"待加 fail closed 注释、2 句名词串病句（83、93 行）
- zh/concepts/intermediate-artifacts.mdx："SubAgent"与中文间缺空格×7

### GPT 腔残留

- zh/concepts/native-workflow.mdx："本质上"（33 行）、"换句话说"（43 行）、"确定性转发"（114 行）
- zh/concepts/intent-routing.mdx：224 行"换句话说"、87-88 行冒号格式残留
- zh/tech-blog/comet-0.4.0-rc1.mdx：开头三连排比、"恢复时丢失后"歧义、"不能授权提交"
- zh/eval/overview.mdx："作为一个产品能力"、"信息性"独立成句
- zh/eval/quickstart.mdx:172 悬空句；zh/eval/agent-setup.mdx:253 悬空句
- zh/eval/harness.mdx:21"错误顺序"；zh/eval/runtime.mdx:100"Agent 候选"
- zh/eval/why-eval.mdx:84"实质深度"残留

### 格式与笔误

- zh/skill-creator/preferences.mdx:54：**"只允许这四个 key"实列 5 个（事实错误）**
- zh/skill-creator/publishing.mdx:34：draft hash 指代不清；224 行"确定性状态"
- zh/skill-creator/workflow.mdx:432："常用命令"标题下无命令
- zh/presets/hotfix.mdx:223："升级后绝不会自动归档"疑似笔误（本节讲归档必停）
- zh/phases/design.mdx:129："你可能被要求手动压缩"
- zh/phases/archive.mdx:125：多层定语长句
- zh/home.mdx："全面自动的Coding"、"Engineer驱动"、"更多的HITL"中英混排
- zh/tech-blog/index.mdx:14："不止Skill"冒号与空格（与 beyond-skill 标题联动）
- zh/plugins/personal-memory.mdx:16："一次性授权边界"；personal-memory-principles.mdx:110"授权边界"、59"规范化机器状态"
- zh/guides/state-recovery.mdx:8："恢复真实事实"（ground truth）
- zh/guides/mid-workflow-changes.mdx 残留：129 行"将 phase 返回 design"、153 行"授权丢弃"
- zh/guides/classic-layout-migration.mdx 残留：description 状语错位、128 行"保留所有 Classic 事实"
- zh/guides/project-structure.mdx:6：Understanding…helps you 句式
- zh/guides/install-and-update.mdx:58："不正确处理"否定错位
- zh/native/scenarios/document-driven-execution.mdx 结尾："同一套可恢复、可验收的长程执行流程"抽象名词串

## 全局统一项

1. "一等产物"（workflow/tweak/hotfix）vs"正式产物"（intent-routing）→ 统一为"正式产物"
2. "归档授权"×5 → "归档批准"
3. "实质深度"×3（why-eval/scoring/eval-driven-evolution）→ "是否有实质内容"
4. "确定性"非固定搭配约 10 处、"授权"滥用约 8 处 → 逐句改自然表达
5. 半角引号批量清理（prd-splitting、existing-project、resuming-workflow、0.3.9-to-0.4.0、baseline-experiment）；beyond-skill 的"他→它、的→地"
6. 非文风问题：eval 4 篇（quickstart/agent-setup/harness/faq）代码块 Windows 路径双反斜杠 `\\.comet\\eval\\.env`，渲染会显示两个反斜杠，改单反斜杠

## 已完成记录（第一轮，2026-09-02）

- 整页重写：zh/overview.mdx
- 理念段落：concepts/intent-routing、context-compression、native-workflow、native/native-loop、native/scenarios/supervisor-change-delivery、eval/why-eval、eval/eval-driven-evolution、tech-blog/comet-vs-industry
- 直译句修复：cli/update、cli/resume-probe、guides/classic-layout-migration、guides/existing-project、changelog 0.3.x 段
- 格式清洗：guides/mid-workflow-changes（全篇标点）、guides/install-and-update（第 3 节）、native/faq（孤儿段落收进 Accordion）
- 全局：home 页 3 处、"失败闭合"→"失败关闭"统一、AGENTS.md 补"改写保留强调标记"规则
