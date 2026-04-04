---
icon: material/keyboard
---

# Keyboard Shortcuts

All hotkeys are active when the cursor is over the **3D Viewport sidebar** (N-panel).
Hotkeys that share the same key across lists are **focus-aware** — only the currently visible/active list responds.

---

### Generic (All Lists)

| Shortcut | Action | Notes |
|----------|--------|-------|
| <kbd>Ctrl</kbd> + <kbd>I</kbd> | **Invert Selection** | Only active when multi-select mode is enabled. Inverts the current selection across the focused list. |

---

### Navigation Panel (Takes Tree)

| Shortcut | Action | Notes |
|----------|--------|-------|
| <kbd>DEL</kbd> / <kbd>X</kbd> | **Delete Item** | Removes the selected Scene, View Layer, or Group. Shows a confirmation dialog. In multi-select mode, batch-deletes all selected items. |
| <kbd>Ctrl</kbd> + <kbd>N</kbd> | **Add** | Opens the Add menu to create a new Scene or View Layer. |
| <kbd>F2</kbd> | **Rename** | Opens a rename dialog for the selected item. |
| <kbd>Ctrl</kbd> + <kbd>G</kbd> | **Group** | Groups the selected items into a Scene Group or VL Group. |
| <kbd>Alt</kbd> + <kbd>G</kbd> | **Ungroup** | Removes the selected item from its group. |
| <kbd>Ctrl</kbd> + <kbd>T</kbd> | **Retarget** | Opens the retarget dialog for the selected Scene or View Layer. |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>I</kbd> | **Set Reference** | Sets the reference default for the selected item. |

---

### Variant Tree

| Shortcut | Action | Notes |
|----------|--------|-------|
| <kbd>DEL</kbd> / <kbd>X</kbd> | **Remove Item** | Removes the selected Product, State, Part, or Pool Material. Enforces minimum 1 State and 1 Part per Product. |
| <kbd>Ctrl</kbd> + <kbd>N</kbd> | **Smart Add** | Context-aware add: auto-detects what to create based on the current selection. If a State header or State is selected, adds a State. If a Part or Pool Material is selected, adds a Pool Material. If a Product is selected, shows the full add menu. |
| <kbd>F2</kbd> | **Rename** | Opens a rename dialog for the selected Product, State, or Part. |

---

### Multi-Select Mode

Multi-select mode is activated by clicking the **☐** toggle in the stats row of any list.

| Shortcut | Action | Notes |
|----------|--------|-------|
| <kbd>Shift</kbd> + Click (toggle) | **Select All** | Selects all visible items. Respects active type filters. |
| <kbd>Alt</kbd> + Click (toggle) | **Invert** | Inverts the current selection. |
| <kbd>Ctrl</kbd> + <kbd>I</kbd> | **Invert** | Same as Alt+Click — keyboard shortcut for invert. |
| Click stat icon | **Type Filter** | Filters checkboxes to a specific type (e.g., only Scenes, only States). Click again to clear. |
