---
icon: material/download
---

# 安装

## 系统要求

- **Blender 5.1** 或更高版本
- Windows，macOS，或 Linux

## 下载

请从 [GitHub Releases](https://github.com/niwo-dev/Takes-for-Blender/releases) 页面下载最新的 ZIP 发布版本。

!!! warning "请勿解压"
    Blender 可直接从 `.zip` 文件安装插件。**不要**在安装前将其解压。

## 在 Blender 中安装

1. 打开 Blender 并前往 **Edit (编辑) > Preferences (偏好设置) > Add-ons (插件)**。
2. 点击右上角下拉菜单中的 **Install from Disk... (从磁盘安装...)**。
3. 浏览并选择你下载的 `.zip` 文件。
4. 勾选 **Takes for Blender** 旁边的复选框以激活插件。

## 验证安装

激活后，**Properties Editor (属性编辑器)** 的侧边栏将出现一个新的 **Takes** 选项卡（如果侧边栏隐藏了，可以按 ++n++ 呼出）。

你应该能看到：

- **Navigation Panel (导航面板)** 以及 Take/View Layer 选择器
- **Takes Tree (Takes 树状图)**，显示当前所有的 Scenes (场景) 和 View layers (视图层)

!!! tip "首次启动"
    在默认设置下的首次启动时，插件会自动为级联动画启用
    **Auto-Assign (自动分配)** 和 **Auto-Rename (自动重命名)** 功能。
    这意味着动画数据将在每个 View Layer 层级开箱即用。

## 更新

要更新到较新版本：

1. 前往 **Edit > Preferences > Add-ons**。
2. 找到 **Takes for Blender** 并点击下拉箭头。
3. 点击 **Remove (移除)**。
4. 重启 Blender。
5. 使用新的 `.zip` 文件重复上述安装步骤。

!!! note "设置持久化"
    只要启用了 **Autosave Preferences (自动保存偏好设置)** (默认状态下开启)，你的插件偏好设置将保存到单独的 JSON 文件中，并在更新后持续生效。
