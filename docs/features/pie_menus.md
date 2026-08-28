---
icon: material/dots-circle
---

# Pie Menus

A pie menu opens under your cursor. You flick in a direction instead of hunting for a button.

Takes gives you five, each with eight slots you fill yourself.

Only the **Navigation Pie** is on out of the box. Switch the others on in *Preferences ▸ Workflow ▸ Pie & Misc*.

??? info "What all five pies share"
    - Eight compass directions per pie: N, NE, E, SE, S, SW, W, NW.
    - Assigning an action that already lives in another slot blanks that other slot. Every direction stays unique.
    - All five are configured in the same place: *Workflow > Pie & Misc*.

## :material-compass: Navigation Pie

Switch between the addon's side-panel views without taking your hand off the mouse.

Press ++ctrl+shift+c++ in the 3D Viewport. This pie is on by default.

??? info "Default layout"
    Each cell shows the direction and the action assigned to it. The cursor icon
    in the centre is where the pie opens.

    |   |   |   |
    |:-:|:-:|:-:|
    | **NW**<br>Variants     | **N**<br>Rules        | **NE**<br>Tags      |
    | **W**<br>Tree View     | :material-cursor-default-click:{ .lg .middle } | **E**<br>Watchlist  |
    | **SW**<br>Batch Render | **S**<br>Slotted Mode | **SE**<br>Channels  |

### :material-format-list-bulleted: Navigation Pie — Slot Actions

Every slot can hold any one of nine actions.

??? info "The nine actions"
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

Pick **what** to render — this layer, this scene, every scene, only the failed ones — and the pie starts that batch.

It takes over ++f12++, so it ships off. Switch on **F12 Render Pie Menu** in *Workflow > Pie & Misc*.

The same scopes also sit in the render menu behind the queue sidebar's render button — see [Batch Render](batch_render.md#the-render-menu).

??? info "Default layout"
    Every slot is reassignable.

    |   |   |   |
    |:-:|:-:|:-:|
    | **NW**<br>All Layers · This Scene | **N**<br>Resume — Skip Done           | **NE**<br>Retry Failed            |
    | **W**<br>Active Layer Only      | :material-cursor-default-click:{ .lg .middle } | **E**<br>Selected Layers · This Scene |
    | **SW**<br>All Layers · All Scenes | **S**<br>Selected Layers · All Scenes | **SE**<br>Render Jobs     |

### :material-format-list-bulleted: F12 Pie — Slot Actions

Ten actions, grouped in the dropdowns as **Selected Layers**, **All Layers** and **Other**.

??? info "What each action renders"
    **Selected Layers** means View Layers whose render icon is on. **All Layers**
    ignores the render icon. Inside the pie each scope action carries its group in
    the label, for example *Selected Layers · This Scene*.

    | Action | What it renders |
    |--------|-----------------|
    | **Selected Layers · This Scene** | Every render-icon-enabled View Layer in the current scene only. |
    | **Selected Layers · All Scenes** | Every render-icon-enabled View Layer across every scene. |
    | **All Layers · This Scene** | Every View Layer in the current scene, regardless of render-icon state. |
    | **All Layers · All Scenes** | Every View Layer in every scene, regardless of render-icon state. |
    | **Active Layer Only** | Just the active View Layer. |
    | **Resume — Skip Done** | Resume a batch — skips View Layers already marked done. |
    | **Retry Failed** | Re-render only the View Layers whose previous attempt failed or cancelled. |
    | **Native F12** | Fall back to Blender's built-in render. |
    | **Open Render Settings** | Switch the active Properties editor to the Output context. |
    | **Render Jobs** | Open the Render Jobs overview popover. |
    | **None** | Empty slot. |

    In Background mode both the pie and the render menu dispatch through
    **Background Batch Render**, the fast background renderer.
    The menu's *Other* category also offers
    **Calibrate Render Times** to seed the queue's time estimates.

??? tip "Search Scenes — find one scene in a crowded file"
    The per-scene scope submenus list every scene as its own row, which gets
    unwieldy fast. So each submenu opens with a **Search Scenes** entry (shown as
    *Search scenes…*) at the top.

    Pick it to get Blender's type-to-filter popup. Find the scene by name and it
    renders immediately — no scrolling.

    It respects the popover's current **Foreground / Background** choice. It also
    mirrors the submenu it came from: the plain variant renders that scene's
    render-toggle-enabled View Layers, the *force* variant renders every View Layer
    in the scene.

## :material-toggle-switch: Mode Pie {: #mode-pie }

++shift+alt+q++ brings the Navigation Panel's mode toggles to your cursor: Rest State, Still Mode, Value Lock, Autokey, Timeline Sync and Variant Live.

It ships off. Switch on **Enable Mode Pie** in *Workflow > Pie & Misc* to reveal its eight dropdowns.

??? info "Slot actions and the default layout"
    | Action | What it toggles |
    |--------|-----------------|
    | **None** | Empty slot. |
    | **Rest State** | [Rest State](rest_state.md) mode. |
    | **Still Mode** | Pin every take to its still frame. |
    | **Animation** | Make every take animate. |
    | **Off (per-take)** | Let each take's own [Still](still_mode.md) setting decide. |
    | **Value Lock** | The [Value Lock](value_lock.md). |
    | **Autokey** | Automatic keyframe insertion across all scenes. |
    | **Timeline Sync** | Playhead sync across scenes. |
    | **Variant Live** | [Live apply](variant_switch.md) for the edited variant state. |

    Still's three states each get their own slice instead of one cycling button.
    In a pie every destination should be a direction, not a number of presses.

    **Defaults:** North *Timeline Sync*, North-East *Value Lock*, East *Variant
    Live*, South-East *Animation*, South *Still Mode*, South-West *Off (per-take)*,
    West *Autokey*, North-West *Rest State*.

