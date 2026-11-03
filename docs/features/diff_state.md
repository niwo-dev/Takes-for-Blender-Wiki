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
| **Rest State** | it has keys in the Rest action | teal |
| **Drift State** | its live values no longer match where they should be | orange |

The first three are one chain, read top down: a value comes from exactly one of them, so an object
is in exactly one. **Drift State** is a different question and rides on whichever of the three an
object is in.

Objects you pinned, or gave an action to by hand, count as **Take State**: that is your choice,
not something handed down.

All four states are on to start with. **Rest State** only marks objects while Rest State Mode is
on, because outside it the Rest keys cover most of a scene. Change that with **Show Rest State**
under [Preferences](#preferences).

## :material-map-marker: Where to Find It

- **Navigation header** - the **Diff State** button in the mode row.
- **Viewport Overlays** - a **Diff State** section in Blender's overlay popover.

## :material-menu-down: Pick What You See

Click the **Diff State** button to switch it on or off. ++shift++ + click
opens a small menu: one row per state, then a line, then **Show All States**.

| Choice | What the viewport shows |
|---|---|
| **Take State** | Only objects this take keys |
| **Parent State** | Only objects a tier above keys |
| **Rest State** | Only objects nothing keys |
| **Drift State** | Only objects that drifted from the Rest State |
| **Show All States** | All four states at once, Rest State included |

The rows are exclusive: picking one is the whole decision, and the others
switch off. Switched back on, the mode comes back in the choice you last had.
Change that under *Preferences ▸ Interface ▸ Overlay ▸ Mode Row*.

The Overlays section carries the same menu under its **Show States** switch.

## :material-palette: Marks

Each state draws its own marks, set in **Preferences ▸ Interface ▸ Overlay ▸ Diff States**. A tab row there picks one state at a time, and each tab wears a dot in that state's colour. The marks table stays on the page; what a mark looks like sits behind the pencil on its row.

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
    Drift always wins where both want the same mark. **When Both Apply** decides
    the rest: **Everything** hands drift the whole object, **Matching Marks Only** only the marks it
    draws itself.

## :material-cog: Preferences

Under **Preferences ▸ Interface ▸ Overlay ▸ Diff States**, below the state tabs.

| Setting | Default | What it does |
|---|---|---|
| **Shape Refresh** | Auto | How an outline follows a deforming shape. **Auto** follows it while that stays cheap and holds the last shape when it does not. **Live** rebuilds it every frame. **On Stop** holds the last shape while the animation plays and rebuilds once when it stops |
| **Frame Budget (ms)** | 8 | How long **Auto** may spend rebuilding outlines in one frame. Greyed out unless **Shape Refresh** is **Auto** |
| **Hide While Playing** | Off | Draws no marks while the animation plays. They come back when it stops |
| **When Both Apply** | Everything | What drift takes over on an object that is both keyed and drifted |
| **Show Rest State** | In Rest State Mode | When Rest State marks Rest keys: **In Rest State Mode**, **When Tree Has Action** (also when the tree assigns or inherits an action to the take you look at) or **Always** |
| **Show In Overlays Menu** | On | Shows the Diff State switch in Blender's Overlays menu |

The marks and the process banner also hide while Blender's **Show Overlays** switch is off. A foreground Batch Render switches Diff State off for its run; the states that were on come back afterwards.
