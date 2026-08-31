---
icon: material/cog
---

# Preferences

Open them under *Edit > Preferences > Add-ons > Takes for Blender*.

Four tabs hold every setting: **Workflow**, **Interface**, **Data** and **Developer**. Each splits into sub-tabs.

Your changes save themselves as you make them. [Save Mode](data.md#add-on) decides where they land.

<div class="grid cards" markdown>

-   :material-cog-play:{ .lg .middle } **Workflow**

    ---

    Render behaviour, automations, naming templates, pie menu slots, hotkeys.

    [:octicons-arrow-right-24: Workflow Tab](workflow.md)

-   :material-view-dashboard:{ .lg .middle } **Interface**

    ---

    Confirmation dialogs, list row heights, column visibility, tree appearance.

    [:octicons-arrow-right-24: Interface Tab](ui.md)

-   :material-database:{ .lg .middle } **Data**

    ---

    Preset storage tiers, shared / project / local folder paths, and where your settings file lives.

    [:octicons-arrow-right-24: Data Tab](data.md)

-   :material-bug:{ .lg .middle } **Developer**

    ---

    Logging controls, per-topic filters, and the Icon Sheet for browsing Blender's icons.

    [:octicons-arrow-right-24: Developer Tab](debug.md)

-   :material-incognito:{ .lg .middle } **Advanced**

    ---

    Hidden side-effect settings, and how to reset everything back to defaults.

    [:octicons-arrow-right-24: Advanced](advanced.md)

</div>

??? tip "Can't find a setting? Search for it."
    The header row has a **Search** field, next to the solo-accordion toggle.
    As you type, anything that doesn't match goes dim — whole tabs and sub-tabs
    included. So you can see at a glance where a setting lives.

    Empty the field (**{{ op('tks.clear_pref_search').bl_label }}**) to bring everything back.

## :material-folder-cog: Preference Configurations

Your settings live in a config file. *Save Mode* on [*Data > Add-on*](data.md#add-on) picks the folder.

Buttons beside the **Config File** picker on that same sub-tab manage the file and its siblings.

??? info "Every configuration button"
    | Button | What it does |
    | -------- | -------------- |
    | **{{ op('tks.new_preference_config').bl_label }}** | Asks for a filename, then writes a fresh config full of default values into the current *Save Mode* folder (Add-on, Project, Shared or Local) and switches to it. It refuses to overwrite an existing file. |
    | **{{ op('tks.init_project_prefs').bl_label }}** | One-click project setup. It creates a **presets** folder beside your saved `.blend`, links it through the scene's World, switches *Save Mode* to Project, and writes your current settings there. Save the `.blend` first. |
    | **{{ op('tks.open_config_folder').bl_label }}** | Opens the folder holding the active config file in your system file browser. |
    | **{{ op('tks.duplicate_preference_config').bl_label }}** | Copies the active config to a new file, with an editable name pre-filled, then switches to the copy. It refuses to overwrite an existing file. |
    | **{{ op('tks.delete_preference_config').bl_label }}** | Deletes the active config file after a confirmation, gated by the *Override Persistence* setting. It then switches to the next config in that folder, if there is one. |
    | **{{ op('tks.rename_project_prefs_file').bl_label }}** | Renames the current project preferences file on disk, in Project save mode. |

    **Project preferences travel with the .blend.** Because the folder is linked
    through the scene's World, anyone who opens that file loads the same settings —
    as long as their *Save Mode* points at Project. Handy for shared shot files.

### :material-content-save: Manual Save / Load / Reset

With *Autosave Preferences* on — the default — you never touch these. Switch autosave off and a three-button row takes over.

??? info "What the three buttons do"
    | Button | What it does |
    | -------- | -------------- |
    | **{{ op('tks.save_preferences').bl_label }}** | Writes the portable settings to the active config file. Machine-specific values, like folder paths and save mode, go to a separate file that shared configs never overwrite. |
    | **{{ op('tks.load_preferences').bl_label }}** | Re-reads the active config file from disk and replaces your current settings. |
    | **{{ op('tks.reset_preferences').bl_label }}** | Puts every saveable preference back to its default, after a confirmation gated by the *Override Persistence* setting. |

### :material-map-legend: Storage Legend

The **Configuration Inspector** sits below the Add-on section on *Data > Add-on*. It lists every preference with a small icon.

That icon tells you where the value is stored. Open the inspector's *Legend* to read them, or hover an entry for the full explanation.

??? info "What the four icons mean"
    | Icon | Legend entry | Meaning |
    |------|--------------|---------|
    | :material-check: | **{{ op('tks.legend_portable').bl_label }}** | Saved into the active config file — identical on every machine that shares it. |
    | :material-lock: | **{{ op('tks.legend_machine').bl_label }}** | Tied to this Blender installation, like folder paths. Loading a shared config never overwrites it. |
    | :material-eye: | **{{ op('tks.legend_temp').bl_label }}** | Panel expansion toggles and other short-lived flags. They reset every time Blender restarts. |
    | :material-alert-circle: | **{{ op('tks.legend_internal').bl_label }}** | Blender's own settings, outside the add-on's configuration. |

## :material-format-text: Naming-Template Repair

The [naming templates](workflow.md#syntax) on *Workflow > Syntax* only accept tokens in `{curly}` braces. Each template also accepts only its own tokens.

When a field holds a bad token, a fix-up button appears in its ▾ row popover.

??? info "The two repair buttons"
    | Button | What it does |
    | -------- | -------------- |
    | **Fix Token Format** | Converts wrong-format tokens, such as `[scene]`, into the `{scene}` curly-brace style. It works on one field, or on every template when you target none. |
    | **Remove Invalid Tokens** | Strips any token that template doesn't accept. It then tidies the leftovers, collapsing doubled underscores or spaces and trimming the ends. |

    **The tooltips name the culprit.** When a field really holds a problem, the
    button tooltip names the exact offending tokens. So you see what will change
    before you click.

## :material-wrench: Maintenance

Housekeeping buttons, each living on the tab it belongs to.

They scan custom properties, tidy stale presets, and open the folders the add-on writes into.

??? info "Every maintenance button"
    | Button | What it does |
    | -------- | -------------- |
    | **Scan Properties** | Scans your `.blend` for every custom-property key on objects, bones, scenes and the rest. It tags each as Blender-native or added by the add-on, then fills the cleanup list with counts and sample values. Run it before clearing anything. |
    | **{{ op('tks.cleanup_incompatible_presets').bl_label }}** | Quarantines render presets whose format no longer matches this add-on version, so they stop cluttering your preset lists — see [Render Presets](../features/render_presets.md). |
    | **{{ op('tks.open_addon_presets_folder').bl_label }}** / **{{ op('tks.open_project_presets_folder').bl_label }}** | Open the add-on-wide or per-project render-preset folder in your file browser. These are the two tiers under *Data > Storage*. |
    | **{{ op('tks.open_snapshots_folder').bl_label }}** | Opens the folder holding the safety copies of your take data. It sits beside the read-only path under *Data > Snapshots & Recovery* — see [Snapshots & Recovery](data.md#snapshots). |
    | **Hide these notice boxes** | The ✕ on a tip or warning box. It hides every box of that kind across the whole add-on at once. Bring them back under *Preferences > Interface > Confirmations*. |

## :material-lifebuoy: Support & Developer

**Preview Sound** plays your render-completion sound so you can audition it without rendering.

**Email Dev Support** opens your mail client with a support ticket ready to send. **Reload Add-on** picks up code changes without restarting Blender.

??? info "The fine print"
    **Preview Sound** respects the *Enable Render Sounds* switch — see
    [render sounds](workflow.md#render).

    **Email Dev Support** stamps the subject line with your add-on and Blender
    versions, and reminds you to attach the exported log.

    **Reload Add-on** clears the cached Python bytecode, then disables and
    re-enables the add-on. It is meant for development. For a deeper reset, see
    [Rebuild Cache & Reload Add-on](advanced.md#rebuild-cache).

??? warning "Reload or restart?"
    **Reload Add-on** rebuilds the add-on's runtime state in place. That is enough
    most of the time.

    After editing the add-on's own Python files, a full Blender restart is still
    the most reliable way to load everything fresh.
