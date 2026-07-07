---
icon: material/dots-circle
---

# Pie Menus

The addon registers four configurable pie menus — the **Navigation Pie** for switching between side-panel views, the **F12 Render Pie** (opt-in) for picking a render scope, and the opt-in **Keyframe** (++i++) and **Clear** (++alt+i++) pies for Takes-aware keyframing, each of which can grow its own Still / Animation sub-pies. All of them share the same 8-direction layout, the same de-duplication behaviour (assigning an action that already lives in another slot blanks the previous slot), and the same in-Preferences configurator UI under *Workflow > Pie & Misc*.

## :material-compass: Navigation Pie

Fast switching between the addon's side-panel views without taking your hand off the mouse.

**Default binding:** ++ctrl+shift+c++ in the 3D Viewport. The pie is enabled by default.

*Each cell shows the slot's compass direction and the action assigned to it. The cursor icon in the centre is where the pie opens — you flick toward the direction you want.*

|   |   |   |
|:-:|:-:|:-:|
| **NW**<br>Variants     | **N**<br>Rules        | **NE**<br>Tags      |
| **W**<br>Tree View     | :material-cursor-default-click:{ .lg .middle } | **E**<br>Watchlist  |
| **SW**<br>Batch Render | **S**<br>Slotted Mode | **SE**<br>Channels  |

### :material-format-list-bulleted: Navigation Pie — Slot Actions

| Action | What it toggles |
|--------|-----------------|
| **Tree View** | Context panel (Takes Tree). |
| **Watchlist** | Inspector watchlist. |
| **Slotted Mode** | Slotted-mode panel. |
| **Rules** | Globals → Rules mode. |
| **Variants** | Globals → Variants (Variant Switch). |
| **Tags** | Globals → Tags mode. |
| **Batch Render** | Batch Render panel. |
| **Channels** | Inspector → Channels view. |
| **None** | Empty slot. |

## :material-image-multiple: F12 Render Pie

Replaces Blender's native ++f12++ binding with a render-scope picker — pick **what** you want to render (active layer, this scene, every scene, only failed, etc.) and the pie dispatches to the right batch operator.

**Default binding:** ++f12++ in any window. The pie is **off by default** to avoid surprising existing muscle memory — flip the *F12 Render Pie Menu* toggle in *Workflow > Pie & Misc* to activate it.

*Default slot layout (each slot is reassignable). The label in the centre is where the pie opens. The SE slot ships empty, ready for the action you reach for most.*

|   |   |   |
|:-:|:-:|:-:|
| **NW**<br>All Takes · This Scene | **N**<br>Resume — Skip Done           | **NE**<br>Retry Failed            |
| **W**<br>Active Layer Only      | :material-cursor-default-click:{ .lg .middle } | **E**<br>Selected Takes · This Scene |
| **SW**<br>All Takes · All Scenes | **S**<br>Selected Takes · All Scenes | **SE**<br>*(empty)*     |

### :material-format-list-bulleted: F12 Pie — Slot Actions

In the slot dropdowns these actions are grouped under three headings — **Selected Takes** (View Layers whose render icon is on), **All Takes** (every View Layer, render icon ignored), and **Other**. Inside the pie itself the scope actions carry their group in the label (e.g. *Selected Takes · This Scene*).

| Action | What it renders |
|--------|-----------------|
| **Selected Takes · This Scene** | Every render-icon-enabled View Layer in the current scene only. |
| **Selected Takes · All Scenes** | Every render-icon-enabled View Layer across every scene. |
| **All Takes · This Scene** | Every View Layer in the current scene, regardless of render-icon state. |
| **All Takes · All Scenes** | Every View Layer in every scene, regardless of render-icon state. |
| **Active Layer Only** | Just the active View Layer (`tks.render_active_vl`). |
| **Resume — Skip Done** | Resume a batch — skips View Layers already marked done. |
| **Retry Failed** | Re-render only the View Layers whose previous batch attempt failed or cancelled. |
| **Native F12** | Fall back to Blender's built-in `render.render`. |
| **Open Render Settings** | Switch the active Properties editor to the Output context. |
| **None** | Empty slot. |

The same scope actions are also available from the render menu behind the queue sidebar's render button — see [Batch Render](batch_render.md#the-render-menu).

### :material-magnify: Search Scenes

The per-scene scope submenus list every scene as its own row, which gets unwieldy in a heavily populated file. Each submenu therefore opens with a **Search Scenes** entry (`tks.render_scene_search`, shown as *Search scenes…*) at the top. Picking it opens Blender's type-to-filter search popup so you can find a scene by name and render it immediately — no scrolling the full list.

- It respects the popover's current **Foreground / Background** choice, so the chosen scene renders in whichever mode is active.
- It mirrors the submenu it was opened from: the plain variant renders that scene's render-toggle-enabled View Layers, while the *force* variant renders every View Layer in the scene regardless of toggle state.

## :material-key: Keyframe & Clear Pies

Two opt-in pies that replace Blender's ++i++ (insert keyframe) and ++alt+i++ (clear keyframe) shortcuts in the editors you choose. Where the native shortcuts only know about ordinary keyframes, these pies put the addon's [Rest State](rest_state.md) actions on the same muscle-memory gesture — set a rest default, snap back to rest, or clear rest keys without hunting through menus. Both pies are **off by default**: enable them in *Workflow > Pie & Misc* (*Enable Keyframe Pie* / *Enable Clear Pie (Alt+I)*).

