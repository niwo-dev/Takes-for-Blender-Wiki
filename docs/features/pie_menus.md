---
icon: material/dots-circle
---

# Pie Menus

The addon registers two configurable pie menus — the **Navigation Pie** for switching between side-panel views, and the **F12 Render Pie** (opt-in) for picking a render scope. Both share the same 8-direction layout, the same de-duplication behaviour (assigning an action that already lives in another slot blanks the previous slot), and the same in-Preferences configurator UI.

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

Replaces Blender's native ++f12++ binding with a render-scope picker — pick **what** you want to render (active VL, all VLs in this scene, every scene, only failed, etc.) and the pie dispatches to the right batch operator.

**Default binding:** ++f12++ in any window. The pie is **off by default** to avoid surprising existing muscle memory — flip the *Enable F12 Render Pie* toggle in *Workflow > Pie* to activate it.

*Default slot layout (each slot is reassignable). The label in the centre is where the pie opens.*

|   |   |   |
|:-:|:-:|:-:|
| **NW**<br>All VLs (Scene, Force) | **N**<br>Skip Completed           | **NE**<br>Failed Only            |
| **W**<br>Current View Layer      | :material-cursor-default-click:{ .lg .middle } | **E**<br>Active VLs (Scene)      |
| **SW**<br>All VLs (All Scenes, Force) | **S**<br>Active VLs (All Scenes) | **SE**<br>Preview Thumbnails     |

### :material-format-list-bulleted: F12 Pie — Slot Actions

| Action | What it renders |
|--------|-----------------|
| **Current View Layer** | Just the active View Layer (`tks.render_active_vl`). |
| **Active VLs (Scene)** | Every render-toggle-enabled VL in the current scene only. |
| **Active VLs (All Scenes)** | Every render-toggle-enabled VL across every scene. |
| **All VLs (Scene, Force)** | Every VL in the current scene, regardless of render-toggle state. |
| **All VLs (All Scenes, Force)** | Every VL in every scene, regardless of render-toggle state. |
| **Skip Completed** | Active VLs across all scenes, but skip ones that already have a finished render. |
| **Failed Only** | Re-render only the VLs whose previous batch attempt failed or cancelled. |
| **Preview Thumbnails** | Render the queue at preview resolution to refresh the View Layer thumbnails. |
| **Native F12** | Fall back to Blender's built-in `render.render`. |
| **Open Render Settings** | Switch the active Properties editor to the Output context. |
| **None** | Empty slot. |

The same scope actions are also available as **Foreground** and **Background** dropdown menus next to the queue's main render buttons — see [Batch Render](batch_render.md#render-scope-dropdowns).

### :material-magnify: Search Scenes

The per-scene scope submenus list every scene as its own row, which gets unwieldy in a heavily populated file. Each submenu therefore opens with a **Search Scenes** entry (`tks.render_scene_search`, shown as *Search scenes…*) at the top. Picking it opens Blender's type-to-filter search popup so you can find a scene by name and render it immediately — no scrolling the full list.

- It respects the popover's current **Foreground / Background** choice, so the chosen scene renders in whichever mode is active.
- It mirrors the submenu it was opened from: the plain variant renders that scene's render-toggle-enabled View Layers, while the *force* variant renders every View Layer in the scene regardless of toggle state.

## :material-pencil: Reassigning Slots

*Edit > Preferences > Add-ons > Takes for Blender > Workflow > Pie* — eight enum dropdowns per pie, laid out in a compass grid. Picking an action that already lives in another slot auto-blanks that slot so each direction stays unique. **Reset All Slots** restores the defaults for that pie.

## :material-keyboard-settings: Changing the Keybinding

Both pies are normal Blender keymap entries.

1. *Edit > Preferences > Keymap*.
2. Search for `wm.call_menu_pie`.
3. Find the entry whose menu name is `TKS_MT_PIE_Navigation` (navigation) or `TKS_MT_PIE_RenderScope` (F12 render).
4. Edit the key, modifiers, or disable the binding.

For the F12 pie, disabling the master toggle in *Workflow > Pie* unregisters the keymap entirely, so native F12 takes over again.
