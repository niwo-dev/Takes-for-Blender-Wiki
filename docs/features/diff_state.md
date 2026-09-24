---
icon: material/select-compare
---

# Diff State

**Diff State** colours objects in the 3D viewport by the state they are in. Each state is named
for **where the value comes from**, so the colours read as the cascade itself. It is a view helper
only - nothing is written to the scene or the file.

| State | An object is in it when | Colour |
|---|---|---|
| **Take State** | this take keys it | blue |
| **Parent State** | a tier above keys it: a parent layer under its own keys, an action it inherits, or one it borrows | pink |
| **Rest State** | nothing keys it anywhere, so it sits where the Rest State put it | teal |
| **Drift State** | its live values no longer match where they should be | orange |

The first three are one chain, read top down: a value comes from exactly one of them, so an object
is in exactly one. **Drift State** is a different question and rides on whichever of the three an
object is in.

Objects you pinned, or gave an action to by hand, count as **Take State**: that is your choice,
not something handed down.

!!! note "Rest State is switched off to start with"
    In most files it is most of the scene, so it is a filter you reach for rather than a wash you
    leave on. Switch it on from the same menu as the others.

## :material-map-marker: Where to Find It

- **Navigation header** - the **Diff State** button in the mode row.
- **Viewport Overlays** - a **Diff State** section in Blender's overlay popover.

## :material-menu-down: Pick What You See

Click the **Diff State** button to switch it on or off. ++shift++ + click
opens a small menu: one row per state, then **All**.

| Choice | What the viewport shows |
|---|---|
| **Take State** | Only objects this take keys |
| **Parent State** | Only objects a tier above keys |
| **Rest State** | Only objects nothing keys |
| **Drift State** | Only objects that drifted from the Rest State |
| **All** | Every state that is switched on |

The rows are exclusive: picking one is the whole decision, and the others
switch off. Switched back on, the mode comes back in the choice you last had.
Change that under *Preferences ▸ Interface ▸ Overlay ▸ Mode Row*.

The Overlays section carries the same menu under its **Show States** switch.

## :material-palette: Marks

Each state draws its own marks, set in **Preferences ▸ Interface ▸ Diff State**.

| Mark | What it draws |
|---|---|
| **Box** | The object's bounding box |
| **Outline** | A rim hugging the shape |
| **Fill** | A translucent surface |
| **Empty** | One of Blender's empty shapes at the origin, sized to the object |

Cameras, lights, empties, lattices and armatures are outlined with the shape Blender itself draws for them.

Each state (Take, Parent, Rest, Drift) also has two settings beside its marks:

| Setting | What it does |
|---|---|
| **Random Colour Per Object** | Gives every marked object its own colour, so two neighbours can be told apart. The state still decides which marks are drawn |
| **Empty Size** | How large the **Empty** mark is drawn, compared with the object |

## :material-shape-outline: Per Object Kind

Every object kind can follow the state's master marks or carry its own.

| Button | What it does |
|---|---|
| **Use Own Marks** | Gives this kind its own marks, starting from the master default |
| **Follow Master Default** | Drops the kind's own marks and follows the master again |

A kind with its own marks also has its own **Empty Size**, per state.

??? info "When drift cannot be read"
    A keyed channel's drift is only compared at frame 0, or while **Rest State
    Mode** is on. Off that frame the mode says so in the Overlays section instead
    of painting a wrong colour.

??? info "Both states on one object"
    Drift always wins where both want the same mark. **Drift Priority** decides
    the rest: **All** hands drift the whole object, **Matching** only the marks it
    draws itself.
