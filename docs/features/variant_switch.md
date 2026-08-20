---
icon: material/swap-horizontal
---

# Variant Switch

Show one product in several finishes — Gold, Silver, Matte Black — without rebuilding anything.

Set the looks up once. Takes swaps the materials for you, and every shot can ask for a different one.

## :material-source-branch: Hierarchy

Four words cover the whole system.

| Element | What it is |
|---------|------------|
| **Product** | The whole thing you are showing, such as "Watch". |
| **Part** | One component of it, such as "Strap". Each Part is linked to a collection. |
| **material pool** | The list of materials that Part can wear. |
| **State** | A named look, such as "Gold". Click one to preview it. |

A State remembers one pool entry per Part. Picking a State applies all of them at once.

??? note "State and Variant are the same thing"
    The Variant Tree calls each entry a **State** — the
    **{{ op('tks.vsw_add_state').bl_label }}** button creates one.

    Everywhere the cascade is involved, that same entry is called a **Variant**:
    the per-tier popovers, the Set Variant buttons and the `{variant_tag}` token.

    Selecting a State in the tree and assigning a Variant through the cascade
    write the identical value.

## :material-cursor-default-click: Usage

1. Open the **Variant Switch** panel.
2. Click **+**, or press ++ctrl+n++, to add a Product.
3. Expand the new Part and drop a material into its empty pool slot.
4. Add a State for each finish you need, such as "Gold".

??? info "What you get, and what happens as you fill the pool"
    A new Product arrives ready to use: one Part named **base part**, one starter
    State named **default**, and one empty pool slot.

    Assign a material to the last empty slot and a fresh empty slot appears below
    it, so the pool grows as you work. The material field is Blender's own, so
    **New**, **Duplicate** and **Unlink** behave exactly as you expect.

### :material-eye: Previewing Variants

Click the **diamond** icon on any inactive State to apply that look to the viewport at once.

The State that is currently active shows a filled circle instead.

### :material-folder-outline: Linking a Part to a Collection

Each Part has a **collection button**. Click it to choose which collection's objects this Part controls.

That collection is what the Part's materials are swapped on. ++alt++-click the button to clear the link.

??? info "Picking the collection"
    The Product's own collection must be set first — a Part's collection is chosen
    from inside it. Hover the button to see which collection is linked right now.

    The picker writes through **{{ op('tks.vsw_set_part_collection').bl_label }}**.

## :material-shape: Pool-based Variant Model

There is no mode selector to learn. Every Part owns its own ordered pool of materials.

Each Variant stores one pool position per Part, and switching applies those positions to every Part it covers.

??? info "How pools behave"
    - A new Variant starts on the first material in every Part's pool.
    - Assigning a material into the last empty slot creates the next one.
    - Removing all materials shrinks the pool again, and existing Variants are
      pulled back to a position that still exists.
    - Pools may be different lengths on different Parts of the same Product.

## :material-content-duplicate: Duplicating a Product

**{{ op('tks.vsw_duplicate_product').bl_label }}** copies a Product whole — every Part, every pool and every State.

To build a near-identical product, duplicate it and swap only the materials that differ.

