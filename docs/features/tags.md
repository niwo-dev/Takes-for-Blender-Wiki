---
icon: material/tag-multiple
---

# Tag Library

Tags are colour-coded labels. You attach them to Scenes, View Layers, Variants and Objects, and they show up in the tree.

A tag on a *rule* also does work for you. One tag then applies a whole set of presets through the cascade — see [Rules](rules.md).

## :material-map-marker: Where to Find It

Open the **Globals** tab in the Takes side panel. Click the **Tags** mode icon at the top right.

## :material-tag-multiple: Categories

Every tag lives in one category. Four categories drive automation rules. The other six are plain labels.

??? info "All ten categories"
    | Category | Type | Purpose |
    |----------|------|---------|
    | **Output** | Automation rule | Drives Render / Output / File Output / View Layer / Color Management presets. |
    | **Camera** | Automation rule | Drives the Camera preset and the camera object choice. |
    | **World** | Automation rule | Drives World and environment presets. |
    | **Material** | Automation rule | Drives Material preset assignments. |
    | **Scene** | Data-scoped | Tags Scenes for organisation. |
    | **Scene Group** | Data-scoped | Tags Scene Groups. |
    | **View Layer Group** | Data-scoped | Tags View Layer Groups. |
    | **View Layer** | Data-scoped | Tags View Layers. |
    | **Variant** | Data-scoped | Tags variant States. Feeds the `{variant_tag}` Smart Output token. |
    | **Custom** | Data-scoped | Cross-cutting labels. |

## :material-view-grid-outline: Panel Anatomy

The panel is a tree of all your tags, grouped by category.

Use **+** and **−** to add or remove a tag, and **↑ / ↓** to reorder one. The **Filter** box narrows the list by name.

??? info "The rest of the panel"
    - **Multiselect** (☐) turns on bulk editing, so one action hits every picked tag.
    - **{{ op('tks.tag_retarget_group').bl_label }}** (track icon) moves a tag into
      another group. Same as ++ctrl+t++.
    - The **stats row** counts tags per category, like `3/5 Output | 2/2 Camera`.
    - Every category header carries a **chevron** that runs **Toggle Expand**. It
      folds or unfolds that category.
    - ++shift++-click a chevron to fold or unfold **every** category at once. Handy
      for tidying a long list down to just the headers.

## :material-plus-circle: Creating Tags

1. Pick a category in the tree.
2. Click **+**, then **Tag**.
3. Give it a name and a colour — five presets, or your own.

To file it away, tick the tags you want, then press **+** → **Group**. The group is built from what you picked. To move a tag later, select it and use **Retarget**.

### Duplicate names

Names do not have to be unique, and nothing is rejected for colliding. A second `hero` becomes `hero.001`, exactly like a duplicated object in Blender.

??? tip "Namespaces, and names that free up again"
    Rules and tags are separate namespaces. A rule named `a` and a tag named `a`
    live side by side. Neither pushes the other to `.001`.

    Tag Groups work the same way. The suffix only applies within the same kind of
    thing.

    Rename `hero.001` to something else and the name is not reserved. The next
    `hero` you create takes `hero.001` again.

## :material-folder-multiple: Organizing Your Tag Library

Once a category holds more than a handful of tags, bundle them into **Tag Groups** — collapsible folders inside the category.

Select the tags you want and press ++ctrl+g++. A new group appears with them inside. Press ++f2++ on its header to rename it.

??? info "Working with groups"
    - **Create** — turn on **Multiselect** to pick several tags, then press
      ++ctrl+g++ or click **+** → **Group**. This runs
      **{{ op('tks.tag_group_create').bl_label }}**. You get a group called *New
      Group*, auto-numbered if that name is taken. All selected tags must sit in
      the same category.
    - **Rename** — ++f2++ on the group header opens the
      **{{ op('tks.tag_group_rename').bl_label }}** dialog. Group names must stay
      unique within their category.
    - **Reorder** — **↑ / ↓** move the group up or down within its category.
    - **Move tags between groups** — **{{ op('tks.tag_retarget_group').bl_label }}**
      (track icon, or ++ctrl+t++) opens a dialog with a target-group dropdown. It
      moves the active tag, or your whole multi-selection.
    - That dropdown always opens on **Select a Group**. It lists only destinations
      that would actually move something, so the group the tags already sit in is
      left out. **Ungrouped** appears whenever at least one tag is inside a group.
      That is how you take a tag back out.
    - **Fold / unfold** — the chevron on a group header toggles that group.
      ++shift++-click sets **every group in every category** to the same state.

??? warning "Two ways to get rid of a group"
    | Action | What happens to the tags |
    | -------- | -------------------------- |
    | **{{ op('tks.tag_group_dissolve').bl_label }}** (++alt+g++) | The group shell disappears. Its tags survive and drop back to the category's ungrouped level. |
    | **{{ op('tks.tag_group_delete').bl_label }}** | The group **and every tag inside it** are deleted. It asks you first, and you can turn that confirmation off in Preferences. |

## :material-link-variant: Assigning Tags

Pick a tag from the tag selector on the row you want to label.

??? info "Every place you can assign a tag"
    | Target | How |
    |--------|-----|
    | Scene / View Layer / View Layer Group / Scene Group | The data-scoped tag selector on that tree row. |
    | Variant State | The **Variant** tag selector on the State row. |
    | Object or collection | Custom tags, from the per-object controls. |
    | Cascade rule (automatic presets) | Pick a tag in *Globals > Rules* mode — see [Rules](rules.md). |

### :material-arrow-expand-all: Push Tag to Selected

Turn on **Multiselect** (☐), select the Scenes or View Layers you want, then use **Push Tag to Selected**.

??? tip "What it does"
    It writes your tag to every selected item in the active list, and reports how
    many it updated. Push an empty tag to clear the whole selection, so it doubles
    as a bulk un-tag.

### :material-link-off: Unlinking a Rule's Preset

When a tag drives a rule, each preset field on it shows an **X** once a preset is assigned.

??? tip "What it clears"
    Clicking the **X** runs **Unlink Preset**. It clears only that one field. The
    tag itself and its other preset slots stay exactly as they are.

## :material-folder-cog: Smart Output

Tag names feed two [Smart Output](smart_output.md) tokens.

??? info "The two tokens"
    - `{variant_tag}` — the active variant's tag name.
    - `{preset}` — the active render preset name, often resolved through a tag rule.

## :material-keyboard: Hotkeys

In the tag tree, ++ctrl+g++ groups the selected tags and ++ctrl+t++ retargets them.

Full list: [Keyboard Shortcuts](../interface/hotkeys.md)
