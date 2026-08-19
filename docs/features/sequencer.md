---
icon: material/movie-open-play
---

# Video Sequencer

*The take of the scene strip under the playhead, applied as you scrub — so an edit shows what it will actually render.*

## :material-lightbulb-outline: Concept

A scene strip in the Video Sequencer points at a scene, and that scene has [takes](takes.md) — different cameras, actions, materials and presets, only one of which is live at a time. Blender renders the strip with whichever take happens to be active, which is not necessarily the one the edit is meant to show.

Takes closes that gap: while a sequencer timeline is open, the take state of the strip under the playhead is **applied as you scrub or play**. The preview is the edit.

!!! info "A window shows one scene at a time"
    This is the constraint the whole feature is shaped around. Applying a strip's take means putting the window on that strip's scene, which is why the follow comes with the scene-switching described below rather than as a silent background effect.

## :material-view-dashboard-outline: The Sequencer Sidebar

A **Takes** tab appears in the sequencer's sidebar (++n++). It names the take the strip under the playhead stands for, and — when they differ — the one currently on screen:

| Row | Meaning |
|-----|---------|
| **Renders** | The take the strip under the playhead represents: what this frame will render as. |
| **Showing** | The take actually applied right now. It appears only when it differs from **Renders**, which is the case the panel exists to make visible. |
| **Came from** | Returns you to the scene and view layer a sequencer took the window from — see [Going back](#going-back). |

The panel also explains itself when there is nothing to follow: *"Playhead following is off"*, *"No scene strip under the playhead"*, or *"This scene has no strips"*. That last state keeps the panel — and its **{{ op('tks.sequencer_focus_switch').bl_label }}** button — visible on an ordinary shot scene, which is precisely when you want a way over to the edit timeline.

## :material-cursor-default-click: Getting to the Timeline

Using a sequencer takes the window to the scene that owns the strips, because the playhead needs a timeline to follow. Which gestures do that is yours to choose in [Preferences ▸ Workflow ▸ Automations](../preferences/workflow.md):

| Rung | Fires on |
|------|----------|
| **Hover** | The mouse entering a sequencer. The most eager — it acts before you press anything, which is what makes dragging the scrub bar work straight away. |
| **Click** | Clicking inside a sequencer. The most deliberate. |
| **Play** | Pressing play with the mouse over a sequencer. |
| **Playhead** | Clicking or dragging the playhead itself. |
| **Arrows** | Stepping the frame with the arrow keys over a sequencer. |

!!! warning "They are a ladder, not four separate doors"
    Hover fires before any press, so the rungs below it only get a turn when it is switched off. If you want clicking to be the trigger, turn Hover off — otherwise Hover gets there first every time.

**{{ op('tks.sequencer_focus_switch').bl_label }}** (`tks.sequencer_focus_switch`) is the manual version of the same journey, for when every automatic rung is off.

## :material-keyboard-return: Going back {: #going-back }

**{{ op('tks.sequencer_go_back').bl_label }}** (`tks.sequencer_go_back`) returns the window to the scene *and view layer* it was taken from — not just the scene, so you land on the take you left.

The return can also happen by itself, but it is **off by default**. With both halves on, the window follows your mouse between the two editors — sequencer, viewport, sequencer — and every crossing runs a full cascade. On two monitors that may be exactly right; it is not something handed to you unasked. Its own ladder has only two rungs (**Hover**, **Click**): there is no playhead in a viewport, so Play and Playhead have no meaning on the way back.

## :material-database-off: The Frame Cache

The sequencer caches rendered frames. A stored frame keeps the take it was rendered *with*, so it can show an old camera, animation or material before the correct one appears — which looks exactly like the follow being broken.

**{{ op('tks.sequencer_cache_off').bl_label }}** (`tks.sequencer_cache_off`) turns the frame cache off for a timeline the follow is driving, and invalidates what is already stored. The sidebar warns — *"Stored frames can show the wrong take"* — when the cache is on and could mislead you.

A preference keeps it off automatically on any timeline the follow drives; leave it on and you get the warning instead of the silent wrong frame.

## :material-cog: Preferences

All of these live in [Preferences ▸ Workflow ▸ Automations](../preferences/workflow.md):

| Setting | Default | What it does |
|---------|---------|--------------|
| **{{ pref('sequencer_follow_enabled').label }}** | On | Apply the take of the strip under the playhead while a sequencer is open. |
| **{{ pref('sequencer_scene_autoswitch').label }}** | On | Let using a sequencer move the window to the scene that owns the strips. |
| **{{ pref('sequencer_autoswitch_on').label }}** | all five | Which gestures do that — the ladder above. |
| **{{ pref('sequencer_autoswitch_back').label }}** | Off | Return to the previous scene by itself when the mouse enters a 3D viewport. |
| **{{ pref('sequencer_autoswitch_back_on').label }}** | Hover | Which gestures bring you back. |
| **{{ pref('sequencer_cache_off').label }}** | On | Keep the frame cache off on a timeline the follow drives. |

!!! note "A scene with no strips is not an edit timeline"
    Opening a sequencer on a shot scene that holds no strips does not make it one — the follow stays quiet, and the sidebar offers the way over to the real timeline instead.