The copy follows [Blender's own duplicate naming](tags.md#duplicate-names), so `Chair` becomes `Chair.001`.

## :material-alert-decagram: Conflicts {: #conflicts }

A switch writes real material slots, so two Products can quietly disagree about the same object.

Takes warns you *before* that happens, through the [variant-conflict badge](../interface/navigation_panel.md#warnings) in the Navigation panel.

??? info "The two kinds of conflict"
    | Conflict | What it means |
    |----------|---------------|
    | **Collapse** | One object carries **two or more different materials from the same pool**. A switch has only one pool position to apply, so both slots end up on one material and the difference is lost. The warning names the object, the slot, the material being replaced and the one replacing it. |
    | **Shared object** | One object is reachable from **two different Products**, through their root collections, Part collections or pool collections. Whichever Product switches last wins, so the result depends on the order you clicked in. |

    Each entry offers two buttons.

    | Button | What it does |
    | -------- | -------------- |
    | **{{ op('tks.vsw_reveal_pool').bl_label }}** | Selects the offending pool in the Variants tree, so you land on the exact Part that needs fixing. |
    | **{{ op('tks.vsw_conflicts_rescan').bl_label }}** | Re-scans every pool and Product. Use it after changing material slots outside the addon. |

??? note "Detection is scoped, not a file sweep"
    Reach is worked out from the Product's own collections only — never a sweep
    over every object in the file — so the scan stays cheap enough to run as you work.

## :material-arrow-decision: Variants in the Cascade

Variants resolve through the [cascade](cascade.md), so a scene, a shot or a single take can each demand a different look.

Click the **variant** icon on any tree row to pick a State for that tier. The same six tiers apply, and the deeper one wins.

??? info "Set and clear buttons, tier by tier"
    | Tier | Set / clear buttons |
    |------|---------------------|
    | **Global** | **{{ op('tks.vsw_set_global_variant').bl_label }}** / **{{ op('tks.vsw_clear_global_variant').bl_label }}** |
    | **Scene Group** | Row pickers write the group tier; **{{ op('tks.vsw_group_clear_variant').bl_label }}** empties every member. |
    | **Scene** | **{{ op('tks.vsw_set_scene_variant').bl_label }}** / **{{ op('tks.vsw_clear_scene_variant').bl_label }}** |
    | **View Layer Group** | Same pattern as Scene Group, at the View Layer Group tier. |
    | **View Layer** | **{{ op('tks.vsw_set_vl_variant').bl_label }}** / **{{ op('tks.vsw_clear_vl_variant').bl_label }}** |
    | **Take** | **{{ op('tks.take_set_variant').bl_label }}** / **{{ op('tks.take_clear_variant').bl_label }}** — see [Take Variants](cascade.md#version-variants). |

??? info "Inside a variant popover"
    Every popover looks the same. Each assigned Product gets a row of
    `[Product ▼] [Variant ▼] [✕]`.

    The left picker exchanges the Product while keeping the row
    (**{{ op('tks.vsw_swap_cascade_product').bl_label }}**), the right one pins the
    variant (**{{ op('tks.vsw_set_cascade_variant').bl_label }}**), and **✕** removes
    that Product's override at this tier
    (**{{ op('tks.vsw_delete_cascade_product').bl_label }}**).

    Rows inherited from a higher tier are greyed and carry a link icon — pick a
    variant to override them here. **Add Product** appends another row, so one tier
    can pin variants for several Products at once. **Push to Selected** appears
    during a multi-selection and fans the tier's value out to every selected View Layer.

??? tip "Variant Tags"
    Give States tags from the **Variant** category to keep them organised and to
    fill the `{variant_tag}` token in [Smart Output](smart_output.md).

## :material-keyboard: Hotkeys

With the Variant Tree focused, ++ctrl+n++ adds the right thing for your selection, and ++f2++ renames it.

??? info "Full list"
    | Shortcut | Action |
    |----------|--------|
    | ++ctrl+n++ | Add — Product, State or Part, depending on the selection. |
    | ++shift+a++ | Add menu, with every option. |
    | ++f2++ | Rename the selected item. |
    | ++del++ / ++x++ | Remove. Every Product keeps at least one State and one Part. |
    | ++ctrl+i++ | Invert the multi-selection. |

    Cascade icons on State and Part rows take the same modifier-clicks as the Takes Tree.

    | Shortcut | Action |
    |----------|--------|
    | ++alt++ + click | Clear the variant override at this tier. |
    | ++alt+shift++ + click | Clear it here **and** on every tier beneath it. |
    | ++shift++ + click | Toggle this variant across all View Layers in the active scene. |

    The full reference lives on [Keyboard Shortcuts](../interface/hotkeys.md).
