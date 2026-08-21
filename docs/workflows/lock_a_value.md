---
icon: material/lock-outline
---

# Lock a Value

When you keep knocking a light's power or a material's roughness out of place.

1. Select the objects whose values you want held still.
2. Open the **Takes** tab in the 3D viewport sidebar (++n++).
3. Click **{{ op('tks.value_lock_toggle').bl_label }}** in the Navigation header.
4. Carry on working — a nudged value snaps straight back.
5. Click the button again to release the lock.

You now have a scene whose static values cannot drift while you work.

??? info "Details and edge cases"
    The button sits between **Still Mode** and **Autokey** in the Navigation header.

    The lock captures the unkeyed values of your **selected objects** at the moment
    you switch it on. That baseline covers their materials, object data, the world
    and anything else holding a static value.

    Keyframed and driven channels stay free. They are the animation you came to
    make, so the lock never touches them.

    Insert a keyframe on a locked property and it leaves the lock's care. Keying is
    always an intentional act.

    **Autokey** pauses while the lock is on and comes back when you release it.
    Otherwise every nudge would be keyed, and the lock only looks after unkeyed
    values.

    **Rest State Mode** guards the same values, so the two take turns. Switching one
    on releases the other.

    Take switching keeps working while the lock is on, on any View Layer.

Full reference: [Value Lock](../features/value_lock.md)
