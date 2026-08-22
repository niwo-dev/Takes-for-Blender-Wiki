"""Two ways to reach the Takes tab, since Region.active_panel_category is
read-only in 5.2.

  A) write it under a temp_override, in case the refusal is contextual
  B) event simulation -- Blender's own test harness path, enabled with
     --enable-event-simulate; if this works it also unlocks the four shots
     that need an OPEN MENU, which no property assignment can produce

Reports which of the two actually moved the tab.
"""

import os

import bpy

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_probe")
os.makedirs(OUT, exist_ok=True)
LOG = os.path.join(OUT, "tab.log")
MODULE = "bl_ext.user_default.takes_for_blender"


def log(m):
    with open(LOG, "a", encoding="utf-8") as fh:
        fh.write(str(m) + "\n")


def run():
    try:
        bpy.ops.wm.read_homefile()
        bpy.ops.preferences.addon_enable(module=MODULE)

        win = bpy.context.window_manager.windows[0]
        view3d = next(a for a in win.screen.areas if a.type == 'VIEW_3D')
        view3d.spaces.active.show_region_ui = True
        ui = next(r for r in view3d.regions if r.type == 'UI')

        log(f"tabs offered: {getattr(ui, 'panel_categories', 'n/a')}")
        log(f"tab now: {ui.active_panel_category!r}")

        # A) direct write, with context pointed at the region
        try:
            with bpy.context.temp_override(window=win, area=view3d, region=ui):
                ui.active_panel_category = "Takes"
            log(f"A) direct write -> {ui.active_panel_category!r}")
        except Exception as exc:
            log(f"A) direct write FAILED: {type(exc).__name__}: {exc}")

        # B) event simulation -- only present when the flag is on
        can_sim = hasattr(win, "event_simulate")
        log(f"B) event_simulate available: {can_sim}")
        if can_sim:
            log("   (coordinates would come from the tab spine's region rect)")
    except Exception as exc:
        log(f"EXCEPTION {type(exc).__name__}: {exc}")
    finally:
        bpy.ops.wm.quit_blender()
    return None


bpy.app.timers.register(run, first_interval=3.0)
