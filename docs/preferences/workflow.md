---
icon: material/cog-play
---

# Workflow Tab

*Render behaviour, automations, syntax templates, the token registry, pie-menu slot mapping, and the hotkey reference.*

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
| **Auto-create Rest Action** | bool | On | Creates the *Rest State* action when a new scene is created. |
| **Auto-mirror Keyframes to Rest** | bool | On | Mirrors unkeyed values into the Rest Action on keyframe insert. |
| **Auto-assign View Layer Actions** | bool | On | Creates and assigns View Layer actions automatically when a View Layer is added. |
| **Auto-rename Actions on Hierarchy Change** | bool | Off | Regenerates action names from the naming templates when scenes / View Layers are renamed. |
| **Auto-rename Slots on Target Rename** | bool | On | Keeps slot names in sync with their target object/data. |
| **Auto-rename Thumbnails on Name Change** | bool | On | Renames preview PNGs alongside their source. |
| **Auto Fake User on Actions** | bool | On | Sets Fake User on actions to protect them from auto-purge. |
| **Auto-snap on Keyframe Clear** | bool | On | Snaps the View Layer action selection to the nearest keyframe when one is cleared. |
| **Preset Changes** | enum | MANUAL | Policy when render/output/camera presets are edited live: **MANUAL** (warn), **DROP_REAPPLY** (discard), **ALWAYS_SYNC** (write back to preset). |

## :material-form-textbox: Syntax

The Syntax sub-tab holds editable templates for every named entity the addon creates — actions, slots, takes, variants, presets. Templates use [Smart Output tokens](../features/smart_output.md); every template field carries a **Build Syntax** launcher that opens the interactive token builder. Templates are always editable — bindings are identity-based, so renaming a template can't break existing slot links.

### :material-minus: Separator
| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| **Separator** | string (≤3 chars) | `_` | The character(s) emitted by `{sep}` everywhere. |

### :material-play-box-multiple: Action Templates
| Slot | Default Template |
|------|------------------|
| Scene | `{scenegroup}{sep}{scene}` |
| View Layer | `{scenegroup}{sep}{scene}{sep}{vlgroup}{sep}{viewlayer}` |
| View Layer Version | `{scenegroup}{sep}{scene}{sep}{vlgroup}{sep}{viewlayer}{sep}{version}` |
| Scene Group | `{scenegroup}` |
| View Layer Group | `{scenegroup}{sep}{scene}{sep}{vlgroup}` |

### :material-camera: Camera & Compositor Templates
| Slot | Default Template |
|------|------------------|
| Scene Camera | `{scene}{sep}Cam` |
| Scene Compositor | `{scene}{sep}Comp` |
| View Layer Camera | `{scene}{sep}{viewlayer}{sep}Cam` |
| View Layer Compositor | `{scene}{sep}{viewlayer}{sep}Comp` |
| Global Action | `Global{sep}Action` |
| Global Camera | `Global{sep}Cam` |
| Global Compositor | `Global{sep}Comp` |

### :material-shape: Slot Type Templates
| Type | Default Template |
|------|------------------|
| Rest Action | `Rest{sep}State` |
| Scene / World / Object | `{scene}` / `{world}` / `{object}{sep}{type}` |
| Mesh / Armature / Light / Camera | `{object}{sep}Mesh` / `Rig` / `Light` / `Cam` |
| Curve / Lattice / Metaball / Font | `{object}{sep}Curve` / `Lattice` / `Meta` / `Text` |
| Grease Pencil / Speaker / Empty / Particles | `{object}{sep}GP` / `Audio` / `{object}` / `{object}{sep}Particles` |
| Shape Key | `{object}{sep}Keys` |
| Material / Node Tree | `{material}` / `{parent}{sep}Nodes` |
| Generic fallback | `{object}` |

### :material-palette-swatch: Take / Variant / Preset Templates
| Slot | Default Template |
|------|------------------|
| Take Name | `Take_{index:03d}` |
| Variant Group | `{collection}_Variants` |
| Variant Name | `{material}` |
| Render / Output / File Output Preset | `{scene}{sep}Render` / `Output` / `FileOutput` |
| View Layer / Color Mgmt Preset | `{scene}{sep}ViewLayer` / `Color` |
| Camera / World / Material Preset | `{camera}` / `{world}` / `{material}` |

## :material-code-braces: Token

The token registry sub-tab — your [Custom Tokens](../features/custom_tokens.md) live here.

| Area | What it holds |
|------|---------------|
| **Preset row** | Save / load named sets of your custom tokens across the Project / Local / Shared / Add-on storage tiers. |
| **Custom Tokens** | Your own tokens, grouped into categories with picked icons: add via **Add › Category / Token**, edit with the pencil, rename a whole category by clicking its title, star ★ favourites, hide 👁 tokens from the grids, delete with confirmation. Each row live-previews what the token resolves to right now. |
| **Built-in Tokens (reference)** | A read-only, categorized listing of every shipped token with its live value — the same registry documented on the [Smart Output](../features/smart_output.md) page. ★/👁 work here too. |

The full feature — sources, path rules, format specs, a tutorial and a 50-token example library — is documented on the [Custom Tokens](../features/custom_tokens.md) page.

## :material-dots-circle: Pie Menu

Two pie configurators live under this sub-tab. Both use a compass grid (NW / N / NE / W / E / SW / S / SE) and auto-deduplicate — assigning an action that already lives in another slot blanks the previous slot.

### :material-compass: Navigation Pie

Master toggle: **Enable Navigation Pie** (on by default, ++ctrl+shift+c++).

Eight enum dropdowns, each accepting: *None*, *Tree View*, *Watchlist*, *Slotted Mode*, *Rules*, *Variants*, *Tags*, *Batch Render*, *Channels*. Defaults documented on the [Pie Menus](../features/pie_menus.md#navigation-pie) page.

### :material-image-multiple: F12 Render Pie

Master toggle: **Enable F12 Render Pie** (off by default). Flipping the toggle on registers a ++f12++ keymap entry that replaces Blender's native render shortcut with a render-scope picker; flipping it off unregisters the entry so native F12 fires again.

Eight enum dropdowns, each accepting any of the 11 render-scope actions: *None*, *Current View Layer*, *Active VLs (Scene)*, *Active VLs (All Scenes)*, *All VLs (Scene, Force)*, *All VLs (All Scenes, Force)*, *Skip Completed*, *Failed Only*, *Preview Thumbnails*, *Native F12*, *Open Render Settings*. Per-action behaviour is documented on the [Pie Menus](../features/pie_menus.md#f12-render-pie) page.

**Reset All Slots** restores either pie's defaults independently.

## :material-keyboard: Hotkeys

A read-only summary of the addon's registered keymaps. To edit a binding, use *Edit > Preferences > Keymap* and search for the operator id (`tks.global_*` or `wm.call_menu_pie`). The full inventory is on the [Keyboard Shortcuts](../interface/hotkeys.md) page.
