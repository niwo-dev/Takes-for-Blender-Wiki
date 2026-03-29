# Variant Tree

**Location:** *Properties Editor > Takes tab > Variant Switch*

The Variant Tree manages product variants — different material configurations, color options, or states of your product. It uses a hierarchical structure of Products, States, and Parts.

## Hierarchy

```mermaid
graph TD
    P[Product] --> S1[State A]
    P --> S2[State B]
    S1 --> PA[Part: Body]
    S1 --> PB[Part: Cap]
    S2 --> PC[Part: Body]
    S2 --> PD[Part: Cap]
    PA --> M1[Material Pool]
    PB --> M2[Material Pool]
```

Product
:   The top-level container (e.g., "Bottle", "Watch").

State
:   A named variant of the product (e.g., "Gold", "Silver", "Matte Black").

Part
:   A component of the product linked to a collection (e.g., "Body", "Cap", "Strap").
    Each part has a material pool with indexed slots.

## Usage

### Switching Variants

Click the **diamond icon** on any inactive state to immediately preview that variant in the viewport. The active state shows as a filled circle.

### Material Pool

Each Part has a material pool — a list of materials that can be swapped in:

1. Assign a material to the first empty slot (a new slot auto-creates).
2. Use the **pool index** to select which material is active for that part.
3. When switching states, the system swaps materials according to each state's pool index.

### Collection Assignment

Each Part is linked to a Blender collection. All objects in that collection (and child collections) receive the material swap.

## Variant Tags

States can be tagged with the **Variant** tag category for organization and Smart Output token resolution via `{variant_tag}`.
