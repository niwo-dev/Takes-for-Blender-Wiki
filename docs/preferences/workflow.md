---
icon: material/cog-play
---

# Workflow Tab

*Render behaviour, automations, syntax templates, the token registry, pie-menu slot mapping, viewport sync, and the hotkey reference.*

Seven sub-tabs live here: **Render**, **Automations**, **Syntax**, **Token**, **Hotkeys**, **Pie & Misc**, and **Sync**. A search field above the Preferences tabs filters all of them — settings that don't match the query dim in place while matches stay highlighted, and tabs or sub-tabs with no match gray out.

## :material-image-multiple: Render

Grouped into three collapsible sections: **Render Output**, **Completion Sounds**, and **Play Sound For**.

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| **{{ pref('smart_output_apply_to_f12').label }}** | bool | Off | When off, ++f12++ keeps Blender's native render behaviour (literal filepath, no token resolution). When on, ++f12++ / ++ctrl+f12++ resolve Smart Output tokens and obey the Standard / Compositor output toggles. Batch renders use Smart Output regardless. |
| **{{ pref('smart_output_bracket_style').label }}** | enum | `[token]` | Bracket style for [Smart Output](../features/smart_output.md#bracket-styles) tokens — seven styles from `[scene]` to `#scene#`. |
| **{{ pref('smart_output_render_version_scope').label }}** | enum | Per Scene | Where the `{rev}` render-version counter is stored: one shared by the whole scene, or one per view layer. |
| **Enable Render Sounds** | bool | On | Plays a notification sound when a render completes. |
| **Sound Folder** | path | *(empty)* | Custom directory of `.wav` files. Empty falls back to the bundled defaults. |
| **Success Sound** | enum | *(scanned)* | File played on successful render. |
| **Failed Sound** | enum | *(scanned)* | File played on render failure / cancellation. |

**Play Sound For** holds per-flow toggles, gated by the master switch — choose which render flows ring: single-image renders (Ctrl+click, active View Layer, native F12) and batch renders (foreground, background, preview thumbnails).

## :material-auto-fix: Automations

Grouped into collapsible categories: **Rest State**, **Actions**, **Cameras**, **World**, **Previews**, and **Render Presets**.

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| **Auto-create Rest Action** | bool | On | Creates the *Rest State* action when a new scene is created. |
| **Auto-mirror Keyframes to Rest** | bool | On | Mirrors unkeyed values into the Rest Action on keyframe insert. |
| **Auto-snap on Keyframe Clear** | bool | On | Snaps the View Layer action selection to the nearest keyframe when one is cleared. |
| **Auto-assign ViewLayer Actions** | bool | On | Creates and assigns View Layer actions automatically when a View Layer is added. |
| **Auto-rename Actions on Hierarchy Change** | bool | Off | Regenerates action names from the naming templates when scenes / View Layers are renamed. |
| **Auto-rename Slots on Target Rename** | bool | On | Keeps slot names in sync with their target object/data. |
| **Auto Fake User on Actions** | bool | On | Sets Fake User on actions to protect them from auto-purge. |
| **{{ pref('auto_duplicate_action_mode').label }}** | enum | Strip Animation | What happens to a duplicated object's animation: **Strip Animation** (the copy arrives with no action, like a fresh object), **Independent Slot** (the copy keeps the action but gets its own slot with an independent copy of the keyframes), or **Off (Blender Default)**. |
| **{{ pref('preload_viewlayers_mode').label }}** | enum | Off | Pre-builds view-layer dependency graphs quietly in the background so the first switch to each take is instant: **Off**, **Automatic** (preload shortly after a file opens), or **Manual (button)** (adds a *Preload View Layers* button to the Takes tree sidebar). |
| **{{ pref('preload_auto_open_panel').label }}** | bool | Off | With Automatic preload, opens the View-Layer Preload panel so you can watch progress; it closes itself once every layer is preloaded. |
| **Auto-rename Thumbnails on Name Change** | bool | On | Renames preview PNGs alongside their source. |
| **Preset Changes** | enum | MANUAL | Policy when render/output/camera presets are edited live: **MANUAL** (warn), **DROP_REAPPLY** (discard), **ALWAYS_SYNC** (write back to preset). |

## :material-form-textbox: Syntax

The Syntax sub-tab holds editable templates for every named entity the addon creates — actions, slots, takes, variants, presets. Templates use [Smart Output tokens](../features/smart_output.md); every template field carries a **Build Syntax** launcher that opens the interactive token builder. Templates are always editable — bindings are identity-based, so renaming a template can't break existing slot links. The `{sep}` separator character itself is configured under [Pie & Misc > Tokens](#tokens).

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

## :material-keyboard: Hotkeys

A read-only summary of the addon's registered keymaps. To edit a binding, use *Edit > Preferences > Keymap* and search for the operator id (`tks.global_*` or `wm.call_menu_pie`). The full inventory is on the [Keyboard Shortcuts](../interface/hotkeys.md) page.

## :material-dots-circle: Pie & Misc

Four pie configurators live under this sub-tab, alongside the other hotkey behaviour (Editor Scope, Add Context) and the Tokens section. Every pie uses a compass grid (NW / N / NE / W / E / SW / S / SE) and auto-deduplicates — assigning an action that already lives in another slot blanks the previous slot. Each pie has its own **Reset** button to restore its defaults independently.

### :material-compass: Navigation Pie

Master toggle: **Enable Navigation Pie** (on by default, ++ctrl+shift+c++).

Eight enum dropdowns, each accepting: *None*, *Tree View*, *Watchlist*, *Slotted Mode*, *Rules*, *Variants*, *Tags*, *Batch Render*, *Channels*. Defaults documented on the [Pie Menus](../features/pie_menus.md#navigation-pie) page.

### :material-image-multiple: F12 Render Pie

Master toggle: **{{ pref('f12_pie_menu_enabled').label }}** (off by default). Flipping the toggle on registers a ++f12++ keymap entry that replaces Blender's native render shortcut with a render-scope picker; flipping it off unregisters the entry so native F12 fires again.

Eight enum dropdowns, each accepting any of the 10 render-scope actions, grouped under **Selected Takes** / **All Takes** / **Other** headings: *This Scene* and *All Scenes* (per group), *Active Layer Only*, *Resume — Skip Done*, *Retry Failed*, *Native F12*, *Open Render Settings*, and *None*. Per-action behaviour is documented on the [Pie Menus](../features/pie_menus.md#f12-render-pie) page.

### :material-key-plus: Keyframe Pie

Master toggle: **{{ pref('keyframe_pie_enabled').label }}** (off by default). Replaces Blender's native ++i++ keyframe-insert menu with a pie of keyframing actions — eight configurable compass slots, same grid and dedup rules as the pies above.

### :material-key-minus: Clear Pie

Master toggle: **{{ pref('keyframe_alt_pie_enabled').label }}** (off by default). Puts a pie of keyframe-clearing actions on ++alt+i++, again with eight configurable slots — plus opt-in *Still* and *Anim* mode sub-pies, each with its own slot set.

### :material-window-restore: Editor Scope

Shown while at least one keyframe pie is enabled: per-editor checkboxes pick which editors get the keyframe pies (3D Viewport, Properties, Graph Editor, Dope Sheet, NLA, Shader, Image, Movie Clip, Sequencer, Outliner). Editors left off keep the native ++i++ behaviour.

### :material-plus-box: Add Context

What ++ctrl+n++ creates in the Takes tree — **Add ViewLayer** and **Add Scene** each choose a default (create a new one, copy settings, blank) or *Ask (show menu)* to pick every time (both default to *Ask*).

### :material-code-braces: Tokens

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| **Separator** | string (≤3 chars) | `_` | The character(s) emitted by the `{sep}` token everywhere — [naming templates](#syntax) and [Smart Output](../features/smart_output.md#separators) alike. A `{sep}` button beside the field copies the token for pasting into templates. |

## :material-monitor-multiple: Sync

Cross-scene **Viewport Sync** — mirrors viewport tool settings across scenes, so switching takes doesn't silently change your active tool setup. A master toggle (**{{ pref('viewport_sync_enabled').label }}**, off by default) gates individual sub-toggles: *Transform Orientation + Pivot*, *Snap Settings*, *Proportional Edit*, *Mirror Axes*, *Auto-Merge*, *Lock Object Mode*, and *UV Options*. The full feature is documented on the [Viewport Sync](../features/viewport_sync.md) page.
