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
3. A default Part named **base part** — plus a starter State named **default** and one empty pool slot — is created automatically.

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
Each Part carries a **collection button** — its tooltip shows the currently linked collection. Click it to pick which collection's objects this Part governs (the Product's own collection must be set first; the Part's collection is chosen from inside it), or ++alt++-click to clear the link. The picker writes through **{{ op('tks.vsw_set_part_collection').bl_label }}**. The linked collection is what scopes the Part's material pool: switching a variant swaps materials on the objects of that collection.

## :material-shape: Pool-based Variant Model

Variant Switch uses a **single pool-based model** — there isn't a per-Part mode selector. Each Part owns its own ordered list of pool materials, and each Variant stores one pool index per Part. Switching to a Variant simply applies that Variant's pool index to every Part it covers.

- A new Variant is initialised with every Part's pool index at `0` (the first material in each pool).
- Assigning a material into a Part's pool auto-creates the next empty slot.
- Removing all materials from a Part shrinks its pool back down (pool indices on existing Variants are re-clamped).
- Pool sizes can differ between Parts within the same Product — each Part is independent.

## :material-content-duplicate: Duplicating a Product

**{{ op('tks.vsw_duplicate_product').bl_label }}** copies a product whole — every Part, every material pool and every State come with it, in one click. It is the fast way to build a second product that shares a structure with the first: duplicate, then swap the materials that differ instead of rebuilding the pools by hand.

The copy is named by [Blender's own duplicate convention](tags.md#duplicate-names), so duplicating `Chair` gives you `Chair.001`.

## :material-alert-decagram: Conflicts {: #conflicts }

A variant switch writes real material slots and visibility flags, so two products can quietly disagree about the same geometry. Takes detects both shapes and warns **before** a switch does something you can't easily see:

| Conflict | What it means |
|----------|---------------|
| **Collapse** | One object carries **two or more distinct materials from the same pool**. A switch has only one pool index to apply, so both slots collapse onto a single material and the distinction is lost. The warning names the object, the slot, the material being replaced and the one replacing it. |
| **Shared object** | One object is reachable from **two different products** — through their root collections, part collections or material-pool collections. Whichever product switches last wins, so the result depends on the order you clicked in. |

Conflicts surface as the [variant-conflict badge](../interface/navigation_panel.md#warnings) in the Navigation panel header, and each entry offers:

| Button | What it does |
| -------- | -------------- |
| **{{ op('tks.vsw_reveal_pool').bl_label }}** | Selects the offending pool in the Variants tree, so you land on the exact Part that needs fixing instead of hunting for it. |
| **{{ op('tks.vsw_conflicts_rescan').bl_label }}** | Re-scans every pool and product. The detection is cached and invalidated as you edit; use this after changing material slots outside the addon. |

!!! note "Detection is scoped, not a file sweep"
    Reach is computed from the product's own collections only — never a sweep over every object in the file — so the scan stays cheap enough to run as you work.

## :material-arrow-decision: Variants in the Cascade

Variant Switch states are resolved as part of the [cascade](cascade.md). Each View Layer (or higher tier) can specify which variant is active, enabling different variants per camera angle — and the same 6-tier override chain applies, leaf beating root:

| Tier | Set / clear buttons |
|------|---------------------|
| **Global** | **{{ op('tks.vsw_set_global_variant').bl_label }}** / **{{ op('tks.vsw_clear_global_variant').bl_label }}** |
| **Scene Group** | Row pickers write the group tier; **{{ op('tks.vsw_group_clear_variant').bl_label }}** empties every member. |
| **Scene** | **{{ op('tks.vsw_set_scene_variant').bl_label }}** / **{{ op('tks.vsw_clear_scene_variant').bl_label }}** |
| **View Layer Group** | Same pattern as Scene Group, at the View Layer Group tier. |
| **View Layer** | **{{ op('tks.vsw_set_vl_variant').bl_label }}** / **{{ op('tks.vsw_clear_vl_variant').bl_label }}** |
| **Take** | **{{ op('tks.take_set_variant').bl_label }}** / **{{ op('tks.take_clear_variant').bl_label }}** — see [Take Variants](cascade.md#version-variants). |

Every tier row also carries a **variant popover** — click the variant icon on the row to pick a state for that tier.

Every popover shares one anatomy. Each assigned Product gets a row of `[Product ▼] [Variant ▼] [✕]`: the pickers repoint the row (**{{ op('tks.vsw_set_cascade_variant').bl_label }}** pins the variant, **{{ op('tks.vsw_swap_cascade_product').bl_label }}** exchanges the product while keeping the row), and the ✕ removes that product's override at this tier (**{{ op('tks.vsw_delete_cascade_product').bl_label }}**). Rows inherited from a higher tier appear greyed with a link icon — override them locally by picking a variant. **Add Product** appends another row, so a single tier can pin variants for *several products at once*. A **Push to Selected** button appears during multi-selection, fanning the tier's variant value out to every selected View Layer.

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
