---
icon: material/camera-control
---

# Show One Camera at a Time

When a scene holds several cameras and you only want to see the one this take uses.

1. Open the **Takes** tab in the 3D viewport sidebar (++n++).
2. Hold ++shift++ and right-click any row in the Takes Tree.
3. At the foot of the menu, open **Isolate** and pick a mode.
4. Switch takes.

You now have one camera on screen and the rest out of the way.

## The three modes

The row shows the mode in force, so you can read it without opening the menu.

| Mode | What you see |
|---|---|
| **Off** | Nothing changes on its own. **Isolate Active Camera** still works. |
| **Single Camera** | Only the camera in use. On a Multi-Cam take that is the camera under the playhead, and it follows as you scrub or play. |
| **Multi Camera** | Every camera the take uses. On a Multi-Cam take, all of its marker cameras. |

**Off** is the default. The mode means the same thing on every take: whether a
take is in [Still Mode](../features/still_mode.md) or not makes no difference.

## Do it right now

Click **Isolate Active Camera** in the same menu, or press ++shift+alt+h++. That
works even while the mode is **Off**.

??? info "Hidden cameras stay hidden"
    Takes never puts a camera back on screen by itself. What it hides stays
    hidden until you say otherwise, because it cannot tell its own work from a
    camera you hid on purpose.

    To get them all back, use **Reset Camera Visibility** in
    *Preferences > Workflow > Automations > Cameras*.

    Unhide a camera by hand and it stays visible. The next switch or the next
    **Isolate** puts it away again.

??? info "What Isolate touches"
    Two switches under *Preferences > Workflow > Automations > Cameras* decide
    the halves: **Show Assigned Camera** reveals this take's camera, and **Hide
    Other Cameras** puts the rest away. Both are on to start with.

    Switch **Hide Other Cameras** off and **Isolate** only reveals the take's own
    camera. It hides nothing.

    **Affect Containing Collection** also reveals the collection the camera sits
    in, so a hidden collection cannot keep it off screen.

Full reference: [Navigation Panel](../interface/navigation_panel.md)
