---
icon: material/pin
---

# Keep an Object's Own Animation

When one object should hold onto its own action instead of taking the cascade's.

1. Open the **Inspector** panel in the **Takes** tab (++n++).
2. Switch the header toggle to **Watchlist** if it is showing **Channels**.
3. Find the object's row in the list.
4. Click the **pin icon** at the start of that row.
5. Assign the action you want by hand in the **Actions & Slots** section.

You now have an object that keeps its own action while everything else follows the View Layer.

??? info "Details and edge cases"
    A **managed** object takes its action from the cascade of the active View Layer.
    A **pinned** object keeps yours. Pinned objects are also skipped by cascade slot
    assignment and by auto-rename, so their names and slots are yours to manage.

    Click the pin icon again to hand the object back to the cascade. If it has an
    action, a dialog asks you to confirm first, because the cascade assignment then
    replaces that action.

    **{{ op('tks.add_to_watchlist').bl_label }}** pins every selected object on the
    current View Layer at once. Objects that are already pinned are left alone.

    **{{ op('tks.remove_from_watchlist').bl_label }}** does the reverse for the
    selected objects, and clears their slots and animation data as it goes.

    Two header buttons filter the list: one shows only pinned objects, the other only
    managed ones.

    From the cascade side, **Pin Action** does the same job for the object's current
    action — see [Cascade](../features/cascade.md).

Full reference: [Inspector Panel](../interface/inspector_panel.md)
