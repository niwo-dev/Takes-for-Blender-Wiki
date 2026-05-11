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

## :material-shape: Pool-based Variant Model

Variant Switch uses a **single pool-based model** — there isn't a per-Part mode selector. Each Part owns its own ordered list of pool materials, and each Variant stores one pool index per Part. Switching to a Variant simply applies that Variant's pool index to every Part it covers.

- A new Variant is initialised with every Part's pool index at `0` (the first material in each pool).
- Assigning a material into a Part's pool auto-creates the next empty slot.
- Removing all materials from a Part shrinks its pool back down (pool indices on existing Variants are re-clamped).
- Pool sizes can differ between Parts within the same Product — each Part is independent.

## :material-arrow-decision: Cascade Integration

Variant Switch states are resolved as part of the cascade. Each View Layer (or higher tier) can specify which variant state is active, enabling different variants per camera angle.

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
| ++shift++ + click | Toggle this variant across all View Layers in the active scene. |

See the [Keyboard Shortcuts](../interface/hotkeys.md) page for the full reference.
