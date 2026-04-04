---
icon: material/movie-open
---

# 镜头管理 (Takes)

一个 **Take (镜头)** 指的是包含了一个或多个 View Layers (视图层) 且具有明确名称用途的特定组。它代表着你设定好的某一个场景组合 —— 也许是个相机的角度、或者是一套精美的打光环境、某一套特定贴图的材质变体，亦或者是一段特有的独立动画表现。

## 基本概念

在电影制作和专业摄影领域，"take" 常指对一个分镜/镜头的录制版本。而在 Takes for Blender 里，我们将这一概念深入延伸并拓展进 Blender 原生的 View Layer 系统逻辑中，提供以下非凡特性：

- 每一单个 View Layer 都可 **独立指定摄影相机 (Camera)**
- 每一单个 View Layer 都可 **独立指定外界环境光 (World environments)**
- 每一单个 View Layer 都可 **独立挂载合成器树图 (Compositor node trees)**
- 每一单个 View Layer 都可 **拥有独立的渲染预设档 (Render presets)**
- 每一单个 View Layer 都可 **独立运行专属的物体动画 (Animation actions)**

## 层级组织结构

所有的 Takes (镜头) 都严谨有序地归纳组织于 Takes Tree (视图树) 内的结构关系里：

| 级别代称 | 等级用途 | 实战取名示例 |
|-------|---------|---------|
| **Scene Group (场景主组)** | 最最顶层/宏观收纳层 | "室内 / Interior", "室外 / Exterior" |
| **Scene (场景)** | Blender 的独立场景级别 | "厨房 / Kitchen", "浴室 / Bathroom" |
| **VL Group (VL副组)** | 把特定具有共同点的 VL 层逻辑规整打包 | "C位大特写", "细节机位组" |
| **View Layer (视图层)** | 真实下水参与渲染的核心业务单位 | "正面45度", "鸟瞰机位" |
| **VL Version (VL变种版本)** | 为了记录某些改动或修改单独保存下来的 VL 设定切片快照库 | "v1_暖光版", "v2_赛博朋克风" |

## 创建 Takes

### 新增一个 View Layer 层

1. 点击树状图边上的 **+** 号面板按钮。
2. 直接选择 **Add View Layer**.
3. 新诞生的 VL 会直接复刻并继承此前正处于激活工作状态那个 VL 相关的属性状态。

### 把 View Layers 层进行规整编组

1. 选中树状图上你想选的那个 View Layer。
2. 点击键盘快捷键 ++ctrl+g++ 立刻让它被囊括进入一个新诞生的 VL Group 组里。
3. 把其他的 View Layers 也通通拖进这个分组内。

### VLVersions (小版本分支)

生成某个 View Layer 层特有级联状况配置的完整参数切片快照库：

1. 选中你想要开支的 View Layer 面板层。
2. 点击 **+** → **Add Version (创建分支版本)**。
3. 分支生成的每一个小版本里，他们都有极其私密且全独立拥有的：个人私用相机、背景世界、人物动画、甚至有自己的一套私密预设覆盖！

!!! tip "光速切换 (Quick Switching)"
    穿插点击不同的 VL Versions (版本分支) 便可达到毫秒间比较评估设计思路方案的能力。不再需要笨重而且极占资源的重复完整克隆(duplicating)整个视图层模型网格包。
