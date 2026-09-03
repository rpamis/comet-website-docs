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
- 全局：home 页 3 处、“失败闭合”→“失败关闭”统一、AGENTS.md 补“改写保留强调标记”规则

## 已完成记录（第二轮，2026-09-02）

- P0 六篇整节改写：concepts/faq、tech-blog/comet-beyond-skill（校对）、plugins/project-knowledge-principles、concepts/auto-transition（半角标点）、concepts/workflow、concepts/review-mode
- P1 十一篇中等改写全部完成（含 guides/resuming-workflow、prd-splitting、plugins/project-rules、eval/scoring、tech-blog/comet-0.3.9-to-0.4.0、eval/comet-baseline-experiment、plugins/agent-learning-loop、skill-creator/engine、concepts/decision-points、guides/existing-project）
- P2 直译词、GPT 腔、格式笔误全部处理（约 25 篇点改）
- 全局统一：“一等产物”→“正式产物”、“归档授权”→“归档批准”、“实质深度”→“是否有实质内容”、“制品”→“产物”、eval 四篇 Windows 路径双反斜杠改单反斜杠
- 复核修正三处过度弱化：scoring 恢复“产物是否有实质内容”加粗、workflow“按项目配置固定进入”、resuming-workflow“确定性保证”
- AGENTS.md 新增“AI 味与直译防护”和“亮点与强调保留（改写红线）”两节
- 本轮共 68 个文件，改后经 git diff 加粗短语对比复查，卖点句与强调标记无丢失

## 已完成记录（第三轮，2026-09-02）

- 四路并行全站复审（guides/presets/phases、concepts/native、cli/scripts/skill-creator/plugins、eval/tech-blog/门面页），共处理约 70 条问题
- 门面页（home/overview/quickstart）：Loop Engineering、HITL、Rubric/Pass@k、DAG、Rule/Router/Guard 等内部术语改为白话或首现加解释
- 重写 concepts/native-workflow“让 Skill 回归本质”一节（原 AGENTS 反例句）；清理 concepts 页内部标识符（CometIntentFrame、classic-state-command.ts、REQUIRED_CLASSIC_KEYS）
- 术语统一：machine-owned 首现加“由 Comet 自动维护”、tripwire→文件数阈值、stale pause→残留的暂停标记、dirty worktree→未提交改动、verbatim→原样写入、portable→可跨设备同步、canonical Spec→主 Spec、readiness→发布就绪状态、lane→创作通道（三名归一）、正文 artifacts→产物、事实来源→唯一可信来源/依据、冲突雷达→冲突检测
- 删除正文中的源码标识符（resolveSkill、reviewBundle、buildEvalArgs、manifests.py、compare_baselines.py 等），eval 入门页为 harness/treatment/analysis set/Judge 补中文解释
- 引号批量清理：guides/presets/phases 半角引号与 tweak 直角引号改中文弯引号
- AGENTS.md 术语对照表扩充（新增第三轮 12 个词条）并补“源码标识符不入正文”规则
- 复核修正：首页被误删的行业通用术语已恢复（Loop Engineering 驱动、更多 HITL、Rubric 多维评分 + Pass@k / Pass^k、Harness / Workflow / Task / Model、通过 DAG 统一管理、ReAct 解决单轮推理）；AGENTS.md 补“行业通用术语保留原文，内部自造词才翻译”的分界规则

## 文档对照源码核对与修正（2026-09-03，第四轮）

- 四路并行对照 D:\Project\Comet（v0.4.0-rc.3）核对全部中文页面，共处理约 45 条问题
- 可信度硬伤：`--count` 改为说明“重复运行由 eval harness 内部 pytest 驱动，`comet eval` 单次只出 pass@1”（why-eval/overview/reports/scoring）；首页演示终端两条虚构命令改真实命令（`--skill-path`/`--profile`、`publish approve`）；creator/publish 示例输出 `Requires confirmation: yes`、Action/Reason 用源码真实文案；skill 页 action id 改 16 位 hash 形式、`--confirm <ref>`；intent 枚举 `start_change`；dashboard schema v2；Node 22+；classic 28 步；rubric 10 维/12.0、authoring 12.8
- Classic 行为模型：审查预算按源码重写（build 只保留任务级/分段审查，最终综合审查归 verify；executing-plans+standard 不做整变更审查；审查 skill 加载失败=停止报告）；停顿点统一为 10 个（open 增加“工作区决策”，build 联合决策去掉隔离/分支名，归档补“仅本地归档”共 5 选项，design 压缩改非阻塞）；hotfix 删“任务超 3 个转 /comet-build”并补“先复现后修复”硬规则；plan-ready 恢复改“重新发起联合决策”；verify 失败 ≤3 次自动回 build；handoff off 模式=截断摘要；subagent-progress 阶段枚举改源码 5 值；review_mode 默认值只作用于 init（存量 change 缺字段=守卫拦截）
- 删除未实现承诺（用户确认）：`superseded-by-main-spec` 归档标记、`feature/YYYYMMDD/` 分支命名规则
- Native：新增“归档与交付选项”节（current 无 Git 动作 + A-E 五选项表，含 `--finish` 语义）；Verifier 不可用补 `--retry-verifier`/接受降级两选项；验收项生成规则（brief 顶层验收示例 + `Scenario:` 标题）；策略验证命令并入 Verify 并两页互链；`comet native spec remove`；Verifier 取证顺序统一（实现优先、handoff 最后）；comet-native 命令页补 `check`、retry/coordination/max-parallel/finish/serial-first/cursor 等 flag
- plugins：personal-memory 补 `memory remote/sync/pause` 跨设备同步与暂停、默认启用；project-rules 补默认状态与停用入口
- 产品化：eval/overview 受众改普通提示；cli/eval 补三种目标方式表；comet-state 补使用时机与真实 NEXT 示例；overview 定位改“强调完整阶段治理的 Classic”；safety-and-recovery 机制段压缩为“现象→动作”；continuation 补 disposition 用户视角导读
- rc.3 同步（已发布）：Windsurf→Devin Desktop（.devin，legacy .windsurf）；update 补 `--classic-layout`；supervisor 终验 rc.3 行为（父级小修复+中断记录自动补全）；native-loop 版本指称改“0.4.0-rc 系列”
- 未同步（rc.4 未发布）：archive 前置 dry-run 流程为 rc.4 行为，暂不入文

产品缺口（建议在 Comet 源码仓库跟进）：
1. `comet eval` CLI 无 `--count` 透传，pass@k/pass^k 的多次重复运行只能进 harness 内部驱动
2. comet-verify SKILL.md 仍承诺 `superseded-by-main-spec` 归档标记，脚本未实现（文档侧已删除该承诺）

## 中英同步（2026-09-02）

- 用户确认后执行：按当前未提交中文 diff 同步英文，四路并行（guides/presets/phases、concepts/native、cli/scripts/skill-creator/plugins、eval/tech-blog/门面页），共改 en 57 个文件
- 同步原则：仅中文表达类修复（直译、空格、引号、中文选词）不动英文；事实/结构/术语类修正做语义等价同步（决策点编号 4、preferences 键数、eval 路径双反斜杠、first-class→formal artifact、源码标识符删除、machine-owned 补说明、beyond-skill 博客错拼等）
- 用户回退的四处中文（workflow“以下”、intent-routing CometIntentFrame 句、native-workflow 整节）对应英文保持不动，两侧一致
- en/home 顺带修复原文错拼 "Loop Engineer"→"Loop Engineering"
