# Comet 与普通提示词对比：工作区与并行协作

## 目标

在中文介绍页“与普通提示词不同的地方”表格中补充两项由 Comet 源码和 Runtime 合约支持的优势：工作区管理与并行协作。

## 文案设计

新增两行，不改写现有条目：

| 关心点 | 没有 Comet | 使用 Comet |
| --- | --- | --- |
| 工作区管理 | 开发者需要手动创建、切换并记住每项工作对应的分支和 worktree | 创建 change 时选择 `current`、`branch` 或 `worktree`；Comet 创建或复用工作区、记录分支绑定，并在恢复时定位正确目录。分支或目录不匹配时停止推进 |
| 并行协作 | 开发者需要自己拆任务、判断依赖、分配工作目录、跟踪完成状态并合并结果 | Supervisor Change 按依赖只释放当前可执行的 child，为每个 child 准备独立 worktree，并用验证与集成状态统一收口 |

## 表达边界

- 不声称所有普通 Change 都会自动并行。普通 Change 只内置 `current`、`branch`、`worktree` 的准备、绑定、复用与恢复。
- 不声称 Agent 可以在错误分支上自动切换并继续。绑定不匹配时 Runtime 应停止，避免把改动写入错误工作区。
- 并行编排只归属 Native Supervisor Change。Classic 多个 active change 可以共存，但并发写源码仍需要独立分支或 worktree。
- 本轮只修改中文 `zh/introduction.mdx`。英文内容等待用户确认后再同步。

## 验证

- 检查 MDX 表格语法和格式。
- 运行面向 `zh/introduction.mdx` 的 Mintlify 校验或仓库现有等价检查。
- 检查 Git diff，确保不覆盖工作区中已有的中文介绍页改动，也不修改英文页面。

## 后续候选

“交付收尾”“改动范围归属”“用户决策所有权”和“只读可观测性”都有源码依据，但不在本次两行改动内；是否加入由用户另行确认。
