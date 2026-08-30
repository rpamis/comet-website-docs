# 插件中心三篇中文文章重写证据报告

> 日期：2026-08-30  
> Comet 源码基线：`D:\Project\Comet` @ `baef0646`。该工作区有与 Native Runtime、CHANGELOG 和 website submodule 相关的未提交改动；本报告引用的插件、Agent Learning、Personal Memory、Project Knowledge 源码不在当前脏改动列表中。  
> 站点基线：`D:\Project\comet-website-docs` @ `75201fb`。站点没有项目级 `research/` 或 `notes/` 目录（只有 `.agents/.claude` 下的 research Skill），因此按任务要求新建本文件。  
> 证据等级：**S** = 当前源码事实，**D** = 当前产品/运行文档合同，**H** = 历史 research 结论，**I** = 业界官方事实，**P** = 本报告据此提出的产品推论。

## 结论先行

三篇文章应该共同讲清一件事：**Comet 插件中心不是一个“多存几段提示词”的设置页，而是让 Agent 把长期协作经验和项目工程知识安全地带到下一次任务的产品层。**

- **Personal Memory（个人记忆）**回答“这个用户希望怎样协作”。它属于用户，既可全局生效，也可只在一个项目生效；默认不共享给团队，也不会变成项目规则。【S：`domains/comet-memory/plugin.ts:36-53,187-278,279-367`；D：`docs/operations/PERSONAL-MEMORY-ZH.md:1-30`】
- **Project Knowledge（项目知识）**回答“这个项目是什么、为什么这样设计、改动时要核对什么”。一个插件内部包含 Project Model（项目模型）和 Project Policy（项目策略）；旧 Project Rules 插件和命令已经删除。【S：`domains/project-knowledge/plugin.ts:48-69,117-138`；`test/repository/project-rules-removed.test.ts:1-39`】
- **Agent Learning Loop**回答“经验怎样变成下一次可用的上下文”。它是两个插件共享的运行机制，不是 Dashboard 中第三个独立插件，也不是模型训练。源码中的循环是事件采集、Journal、Reflection、Consolidation、Context 选择、应用结果反馈。【S：`domains/agent-learning/types.ts:1-23,79-95,146-168`；`domains/agent-learning/coordinator.ts:83-138,180-252`；`domains/comet-plugin/integration.ts:356-472`】
- **Rule / AGENTS.md / CLAUDE.md / `.cursor/rules`**是宿主直接加载的行为指令；**Hook / linter / test / CI**负责执行时观察、拦截或确定性校验；**Project Knowledge**是可追溯、可检索、按任务激活的工程知识层。三者协作，不应在文案中互称同义词。【D：`docs/operations/PROJECT-KNOWLEDGE-ZH.md:1-17`；I：Claude、Codex、Cursor 官方资料，见下文】

## 一、当前 Comet 的真实产品与运行时边界

### 1. 插件中心的真实对象

当前默认 Plugin Bridge 只注册两个面向用户的第一方插件：`comet.personal-memory` 和 `comet.project-knowledge`，随后通过 `reconcileFirstParty()` 默认启用。Plugin Runtime 支持 `enabled / disabled / uninstalled`，也支持按项目暂停；停用会卸载活动模块，未见删除插件数据的动作。【S：`domains/comet-plugin/integration.ts:356-472`；`domains/comet-plugin/plugin-runtime.ts:179-205,230-264,472-523`】

Runtime 给插件的公开能力包括：订阅 Experience、Reflection/Consolidation、提供/展开 Context、Dashboard 页面和 capability 调用。第一方和第三方走同一接口；第三方安装或更新必须由用户发起。【S：`domains/comet-plugin/types.ts:10-13,74-107`；`domains/comet-plugin/plugin-runtime.ts:638-646`】

因此，“Agent Learning Loop”文章应定位为**插件中心的工作原理**，不要写成第三张插件卡或第三套存储。

### 2. Personal Memory：用户拥有的协作连续性

当前源码将个人记忆分为：

