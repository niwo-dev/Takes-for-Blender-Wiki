---
icon: material/movie-open-play
---

# Video Sequencer

*The take of the scene strip under the playhead, applied as you scrub — so an edit shows what it will actually render.*

## :material-lightbulb-outline: Concept

A scene strip points at a scene, and that scene has [takes](takes.md). Only one take is live at a time, so Blender may render the strip with the wrong one.

Takes closes that gap. While a sequencer is open, the take of the strip under the playhead is applied as you scrub or play. The preview is the edit.

??? info "Why the window changes scene"
    A window shows one scene at a time. Applying a strip's take means putting the
    window on that strip's scene.

    That is why the follow comes with the scene switching described below, rather
    than as a silent background effect.

## :material-view-dashboard-outline: The Sequencer Sidebar

Press ++n++ in the sequencer and open the **Takes** tab.

It names the take this frame stands for, and — when they differ — the one you are actually looking at.

| Row | Meaning |
|-----|---------|
| **Renders** | The take the strip under the playhead represents: what this frame will render as. |
| **Showing** | The take applied right now. It appears only when it differs from **Renders**. |
| **Came from** | Returns you to the scene and view layer you were taken from — see [Going back](#going-back). |

??? info "When there is nothing to follow"
    The panel says so: *"Playhead following is off"*, *"No scene strip under the
    playhead"*, or *"This scene has no strips"*.

    That last state keeps the panel — and its
    **{{ op('tks.sequencer_focus_switch').bl_label }}** button — visible on an
    ordinary shot scene. Which is precisely when you want a way over to the edit
    timeline.

## :material-cursor-default-click: Getting to the Timeline

Using a sequencer takes the window to the scene that owns the strips, because the playhead needs a timeline to follow.

Which gestures do that is yours to choose in [Preferences ▸ Workflow ▸ Automations](../preferences/workflow.md).

??? info "The five gestures"
    | Rung | Fires on |
    |------|----------|
    | **Hover** | The mouse entering a sequencer. The most eager — it acts before you press anything, which is what makes dragging the scrub bar work straight away. |
    | **Click** | Clicking inside a sequencer. The most deliberate. |
    | **Play** | Pressing play with the mouse over a sequencer. |
    | **Playhead** | Clicking or dragging the playhead itself. |
    | **Arrows** | Stepping the frame with the arrow keys over a sequencer. |

    **They are a ladder, not four separate doors.** Hover fires before any press,
    so the rungs below it only get a turn when it is switched off. If you want
    clicking to be the trigger, turn Hover off.

**{{ op('tks.sequencer_focus_switch').bl_label }}** makes the same trip by hand, for when every automatic rung is off.

## :material-keyboard-return: Going back {: #going-back }

**{{ op('tks.sequencer_go_back').bl_label }}** returns the window to the scene *and view layer* it was taken from. So you land on the take you left.

The return can also happen by itself, but it is **off by default**.

??? info "Turning the automatic return on"
    With both halves on, the window follows your mouse between the two editors —
    sequencer, viewport, sequencer — and every crossing runs a full cascade. On two
    monitors that may be exactly right; it is not something handed to you unasked.

    Its own ladder has only two rungs, **Hover** and **Click**. A viewport has no
    playhead, so Play and Playhead have no meaning on the way back.

## :material-database-off: The Frame Cache

The sequencer caches rendered frames. A stored frame keeps the take it was rendered *with*, so it can show an old camera, animation or material — which looks exactly like the follow being broken.

**{{ op('tks.sequencer_cache_off').bl_label }}** turns the cache off for that timeline and invalidates what is already stored. A preference does it for you automatically.

??? warning "If you leave the cache on"
    The sidebar warns you instead — *"Stored frames can show the wrong take"* —
    rather than quietly serving a wrong frame.

## :material-cog: Preferences

All of these live in [Preferences ▸ Workflow ▸ Automations](../preferences/workflow.md).

??? info "The six settings"
    | Setting | Default | What it does |
    |---------|---------|--------------|
    | **{{ pref('sequencer_follow_enabled').label }}** | On | Apply the take of the strip under the playhead while a sequencer is open. |
    | **{{ pref('sequencer_scene_autoswitch').label }}** | On | Let using a sequencer move the window to the scene that owns the strips. |
    | **{{ pref('sequencer_autoswitch_on').label }}** | all five | Which gestures do that — the ladder above. |
    | **{{ pref('sequencer_autoswitch_back').label }}** | Off | Return to the previous scene by itself when the mouse enters a 3D viewport. |
    | **{{ pref('sequencer_autoswitch_back_on').label }}** | Hover | Which gestures bring you back. |
    | **{{ pref('sequencer_cache_off').label }}** | On | Keep the frame cache off on a timeline the follow drives. |

??? note "A scene with no strips is not an edit timeline"
    Opening a sequencer on a shot scene that holds no strips does not make it one.
    The follow stays quiet, and the sidebar offers the way over to the real
    timeline instead.
