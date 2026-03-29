# Inspector Panel

**Location:** *Properties Editor > Takes tab > Inspector*

The Inspector Panel provides a per-object watchlist showing which objects are managed by the cascade system, their assigned actions, slots, and sub-data (materials, node trees, shape keys).

## Managed vs. Pinned

Objects in the watchlist have one of two states:

Managed
:   Follows the cascade system. The object's action is automatically assigned by the active View Layer's cascade.

Pinned
:   Exempt from cascade management. The object keeps its own action regardless of View Layer switches. Pin an object by clicking the **pin icon** on its row.

!!! warning "Unpinning"
    Unpinning an object that has an action will show a confirmation dialog,
    because the action will be replaced by the cascade assignment.

## Watchlist

The watchlist shows all objects relevant to the current View Layer:

| Column | Description |
|--------|-------------|
| **Pin** | Toggle managed/pinned state. |
| **Name** | Object name (click to select in viewport). |
| **Sub-data icons** | Compact icons for each animated datablock (material, node tree, etc.). |

### Compact Mode

In compact mode, sub-data icons appear as a row of small type-aware icons next to each object:

- **Bright icon** — Datablock has an action assigned
- **Dimmed icon** — No action on this datablock

Click any sub-data icon to open a popover for per-datablock action and slot management.

## Filters

Filter the watchlist using the header buttons:

- **Pinned filter** — Show only pinned objects
- **Unpinned filter** — Show only managed objects

Filter icons are disabled (grayed out) when their count is zero.

## Actions & Slots

Select an object in the watchlist to see its action and slot details in the lower section of the Inspector:

- **Actions list** — Shows all actions referencing this object
- **Slots list** — Shows all slots within the active action
- **Inline rename** — Double-click an action or slot name to rename it
