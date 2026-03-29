# Variant Switch

The **Variant Switch** system manages product variants — different material configurations, finishes, or color options — with per-scope material swapping and cascade-aware state management.

## Concept

In product visualization, you often need to render the same product in multiple finishes (Gold, Silver, Matte Black) or configurations. Variant Switch automates the material swapping process.

## Hierarchy

| Element | Description |
|---------|-------------|
| **Product** | The top-level container (e.g., "Watch", "Bottle"). |
| **State** | A named variant (e.g., "Gold", "Silver"). Click to preview. |
| **Part** | A component linked to a collection (e.g., "Body", "Strap"). |
| **Pool** | Material slots available for each part. |

## Usage

### Creating a Product

1. Open the **Variant Switch** panel.
2. Click **+** or press ++ctrl+n++ to add a Product.
3. A default Part ("base") is created automatically with one empty pool slot.

### Adding States

1. Select the Product.
2. Add a new State (e.g., "Gold").
3. Each State stores a pool index per Part, selecting which material to use.

### Assigning Materials

1. Expand a Part to see its material pool.
2. Assign a material to the first empty slot — a new slot auto-creates.
3. Use Blender's native material selector (New, Duplicate, Unlink).

### Previewing Variants

Click the **diamond icon** on any inactive State to immediately apply that variant to the viewport. The active state shows as a filled circle.

## Variant Modes

Variant Switch supports three modes:

=== "Swap"
    Direct material replacement. The simplest mode — Material A becomes Material B.

=== "Preset"
    Apply a material preset in-place via JSON. The material stays the same but its properties change.

=== "Pool"
    Pick from a product-level material palette. Each Part has a pool of materials indexed per State.

## Integration with Cascade

Variant Switch states are resolved as part of the cascade. Each View Layer (or higher tier) can specify which variant state is active, enabling different variants per camera angle.

!!! tip "Variant Tags"
    Assign tags from the "Variant" category to states for organization
    and Smart Output resolution via the `{variant_tag}` token.
