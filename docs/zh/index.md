---
icon: material/home
title: 首页
hide:
  - navigation
  - toc
  - title
---

<div class="grid cards" markdown>

-   :material-rocket-launch:{ .lg .middle } **快速入门**

    ---

    安装插件，并在5分钟内了解基本操作。

    [:octicons-arrow-right-24: 安装指南](getting_started/installation.md)

-   :material-view-dashboard:{ .lg .middle } **界面指南**

    ---

    针对所有面板、按钮和控制项的直观图解。

    [:octicons-arrow-right-24: 界面](interface/index.md)

-   :material-layers-triple:{ .lg .middle } **核心功能**

    ---

    深入了解 Takes (镜头)、Cascade (级联)、Variants (变体)、Batch Render (批量渲染) 等功能。

    [:octicons-arrow-right-24: 核心功能](features/index.md)

-   :material-play-circle:{ .lg .middle } **工作流**

    ---

    适用于实际生产场景的循序渐进教程。

    [:octicons-arrow-right-24: 工作流](workflows/index.md)

</div>

## 核心能力 (Key Capabilities)

| 功能 | 描述 |
|---------|-------------|
| **Takes 视图树** | 统一的层级结构：Scene Groups → Scenes → VL Groups → View Layers → Versions。 |
| **6级 Cascade (级联)** | 从全局级向下覆盖解析到版本级，支持相机、环境、动画动作等。 |
| **Variant Switch (变体切换)** | 产品变体系统，支持特定范围的材质替换、预设注入及材质池管理。 |
| **Rest State (静止状态/基准状态)** | 自动镜像基准动作系统，可在各种动画间保留原始的默认关键帧。 |
| **Batch Render (批量渲染)** | 模态渲染引擎（前台或后台），搭载智能输出（Smart Output）文件命名令牌系统。 |
| **Render Presets (渲染预设)** | 基于 JSON 的预设，用于针对每个 View Layer 单独配置渲染、相机、环境和文件输出设置。 |
| **内联预览** | 直接在树状图中的每个 View Layer 旁边实时显示迷你预览缩略图。 |

!!! tip "Blender 版本"
    Takes for Blender 需要 **Blender 5.1** 或更高版本。它依赖于 Blender 5.0 中引入的 Slotted Action 动画插槽系统。

---

*由 Nikolaj Woroschilow 制作*
