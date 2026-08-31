# 插件中心五篇中文文章重写设计

## 目标

把插件中心从三篇偏运行时说明的文章，重写为一套面向中文开发者的产品内容：先回答用户为什么需要长期协作能力，再解释 Comet 如何把个人经验与项目知识带入下一次任务，最后提供两篇可独立深入阅读的原理文章。

本次只修改中文站点。用户可见名称统一使用“项目知识”，现有 `/zh/plugins/project-rules` URL 保持不变，避免旧链接失效。

## 读者完成阅读后应获得什么

读者应能回答以下问题：

1. 插件中心帮助自己减少什么重复工作。
2. Agent Learning Loop、个人记忆和项目知识分别承担什么职责。
3. 个人记忆与项目知识怎样形成、怎样被下一次任务使用。
4. 项目知识与 `AGENTS.md`、`CLAUDE.md`、Cursor Rules、Hook、linter、test 和 CI 的关系。
5. Comet 为什么把用户偏好、项目知识、Agent 指令和确定性检查分层治理。
6. 哪些能力来自当前产品源码，哪些只是业界对照，哪些行为明确不在产品承诺内。

## 产品定位

插件中心不是提示词收藏夹，也不是聊天记录页。它是 Comet 的长期协作层：让 Agent 在新任务中带着经过治理的用户偏好和项目工程知识开始工作。

- **个人记忆**回答“你希望怎样协作”。它属于当前用户，可全局生效，也可只在当前项目生效。
- **项目知识**回答“这个项目是什么、为什么这样设计、改动时还要核对什么”。它属于当前项目。
- **Agent Learning Loop**回答“可复用经验如何形成、激活并根据实际效果继续校准”。它是两个插件共享的工作机制，不是第三个插件。

项目知识内部继续区分：

- **Project Model（项目模型）**：拓扑、事实和依赖，说明项目是什么。
- **Project Policy（项目策略）**：决策、模式、流程、约束和故障解法，说明在项目中怎样工作。

项目知识、Rule 和确定性执行层使用以下统一关系：

> 项目知识帮助 Agent 读懂项目；Rule 指导 Agent 按团队约定行动；Hook 和检查守住必须执行的边界。

## 信息架构

中文“插件中心”调整为三个导航分组：

1. **工作原理**
   - `zh/plugins/agent-learning-loop`
2. **个人记忆**
   - `zh/plugins/personal-memory`
   - `zh/plugins/personal-memory-principles`
3. **项目知识**
   - `zh/plugins/project-rules`
   - `zh/plugins/project-knowledge-principles`

三个现有 URL 保持不变。新增页面使用：

- `/zh/plugins/personal-memory-principles`
- `/zh/plugins/project-knowledge-principles`

英文导航和英文文章不修改。

## 页面设计

### 1. Agent Learning Loop

**页面职责**：建立插件中心的总认知，解释为什么一次任务中的纠正、Review 结论、故障闭环和 Archive 决策能够成为下一次任务的上下文。

**开场问题**：为什么 Agent 每次开始新任务时，都像第一次与你和项目合作。

**内容顺序**：

1. 用户能直接感知的结果：少重复说明、少重复踩坑、知识会根据使用结果修正。
2. 业界的三条常见路线：静态项目指令、自动记忆、代码库知识/索引。
3. Comet 的选择：分开保存个人记忆与项目知识，通过同一 Learning Loop 激活。
4. `Experience → Reflection → Consolidation → Activation → Outcome Feedback` 闭环。
5. 哪些事件值得沉淀，哪些一次性内容不进入长期状态。
6. 证据、作用域、生命周期、可撤销和失败隔离。
7. 链接到个人记忆、项目知识及两篇原理文章。

**必须明确**：

- Agent Learning Loop 是共享机制，不是第三个插件。
- “学习”表示形成外部、可查看、可撤销的记录，不表示训练模型参数。
- 不保存完整会话、完整 diff、原始日志或隐藏推理。
- 不自动改写 Rule、Skill、linter、测试、构建或 CI。

