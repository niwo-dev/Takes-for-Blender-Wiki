"""Shoot the wiki's tutorial screenshots from a clean Blender session.

Run through Blender, never on its own:

    "C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe" \\
        --factory-startup --enable-event-simulate -p 0 0 1600 900 \\
        --python dev/shots/capture.py -- --only first_take_02

Three flags, all load-bearing:

  --factory-startup       Without it Blender opens the author's real session --
                          a client scene, shot strips in the sequencer, every
                          third-party add-on named in Preferences. None of that
                          may reach a public page. It also means the Takes
                          extension is off, so this script enables it by hand.
  --enable-event-simulate Lets the script click. Some UI state has no property
                          to set: sidebar tabs are read-only in 5.2, and menus
                          only exist while open.
  -p 0 0 1600 900         A fixed window, so every shot is the same size.

WHY A STEP QUEUE, not one function per shot: Blender builds UI state during
draw, not when you ask for it. A sidebar opened in the same callback that reads
its tabs reports none -- the region exists but has never been drawn. Each step
therefore returns to Blender, which draws, and the next step runs on the
result.

Cropping happens at capture time via `screen.screenshot_area`, so no image
library is in the loop.
"""

import os
import sys
import traceback

import bpy

HERE = os.path.dirname(os.path.abspath(__file__))
WIKI = os.path.dirname(os.path.dirname(HERE))
OUT = os.path.join(WIKI, "docs", "assets", "shots")
LOG = os.path.join(HERE, "_probe", "capture.log")
MODULE = "bl_ext.user_default.takes_for_blender"
SETTLE = 0.35          # seconds handed back to Blender between steps

os.makedirs(OUT, exist_ok=True)
os.makedirs(os.path.dirname(LOG), exist_ok=True)


def log(message):
    with open(LOG, "a", encoding="utf-8") as fh:
        fh.write(f"{message}\n")
    print(f"SHOT: {message}")


# --- session helpers -------------------------------------------------------

def window():
    return bpy.context.window_manager.windows[0]


def area(kind):
    for a in window().screen.areas:
        if a.type == kind:
            return a
    return None


def region(a, kind):
    for r in a.regions:
        if r.type == kind:
            return r
    return None


def redraw():
    for a in window().screen.areas:
        a.tag_redraw()


def shoot(name, target=None):
    """Write one PNG: the whole window, or just `target` when given.

    Both branches name the window. A timer callback has no window in context,
    so without the override `screen.screenshot` fails its poll -- the same
    missing-context root cause that crashed Blender on `show_region_ui`
    (dev/crashes/README.md).
    """
    path = os.path.join(OUT, f"{name}.png")
    if target is None:
        with bpy.context.temp_override(window=window()):
            bpy.ops.screen.screenshot(filepath=path)
    else:
        with bpy.context.temp_override(window=window(), area=target):
            bpy.ops.screen.screenshot_area(filepath=path)
    log(f"  -> {name}.png {'OK' if os.path.exists(path) else 'MISSING'}")


def frame_scene():
    """Zoom the 3D view so the subject fills it, the same for every shot."""
    view3d = area('VIEW_3D')
    with bpy.context.temp_override(window=window(), area=view3d,
                                   region=region(view3d, 'WINDOW')):
        bpy.ops.view3d.view_all(center=False)
    redraw()


def open_sidebar():
    """Show the N-panel.

    The operator, not `space.show_region_ui`. Same end state, but assigning the
    property from a timer fires an RNA update that asks the window for its
    active workspace -- and a timer has no window, so Blender segfaults.
    """
    view3d = area('VIEW_3D')
    with bpy.context.temp_override(window=window(), area=view3d):
        if not view3d.spaces.active.show_region_ui:
            bpy.ops.screen.region_toggle(region_type='UI')
    redraw()


def try_tab_slot(label, offset):
    """Click one position on the sidebar's tab spine, if not already there.

    Blender exposes which tab is active but not the list of tabs, and the
    property is read-only in 5.2 -- so the tab cannot be chosen, only clicked,
    and the spine's slot heights vary with each label's length. Rather than
    guess the layout, walk down the spine one offset per step and stop as soon
    as the active tab is the one asked for. Each attempt is its own step
    because the click only takes effect once Blender redraws.
    """
    view3d = area('VIEW_3D')
    ui = region(view3d, 'UI')
    if ui is None:
        return
    if ui.active_panel_category == label:
        return                                   # already there; nothing to do
    win = window()
    if not hasattr(win, "event_simulate"):
        log("  ! event simulation off -- run with --enable-event-simulate")
        return
    x, y = ui.x + ui.width - 12, ui.y + ui.height - offset
    try:
        # The move is not decoration. Blender resolves which region and widget
        # is under the cursor from the mouse position it last saw, so a click
        # delivered without one lands wherever the pointer happened to be.
        win.event_simulate('MOUSEMOVE', 'NOTHING', x=x, y=y)
        win.event_simulate('LEFTMOUSE', 'PRESS', x=x, y=y)
        win.event_simulate('LEFTMOUSE', 'RELEASE', x=x, y=y)
    except Exception as exc:
        log(f"  ! click at y-{offset} failed: {type(exc).__name__}: {exc}")
    redraw()


def report_tab():
    ui = region(area('VIEW_3D'), 'UI')
    log(f"  tab now: {ui.active_panel_category!r}" if ui else "  no sidebar")


def tab_steps(label):
    """Steps that walk the spine until `label` is the active tab."""
    steps = []
    for offset in range(24, 480, 28):
        steps.append(lambda o=offset: try_tab_slot(label, o))
    steps.append(report_tab)
    return steps


# --- the shots -------------------------------------------------------------
# Each entry is a list of steps. Blender draws between them.

SHOTS = {
    "first_take_01": [
        frame_scene,
        lambda: shoot("getting-started_first-take_default-scene"),
    ],
    "first_take_02": [
        open_sidebar,
        *tab_steps("Takes"),
        frame_scene,
        lambda: shoot("getting-started_first-take_takes-panel"),
    ],
}


# --- driver ----------------------------------------------------------------

def wanted():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    if "--only" in argv:
        names = [n for n in argv[argv.index("--only") + 1].split(",") if n in SHOTS]
        if names:
            return names
    return list(SHOTS)


QUEUE = []


def pump():
    """Run one step, then hand the frame back so Blender can draw."""
    if not QUEUE:
        bpy.ops.wm.quit_blender()
        return None
    step = QUEUE.pop(0)
    try:
        step()
    except Exception:
        log("  ! step failed\n" + traceback.format_exc())
    return SETTLE


def start():
    try:
        # use_factory_startup is NOT optional: a bare read_homefile() reads the
        # user's SAVED startup file and quietly undoes --factory-startup.
        bpy.ops.wm.read_homefile(use_factory_startup=True)
        bpy.ops.preferences.addon_enable(module=MODULE)
        log(f"takes loaded: {MODULE in bpy.context.preferences.addons}")
        for name in wanted():
            QUEUE.append(lambda n=name: log(f"shot {n}"))
            QUEUE.extend(SHOTS[name])
    except Exception:
        log("FATAL\n" + traceback.format_exc())
        QUEUE.clear()
    bpy.app.timers.register(pump, first_interval=SETTLE)
    return None


bpy.app.timers.register(start, first_interval=2.0)
