---
icon: material/dots-circle
---

# Pie Menus

The addon registers one configurable pie menu — the **Navigation Pie** — for fast switching between the side-panel views without taking your hand off the mouse.

## :material-keyboard: Default Binding

| Shortcut | Action |
|----------|--------|
| ++ctrl+shift+c++ | Open the **Takes Navigation** pie menu (in the 3D Viewport). |

## :material-view-grid: Default Slot Layout

```
       N: Rules
NW: Variants    NE: Tags
W: Tree View       E: Watchlist
SW: Batch Render  SE: Channels
       S: Slotted Mode
```

## :material-format-list-bulleted: Available Slot Actions

Each of the 8 directions can be assigned one of:

| Action | What it toggles |
|--------|-----------------|
| **Tree View** | Context panel (Takes Tree). |
| **Watchlist** | Inspector watchlist. |
| **Slotted Mode** | Slotted-mode panel. |
| **Rules** | Globals → Rules mode. |
| **Variants** | Globals → Variants (Variant Switch). |
| **Tags** | Globals → Tags mode. |
| **Batch Render** | Batch Render panel. |
| **Channels** | Inspector → Channels view. |
| **None** | Empty slot. |

## :material-pencil: Reassigning Slots

*Edit > Preferences > Add-ons > Takes for Blender > Workflow > Pie Menu* — eight enum dropdowns, one per direction. Changing a slot auto-deduplicates: if you assign the same action to two slots, the previously-assigned slot is reset.

## :material-keyboard-settings: Changing the Keybinding

Pie menus are normal Blender keymap entries.

1. *Edit > Preferences > Keymap*.
2. Search for `wm.call_menu_pie`.
3. Find the entry whose menu name is `TKS_MT_PIE_Navigation`.
4. Edit the key, modifiers, or disable the binding.