1. `core-profile`：语言、角色、稳定偏好；
2. `collaboration-policy`：按项目、路径、任务、操作、阶段匹配的个人协作方式；
3. `personal-episode`：一次成功、纠正或失败的紧凑经历。

记录具有 `global/project` 作用域和 `explicit/inferred` 来源。显式长期信号同步处理，显式记录初始即 `proven`；推断记录初始为 `trial`，应用成功可转为 `proven`，纠正或造成失败可转为 `superseded`。【S：`domains/agent-learning/types.ts:18-23,42-50,63-68`；`domains/agent-learning/coordinator.ts:83-115`；`domains/comet-memory/personal-memory.ts:1694-1737`；`domains/comet-memory/plugin.ts:279-335`】

它明确过滤 diff、堆栈、stdout/stderr、测试/命令/提交等任务日志式内容；产品文档还排除完整会话、隐藏推理和容易从仓库重建的事实。【S：`domains/comet-memory/personal-memory.ts:2680-2716`；D：`docs/operations/PERSONAL-MEMORY-ZH.md:1-12`】

用户核心价值不是“保存聊天记录”，而是：

- 不必跨任务反复说明语言、表达方式、证据习惯和协作节奏；
- 项目内个人习惯仍保持私有，不误写成团队共识；
- 可以查看、纠正、遗忘、回滚，并知道某条记忆为什么被使用；
- 记忆故障不会阻断 Native、Classic、Hotfix 或 Tweak。

### 3. Project Knowledge：Agent 的项目理解层

当前 `comet.project-knowledge` 是 project-scope 第一方插件。Record 类型分为两组：

- **Project Model**：`topology / fact / dependency`，回答项目是什么；
- **Project Policy**：`decision / pattern / procedure / constraint / failure-resolution`，回答以后怎样做。

【S：`domains/project-knowledge/plugin.ts:48-69,128-138`】

它订阅验证、Review、故障闭环、Change Archive、仓库变化和 Context 结果，形成或更新项目记录。只有 Project Policy 可以达到 `enforced`，且产品合同把这一状态限定为绑定当前存在、成功执行过的确定性验证命令。【S：`domains/project-knowledge/plugin.ts:383-457`；D：`docs/operations/PROJECT-KNOWLEDGE-ZH.md:8-31`】

Local corpus 当前自动发现 Comet 管理的 Native/Classic specs、archives、Superpowers 文档；额外普通 Markdown 必须由 `knowledge.local.include` glob 配置。**不要在文章中承诺 AGENTS.md、CLAUDE.md 或 `.cursor/rules` 会被默认自动索引**；它们只有匹配用户自定义 include 时才进入这个 Markdown corpus。【S：`domains/project-knowledge/corpus.ts:330-376`】

用户核心价值不是“更快搜文档”，而是让 Agent 第一次进入任务时就获得：模块职责、关键依赖、已接受决策、易漏集成点、验证路径和历史故障解法；同时每条内容保留来源、适用范围、新鲜度和验证方式。当前代码、配置和测试仍需现场核对，Project Knowledge 只提供定向假设与检查清单。【H：`docs/research/2026-08-22-agent-project-knowledge-memory-retrieval-architecture.md:59-97,154-179,489-532,1038-1056`】

### 4. Agent Learning Loop：经验治理，不是无边界“自进化”

源码公开 `comet.agent-experience.v1`，事件包括 `user.signal`、任务完成、验证、Review、故障解决、Archive、仓库变化、Context 应用和结果。Journal 先幂等持久化，再按 episode/evidence 分块 Reflection；显式长期用户信号同步处理，其他内容可后台处理并重放。不同 Learner 独立 Consolidate，失败只记录诊断，不让另一个插件或工作流一起失败。【S：`domains/agent-learning/types.ts:1-12,79-95`；`domains/agent-learning/experience-journal.ts:110-158`；`domains/agent-learning/coordinator.ts:83-138,180-252,291-343`】

Context Director 先按 project/path/operation/phase/task 过滤，排除 `superseded`，再按权威等级和历史效果排序。Core Profile 与少量 `proven/enforced` Policy 可完整投递；其他候选进入带 `whyApplied` 的 Manifest，可按稳定 ID 展开。应用结果会再次写回 Journal。【S：`domains/agent-learning/context-director.ts:322-455,533-580,583-714`；`domains/comet-plugin/integration.ts:111-175,200-233`】

