---
icon: material/cog
---

# 偏好设置 (Preferences)

**设置位置:** *Edit (编辑) > Preferences (偏好设置) > Add-ons (插件) > Takes for Blender*

你也可以在 Navigation Panel (导航面板) 的顶部标题栏点击那个 **齿轮图标 (gear icon)**，然后选择 **Open Preferences (打开偏好设置)** 来直达这里。

## 常规 (General)

| 设置项 | 默认值 | 描述 |
|---------|---------|-------------|
| **Autosave Preferences** | 开启 (On) | 将你定制好的设置保存记录在 JSON 文件内，以便下次开启仍旧存在生效。 |
| **Debug Logging** | 关闭 (Off) | 按分类级别单独开启日志抓取机能，并将它写入每日特定的实体日志文档中。 |

## 机能设定 (Features)

| 设置项 | 默认值 | 描述 |
|---------|---------|-------------|
| **Auto-Assign VL Actions** | 开启 (On) | 系统全自动依照 View Layer 来切分、派发及挂载各类独立不同的级联动画档 (actions)。 |
| **Auto-Create Reference Action** | 开启 (On) | 将你打下/篡改的一切基础帧原样照录，自动备份至被称为 Reference State (原初本原态) 的大本营档案去镜像锁存。 |
| **Auto-Rename Actions** | 开启 (On) | 为了美观与系统管理，插件会自动全帮你把各类私配独立的动画文件全按级联标准的命名格式修改成一致名字。 |
| **Preset Automation Mode** | 手动 (Manual) | 这是告诉系统你是准备放养还是自动接受任何因参数遭外力修改后的自动补拍重记行为：可选 (全部自动咽下包揽 auto-accept, 甚至反手分发到各级去覆写更改 sync, 乖乖待审手动 manual)。 |
| **Batch Render Sound** | 无 (None) | 出完所有排队要渲染的批量全家福照片时，所应大响提醒的通知音频档设置位。 |

## 操作及行为 (Behavior)

| 设置项 | 默认值 | 描述 |
|---------|---------|-------------|
| **Syntax Brackets** | 方括号型 `[]` | 在应用 Smart Output 指向时，用哪些形态模样的符号包裹代换神之令牌。 |
| **Separator Characters** | `sep1`设定是`_` | 提供多达 5套 可以独立配比并随取随用的断隔隔断符 (tokens)。 |

## 除虫与日志捕获设定 (Debug Logging)

在勾亮该档时，除虫调试会细粒度且无遗漏去依仗类目大纲网抓拿捕获各条异动写入日存日志档:

| 主板块区 (Topic) | 下设的捕捉支目 (Subtopics) |
|-------|-----------|
| **Core (内设主程序)** | VL 切屏换层 (VL Switch), 主瀑布级帘运算网 (Cascade) |
| **UI (屏幕面板表皮)** | 检查大官 (Inspector) |
| **Ops (手动向微操作项)** | 有关调参打动画等异变 (Animation) |
| **Features (硬核体系系统类)** | 基准还原大本营 (Reference State), 材料调换组 (Variant Switch) |
| **Render (只与出图打交道)** | 批量算图网机大排队 (Batch Render) |

此外这里设下的那并排四核级别滤芯钮 (Debug, Info, Warning, Error) ，能够极其高明和节省电脑内存地在任何除虫文本尚未串联组合发生前就把不需要抓的等级给剔出去免记录。

!!! note "日志实物安放所在地 (Log Location)"
    所有的打卡录制本通通皆存定式为名为： `takes_for_blender_YYYY-MM-DD.log`
    这版子呆在你提前预留给它的专司日记目录里头，此外为防止那些成吨电子垃圾堆积毁硬盘，所有逾期存放越 7日 极限的远古旧史，系统全皆自动代劳无痛拔掉火化。