### :material-format-list-bulleted: Keyframe Pie (I) — Slot Actions

Default layout: **N** Set as Rest Default, **S** Snap Active to Rest, **W** Snap All to Rest — the remaining slots ship empty.

| Action | What it does |
|--------|--------------|
| **Set as Rest Default** | Insert the current value into the Rest State action at frame 0. |
| **Snap Active to Rest** | Snap the active property back to its rest value — no keyframe inserted. |
| **Snap All to Rest** | Snap every drifted property in the scene to its rest value. |
| **Insert Keyframe (Native)** | Blender's native keyframe insert for the current editor. |
| **Open Still** / **Open Animation** | Open the matching sub-pie (only offered while that sub-pie is enabled). |
| **None** | Empty slot. |

### :material-format-list-bulleted: Clear Pie (Alt+I) — Slot Actions

Default layout: **N** Clear Current Keyframe, **E** Unset Rest Key (Channel), **S** Unset Entire Rest Slot, **W** Clear All Keyframes (Object), **NW** Clear All Rest Keys (VL).

| Action | What it does |
|--------|--------------|
| **Clear Current Keyframe** | Remove the keyframe under the cursor (`anim.keyframe_delete`). |
| **Unset Rest Key (Channel)** | Remove the active property's channel from the Rest State action. |
| **Unset Entire Rest Slot** | Remove the active object's slot from the Rest State action. |
| **Clear All Keyframes (Object)** | Clear all keyframes on the active object. |
| **Clear All Rest Keys (VL)** | Clear all rest keys for objects in the current View Layer. |
| **Open Still** / **Open Animation** | Open the matching Clear sub-pie (only offered while that sub-pie is enabled). |
| **None** | Empty slot. |

### :material-eye-check: Context-Aware Slots

The keyframe pies adapt to where you invoke them, so a slot never fires an action that would silently do the wrong thing:

- **Hover-dependent actions** (Set as Rest Default, Snap Active to Rest, the native insert/clear, Unset Rest Key) need a keyframable value under the cursor. Outside the 3D Viewport they vanish from the pie when nothing is hovered — the slot renders as a gap rather than shifting its neighbours, so the remaining directions keep their positions.
- **Snap Active to Rest** greys out when a Rest State action exists but the active object has no slot in it — there is nothing to snap back to.

### :material-layers-triple: Still & Animation Sub-Pies

Each main pie can grow two optional sub-pies — **Still** (rest-state actions) and **Animation** (keyframe actions). Tick the *Still* or *Animation* checkbox inside the pie's configurator section to enable one: that reveals the sub-pie's own 8-slot grid and surfaces an *Open Still* / *Open Animation* entry among the main pie's slot actions, so you can flick into the sub-pie mid-gesture. Sub-pie slots offer scope variants of the core actions — active object, selected objects, or all (e.g. *Rest Default · Sel*, *Clear · All*, *Delete Slot · Sel*).

### :material-monitor: Editor Scope

Once either keyframe pie is enabled, an **Editor Scope** section appears in *Workflow > Pie & Misc* listing the editors that get the pies. Both pies share the same list; editors left off keep their native ++i++ / ++alt+i++ behaviour. Defaults: 3D Viewport, Shader Editor, Image Editor, Movie Clip Editor, Video Sequencer and Outliner on; Properties, Graph Editor, Dope Sheet and NLA Editor off. In hover-driven editors like the Shader Editor the pie only opens when the cursor is over a keyframable node value.

## :material-pencil: Reassigning Slots

*Edit > Preferences > Add-ons > Takes for Blender > Workflow > Pie & Misc* — one collapsible section per pie, each with eight enum dropdowns laid out in a compass grid. Picking an action that already lives in another slot auto-blanks that slot so each direction stays unique. Every grid ends with a **Reset to default** button that restores that pie's stock layout.

## :material-keyboard-settings: Changing the Keybinding

All pie shortcuts are rebindable without leaving the addon preferences:

- **Workflow > Hotkeys > Pie Shortcuts** lists every enabled pie's keymap entry — edit the key, modifiers, or disable the binding right there.
- Each pie configurator grid in **Workflow > Pie & Misc** shows the current chord in its centre cell. Click it, press a new key combination, and the rebind is captured in one interaction; the reset arrow beside it restores the built-in default. Rebinds are stored in the addon preferences, so they survive restarts and addon updates.

As an advanced fallback, the pies are also normal entries in Blender's own keymap editor (*Edit > Preferences > Keymap*): search for `wm.call_menu_pie` and look for the menu names `TKS_MT_PIE_Navigation` (navigation) or `TKS_MT_PIE_RenderScope` (F12 render). The Keyframe and Clear pies bind through the wrapper operator `tks.invoke_keyframe_pie` instead — the plain-++i++ and ++alt+i++ entries belong to the Keyframe and Clear pie respectively.

For the F12 pie, disabling the master toggle in *Workflow > Pie & Misc* unregisters the keymap entirely, so native F12 takes over again.