??? note "Why ++shift+alt+q++"
    Not a `Ctrl+Alt` chord: on German layouts `AltGr` sends Ctrl+Alt, so such a
    binding fires while you type. Plain `Alt+Q` is Blender's own Quick Favourites.
    ++shift+alt+q++ is free in the factory keymap.

## :material-key: Keyframe & Clear Pies

These two replace ++i++ and ++alt+i++ in the editors you choose. They put the [Rest State](rest_state.md) actions on the keying gesture you already use.

Both ship off. Switch on **Enable Keyframe Pie** and **Enable Clear Pie (Alt+I)** in *Workflow > Pie & Misc*.

### :material-format-list-bulleted: Keyframe Pie (I) — Slot Actions

Default layout: **N** Set as Rest Default, **E** Insert Keyframe (Native), **S** Snap Active to Rest, **W** Snap All to Rest. The four corner slots ship empty.

??? info "Every action you can assign"
    | Action | What it does |
    |--------|--------------|
    | **Set as Rest Default** | Insert the current value into the Rest State action at frame 0. |
    | **Snap Active to Rest** | Snap the active property back to its rest value — no keyframe inserted. |
    | **Snap All to Rest** | Snap every drifted property in the scene to its rest value. |
    | **Insert Keyframe (Native)** | Blender's native keyframe insert for the current editor. |
    | **Open Still** / **Open Animation** | Open the matching sub-pie (offered only while that sub-pie is enabled). |
    | **None** | Empty slot. |

### :material-format-list-bulleted: Clear Pie (Alt+I) — Slot Actions

Default layout: **N** Clear Current Keyframe, **E** Unset Rest Key (Channel), **S** Unset Entire Rest Slot, **W** Clear All Keyframes (Object), **NW** Clear All Rest Keys (VL).

??? info "Every action you can assign"
    | Action | What it does |
    |--------|--------------|
    | **Clear Current Keyframe** | Remove the keyframe under the cursor. |
    | **Unset Rest Key (Channel)** | Remove the active property's channel from the Rest State action. |
    | **Unset Entire Rest Slot** | Remove the active object's slot from the Rest State action. |
    | **Clear All Keyframes (Object)** | Clear all keyframes on the active object. |
    | **Clear All Rest Keys (VL)** | Clear all rest keys for objects in the current View Layer. |
    | **Open Still** / **Open Animation** | Open the matching Clear sub-pie (offered only while that sub-pie is enabled). |
    | **None** | Empty slot. |

??? info "Slots that adapt to what you hover"
    A slot never fires an action that would silently do the wrong thing.

    **Hover-dependent actions** — Set as Rest Default, Snap Active to Rest, the
    native insert and clear, Unset Rest Key — need a keyframable value under the
    cursor. Outside the 3D Viewport they vanish from the pie when nothing is
    hovered. The slot renders as a gap rather than shifting its neighbours, so the
    remaining directions keep their positions.

    **Snap Active to Rest** greys out when a Rest State action exists but the
    active object has no slot in it. There is nothing to snap back to.

??? info "Still and Animation sub-pies"
    Each main pie can grow two optional sub-pies: **Still** for rest-state actions
    and **Animation** for keyframe actions.

    Tick the *Still* or *Animation* checkbox inside the pie's configurator section.
    That reveals the sub-pie's own eight-slot grid, and adds an *Open Still* /
    *Open Animation* entry to the main pie's slot actions so you can flick into the
    sub-pie mid-gesture.

    Sub-pie slots offer scope variants of the core actions — active object,
    selected objects, or all. For example *Rest Default · Sel*, *Clear · All*,
    *Delete Slot · Sel*.

??? info "Which editors the pies take over"
    Once either pie is enabled, an **Editor Scope** section appears in
    *Workflow > Pie & Misc*. Both pies share the same list. Editors left off keep
    their native ++i++ / ++alt+i++ behaviour.

    On by default: 3D Viewport, Shader Editor, Image Editor, Movie Clip Editor,
    Video Sequencer, Outliner. Off by default: Properties, Graph Editor, Dope Sheet,
    NLA Editor.

    In hover-driven editors like the Shader Editor the pie only opens when the
    cursor sits over a keyframable node value.

## :material-pencil: Reassigning Slots

Open *Edit > Preferences > Add-ons > Takes for Blender > Workflow > Pie & Misc*. Each pie gets its own section with eight dropdowns in a compass grid.

Pick a new action for any direction. **Reset to default** at the foot of each grid restores that pie's stock layout.

## :material-keyboard-settings: Changing the Keybinding

Click the chord in the centre of a pie's grid, then press the combination you want. The reset arrow beside it restores the built-in default.

**Workflow > Hotkeys > Pie Shortcuts** lists every enabled pie's binding in one place, where you can also disable it.

??? warning "What survives an addon update"
    Keyframe and Clear pie rebinds are stored in the addon preferences and survive
    restarts and updates. Navigation and F12 rebinds currently live only in the
    keymap, so an addon reload or update can reset them.

    Disabling the F12 pie's master toggle unregisters its keymap entry completely,
    so native F12 takes over again.

??? info "Advanced: Blender's own keymap editor"
    The pies are also normal entries in Blender's keymap editor
    (*Edit > Preferences > Keymap*): search for `wm.call_menu_pie` and look for the
    menu names `TKS_MT_PIE_Navigation` (navigation) or `TKS_MT_PIE_RenderScope`
    (F12 render). The Keyframe and Clear pies bind through the wrapper operator
    `tks.invoke_keyframe_pie` instead — the plain-++i++ and ++alt+i++ entries
    belong to the Keyframe and Clear pie respectively.