### 2. 个人记忆

**页面职责**：帮助用户判断什么值得记住、如何控制记忆，以及个人记忆能为实际协作减少哪些重复说明。

**开场承诺**：你不需要在每个任务里重新告诉 Agent 语言偏好、表达方式和稳定的协作习惯。

**内容顺序**：

1. 三个中文场景：跨项目偏好、当前项目的个人习惯、只对本次任务生效的要求。
2. 个人记忆与聊天记录、项目公共事实、团队规范的边界。
3. Core Profile、Collaboration Policy、Personal Episode 的用户可理解说明。
4. 明确记住与自动形成的差别。
5. `trial / proven / superseded` 生命周期及实际结果反馈。
6. Dashboard 与 CLI 能完成的查看、纠正、遗忘和回滚。
7. Local/Remote、项目隔离和工作流失败隔离。
8. 进入“个人记忆原理”的链接。

**行业对照**：使用 Claude Code Auto Memory、Cursor Memories、GitHub Copilot Memory 的官方事实说明“跨会话记忆”已成为通用方向，同时突出 Comet 对个人与项目归属、显式与推断、应用结果反馈的分层。

### 3. 个人记忆原理

**页面职责**：解释 Personal Memory 从信号进入系统到下一次任务被选中的完整数据路径，供希望理解可信性、隐私和调试边界的用户阅读。

**内容顺序**：

1. 原理总览图：用户信号/任务结果 → Experience Journal → Reflection → Personal Memory Provider → Context Director → 应用结果。
2. 记录模型：scope、memory type、authority、selector、evidence、lifecycle。
3. 形成原理：显式长期信号的确定性路径；推断经验的 trial 路径。
4. 检索原理：project/path/task/operation/phase 匹配、优先级和有界上下文。
5. Context Manifest、稳定 ID、`whyApplied` 与按需展开。
6. Local/Remote Provider、可读 Markdown 投影、稳定 repository identity。
7. 纠正、遗忘、tombstone、重放与失败隔离。
8. 能力边界和故障排查入口。

**避免重复**：CLI 命令只保留最小诊断示例；面向用户的操作清单留在《个人记忆》。

### 4. 项目知识

**页面职责**：用产品语言说明项目知识怎样让 Agent 更早定位正确模块、补全修改范围并找到正确验证方式。

**开场承诺**：Agent 不再只从目录搜索开始，而是先获得一张带来源的项目地图和相关工程经验。

**内容顺序**：

1. 用户核心价值：首次定位、完整修改范围、决策背景、验证路径和历史故障解法。
2. Project Model 与 Project Policy。
3. 业界路线：短项目指令、按路径 Rule、代码索引和 Agent 专用知识层。
4. Comet 的选择及“项目规则”改名为“项目知识”的原因。
5. 项目知识、Rule、Hook/Check 的关系表。
6. 来源、新鲜度、生命周期和当前代码现场核对。
7. Dashboard 与 CLI 的管理入口。
8. 进入“项目知识原理”的链接。

**必须明确**：

- Project Policy 是项目知识内部的一类记录，不是第三个插件。
- 项目知识不替代当前源码、配置、测试和仓库指令。
- 默认 corpus 不承诺自动扫描所有 `AGENTS.md`、`CLAUDE.md` 或 `.cursor/rules`；额外 Markdown 来源由 `knowledge.local.include` 配置。
- 只有绑定当前存在且成功执行过的确定性验证入口的 Project Policy 才可标记为 `enforced`。

### 5. 项目知识原理

**页面职责**：解释 Project Knowledge 如何发现来源、构建记录、混合检索、检查新鲜度并向 Agent 提供有界上下文。

**内容顺序**：

