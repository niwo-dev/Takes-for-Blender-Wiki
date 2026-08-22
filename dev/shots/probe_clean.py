"""Can a FACTORY session still load Takes?

The first probe opened the author's real project and full add-on list — a
sequencer full of shot strips, a client scene, every third-party add-on
installed. None of that may reach a public page, so wiki captures have to run
from a clean session instead.

`--factory-startup` skips user preferences, which also means the Takes
extension is not enabled. This checks whether enabling it by hand from a script
works anyway, and what a clean window looks like.
"""

import os

import bpy

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_probe")
os.makedirs(OUT, exist_ok=True)
LOG = os.path.join(OUT, "clean.log")
MODULE = "bl_ext.user_default.takes_for_blender"


def log(message):
    with open(LOG, "a", encoding="utf-8") as fh:
        fh.write(str(message) + "\n")


def run():
    try:
        log(f"addons before: {list(bpy.context.preferences.addons.keys())}")
        try:
            bpy.ops.preferences.addon_enable(module=MODULE)
            log("addon_enable: OK")
        except Exception as exc:
            log(f"addon_enable FAILED: {type(exc).__name__}: {exc}")
        log(f"takes loaded: {MODULE in bpy.context.preferences.addons}")

        win = bpy.context.window_manager.windows[0]
        log(f"areas: {sorted({a.type for a in win.screen.areas})}")
        log(f"window: {win.width}x{win.height}")
        log(f"objects: {[o.name for o in bpy.data.objects]}")

        shot = os.path.join(OUT, "clean_window.png")
        bpy.ops.screen.screenshot(filepath=shot)
        log(f"wrote: {os.path.exists(shot)}")
    except Exception as exc:
        log(f"EXCEPTION {type(exc).__name__}: {exc}")
    finally:
        bpy.ops.wm.quit_blender()
    return None


bpy.app.timers.register(run, first_interval=3.0)
