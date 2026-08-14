---
icon: material/tag-multiple
---

# Tag Library

Tags are the addon's universal labelling system. They serve two purposes:

1. **Organisation** — colour-coded labels you can attach to Scenes, View Layers, Variants, Objects, and so on, surfacing visually in the tree.
2. **Automation** — when attached to a *rule* category (Output / Camera / World / Material), a tag becomes a one-click bundle that applies a set of presets through the cascade. See [Rules](rules.md).

## :material-map-marker: Where to Find It

*Globals panel > **Tags** mode* (open the **Globals** tab in the Takes N-panel and click the **Tags** mode icon at the top right).

## :material-tag-multiple: Categories

| Category | Type | Purpose |
|----------|------|---------|
| **Output** | Automation rule | Drives Render / Output / File Output / View Layer / Color Management presets. |
| **Camera** | Automation rule | Drives Camera preset + Camera object selection. |
| **World** (internal id `STUDIO`) | Automation rule | Drives World / environment presets. |
| **Material** | Automation rule | Drives Material preset assignments. |
| **Scene** | Data-scoped | Tags Scenes for organisation. |
| **Scene Group** | Data-scoped | Tags Scene Groups. |
| **ViewLayer Group** (internal id `VL_GROUP`) | Data-scoped | Tags View Layer Groups. |
| **ViewLayer** | Data-scoped | Tags View Layers. |
| **Variant** | Data-scoped | Tags variant States. Available as `{variant_tag}` in Smart Output. |
| **Custom** | Data-scoped | Cross-cutting labels. |

## :material-view-grid-outline: Panel Anatomy

- **Tree view** of all tags grouped by category.
- **+** / **−** to add or remove a tag.
- **↑ / ↓** to reorder.
- **{{ op('tks.tag_retarget_group').bl_label }}** (track icon) to move a tag into another group — equivalent to ++ctrl+t++.
- **Filter** search box (`tks_tags_filter`) to narrow visible tags by name.
- **Multiselect** (☐) toggle to bulk-edit.
- **Stats row** showing the tag count per category, e.g. `3/5 Output | 2/2 Camera`.

Each category header carries a **chevron** that runs **Toggle Expand** (`tks.tagtree_toggle_expand`) to fold or unfold that category in the tree. ++shift++-click the chevron to expand or collapse **every** category at once — handy for quickly tidying a long tag list down to just the headers, or opening everything back up.

## :material-plus-circle: Creating Tags

1. Pick a category in the tree.
2. Click **+** → **Tag**.
3. Choose a name and a colour (5 default presets, or custom).
4. (Optional) drop the tag inside a Tag Group via **+** → **Group**, then drag tags into it.

## :material-folder-multiple: Organizing Your Tag Library

Once a category holds more than a handful of tags, fold them into **Tag Groups** — collapsible folders inside the category:

1. **Create a group** — select the tags to bundle (enable **Multiselect** to pick several), then press ++ctrl+g++ or click **+** → **Group**. This runs **{{ op('tks.tag_group_create').bl_label }}** (`tks.tag_group_create`): a group named *New Group* (auto-numbered if taken) appears with the selected tags inside. All selected tags must belong to the same category.
2. **Rename it** — ++f2++ on the group header opens the **{{ op('tks.tag_group_rename').bl_label }}** dialog (`tks.tag_group_rename`); group names must stay unique within their category.
3. **Reorder** — the **↑ / ↓** buttons move the group up or down within its category (`tks.tag_group_move`).
4. **Move tags between groups** — **{{ op('tks.tag_retarget_group').bl_label }}** (track icon, or ++ctrl+t++, `tks.tag_retarget_group`) opens a small dialog with a target-group dropdown. It moves the active tag or the whole multi-selection, and remembers the last target per category — so re-filing a batch of tags is two clicks.
5. **Fold / unfold** — the chevron on a group header toggles that group (`tks.tag_group_toggle_expand`); ++shift++-click sets **every group in every category** to the same state at once.

When a group has outlived its usefulness, there are two exits with very different blast radii:

| Action | Operator | What happens to the tags |
|--------|----------|--------------------------|
| **{{ op('tks.tag_group_dissolve').bl_label }}** (++alt+g++) | `tks.tag_group_dissolve` | The group shell disappears; its member tags survive and move back to the category's ungrouped level. |
| **{{ op('tks.tag_group_delete').bl_label }}** | `tks.tag_group_delete` | The group **and every tag inside it** are deleted. Asks for confirmation first (toggleable in Preferences). |

## :material-link-variant: Assigning Tags

| Target | How |
|--------|-----|
| Scene / View Layer / View Layer Group / Scene Group | The data-scoped tag selector on the corresponding tree row. |
| Variant State | The `Variant` tag selector on the State row. |
| Object / collection | Custom tags via the per-object UI. |
| Cascade Rule (auto presets) | Select a tag in *Globals > Rules* mode (see [Rules](rules.md)). |

### :material-arrow-expand-all: Push Tag to Selected

To stamp one tag onto many rows at once, turn on the **Multiselect** (☐) toggle, select the Scenes or View Layers you want, then use **Push Tag to Selected** (`tks.batch_set_tag`). It writes the chosen tag to every selected item in the active list and reports how many it updated. Pushing an empty tag clears the assignment across the selection, so it doubles as a bulk *un-tag*.

### :material-link-off: Unlinking a Rule's Preset

When a tag drives an automation rule (Output / Camera / World / Material), each preset field on the rule shows an **X** button once a preset is assigned. Clicking it runs **Unlink Preset** (`tks.unlink_tag_preset`), which clears just that one field on the tag — leaving the tag itself and its other preset slots intact.

## :material-folder-cog: Smart Output

Tag names feed several Smart Output tokens:

- `{variant_tag}` — the active variant's tag name.
- `{preset}` — the active render preset name (often resolved through a tag rule).

## :material-keyboard: Hotkeys

| Shortcut | Action |
|----------|--------|
| ++ctrl+n++ | Add tag (smart). |
| ++shift+a++ | Full add menu. |
| ++f2++ | Rename. |
| ++del++ / ++x++ | Delete. |
| ++ctrl+g++ / ++alt+g++ | Group / ungroup. |
| ++ctrl+t++ | Retarget into another group. |
| ++ctrl+i++ | Invert multi-selection. |

See [Keyboard Shortcuts](../interface/hotkeys.md) for the full reference.