这里的“学习”应产品化解释为：**从可核对的工作结果中形成可撤销的外部记忆**。它不训练模型参数，不保存隐藏推理，不自动改写 AGENTS/Rule/Skill/linter/CI，也不扩大提交、推送、删除或发布权限。【D：`docs/comet/specs/personal-memory/spec.md:63-88`；`docs/comet/specs/project-knowledge/spec.md:68-88`】

## 二、Project Knowledge 与 Rule / 项目指令的关系

| 层 | 回答的问题 | 典型载体 | Comet 的关系 |
| --- | --- | --- | --- |
| Project Knowledge | 项目是什么、为什么这样、改哪里还要核对哪里 | Project Model、来源文档、结构化 Record | 建模、检索、来源复核、按需展开 |
| Project Policy | 已接受的做法、流程、约束、故障解法是什么 | `decision/pattern/procedure/constraint/failure-resolution` | Project Knowledge 插件内的程序性知识，不是另一份 Rule 文件 |
| Rule / Agent Instructions | Agent 在当前作用域应怎样做 | `AGENTS.md`、`CLAUDE.md`、`.claude/rules`、`.cursor/rules` | 宿主直接加载；仍是更高优先级项目证据；Comet 不静默改写 |
| Hook / Check / Guard | 哪些动作要观察、阻断或确定性验证 | Hook、permission、linter、test、build、CI | 执行与强制层；Project Policy 可引用已有成功命令，不再造一套检查语义 |

最适合中文用户的一句话是：

> **项目知识让 Agent 先读懂项目；Rule 让 Agent 按团队约定行动；Hook 和检查守住必须执行的边界。**

“项目规则”改为“项目知识”的根本原因：Rule 天然暗示“必须遵守的一条要求”，但该插件实际还包含拓扑、事实、依赖、决策背景和故障解法。继续叫“项目规则”会把“知道什么”和“必须怎么做”混在一起，也容易让用户误以为 Comet 会创建或覆盖宿主 Rule 文件。当前 Dashboard contribution 已只显示“项目知识”，路由也已是 `/plugins/project-knowledge`。【S：`domains/project-knowledge/plugin.ts:117-125`】

## 三、业界怎么做，为什么

### Claude Code

