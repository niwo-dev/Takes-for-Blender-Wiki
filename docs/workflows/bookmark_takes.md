---
icon: material/bookmark-plus
---

# Bookmark Takes

When the one value you keep tweaking is buried five panels deep.

1. Right-click that property, anywhere in Blender's UI.
2. Choose **{{ op('tks.bookmark_property').bl_label }}**.
3. Open the **Inspector** panel and flip its header toggle to **Channels**.
4. Click the bookmark icon in the **Channels** header to reveal the Bookmarks shelf.
5. Edit or keyframe the property from its row there.

You now have every scattered control you care about on one shelf.

??? info "Details and edge cases"
    - Any animatable property works: transforms, modifier values, shader and world
      inputs, shape keys, custom properties.
    - To remove one, right-click it and choose
      **{{ op('tks.unbookmark_property').bl_label }}**. That works on the original
      control and on the shelf row alike — the rows are the real properties, so they
      carry no separate remove button.
    - Bookmarks are one set per Scene, saved in the .blend file. A row shows up
      whenever its object, material or world is active.
    - Bookmarked target types stay switchable even with no keyframes, so your
      favourites never drop out of the list.
    - Save a layout as a **Bookmark preset** to reuse it in other scenes or hand it
      to a collaborator — see [Render Presets](../features/render_presets.md).

Full reference: [Bookmarks](../features/bookmarks.md)
