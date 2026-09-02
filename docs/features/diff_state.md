---
icon: material/select-compare
---

# Diff State

**Diff State** colours objects in the 3D viewport by the state they are in: **Keyed** (the object holds a slot with keyframes) or **Drifted** (its live values no longer match the Rest State). It is a view helper only - nothing is written to the scene or the file.

## :material-map-marker: Where to Find It

- **Navigation header** - the **Diff State** button in the mode row.
- **Viewport Overlays** - a **Diff State** section in Blender's overlay popover.

## :material-palette: Marks

Each state draws its own marks, set in **Preferences ▸ Interface ▸ Diff State**.

| Mark | What it draws |
|---|---|
| **Box** | The object's bounding box |
| **Outline** | A rim hugging the shape |
| **Fill** | A translucent surface |
| **Empty** | One of Blender's empty shapes at the origin, sized to the object |

Cameras, lights, empties, lattices and armatures are outlined with the shape Blender itself draws for them.

## :material-shape-outline: Per Object Kind

Every object kind can follow the state's master marks or carry its own.

| Button | What it does |
|---|---|
| **Use Own Marks** | Gives this kind its own marks, starting from the master default |
| **Follow Master Default** | Drops the kind's own marks and follows the master again |

??? info "When drift cannot be read"
    A keyed channel's drift is only compared at frame 0, or while **Rest State
    Mode** is on. Off that frame the mode says so in the Overlays section instead
    of painting a wrong colour.

??? info "Both states on one object"
    Drift always wins where both want the same mark. **Drift Priority** decides
    the rest: **All** hands drift the whole object, **Matching** only the marks it
    draws itself.
