---
icon: material/cog-play
---

# Workflow Tab

*Render behaviour, automations, naming templates, pie-menu slot mapping, and the hotkey reference.*

## :material-image-multiple: Render

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| **Apply to F12 / Native Renders** | bool | Off | Intercepts Blender's native F12 / `bpy.ops.render.render()` and applies Smart Output tokens to the path. |
| **Enable Render Sounds** | bool | On | Plays a notification sound when a batch render completes. |
| **Sound Folder** | path | *(empty)* | Custom directory of `.wav` files. Empty falls back to the bundled defaults. |
| **Success Sound** | enum | *(scanned)* | File played on successful render. |
| **Failed Sound** | enum | *(scanned)* | File played on render failure / cancellation. |

## :material-auto-fix: Automations

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| **Auto-create Reference Action** | bool | On | Creates the *Reference State* action when a new scene is created. |
| **Auto-mirror Keyframes to Reference** | bool | On | Mirrors unkeyed values into the Reference Action on keyframe insert. |
| **Auto-assign View Layer Actions** | bool | On | Creates and assigns View Layer actions automatically when a View Layer is added. |
| **Auto-rename Actions on Hierarchy Change** | bool | Off | Regenerates action names from the naming templates when scenes / View Layers are renamed. |
| **Auto-rename Slots on Target Rename** | bool | On | Keeps slot names in sync with their target object/data. |
| **Auto-rename Thumbnails on Name Change** | bool | On | Renames preview PNGs alongside their source. |
| **Auto Fake User on Actions** | bool | On | Sets Fake User on actions to protect them from auto-purge. |
| **Auto-snap on Keyframe Clear** | bool | On | Snaps the View Layer action selection to the nearest keyframe when one is cleared. |
| **Preset Changes** | enum | MANUAL | Policy when render/output/camera presets are edited live: **MANUAL** (warn), **DROP_REAPPLY** (discard), **ALWAYS_SYNC** (write back to preset). |

## :material-form-textbox: Naming

The naming sub-tab holds editable templates for every named entity the addon creates — actions, slots, takes, variants, presets. Templates use [Smart Output tokens](../features/smart_output.md).

### Separator

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| **Separator** | string (≤3 chars) | `_` | The character(s) emitted by `{sep}` everywhere. |
| **Unlock Naming Templates** | bool | Off | Safety latch — must be on before any template is editable. Changing templates can break existing slot links. |
| **Token Filter** | enum | ALL | Limits which tokens the picker shows: ALL / SCENE_ACTION / VL_ACTION / SLOT / TAKE / VARIANT. |

### Action Templates

| Slot | Default Template |
|------|------------------|
| Scene | `{scenegroup}{sep}{scene}` |
| View Layer | `{scenegroup}{sep}{scene}{sep}{vlgroup}{sep}{viewlayer}` |
| View Layer Version | `{scenegroup}{sep}{scene}{sep}{vlgroup}{sep}{viewlayer}{sep}{version}` |
| Scene Group | `{scenegroup}` |
| View Layer Group | `{scenegroup}{sep}{scene}{sep}{vlgroup}` |

### Camera & Compositor Templates

| Slot | Default Template |
|------|------------------|
| Scene Camera | `{scene}{sep}Cam` |
| Scene Compositor | `{scene}{sep}Comp` |
| View Layer Camera | `{scene}{sep}{viewlayer}{sep}Cam` |
| View Layer Compositor | `{scene}{sep}{viewlayer}{sep}Comp` |
| Global Action | `Global{sep}Action` |
| Global Camera | `Global{sep}Cam` |
| Global Compositor | `Global{sep}Comp` |

### Slot Type Templates

| Type | Default Template |
|------|------------------|
| Reference Action | `Reference{sep}State` |
| Scene / World / Object | `{scene}` / `{world}` / `{object}{sep}{type}` |
| Mesh / Armature / Light / Camera | `{object}{sep}Mesh` / `Rig` / `Light` / `Cam` |
| Curve / Lattice / Metaball / Font | `{object}{sep}Curve` / `Lattice` / `Meta` / `Text` |
| Grease Pencil / Speaker / Empty / Particles | `{object}{sep}GP` / `Audio` / `{object}` / `{object}{sep}Particles` |
| Shape Key | `{object}{sep}Keys` |
| Material / Node Tree | `{material}` / `{parent}{sep}Nodes` |
| Generic fallback | `{object}` |

### Take / Variant / Preset Templates

| Slot | Default Template |
|------|------------------|
| Take Name | `Take_{index:03d}` |
| Variant Group | `{collection}_Variants` |
| Variant Name | `{material}` |
| Render / Output / File Output Preset | `{scene}{sep}Render` / `Output` / `FileOutput` |
| View Layer / Color Mgmt Preset | `{scene}{sep}ViewLayer` / `Color` |
| Camera / World / Material Preset | `{camera}` / `{world}` / `{material}` |

## :material-dots-circle: Pie Menu

Eight enum dropdowns — one per pie direction — each accepting: *None*, *Tree View*, *Watchlist*, *Slotted Mode*, *Rules*, *Variants*, *Tags*, *Batch Render*, *Channels*. Defaults documented on the [Pie Menus](../features/pie_menus.md) page. Reassigning a slot auto-deduplicates the previous holder.

## :material-keyboard: Hotkeys

A read-only summary of the addon's registered keymaps. To edit a binding, use *Edit > Preferences > Keymap* and search for the operator id (`tks.global_*` or `wm.call_menu_pie`). The full inventory is on the [Keyboard Shortcuts](../interface/hotkeys.md) page.
