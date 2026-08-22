"""Feasibility probe: can Blender screenshot its own UI unattended?

Answers three questions in one run:
  1. Does `screen.screenshot` write a PNG of the whole window from a script?
  2. Does `screen.screenshot_area` crop to a single editor (the sidebar shot
     the tutorials actually need)?
  3. Is the Takes addon loaded in this session at all?

Writes to dev/shots/_probe/ and quits. Nothing here is a wiki asset yet.
"""
import os
import sys

import bpy

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_probe")
os.makedirs(OUT, exist_ok=True)
LOG = os.path.join(OUT, "probe.log")


def log(msg):
    with open(LOG, "a", encoding="utf-8") as fh:
        fh.write(str(msg) + "\n")
    print("PROBE:", msg)


def area_of(wm_window, kind):
    for area in wm_window.screen.areas:
        if area.type == kind:
            return area
    return None


def run():
    try:
        addons = [m for m in bpy.context.preferences.addons.keys() if "takes" in m.lower()]
        log(f"takes addon loaded: {addons or 'NO'}")
        log(f"blender: {bpy.app.version_string}")

        win = bpy.context.window_manager.windows[0]
        log(f"areas: {sorted({a.type for a in win.screen.areas})}")

        full = os.path.join(OUT, "full_window.png")
        bpy.ops.screen.screenshot(filepath=full)
        log(f"full window -> {os.path.exists(full)} ({full})")

        view3d = area_of(win, 'VIEW_3D')
        if view3d:
            crop = os.path.join(OUT, "area_view3d.png")
            with bpy.context.temp_override(window=win, area=view3d):
                bpy.ops.screen.screenshot_area(filepath=crop)
            log(f"area crop  -> {os.path.exists(crop)} ({crop})")
        else:
            log("no VIEW_3D area to crop")
    except Exception as exc:                      # probe: report, never hang
        log(f"EXCEPTION {type(exc).__name__}: {exc}")
    finally:
        bpy.ops.wm.quit_blender()
    return None


bpy.app.timers.register(run, first_interval=3.0)
