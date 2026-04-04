---
icon: material/view-dashboard
---

# 界面

Takes for Blender 的总界面安置在 **Properties Editor (属性编辑器)** 的侧边栏中。它由四个主面板构成，你可以通过导航面板 (Navigation Panel) 顶部的选项卡切换它们。

## 面板概览

| 面板 | 用途 |
|-------|---------|
| [**Navigation Panel (导航面板)**](navigation_panel.md) | 主要的控制中心 —— 处理 Take/VL 的切换、树状图视图、级联图标以及批量渲染入口。 |
| [**Inspector Panel (检查器面板)**](inspector_panel.md) | 针对单个对象的观察列表 (watchlist)，显示受管 (managed) 或锁定 (pinned) 的对象、它们的动画动作、插槽以及子数据。 |
| [**Context Properties (上下文属性)**](context_properties.md) | 每个视图层 (View Layer) 的独立级联覆盖设置 —— 涵盖相机、环境世界、合成器、动画以及预设。 |
| [**Variant Tree (变体树)**](variant_tree.md) | 产品变体管理 —— 包含产品、状态、部件以及材质池。 |

## 导航选项卡

导航面板的标题处包含三个切换按钮，用于在 Context (上下文)、Link (链接) 和 Inspector (检查器) 视图之间切换：

- **Context** — Takes 树和各 VL 设置
- **Link** — 集合的关联与管理
- **Inspector** — 对象观察列表及动画动作/插槽管理

!!! tip "快捷键"
    许多树状图的操作都支持由键盘快捷键来完成：

    - ++ctrl+n++ — 创建新项目（上下文感知）
    - ++shift+d++ — 复制（独立的新副本）
    - ++alt+d++ — 关联复制（实例副本）
    - ++ctrl+g++ — 创建组
    - ++alt+g++ — 取消成组
    - ++del++ 或 ++x++ — 删除（带有确认弹窗）
    - ++f2++ — 重命名