1. 原理总览图：项目来源 → corpus/记录构建 → Local/Remote Provider → 检索与新鲜度检查 → Context Director → 结果反馈。
2. corpus 边界：Comet 产物、确定性结构、自定义 Markdown glob。
3. Record 模型：Project Model/Policy、来源、适用范围、验证、关系和 lifecycle。
4. 混合召回：结构过滤、FTS、有限 ripgrep、关系和应用反馈；SQLite 是可重建读模型。
5. 来源变化与 `superseded`，主工作区和 linked worktree 的共享/隔离关系。
6. Context Manifest、按需展开和关键 Policy 的完整投递。
7. Local/Remote 严格二选一、Remote 数据边界和失败行为。
8. Rule/Instructions 与 Hook/Check 的职责边界。
9. 能力限制：提供定向假设和检查清单，最终仍需核对当前代码、测试和 Runtime 状态。

**避免重复**：产品价值和管理操作留在《项目知识》；本篇聚焦数据来源、检索、验证和激活原理。

## 业界资料使用原则

正文只使用官方一手资料，主要覆盖：

- Claude Code 的 `CLAUDE.md`、path-scoped rules、Auto Memory 和 Hook 分层；
- OpenAI Codex 的 `AGENTS.md`、短入口文件与结构化 repository knowledge 实践；
- Cursor 的 Project Rules、Memories 和 Hooks；
- GitHub Copilot Memory 对 repository facts 与 user preferences 的分层；
- Qoder Knowledge Engine 对 Agent 专用工程知识层的产品说明。

业界资料用于说明共同问题和设计取舍，不把厂商自测数字写成 Comet 的效果承诺。正文不做功能逐项竞品表，也不使用“行业领先”等无法由 Comet 当前证据支持的表述。

## 中文写作规范

- 每篇先说明职责、行为和结果，再解释内部名词。
- 使用主动语态和第二人称。
- 标题采用句式中文，不堆叠中英文术语。
- 每段只表达一个主要观点。
- 保留必要的英文对象名，并在第一次出现时给出中文解释。
- 避免连续使用“不是……而是……”“不会……”等先否定再解释的句式；安全边界单独集中说明。
- 不使用“强大、无缝、智能化、革命性”等营销词。
- 不把实现字段和 CLI 命令放在开篇。

## 文件范围

**修改**：

- `zh/plugins/agent-learning-loop.mdx`
- `zh/plugins/personal-memory.mdx`
- `zh/plugins/project-rules.mdx`
- `docs.json` 中仅中文“插件中心”导航段

**新增**：

- `zh/plugins/personal-memory-principles.mdx`
- `zh/plugins/project-knowledge-principles.mdx`

**不修改**：

- `en/plugins/**`
- 英文导航
- Comet 产品源码
- 现有插图和全站样式

## 验收标准

1. 中文插件中心包含五篇文章，并按“工作原理 / 个人记忆 / 项目知识”分组。
2. 三篇现有文章完成结构和正文重写，不是局部修补。
3. 两篇原理篇能独立解释完整数据路径，并与概览文章分工明确。
4. 所有用户可见名称统一为“项目知识”；旧 URL 保持可用。
5. 五篇文章共同讲清业界做法、Comet 做法、设计原因、产品定位和用户价值。
6. 项目知识与 Rule、项目指令、Hook、确定性检查的关系准确。
7. Agent Learning Loop 不被表述为第三个插件或模型训练。
8. Personal Memory 不被表述为团队共享知识或聊天备份。
9. Project Knowledge 不承诺默认扫描所有宿主 Rule 文件，也不承诺替代当前源码和测试。
10. 所有外部事实链接到官方一手资料；不写无法核对的效果数字。
11. 新页面 frontmatter 包含 `title` 和 `description`，内部链接使用无扩展名的根路径。
12. 英文文件保持不变。
13. `docs.json` 可以被 JSON 解析。
14. `mint validate --disable-openapi`、相关链接检查和 `git diff --check` 完成，并如实报告仓库基线或环境问题。

## 设计自审

- 没有待定项或占位符。
- 五篇文章各有独立职责，产品概览与实现原理不重复堆叠。
- 命名、URL 兼容策略、中文优先范围和数据边界保持一致。
- 新增范围只涉及中文插件中心和本设计/研究证据，不扩展到英文或产品源码。
