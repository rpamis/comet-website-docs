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

### 中文翻译规则

- **preset** 在中文正文中翻译为「预设」。例如「preset 升级」写作「预设升级」、「preset→full 升级」写作「预设→full 升级」、「继续 preset 轻量流程」写作「继续预设轻量流程」。
- 例外（保持英文原词不译）：CLI 命令、转换标识符、代码字面量，如 `preset-escalate`、`set phase design`、`/comet-hotfix`。
- 章节标题中的 preset 一律改为「预设」（如「## 预设升级」）。

## Style preferences

- Use active voice and second person ("you")
- Keep sentences concise — one idea per sentence
- Use sentence case for headings
- Bold for UI elements: Click **Settings**
- Code formatting for file names, commands, paths, and code references

## Content boundaries

{/* Define what should and shouldn't be documented */}
{/* Example: Don't document internal admin features */}
