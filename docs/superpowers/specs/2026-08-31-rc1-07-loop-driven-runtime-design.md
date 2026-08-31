# RC1 07 Loop 驱动 Runtime 图片设计

## 目标

重做 `img/rc1-highlights-v2/07-recoverable-runtime.png`。修正现有文字与图形的纵向拉长感，以更抽象的视觉方式突出 Native Runtime 由 Build 与 Verify 之间的 Loop 驱动。

## 核心构图

- 使用 3:4 竖版画布和纯白背景。
- 顶部保留小尺寸 Comet Logo。
- 标题使用 `Native Runtime`，副标题使用 `Loop 驱动的可恢复执行`。
- 主体采用横向双环或 `∞` 形轨迹：`Shape` 从左侧进入，`Build` 与 `Verify` 分别位于两个环中，验证通过后从右侧进入 `Archive`。
- 在双环轨迹上分布少量圆点、断续状态和完成节点，用抽象方式表达检查点、恢复与迭代。
- `Build ↔ Verify` 是持续 Loop；`Shape` 和 `Archive` 保持入口与出口语义。
- 需求变化回到 Shape 只用一条轻量回流暗示，不与主 Loop 争夺视觉焦点。

## 信息层级

- 第一层：抽象双环和 `Build ↔ Verify`。
- 第二层：`Shape`、`Build`、`Verify`、`Archive` 四个阶段名称。
- 第三层：底部小型文字标识 `Portable State`、`Guarded Transitions`、`Evidence Gates`。
- 移除当前三个大卡片、具象数据库/盾牌/栅栏插图、矩形流程框和大面积虚线路径。

## 视觉规则

- 所有文字、图标和环形保持自然宽高比例，不使用纵向拉伸、超窄字体或非等比缩放。
- 使用深海军蓝、Comet 蓝、浅蓝和少量青绿色完成态点缀。
- 采用扁平、精确、抽象的产品图形语言，不使用 3D、阴影、玻璃效果或复杂 UI。
- 中文文案使用直接的产品化陈述，不使用反问句和“不是……而是……”句式。

## 验收

- 图片为精确 3:4，背景为 `#FFFFFF`。
- 第一眼可以识别 Build ↔ Verify 的双环驱动关系。
- Shape 与 Archive 不被表达为持续 Loop 的组成部分。
- 字体和圆形没有纵向拉长或非等比变形。
- Git 仅新增本设计说明，并在实施阶段覆盖 v2 目录中的 07 图片。
