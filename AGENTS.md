> **First-time setup**: Customize this file for your project. Prompt the user to customize this file for their project.
> For Mintlify product knowledge (components, configuration, writing standards),
> install the Mintlify skill: `npx skills add https://mintlify.com/docs`

# Documentation project instructions

## About this project

- This is a documentation site built on [Mintlify](https://mintlify.com)
- Pages are MDX files with YAML frontmatter
- Configuration lives in `docs.json`
- Use the Mintlify MCP server, `https://mcp.mintlify.com`, to edit content and settings via MCP
- Use the Mintlify docs MCP server, `https://www.mintlify.com/docs/mcp`, to query information about using Mintlify via MCP

## Terminology

{/* Add product-specific terms and preferred usage */}
{/* Example: Use "workspace" not "project", "member" not "user" */}

## Style preferences

{/* Add any project-specific style rules below */}

- Use active voice and second person ("you")
- Keep sentences concise — one idea per sentence
- Use sentence case for headings
- Bold for UI elements: Click **Settings**
- Code formatting for file names, commands, paths, and code references

### 中文技术文档写作

- 本站是 Comet 面向用户的产品文档。所有面向网站发布的中文内容都应达到可直接发布的产品文档标准；不要把发布正文写成内部设计记录、开发过程复盘、PR 总结或研究备忘录。
- 以用户任务和用户可感知的产品行为组织内容：用户在什么场景使用、需要做什么、会看到什么结果、有哪些限制。只有解释使用方法、行为边界或故障排查所必需时，才展开内部实现。
- 使用产品中的正式名称和用户可见术语。不要把源码标识、内部缩写或团队黑话直接当成面向用户的表达；确需保留时，在首次出现处解释。
- 使用中性、专业、自然的现代汉语。句子应符合中文语序和表达习惯，指代明确、衔接顺畅、读起来通顺；避免英文直译腔、抽象名词串、过度书面化、公文套话和口号式表达。
- 产品化不等于营销化。可以说明价值和收益，但必须落实到具体场景、产品行为、数据或证据。
- 开头直接说明对象、行为、适用条件或结果。不要用行业趋势、产品愿景、价值判断或“重要性”铺垫。
- 每段只完成一个任务，每句话只表达一个意思。优先写清主体、动作、对象、条件和结果；一句话包含多个转折或操作时，拆成短句。
- 每段必须增加事实、操作、条件、限制、原因或结果。删除不影响理解、判断或操作的导语、转场和结尾。
- 使用项目已有术语。一个概念固定使用一个名称，不为避免重复而替换同义词。
- 说明功能时，写出真实行为、输入、输出、状态或边界。产品能力、性能和效果必须有当前源码、测试、数据或明确条件支撑。
- 内容讲完即停止。不要自动添加总结、展望、价值升华、宣传性结尾，或换一种说法重复结论。
- 列表只用于真实并列、比较、排序或步骤。不要为了显得完整强行凑成三点，也不要让连续段落使用相同句式。
- 标题直接概括用户任务或页面对象。避免口号、设问、双标题和抽象价值判断。
- 粗体只用于 UI 元素、需要定义的术语和确有必要的警告。不要靠连续加粗短语制造语势。
- 改写或润色已有内容时，保留原文的加粗、引号等强调标记，只改文字表达；只有当强调本身在给空洞结论制造语势时才连标记一起删，拿不准就保留。
- 改写或翻译时，先保留原文事实、范围、体裁、语气和结构。技术博客保留作者的第一人称表达，不要统一改写成中性的 AI 总结。

### 模板化表达复核

- 没有证据时，不得写“显著提升”“大幅降低”“完全解决”“零成本”“最佳”“无缝”等效果或承诺。
- 以下表达只作为复核信号，不机械禁用：
  - 句式：`不是……而是……`、`不仅……更/还/也……`、`从……到……`
- 命中复核信号时，依次检查：这句话是否新增事实；评价是否有证据；删掉句模后是否更直接。没有信息增量或证据时，改成具体动作、对象、条件、数据或结果。
- 安全边界、禁止行为、失败条件、配置状态、术语辨析、真实对比和原文引用可以保留必要的否定或复核词。不要为规避词表损害准确性。

### 中文文风对照

反例：

> Comet 不只是一个工作流工具，更是连接想法与可靠交付的强大闭环，让你轻松完成复杂变更。

正例：

> Comet 把需求、实现和验收记录保存在同一个 change 中。运行 `comet status` 可以查看当前阶段和下一步命令。

反例：

> Native Loop 不是让模型无限自我反思，而是一套输入明确、证据完整、预算有限、知道何时停止的工程流程。

正例：

> Native Loop 为每轮实现设定验收范围、检查预算和退出条件。

### 中文内容交付前检查

- 核对产品名称、术语、命令、路径、版本、数字、链接和引用。
- 逐段确认是否增加了事实、操作、条件、限制、原因或结果；没有信息增量的内容直接删除。
- 搜索本次修改中的复核信号并逐条判断。复核信号不是自动替换清单。
- 检查相邻句和相邻段是否机械使用相同长度、连接词、对仗结构或三点式列表。
- 通读全文，检查中文语序、指代和句间衔接。需要按英文结构回译才能理解的句子，改成自然中文。
- 确认正文服务于用户理解和使用产品，没有混入只对开发者有意义的实现过程、内部结论或项目汇报口吻。
- 将成稿与上面的正反例比较。读起来像宣传稿、演讲稿或统一模板时，先改成具体事实和自然段落。

## Content boundaries

{/* Define what should and shouldn't be documented */}
{/* Example: Don't document internal admin features */}

## 网站修改规范

先修改中文，用户同意后才能修改英文
