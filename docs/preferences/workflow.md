---
icon: material/cog-play
---

# Workflow Tab

Seven sub-tabs: **Render**, **Automations**, **Syntax**, **Token**, **Hotkeys**, **Pie & Misc**, and **Sync**.

??? tip "Searching the preferences"
    A search field sits above the Preferences tabs and filters all of them.
    Settings that don't match your query dim in place while matches stay
    highlighted. Tabs and sub-tabs with no match gray out.

## :material-image-multiple: Render

How renders name their files, and what you hear when they finish.

| Setting | Default | What it does |
|---------|---------|--------------|
| **{{ pref('smart_output_apply_to_f12').label }}** | Off | Let ++f12++ resolve Smart Output tokens. |
| **Enable Render Sounds** | On | Play a sound when a render finishes. |

??? info "Every Render setting"
    Four collapsible sections hold them: **Render Output**, **Render Jobs
    Popover**, **Completion Sounds**, and **Play Sound For**.

    | Setting | Type | Default | Description |
    |---------|------|---------|-------------|
    | **{{ pref('smart_output_apply_to_f12').label }}** | bool | Off | When off, ++f12++ keeps Blender's native render behaviour: literal filepath, no token resolution. When on, ++f12++ / ++ctrl+f12++ resolve Smart Output tokens and obey the Standard / Compositor output toggles. Batch renders use Smart Output either way. |
    | **{{ pref('smart_output_bracket_style').label }}** | enum | `[token]` | Bracket style for [Smart Output](../features/smart_output.md#bracket-styles) tokens — seven styles, from `[scene]` to `#scene#`. |
    | **{{ pref('use_render_versioning').label }}** | bool | On | Count up a render version each time you render. |
    | **{{ pref('smart_output_render_version_scope').label }}** | enum | Per Scene | Where the `{rev}` render-version counter is stored: one shared by the whole scene, or one per view layer. |
    | **{{ pref('smart_output_render_version_padding').label }}** | int | 3 | How many digits a bare version gets — `v001`, `v01` or `v1`. |
    | **{{ pref('render_jobs_popup_position').label }}** | enum | At Cursor | Where the Render Jobs popover opens: at your mouse, top middle, or centre. |
    | **{{ pref('render_jobs_popup_width').label }}** | int | — | How wide that popover opens. You can also drag its corner grip. |
    | **Enable Render Sounds** | bool | On | Plays a notification sound when a render completes. |
    | **Sound Folder** | path | *(empty)* | Your own folder of sound files. Empty falls back to the bundled ones. |
    | **Success Sound** | enum | *(scanned)* | File played on a successful render. |
    | **Failed Sound** | enum | *(scanned)* | File played on a failed or cancelled render. |

    **Play Sound For** picks which render flows ring. The master switch gates them
    all. Single-image renders (Ctrl+click, active View Layer, native F12) and batch
    renders (foreground, background, preview thumbnails) each have their own toggle.

## :material-auto-fix: Automations

The chores Takes does for you. Turn off anything you would rather do by hand.

??? info "Autokey, Rest State and Actions"
    | Setting | Type | Default | Description |
    |---------|------|---------|-------------|
    | **Manage 'Only Insert Available'** | bool | On | Lets the [Autokey toggle](../interface/navigation_panel.md#autokey-is-being-blocked) manage Blender's *Only Insert Available* preference. Blender 5.2 turns that preference on by default, which makes autokey silently skip channels that were never keyed — and every fresh take starts that way. While managed, enabling Autokey turns the preference off, and disabling Autokey restores it. Takes asks for your consent once; editing the preference by hand withdraws it. |
    | **Auto-create Rest Action** | bool | On | Creates the *Rest State* action when a new scene is created. |
    | **Auto-mirror Keyframes to Rest** | bool | On | Mirrors unkeyed values into the Rest Action on keyframe insert. |
    | **Auto-snap on Keyframe Clear** | bool | On | Snaps unkeyed properties back to their [Rest State](../features/rest_state.md) values when their keyframes are deleted. The snap fires once, on the witnessed deletion. When off, nothing snaps by itself — use the manual *Snap to Rest* tools. |
    | **Auto-assign View Layer Actions** | bool | On | Creates and assigns View Layer actions when a View Layer is added. |
    | **Auto-rename Actions on Hierarchy Change** | bool | Off | Rebuilds action names from the naming templates when scenes or View Layers are renamed. |
    | **Auto-rename Slots on Target Rename** | bool | On | Keeps slot names in sync with their target object or data. |
    | **Auto Fake User on Actions** | bool | On | Protects actions from auto-purge. |
    | **{{ pref('auto_duplicate_action_mode').label }}** | enum | Strip Animation | What a duplicated object's animation does. **Strip Animation**: the copy arrives with no action, like a fresh object. **Independent Slot**: the copy keeps the action but gets its own slot with its own copy of the keyframes. **Off (Blender Default)**: no interference. |

??? info "Cameras, World, Previews and Presets"
    | Setting | Type | Default | Description |
    |---------|------|---------|-------------|
    | **{{ pref('camera_unassigned_mode').label }}** (Cameras) | enum | Adopt into Scene (Native) | What happens when you pick a camera in the Properties editor or the viewport instead of through the cascade. Adopt it onto your adopt tier, preserve it untracked, or let the addon own the slot outright. |
    | **{{ pref('camera_adopt_tier').label }}** (Cameras) | enum | Scene | Which tier an adopted camera lands on. Also the tier the [Camera needed](../features/cascade.md#needed-rows) chips write to. |
    | **Camera Visibility Automation** (Cameras) | bool | Off | Keeps one camera on screen: this take's. Mirrored at the foot of the Takes Tree row menu. See [Show One Camera at a Time](../workflows/show_one_camera.md). |
    | **Apply When** (Cameras) | enum | On Still Mode | When the automation runs on its own. **On Still Mode** only on a take in Still Mode, **On Every Switch** on all of them, **On Request** never by itself. |
    | **Show Assigned Camera** (Cameras) | bool | On | Reveals the camera this take uses. |
    | **Affect Containing Collection** (Cameras) | bool | On | Also reveals the collection that camera sits in, so a hidden collection cannot keep it off screen. |
    | **Hide Other Cameras** (Cameras) | bool | On | Puts every other camera in the scene away. Hidden cameras stay hidden until you say otherwise. |
    | **{{ pref('world_unassigned_mode').label }}** (World) | enum | Adopt into Scene (Native) | What happens when you assign a World in Blender's own Properties editor. **Adopt into Scene (Native)** records it on your adopt tier, so the tree knows about it and take switches keep it — Blender behaves like Blender. **Preserve** leaves it alone without recording it, and the [drift reminder](../features/cascade.md#cascade-preset-drift) stays visible. **Auto-clear (Strict)** gives the addon full ownership: with no World assigned anywhere in the tree, the scene's World is cleared. |
    | **{{ pref('world_adopt_tier').label }}** (World) | enum | Scene | Which tier an adopted World lands on — Global, Scene Group, Scene, View Layer Group, View Layer or Take. Scene matches native Blender. Also the tier the [World needed](../features/cascade.md#needed-rows) resolve chips write to. |
    | **{{ pref('preload_viewlayers_mode').label }}** | enum | Off | Pre-builds view-layer dependency graphs quietly in the background, so your first switch to each take is instant. **Off**, **Automatic** (starts shortly after a file opens), or **Manual (button)** (adds a *Preload View Layers* button to the Takes tree sidebar). |
    | **{{ pref('preload_auto_open_panel').label }}** | bool | Off | With Automatic preload, opens the View-Layer Preload panel so you can watch progress. It closes itself when every layer is done. |
    | **Auto-rename Thumbnails on Name Change** | bool | On | Renames preview images alongside their source. |
    | **Preset Changes** | enum | MANUAL | What happens when render, output or camera presets are edited live: **MANUAL** (warn), **DROP_REAPPLY** (discard), **ALWAYS_SYNC** (write back to the preset). |

## :material-form-textbox: Syntax

Name templates for everything the addon creates — actions, slots, takes, variants, presets.

They use [Smart Output tokens](../features/smart_output.md). Every field has a **Build Syntax** button that opens the token builder.

??? info "Editing a template is safe"
    Templates are always editable. Links are identity-based, so changing a
    template cannot break existing slot links. The separator character itself
    lives under [Pie & Misc > Tokens](#tokens).

### :material-play-box-multiple: Action Templates

Names for the action on each cascade tier.

Takes uses these when it creates an action for you, so shot names stay consistent without you typing them.

??? info "Defaults"
    | Slot | Default Template |
    |------|------------------|
    | Scene | `{scenegroup}{sep}{scene}` |
    | View Layer | `{scenegroup}{sep}{scene}{sep}{vlgroup}{sep}{viewlayer}` |
    | Take | `{scenegroup}{sep}{scene}{sep}{vlgroup}{sep}{viewlayer}{sep}{take}` |
    | Scene Group | `{scenegroup}` |
    | View Layer Group | `{scenegroup}{sep}{scene}{sep}{vlgroup}` |

### :material-camera: Camera & Compositor Templates

Names for cameras and compositor node trees created per tier.

??? info "Defaults"
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

Names for action slots, one per kind of data.

??? info "Defaults"
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

Names for takes, variants and saved presets.

??? info "Defaults"
    | Slot | Default Template |
    |------|------------------|
    | Take Name | `Take_{index:03d}` |
    | Variant Group | `{collection}_Variants` |
    | Variant Name | `{material}` |
    | Render / Output / File Output Preset | `{scene}{sep}Render` / `Output` / `FileOutput` |
    | View Layer / Color Management Preset | `{scene}{sep}ViewLayer` / `Color` |
    | Camera / World / Material Preset | `{camera}` / `{world}` / `{material}` |

## :material-code-braces: Token

The token registry. Your [Custom Tokens](../features/custom_tokens.md) live here.

| Area | Holds |
|------|-------|
| **Preset row** | Saved sets of your tokens. |
| **Custom Tokens** | Your own tokens, in categories. |
| **Built-in Tokens (reference)** | Every shipped token, read-only. |

??? info "Working in the registry"
    Presets store your custom tokens across the Project, Local, Shared and Add-on
    storage tiers.

    In **Custom Tokens** you add via **Add › Category / Token**, edit with the
    pencil, rename a whole category by clicking its title, star ★ favourites,
    hide 👁 tokens from the grids, and delete with a confirmation. Each row shows
    what the token resolves to right now.

    **Built-in Tokens (reference)** lists every shipped token by category, with
    its live value. It is the same registry documented on the
    [Smart Output](../features/smart_output.md) page. ★ and 👁 work there too.

    Sources, path rules, format specs, a tutorial and a 50-token example library
    are all on the [Custom Tokens](../features/custom_tokens.md) page.

## :material-keyboard: Hotkeys

A read-only summary of the addon's keymaps. The full list is on [Keyboard Shortcuts](../interface/hotkeys.md).

To change a binding, open *Edit > Preferences > Keymap* and search for the operator id (`tks.global_*` or `wm.call_menu_pie`).

## :material-dots-circle: Pie & Misc

Five pie menus, plus the Editor Scope, Add Context and Tokens settings.

??? info "How every pie works"
    Each pie uses a compass grid (NW / N / NE / W / E / SW / S / SE) and has its
    own **Reset** button, so you can restore one pie's defaults on its own.

    The eight slots auto-deduplicate. Assign an action that already sits in
    another slot and the old slot goes blank.

### :material-compass: Navigation Pie

Jump between Takes panels from ++ctrl+shift+c++.

Master toggle **Enable Navigation Pie**, on by default.

??? info "Slot choices"
    Eight dropdowns, each accepting *None*, *Tree View*, *Watchlist*, *Slotted
    Mode*, *Rules*, *Variants*, *Tags*, *Batch Render* or *Channels*. Defaults
    are on the [Pie Menus](../features/pie_menus.md#navigation-pie) page.

### :material-image-multiple: F12 Render Pie

Pick a render scope instead of rendering straight away.

Master toggle **{{ pref('f12_pie_menu_enabled').label }}**, off by default.

??? info "What the toggle and slots do"
    Turning it on registers a ++f12++ keymap entry that replaces Blender's native
    render shortcut. Turning it off unregisters that entry, so native F12 fires
    again.

    Eight dropdowns take any of the 10 render-scope actions, grouped under
    **Selected Layers** / **All Layers** / **Other**: *This Scene* and *All
    Scenes* (per group), *Active Layer Only*, *Resume — Skip Done*, *Retry
    Failed*, *Native F12*, *Open Render Settings*, *Render Jobs*, and *None*. Each action is
    described on the [Pie Menus](../features/pie_menus.md#f12-render-pie) page.

### :material-toggle-switch: Mode Pie

Puts the mode switches — Still, Animation, Rest — on ++shift+alt+q++. Eight slots.

Master toggle **{{ pref('mode_pie_enabled').label }}**, off by default. Layout on the [Pie Menus](../features/pie_menus.md#mode-pie) page.

### :material-key-plus: Keyframe Pie

Replaces Blender's native ++i++ menu with a pie of keyframing actions. Eight slots.

Master toggle **{{ pref('keyframe_pie_enabled').label }}**, off by default.

### :material-key-minus: Clear Pie

Puts a pie of keyframe-clearing actions on ++alt+i++. Eight slots.

Master toggle **{{ pref('keyframe_alt_pie_enabled').label }}**, off by default.

??? info "Still and Anim sub-pies"
    The Clear Pie can also show opt-in *Still* and *Anim* mode sub-pies. Each one
    has its own set of slots.

### :material-window-restore: Editor Scope

Picks which editors get the keyframe pies.

Turn an editor off to leave its own shortcuts alone. This section only shows while a keyframe pie is enabled.

??? info "The editor list"
    This section only appears while at least one keyframe pie is enabled.

    A checkbox each for 3D Viewport, Properties, Graph Editor, Dope Sheet, NLA,
    Shader, Image, Movie Clip, Sequencer and Outliner. Editors left off keep the
    native ++i++ behaviour.

### :material-plus-box: Add Context

What ++ctrl+n++ creates in the Takes tree.

??? info "The two choices"
    **Add View Layer** and **Add Scene** each pick a default: create a new one,
    copy settings, or blank. Or leave them on *Ask (show menu)* to choose every
    time. Both default to *Ask*.

### :material-code-braces: Tokens

| Setting | Default | What it does |
|---------|---------|--------------|
| **Separator** | `_` | The character or characters that join name parts. Up to three. |

??? info "Where the separator applies"
    It is used everywhere: [naming templates](#syntax) and
    [Smart Output](../features/smart_output.md#separators) alike. A button beside
    the field copies the token so you can paste it into a template.

## :material-monitor-multiple: Sync

**Viewport Sync** mirrors viewport tool settings across scenes, so switching takes doesn't change your tool setup.

Master toggle **{{ pref('viewport_sync_enabled').label }}**, off by default.

??? info "What can be synced"
    The master toggle gates individual sub-toggles: *Transform Orientation +
    Pivot*, *Snap Settings*, *Proportional Edit*, *Mirror Axes*, *Auto-Merge*,
    *Lock Object Mode*, and *UV Options*.

    The full feature is on the [Viewport Sync](../features/viewport_sync.md) page.