Claude Code 官方明确分开两类跨会话内容：`CLAUDE.md` 是用户写的持久指令，Auto Memory 是 Claude 根据纠正与偏好自行写的 notes；两者都是 Context，不是硬性配置，必须阻止动作时使用 `PreToolUse` Hook。`.claude/rules/` 支持按 path 加载以减少噪声和上下文占用；Auto Memory 按仓库共享 worktree，且跳过能从代码或 CLAUDE.md 推导的内容。[官方：How Claude remembers your project](https://code.claude.com/docs/en/memory)

**对 Comet 的意义（P）**：个人记忆和项目指令必须分开；自然语言上下文负责引导，确定性阻断交给 Hook/权限/检查。Comet 进一步把项目事实与程序性策略结构化，并记录来源和应用结果。

### OpenAI Codex

Codex 从 `$CODEX_HOME` 及项目根到 cwd 聚合 `AGENTS.override.md` / `AGENTS.md`，项目文档默认合计上限 32 KiB；Skill 在初始 Context 中先暴露元数据与使用规则。[官方：Unrolling the Codex agent loop](https://openai.com/index/unrolling-the-codex-agent-loop/)；[官方：AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)

OpenAI 的 Harness Engineering 实践明确把 repository knowledge 作为 system of record，并让短 AGENTS.md 主要充当通向结构化 docs 的地图；原因是巨型指令文件会挤占上下文、稀释重点、快速腐化且难以验证。[官方：Harness engineering](https://openai.com/index/harness-engineering/)

**对 Comet 的意义（P）**：Project Knowledge 应是可定位、可验证、按任务召回的知识层；AGENTS/Rule 保持短、明确、作用域清晰。当前官方资料未声明 Codex 会自动把每次对话写回项目知识库，文章不要暗示这是行业默认能力。

### Cursor

Cursor 把 Rules 定义为 Prompt 层的持久、可复用 Context。Project Rules 位于 `.cursor/rules`，版本化并限定代码库，可 Always、按 glob、按相关性或手工激活；根/子目录 `AGENTS.md` 会合并且更具体者优先。[官方：Cursor Rules](https://cursor.com/docs/rules)

Cursor 历史 Memories 功能把聊天中抽取的内容做成 project-scoped memory，并为后台生成加入用户批准；该页面属于历史路径，当前产品状态应谨慎表述。[官方历史页：Memories](https://docs.cursor.com/en/context/memories)；[官方 Changelog 1.2](https://cursor.com/changelog/1-2)

Cursor Hooks 可观察、控制和扩展 Agent loop，用于审计、阻断命令和脱敏。[官方 Changelog 1.7](https://cursor.com/changelog/1-7)

**对 Comet 的意义（P）**：Cursor 证明了“按相关性/路径激活”与“自动记忆需可治理”的产品价值；Comet 不应把聊天抽取结果直接提升成团队项目知识，更不应把 Rule 和 Hook 写成同一种能力。

## 四、历史 research 中仍有效与已经演进的结论

- 仍有效：普通 Memory 不能直接成为团队强制规范；不能让 Agent 自动覆盖共享 AGENTS/Rule/Hook；个人偏好、项目事实、团队规范和安全策略必须分域。【H：`docs/research/2026-08-07-agent-self-evolution-landscape.md:9-36,82-101,138-150`】
- 仍有效：行业已普遍采用路径/相关性激活，Hook 只是宿主投递与执行适配之一；自然语言指令不等同于确定性检查。【H：`docs/research/2026-08-14-contextual-project-standards.md:9-21,23-47`】
- 仍有效：项目级个人偏好留在 Personal Memory；可由当前仓库证据验证、可复用的工程事实进入 Project Knowledge；两者都不能授权高风险操作。【H：`docs/research/2026-08-22-agent-project-knowledge-memory-retrieval-architecture.md:59-97`】
- 已演进：2026-08-14 research 建议把能力叫 Project Standards，并讨论 `.comet/rules/*.md`；当前源码已经删除旧 Project Rules 插件，并确定一个“项目知识”入口、内部 Project Model + Project Policy。重写应以当前源码为准，只保留旧研究关于 Rule/Check/Instruction 确定性分层的术语依据。【H：`docs/research/2026-08-14-team-rules-terminology.md:9-23,81-140,170-180`；S：`test/repository/project-rules-removed.test.ts:1-39`】

## 五、三篇文章的推荐产品叙事

### 《Agent Learning Loop》

开头先回答：**为什么 Agent 每次都像第一次合作？** 然后用一个闭环讲清 `Experience → Reflection → Consolidation → Activation → Outcome`。重点是证据、作用域、可撤销和失败隔离，不要从事件 schema、CLI 命令或配置开篇。

核心承诺：用户的纠正能成为下一次协作方式；已闭环的 Review、故障和 Archive 能成为下一次项目上下文；使用结果会继续校准。明确非承诺：不是模型训练，不保存完整轨迹，不自动改写 Rule/Skill/检查。

### 《个人记忆》

开头先回答：**你不再需要在每个任务里重新教 Agent 怎样和你合作。** 以“跨项目偏好 / 当前项目个人习惯 / 一次性要求不记住”三个中文场景区分作用域。再解释 Core Profile、Collaboration Policy、Personal Episode 和 `trial/proven/superseded`。

核心承诺：私有、可查看、可纠正、可忘记、按任务相关性使用。不要把价值写成“无限容量”“聊天备份”或“自动生成团队规则”。

### 《项目知识》

开头先回答：**让 Agent 少做一轮盲目探索，更早找对模块、补全影响范围并运行正确验证。** 先用 Project Model / Project Policy 解释“项目是什么 / 以后怎样做”，再用一张边界表说明 Knowledge、Rule、Hook/Check。

核心承诺：可追溯、项目隔离、按需激活、来源变化后失效、与个人记忆分离。标题和正文统一使用“项目知识”；“项目规则”只作为旧称或关系解释出现一次。URL slug 是否从 `project-rules` 迁移属于站点兼容决策，不属于本报告范围。

## 六、写作时必须避免的过度承诺

1. 不要把 Agent Learning Loop 写成第三个可安装插件；它是共享运行机制。
2. 不要说 Project Knowledge 会默认扫描所有 AGENTS.md / CLAUDE.md / Cursor Rules；当前默认 corpus 没有这个保证。
3. 不要说 Project Policy 等于 Rule，或 Comet 会静默修改宿主指令、Skill、linter、测试、构建和 CI。
4. 不要说任何自然语言策略都能“强制执行”；`enforced` 只属于绑定现有确定性验证入口的 Project Policy。
5. 不要把 Personal Memory 的 project scope 写成团队共享知识；共享必须显式、脱敏并重新核对来源。
6. 不要承诺“所有超出字符预算的已存记录一定出现在当前 Manifest”。源码中 Context Director 确实会把无法完整投递的候选降级为 Manifest，但 Personal Memory Provider 在它之前仍按 `profile/task` 字符限制选择候选。最稳妥的产品说法是：“Comet 优先完整提供关键策略，其余相关候选以摘要按需展开；每次任务只使用有界上下文。”【S：`domains/agent-learning/context-director.ts:399-448`；`domains/comet-memory/personal-memory.ts:2147-2204`】

## 来源索引

### 当前源码与产品合同

- `D:\Project\Comet\domains\comet-plugin\types.ts`
- `D:\Project\Comet\domains\comet-plugin\plugin-runtime.ts`
- `D:\Project\Comet\domains\comet-plugin\integration.ts`
- `D:\Project\Comet\domains\agent-learning\types.ts`
- `D:\Project\Comet\domains\agent-learning\experience-journal.ts`
- `D:\Project\Comet\domains\agent-learning\coordinator.ts`
- `D:\Project\Comet\domains\agent-learning\context-director.ts`
- `D:\Project\Comet\domains\comet-memory\plugin.ts`
- `D:\Project\Comet\domains\comet-memory\personal-memory.ts`
- `D:\Project\Comet\domains\project-knowledge\plugin.ts`
- `D:\Project\Comet\domains\project-knowledge\corpus.ts`
- `D:\Project\Comet\docs\operations\PERSONAL-MEMORY-ZH.md`
- `D:\Project\Comet\docs\operations\PROJECT-KNOWLEDGE-ZH.md`
- `D:\Project\Comet\test\repository\project-rules-removed.test.ts`

### 历史 research

- `D:\Project\Comet\docs\research\2026-08-07-agent-self-evolution-landscape.md`
- `D:\Project\Comet\docs\research\2026-08-14-team-rules-terminology.md`
- `D:\Project\Comet\docs\research\2026-08-14-contextual-project-standards.md`
- `D:\Project\Comet\docs\research\2026-08-16-hermes-self-improving-memory-comparison.md`
- `D:\Project\Comet\docs\research\2026-08-22-agent-project-knowledge-memory-retrieval-architecture.md`
- `D:\Project\Comet\docs\research\2026-08-22-agent-project-knowledge-engine-technical-design.md`

### 业界官方资料

- [Claude Code: How Claude remembers your project](https://code.claude.com/docs/en/memory)
- [OpenAI: Unrolling the Codex agent loop](https://openai.com/index/unrolling-the-codex-agent-loop/)
- [OpenAI: Harness engineering](https://openai.com/index/harness-engineering/)
- [OpenAI: Custom instructions with AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
- [Cursor: Rules](https://cursor.com/docs/rules)
- [Cursor: Memories（历史页面）](https://docs.cursor.com/en/context/memories)
- [Cursor Changelog 1.2](https://cursor.com/changelog/1-2)
- [Cursor Changelog 1.7](https://cursor.com/changelog/1-7)
