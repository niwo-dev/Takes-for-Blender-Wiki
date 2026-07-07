---
icon: material/cog
---

# Preferences

**Location:** *Edit > Preferences > Add-ons > Takes for Blender*.

The preferences are organised into four top-level tabs — **Workflow**, **Interface**, **Data**, **Debug** — each with sub-tabs. Most settings auto-save via the *Autosave Preferences* mechanism (see [Save Mode](data.md#addon)).

!!! tip "Search the preferences"
    The header row of the preferences has a **Search** field (magnifier icon,
    beside the solo-accordion toggle). As you type, settings that don't match
    are dimmed — and so are whole sub-tabs and tabs with no match, so you can
    see at a glance where a setting lives. Empty the field
    (*{{ op('tks.clear_pref_search').bl_label }}*) to bring everything back.

<div class="grid cards" markdown>

-   :material-cog-play:{ .lg .middle } **Workflow**

    ---

    Render behaviour, automations, naming templates, pie menu slot mapping, and the hotkey reference.

    [:octicons-arrow-right-24: Workflow Tab](workflow.md)

-   :material-view-dashboard:{ .lg .middle } **Interface**

    ---

    Confirmation dialogs, list row heights, column visibility, tree appearance.

    [:octicons-arrow-right-24: Interface Tab](ui.md)

-   :material-database:{ .lg .middle } **Data**

    ---

    Preset storage tiers, shared / project / local folder paths, and where the addon's own preferences JSON lives.

    [:octicons-arrow-right-24: Data Tab](data.md)

-   :material-bug:{ .lg .middle } **Debug**

    ---

    Logging master switch, log file location, per-topic filters.

    [:octicons-arrow-right-24: Debug Tab](debug.md)

-   :material-incognito:{ .lg .middle } **Advanced**

    ---

    Hidden / side-effect settings and how to reset preferences back to defaults.

    [:octicons-arrow-right-24: Advanced](advanced.md)

</div>

## :material-folder-cog: Preference Configurations

The preferences live in a JSON file whose location is set by *Save Mode* (see [*Data > Addon*](data.md#addon)). These actions manage that file and its sibling configs. They appear next to the **Config File** picker on the *Data > Addon* sub-tab.

| Button | Operator | What it does |
|--------|----------|--------------|
| **New Configuration** | `tks.new_preference_config` | Prompts for a filename and writes a fresh `*.json` config — pre-filled with default values — into the directory for the current *Save Mode* tier (ADDON / PROJECT / SHARED / LOCAL), then switches to it. Refuses to overwrite an existing file. |
| **Create Project Preferences** | `tks.init_project_prefs` | One-click project setup: creates a `presets/` folder next to the saved `.blend`, links it to the scene's World so the PROJECT tier resolves there, switches *Save Mode* to PROJECT, and writes your current settings into `presets/user_preferences.json`. The `.blend` must be saved first. |
| **Open Config Folder** | `tks.open_config_folder` | Opens the folder that holds the active preferences config file in your system file browser. |
| **{{ op('tks.duplicate_preference_config').bl_label }}** | `tks.duplicate_preference_config` | Copies the active config to a new file (pre-filled `*_copy` name, editable), then switches to the copy. Refuses to overwrite an existing file. |
| **{{ op('tks.delete_preference_config').bl_label }}** | `tks.delete_preference_config` | Deletes the active config file — after a confirmation, gated by the *Override Persistence* setting — and switches to the next config in the same folder, if one exists. |
| **{{ op('tks.rename_project_prefs_file').bl_label }}** | `tks.rename_project_prefs_file` | Renames the current project preferences file on disk (PROJECT save mode). |

!!! note "Project preferences travel with the .blend"
    **Create Project Preferences** is the fastest way to give a single project its
    own settings. Because the folder is linked through the scene's World, anyone
    who opens that `.blend` (and points *Save Mode* at PROJECT) loads the same
    config — handy for shared shot files.

### :material-content-save: Manual Save / Load / Reset

With *Autosave Preferences* **on** (the default) you never need these. Switch
autosave off and a three-button row below it takes over:

| Button | Operator | What it does |
|--------|----------|--------------|
| **{{ op('tks.save_preferences').bl_label }}** | `tks.save_preferences` | Writes the portable settings to the active config file, and the machine-specific values (folder paths, save mode) to a separate machine-state file that shared configs never overwrite. |
| **{{ op('tks.load_preferences').bl_label }}** | `tks.load_preferences` | Re-reads the active config file from disk, replacing the current in-memory settings. |
| **{{ op('tks.reset_preferences').bl_label }}** | `tks.reset_preferences` | Puts every saveable preference back to its default value — after a confirmation, gated by the *Override Persistence* setting. |

### :material-map-legend: Storage Legend

The **Configuration Inspector** (below the Addon section on *Data > Addon*)
lists every preference with a small icon telling you where that value lives.
The inspector's collapsible *Legend* explains each icon — the entries are
informational buttons, so hovering any of them shows the full explanation:

| Icon | Legend entry | Meaning |
|------|--------------|---------|
| :material-check: | **{{ op('tks.legend_portable').bl_label }}** | Serialized to the active config JSON — identical on every machine that shares the file. |
| :material-lock: | **{{ op('tks.legend_machine').bl_label }}** | Tied to this Blender installation (file paths and the like) — never overwritten when a shared config is loaded. |
| :material-eye: | **{{ op('tks.legend_temp').bl_label }}** | Volatile UI expansion toggles and internal flags — reset on every Blender restart. |
| :material-alert-circle: | **{{ op('tks.legend_internal').bl_label }}** | Blender's own internal RNA properties, outside the add-on's configuration scope. |

## :material-format-text: Naming-Template Repair

The [naming templates](workflow.md#syntax) on the *Workflow > Syntax* sub-tab only accept tokens in the required `{curly}` format, and only tokens that are valid for that particular template. When a field contains a problem, a small fix-up action appears in its ▾ row popover.

| Button | Operator | What it does |
|--------|----------|--------------|
| **Fix Token Format** | `tks.fix_token_format` | Converts wrong-format tokens (for example `[scene]`) into the required `{scene}` curly-brace style. Operates on one field, or on every template when no field is targeted. |
| **Remove Invalid Tokens** | `tks.strip_invalid_tokens` | Strips any token that is not valid for a given template, then tidies up the leftover separators (collapses doubled `_` / spaces, trims the ends). |

!!! tip "Context-aware tooltips"
    When a field actually contains a problem, the button tooltip names the exact
    offending tokens (e.g. *"Wrong format: `[scene]`. Click to convert to `{curly}`
    braces"*), so you can see what will change before clicking.

## :material-wrench: Maintenance

| Button | Operator | What it does |
|--------|----------|--------------|
| **Scan Properties** | `tks.scan_property_patterns` | Scans the current `.blend` for every unique custom-property key (on objects, bones, scenes, etc.), tags each as Blender-native or addon-added, and fills the cleanup list with counts and sample values. Use it before clearing unwanted custom properties. |
| **Hide these notice boxes** | `tks.dismiss_info_boxes` | The ✕ on a tip or warning info box. Hides every box of that kind throughout the add-on at once (tips, or warning-detail boxes). Re-enable them later under *Preferences → Interface → Confirmations*. |

## :material-lifebuoy: Support & Developer

| Button | Operator | What it does |
|--------|----------|--------------|
| **Preview Sound** | `tks.preview_render_sound` | Plays the currently selected render-completion sound so you can audition it without running a render. Respects the *Enable Render Sounds* switch. See [render sounds](workflow.md#render). |
| **Email Dev Support** | `tks.email_support` | Opens your default mail client with a pre-filled support ticket — subject line stamped with the add-on and Blender versions, and a reminder to attach the exported log. |
| **Reload Addon** | `tks.reload_addon` | Clears the Python bytecode cache and safely disables + re-enables the add-on, picking up any code changes without restarting Blender. Intended for development; for a deeper reset see [Rebuild Cache & Reload Addon](advanced.md#rebuild-cache). |

!!! warning "Reload vs. restart"
    **Reload Addon** rebuilds the add-on's runtime state in place. After editing
    the add-on's Python files, a full Blender restart is still the most reliable
    way to reload deeply-nested submodules.
