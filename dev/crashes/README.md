# Blender crashes hit while building the wiki

One file per crash, named `<date>_<what-triggered-it>_exit<code>.crash.txt`,
copied out of `%TEMP%\blender.crash.txt` before the next run overwrites it.
Blender keeps exactly one, so an uncaptured crash is a lost crash.

---

## 2026-08-22 — `show_region_ui` from a timer, exit 11

**File:** `2026-08-22_event-simulate_exit11.crash.txt`
**Blender:** 5.2.0 LTS, hash `fbe6228777e7`
**Crash:** `EXCEPTION_ACCESS_VIOLATION`, read at `0x70`

### What it really is

The filename blames `--enable-event-simulate` because that was the flag under
test. It is not the cause. The stack says otherwise:

```
WM_window_get_active_workspace   <- null deref
ED_area_init
ED_region_visibility_change_update
rna_property_update
pyrna_py_to_prop                 <- a Python attribute assignment
py_timer_execute                 <- ...made from a bpy.app.timers callback
```

Assigning `space.show_region_ui = True` fires an RNA update that re-inits the
area, which asks the window for its active workspace. A `bpy.app.timers`
callback carries no window, so that lookup dereferences null.

It is a **context** bug, not an event-simulate bug. The same assignment from an
operator, or under a `temp_override` that names the window, is fine.

### Why it did not crash the first time

The earlier capture run set the same property from the same timer and survived,
because the splash screen was still up and the window context happened to be
intact. Adding `read_homefile()` to dismiss the splash is what exposed it — a
reminder that "it worked once" is not evidence here.

### Workaround in use

`dev/shots/capture.py` wraps every region/space write in
`bpy.context.temp_override(window=..., area=...)`.

### Worth carrying to the addon

Takes already has a rule about this family — timer callbacks that touch window
state need an override (see the addon's own notes on timer window-ops). This is
the same failure with a different property, and it is a hard crash rather than
a silent no-op, so it is worth a look at any addon timer that writes to a
`space` or `region`.

### Not yet done

Not reported upstream. A minimal repro would be: launch with
`--factory-startup`, register a timer, and in it call `read_homefile()` then set
`show_region_ui` with no override.
