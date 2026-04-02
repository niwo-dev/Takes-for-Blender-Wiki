---
icon: material/tune-vertical
---

# 上下文属性 (Context Properties)

**位置:** *Properties Editor (属性编辑器) > Takes 选项卡 > Context*

上下文属性面板 (Context Properties) 会为你一比一呈现目前激活的那个 View Layer 其上的特定覆盖设置 (cascade override)。所有的设置属性，本身皆享有独立的子菜单，且可以点击树状图中的级联图标直接把它们呼出。

## 级联悬浮窗 (Cascade Popovers)

利用鼠标左键轻轻单击树图上的任意级联标记，借此揭开相关的弹窗 (popover)。在里面的配置里为你提供特定在当前层级的属性设置 (set) 或清楚 (clear) 覆写能力。

### 相机悬浮框 (Camera Popover)

从这能让你自由指派不同 View Layer 各自爱用的相机机位：

- **Camera selector (摄像机列表)** — 一个极其机敏地下拉列表，特地帮你直接过滤那些属于同场景内的现有摄像机集合。
- **Camera preset (相机预设包)** — 直接调用保存好焦距参数与物理参数的一个配置文件套件 (焦段等属性)。
- **New / Rename (新建 / 重命名)** — 在当前视口光驱新建相机对象或给它更换新名字。

!!! note "相机守卫 (Camera Guard)"
    当你误选并非级联认证分配的"当前"主摄像机资产时，相机预设面板会自动封死选项操作且置灰处理。然后底部抛出一个警告反馈: **"Assign a camera in the cascade (由于选择不当, 请重新确认主摄)"** 

### 环境悬浮框 (World Popover)

独立设置针对不同层级的 World Environment 气氛世界:

- **World selector (背景挑选)** — 查找并使用可被提取出的背景数据块。
- **World preset (环境预设)** — 选择提前收纳好的JSON背景文件设定。
- **World rule (智能挑选规则)** — 借由自定义标签算法主动进行自匹配替换规则选择动作。

### 动作悬浮框 (Action Popover)

阅览审查级联分发的底层动作系统:

- **Current action (当前的分配)** — 被判决通过了各级过滤网然后落到当前 VL 身上的有效动作内容。
- **Re-apply Cascade (强制重启应用)** — 洗清本地脏乱的动作修改痕迹并立刻重引回整个主级联链的默认继承设置。

### 合成器菜单 (Compositor Popover)

挂载仅属于当前 VL 的合成节点网络 (Node tree)。

### 输出设置 (Output Popover)

针对出图及导出的细节把控台:

- **Output rule (输出路线算法)** — 基于标签路径的自动导出指令算法设定。
- **Render preset (渲染参数模板)** — 各个 View Layer 特化的画质或者引擎设置集合。

## 优先级决断 (Override Resolution)

覆盖数值自顶向下的渗透决解方法一直贯彻于每一级树形结构中。所有指令从最顶上被抛下，一直优先查收首个不吃包空数据的阶层：

```
Global(全局) → Scene Group → Scene → VL Group → View Layer → VL Version
```

当某一台阶层独立设定有内容，它立刻表现为一颗 **鲜亮的图标**，但是若当它是顺水吸纳着上层传递继承下来的包袱，则变成一枚极其 **暗沉发灰的表示符** 以作区分。
