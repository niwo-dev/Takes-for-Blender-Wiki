---
icon: material/camera-control
---

# Show One Camera at a Time

When a scene holds several cameras and you only want to see the one this take uses.

1. Open the **Takes** tab in the 3D viewport sidebar (++n++).
2. Hold ++shift++ and right-click any row in the Takes Tree.
3. Tick **Camera Visibility** at the foot of the menu.
4. Open **Apply When** and pick the moment it should run.
5. Switch takes.

You now have one camera on screen and the rest out of the way.

## When it runs

| Choice | It isolates the camera |
|---|---|
| **On Still Mode** | only when the take you land on is in [Still Mode](../features/still_mode.md) |
| **On Every Switch** | on every take switch |
| **On Request** | never on its own |

**On Still Mode** is the default. A still needs exactly one camera. An animation
take often needs several, so it is left alone.

## Do it right now

Click **Isolate** in the same menu, or press ++shift+alt+h++. That works whatever
**Apply When** says.

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
