---
icon: material/tag-multiple
---

# Tag Library

Tags are the addon's universal labelling system. They serve two purposes:

1. **Organisation** — colour-coded labels you can attach to Scenes, View Layers, Variants, Objects, and so on, surfacing visually in the tree.
2. **Automation** — when attached to a *rule* category (Output / Camera / Studio / Material), a tag becomes a one-click bundle that applies a set of presets through the cascade. See [Rules](rules.md).

## :material-map-marker: Where to Find It

*Globals panel > **Tags** mode* (open the **Globals** tab in the Takes N-panel and click the **Tags** mode icon at the top right).

## :material-tag-multiple: Categories

| Category | Type | Purpose |
|----------|------|---------|
| **OUTPUT** | Automation rule | Drives Render / Output / File Output / View Layer / Color Management presets. |
| **CAMERA** | Automation rule | Drives Camera preset + Camera object selection. |
| **STUDIO** | Automation rule | Drives World / environment presets. |
| **MATERIAL** | Automation rule | Drives Material preset assignments. |
| **SCENE** | Data-scoped | Tags Scenes for organisation. |
| **SCENE_GROUP** | Data-scoped | Tags Scene Groups. |
| **VL_GROUP** | Data-scoped | Tags View Layer Groups. |
| **VIEWLAYER** | Data-scoped | Tags View Layers. |
| **VARIANT** | Data-scoped | Tags variant States. Available as `{variant_tag}` in Smart Output. |
| **CUSTOM** | Data-scoped | Cross-cutting labels. |

## :material-view-grid-outline: Panel Anatomy

- **Tree view** of all tags grouped by category.
- **+** / **−** to add or remove a tag.
- **↑ / ↓** to reorder.
- **Retarget** (track icon) to move a tag into another group — equivalent to ++ctrl+t++.
- **Filter** search box (`tks_tags_filter`) to narrow visible tags by name.
- **Multiselect** (☐) toggle to bulk-edit.
- **Stats row** showing the tag count per category, e.g. `3/5 Output | 2/2 Camera`.

## :material-plus-circle: Creating Tags

1. Pick a category in the tree.
2. Click **+** → **Tag**.
3. Choose a name and a colour (5 default presets, or custom).
4. (Optional) drop the tag inside a Tag Group via **+** → **Group**, then drag tags into it.

## :material-link-variant: Assigning Tags

| Target | How |
|--------|-----|
| Scene / View Layer / View Layer Group / Scene Group | The data-scoped tag selector on the corresponding tree row. |
| Variant State | The `Variant` tag selector on the State row. |
| Object / collection | Custom tags via the per-object UI. |
| Cascade Rule (auto presets) | Select a tag in *Globals > Rules* mode (see [Rules](rules.md)). |

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
