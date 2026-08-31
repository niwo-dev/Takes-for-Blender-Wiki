---
icon: material/tag-search
---

# Tag & Filter Takes

When the tree gets noisy and you want one slice of it — on screen or in a render.

1. Open the **Globals** tab and click the **Tags** mode icon to reach the **Tag Library**.
2. Pick a category, click **+** → **Tag**, then give it a name and a colour.
3. Click the tag icon on the Scene or View Layer row and pick your tag.
4. Click the funnel icon in the tree sidebar to open **{{ op('tks.tag_filter_popover').bl_label }}**, then click that tag.
5. Open the render menu and choose **Select Tag** to render only the layers carrying it.

You now have a colour-coded label that both narrows the tree and drives a render.

??? info "Details and edge cases"
    - The filter popover lists only tags that are actually assigned somewhere.
      **-- Show All --** clears it. The funnel stays lit while a filter is on.
    - In the tree, a Scene stays visible when one of its View Layers matches.
    - **Select Tag** in the render menu matches a View Layer's **own** tag only. A tag
      sitting on the Scene above it does not pull that layer in. Each menu entry
      shows how many layers it would render.
    - To tag many rows at once, turn on **Multiselect** (☐), select them, then use
      **{{ op('tks.batch_set_tag').bl_label }}**. Pushing an empty tag clears them.
    - Tags in the four automation categories also apply whole preset sets through
      the cascade — see [Rules](../features/rules.md).

Full reference: [Tag Library](../features/tags.md)
