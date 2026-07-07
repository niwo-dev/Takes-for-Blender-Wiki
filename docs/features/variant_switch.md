---
icon: material/swap-horizontal
---

# Variant Switch

The **Variant Switch** system manages product variants — different material configurations, finishes, or color options — with per-scope material swapping and cascade-aware state management.

## :material-lightbulb-outline: Concept

In product visualization, you often need to render the same product in multiple finishes (Gold, Silver, Matte Black) or configurations. Variant Switch automates the material swapping process.

## :material-source-branch: Hierarchy

| Element | Description |
|---------|-------------|
| **Product** | The top-level container (e.g., "Watch", "Bottle"). |
| **State** | A named variant (e.g., "Gold", "Silver"). Click to preview. |
| **Part** | A component linked to a collection (e.g., "Body", "Strap"). |
| **Pool** | Material slots available for each part. |

!!! note ""State" vs "Variant""
    The two words name the same thing from two sides. The Variant Tree speaks of **States** — the **{{ op('tks.vsw_add_state').bl_label }}** button creates one. Everywhere the *cascade* is involved — the per-tier variant popovers, the `Set … Variant` operators, the `{variant_tag}` token — that same entry is called a **Variant**. Selecting a State in the tree and assigning a Variant through the cascade set the identical value.

## :material-cursor-default-click: Usage

### :material-plus-circle: Creating a Product
1. Open the **Variant Switch** panel.
2. Click **+** or press ++ctrl+n++ to add a Product.
3. A default Part ("base") is created automatically with one empty pool slot.

### :material-shape-plus: Adding States
1. Select the Product.
2. Add a new State (e.g., "Gold").
3. Each State stores a pool index per Part, selecting which material to use.

### :material-link-variant: Assigning Materials
1. Expand a Part to see its material pool.
2. Assign a material to the first empty slot — a new slot auto-creates.
3. Use Blender's native material selector (New, Duplicate, Unlink).

### :material-eye: Previewing Variants
Click the **diamond icon** on any inactive State to immediately apply that variant to the viewport. The active state shows as a filled circle.

### :material-folder-outline: Linking a Part to a Collection
Each Part carries a **collection button** (`tks.vsw_part_collection_popover`) — its tooltip shows the currently linked collection. Click it to pick which collection's objects this Part governs (the Product's own collection must be set first; the Part's collection is chosen from inside it), or ++alt++-click to clear the link. The picker writes through **{{ op('tks.vsw_set_part_collection').bl_label }}** (`tks.vsw_set_part_collection`). The linked collection is what scopes the Part's material pool: switching a variant swaps materials on the objects of that collection.

## :material-shape: Pool-based Variant Model

Variant Switch uses a **single pool-based model** — there isn't a per-Part mode selector. Each Part owns its own ordered list of pool materials, and each Variant stores one pool index per Part. Switching to a Variant simply applies that Variant's pool index to every Part it covers.

- A new Variant is initialised with every Part's pool index at `0` (the first material in each pool).
- Assigning a material into a Part's pool auto-creates the next empty slot.
- Removing all materials from a Part shrinks its pool back down (pool indices on existing Variants are re-clamped).
- Pool sizes can differ between Parts within the same Product — each Part is independent.

## :material-arrow-decision: Variants in the Cascade

Variant Switch states are resolved as part of the [cascade](cascade.md). Each View Layer (or higher tier) can specify which variant is active, enabling different variants per camera angle — and the same 6-tier override chain applies, leaf beating root:

| Tier | Variant popover | Set / clear operators |
|------|-----------------|-----------------------|
| **Global** | `tks.vsw_global_variant_popover` | **{{ op('tks.vsw_set_global_variant').bl_label }}** / **{{ op('tks.vsw_clear_global_variant').bl_label }}** |
| **Scene Group** | `tks.vsw_sg_variant_popover` | Row pickers write the group tier; **{{ op('tks.vsw_group_clear_variant').bl_label }}** empties every member. |
| **Scene** | `tks.vsw_scene_variant_popover` | **{{ op('tks.vsw_set_scene_variant').bl_label }}** / **{{ op('tks.vsw_clear_scene_variant').bl_label }}** |
| **View Layer Group** | `tks.vsw_vlg_variant_popover` | Same pattern as Scene Group, at the VL Group tier. |
| **View Layer** | `tks.vsw_vl_variant_popover` | **{{ op('tks.vsw_set_vl_variant').bl_label }}** / **{{ op('tks.vsw_clear_vl_variant').bl_label }}** |
| **View Layer Version** | `tks.vlv_variant_popover` | **{{ op('tks.vlv_set_variant').bl_label }}** / **{{ op('tks.vlv_clear_variant').bl_label }}** — see [Version Variants](cascade.md#version-variants). |

Every popover shares one anatomy. Each assigned Product gets a row of `[Product ▼] [Variant ▼] [✕]`: the pickers repoint the row (**{{ op('tks.vsw_set_cascade_variant').bl_label }}** pins the variant, **{{ op('tks.vsw_swap_cascade_product').bl_label }}** exchanges the product while keeping the row), and the ✕ removes that product's override at this tier (**{{ op('tks.vsw_delete_cascade_product').bl_label }}**, `tks.vsw_delete_cascade_product`). Rows inherited from a higher tier appear greyed with a link icon — override them locally by picking a variant. **Add Product** (`tks.vsw_add_cascade_product`) appends another row, so a single tier can pin variants for *several products at once*. A **Push to Selected** button appears during multi-selection, fanning the tier's variant value out to every selected View Layer.

The cascade icon itself answers to modifiers: ++alt++-click clears the tier's own override, and ++alt+shift++-click additionally clears every child tier's overrides beneath it (e.g. on the Global icon: every Scene and View Layer).

!!! tip "Variant Tags"
    Assign tags from the "Variant" category to states for organization
    and Smart Output resolution via the `{variant_tag}` token.

## :material-keyboard: Hotkeys

When the Variant Tree is focused:

| Shortcut | Action |
|----------|--------|
| ++ctrl+n++ | Add (smart — Product, State, or Part depending on selection) |
| ++shift+a++ | Add menu (full options) |
| ++f2++ | Rename the selected item |
| ++del++ / ++x++ | Remove (enforces minimum 1 State and 1 Part per Product) |
| ++ctrl+i++ | Invert multi-selection |

Cascade icons on State / Part rows accept the same modifier-clicks as the Takes Tree:

| Shortcut | Action |
|----------|--------|
| ++alt++ + click | Clear the variant override at this tier. |
| ++alt+shift++ + click | Clear the override at this tier **and** on every child tier beneath it. |
| ++shift++ + click | Toggle this variant across all View Layers in the active scene. |

See the [Keyboard Shortcuts](../interface/hotkeys.md) page for the full reference.
