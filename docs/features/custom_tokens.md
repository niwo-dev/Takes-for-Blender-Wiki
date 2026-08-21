---
title: Custom Tokens
icon: material/code-braces
---

# Custom Tokens

**Custom Tokens** are your own [Smart Output](smart_output.md) tokens, built from live scene data. No scripting.

You pick a *source*, say what to read, and give it a name. From then on `[yourtoken]` works in render paths like any built-in token.

They live in **Preferences → Takes for Blender → Workflow → Token**, next to a reference list of every built-in token.

??? tip "Why you'd want this"
    The built-ins cover the common cases. Custom tokens cover *your* cases: the
    focal length as a bare number for lens-based folders, your studio and client
    names, a per-layer sample override, the color view transform in the filename
    of look-dev renders — anything a render path should carry that the built-ins
    don't.

## :material-school: Tutorial — your first custom token

Let's build `[lens]`. It resolves to the active camera's focal length (`50`, `85`, …).

1. Open **Preferences → Takes for Blender → Workflow → Token**.
2. In **Custom Tokens**, click **Add › Category**. Name it `Camera Rig`, pick an icon, type `lens`, and confirm.
3. Click the token's **pencil**. Set **Source** to `Camera`, **Reads** to `data.lens`, **Format** to `.0f`.
4. Watch the **Now:** line under the fields. It resolves while you type. `Now: 50` means you are done.
5. Type `[lens]` into any render output path, or click it in the **Build Syntax** popover.

The loop is always the same: category → token → source, reads, format → check **Now:** → use it.

??? info "The finished path"
    ```
    //renders/[scene]/[lens]mm/[proj]_[variant]_####
    ```

    renders to `//renders/ShotA/50mm/MyProject_Red_0001.png`.

    Custom categories appear after the built-ins in the **Build Syntax** grid.

??? info "How the *Reads* path works"
    The path is a chain of names separated by dots, starting **from the source**.

    - Source `Camera` + `data.lens` → camera object → its `data` (the camera
      datablock) → `lens`.
    - Source `Scene` + `world.mist_settings.depth` → scene → its world → mist
      settings → depth.

    Three rules make a good path:

    1. **End at a single value** — a number, a text, or an on/off. A datablock at
       the end (like `parent` or `focus_object`) is fine too: it resolves to its
       **name**. Don't end on a list or a color — you'd get raw data dumps in
       your filename.
    2. **Only letters, digits, dots and underscores.** No brackets, no
       parentheses, no function calls — the token system *reads* values, it never
       runs anything.
    3. **When in doubt, hover it in Blender.** Enable *Python Tooltips*
       (Preferences → Interface), hover any property, and the tooltip shows its
       path — e.g. `Camera.dof.aperture_blades`. Drop the datablock prefix and
       use what remains, seen from your chosen source.

??? info "The six sources"
    | Source | Reads from | Path example |
    |--------|-----------|--------------|
    | **Scene** | the active scene | `unit_settings.scale_length` |
    | **View Layer** | the active view layer | `samples` |
    | **Render** | the scene's render settings | `image_settings.color_mode` |
    | **Camera** | the scene's active camera *object* | `data.lens`, `location.z` |
    | **Fixed Text** | nothing — the path field IS the value | `MyStudio` |
    | **Assigned Tag — Scene / View Layer** | the Tag assigned via [Tags](tags.md) | *(no path needed)* |

??? info "Format specs"
    **Format** is optional. It is a standard Python format spec applied to the value.

    | Spec | Turns | Into |
    |------|-------|------|
    | `.0f` | `49.9999` | `50` |
    | `.2f` | `3.14159` | `3.14` |
    | `03d` | `7` | `007` |
    | `+.1f` | `0.5` | `+0.5` |

    A spec that doesn't fit the value is ignored rather than breaking the path.

## :material-folder-cog: Managing your tokens

Every token row carries a **pencil** to edit it, a **★** to favourite it, a **👁** to hide it, and an **✕** to delete it.

Categories are only labels. Click a category title to rename the group, or its icon to pick a new one.

??? info "Every control on a token row"
    - **Editing** — the **pencil** ({{ op('tks.custom_token_edit').bl_label }})
      opens the edit dialog, with live validation and a **Now:** preview of what
      the token resolves to in the current scene.
    - **Categories are labels** — a category exists as long as one token carries
      it. Click a **category title** to rename the whole group inline (invalid
      names snap back). The **pencil** on the category row
      ({{ op('tks.custom_token_edit_category').bl_label }}) renames it with error
      messages and picks its icon. A token's own Category field in the edit
      dialog moves *just that token*. Category headers expand and collapse on
      click ({{ op('tks.custom_token_toggle_category').bl_label }}).
    - **Icon browser** — click a category's icon to browse the full icon library,
      grouped and searchable. Picking a cell applies it
      ({{ op('tks.custom_token_set_category_icon').bl_label }}).
    - **★ / 👁** — star favourites
      ({{ op('tks.custom_token_toggle_favorite').bl_label }}) and hide tokens
      ({{ op('tks.custom_token_toggle_hidden').bl_label }}). The **Build Syntax**
      grid can filter to favourites, and to built-in or custom views.
    - **Deleting** — the row's **✕**
      ({{ op('tks.custom_token_remove').bl_label }}) asks for confirmation, like
      every other delete in the addon. The toggle lives in Preferences →
      Interface → Confirmations → Globals → *Delete Custom Token*.
    - **⚠ rows** — a stored token whose name clashes with a built-in (possible
      via presets from older versions) shows a warning instead of a misleading
      preview. Built-ins always win a name clash.

## :material-content-save: Token Presets

The preset row at the top of the Token tab saves and loads **named sets** of your custom tokens.

Two sets ship with your install: **Starter Pack** (16 essentials) and **Example Library** (all 50 below). Load either via **Select**.

??? info "Where sets are stored"
    A set holds the token definitions plus the category icons. Sets sit in the
    same tiered folders as render presets: **Project / Local / Shared /
    Add-on**. So a set can travel with a `.blend` project, or be shared with a
    team.

## :material-puzzle: Third-party addon data

Custom tokens can read properties that **other addons** add to the Scene, View Layer, Render settings or Camera. That covers most well-behaved addons, Cycles included.

??? info "Examples, and what is out of reach"
    - Source `Scene` + `cycles.device` → `GPU`
    - Source `Scene` + `eevee.taa_render_samples` → `64`
    - Source `Scene` + `my_physics_addon.wind_strength` → whatever that addon stores

    Not reachable: bracket-style custom properties (from the *Custom Properties*
    panel — those aren't attributes), objects other than the active camera, and
    other addons' preferences.

## :material-shield-check: Safety

Reading a token is a strict read-only walk. Nothing from the path is ever run.

A wrong path can't crash anything. The token resolves to nothing and shows dimmed until you fix it.

## :material-library: Example Library — 50 tokens to learn from

Fifty ready-made recipes, all verified against live Blender data. Load them in one click via the **Example Library** preset, or open a category below and copy just the ones you need.

??? info "Camera Rig — 14 tokens (Source: Camera)"
    | Token | Reads | Format | Example |
    |-------|-------|--------|---------|
    | `[lens]` | `data.lens` | `.0f` | `50` |
    | `[sensor]` | `data.sensor_width` | `.0f` | `36` |
    | `[cam_type]` | `data.type` | | `PERSP` |
    | `[cam_height]` | `location.z` | `.1f` | `1.7` |
    | `[dof_dist]` | `data.dof.focus_distance` | `.2f` | `3.20` |
    | `[cam_x]` | `location.x` | `.1f` | `-4.2` |
    | `[clip_start]` | `data.clip_start` | `.2f` | `0.10` |
    | `[clip_end]` | `data.clip_end` | `.0f` | `1000` |
    | `[shift_x]` | `data.shift_x` | `.2f` | `0.00` |
    | `[blades]` | `data.dof.aperture_blades` | | `0` |
    | `[dof_on]` | `data.dof.use_dof` | | `True` |
    | `[rig]` | `parent.name` | | `CamRig` *(dims when unparented)* |
    | `[focus_obj]` | `data.dof.focus_object.name` | | `Hero` *(dims when unset)* |
    | `[camname]` | `data.name` | | `ShotCam.001` |

??? info "Color & Look — 4 tokens (Source: Scene)"
    | Token | Reads | Format | Example |
    |-------|-------|--------|---------|
    | `[view_xform]` | `view_settings.view_transform` | | `AgX` |
    | `[exposure]` | `view_settings.exposure` | `+.1f` | `+0.5` |
    | `[gamma]` | `view_settings.gamma` | `.2f` | `1.00` |
    | `[display]` | `display_settings.display_device` | | `sRGB` |

??? info "Scene & Units — 6 tokens (Source: Scene)"
    | Token | Reads | Format | Example |
    |-------|-------|--------|---------|
    | `[worldname]` | `world.name` | | `Sky_Dusk` |
    | `[unit_scale]` | `unit_settings.scale_length` | `.2f` | `1.00` |
    | `[units]` | `unit_settings.system` | | `METRIC` |
    | `[framestep]` | `frame_step` | | `1` |
    | `[gravity]` | `gravity.z` | `.1f` | `-9.8` |
    | `[autokey]` | `tool_settings.use_keyframe_insert_auto` | | `False` |

??? info "World — 2 tokens (Source: Scene)"
    | Token | Reads | Format | Example |
    |-------|-------|--------|---------|
    | `[mist_depth]` | `world.mist_settings.depth` | `.0f` | `25` |
    | `[world_nodes]` | `world.use_nodes` | | `True` |

??? info "Render Settings — 7 tokens (Source: Render)"
    | Token | Reads | Format | Example |
    |-------|-------|--------|---------|
    | `[threads]` | `threads` | | `16` |
    | `[aspect_x]` | `pixel_aspect_x` | `.1f` | `1.0` |
    | `[film_alpha]` | `film_transparent` | | `False` |
    | `[persist_data]` | `use_persistent_data` | | `True` |
    | `[simplify]` | `use_simplify` | | `False` |
    | `[fps_base]` | `fps_base` | `.2f` | `1.00` |
    | `[stamp_note]` | `stamp_note_text` | | `approved_v2` |

??? info "Output Format — 2 tokens (Source: Render)"
    | Token | Reads | Format | Example |
    |-------|-------|--------|---------|
    | `[color_mode]` | `image_settings.color_mode` | | `RGBA` |
    | `[quality]` | `image_settings.quality` | | `90` |

??? info "Engine — 4 tokens from addon-registered properties (Source: Scene)"
    | Token | Reads | Format | Example |
    |-------|-------|--------|---------|
    | `[render_device]` | `cycles.device` | | `GPU` |
    | `[vp_samples]` | `cycles.preview_samples` | | `1024` |
    | `[denoise]` | `cycles.use_denoising` | | `True` |
    | `[eevee_samples]` | `eevee.taa_render_samples` | | `64` |

??? info "View Layer — 4 tokens (Source: View Layer)"
    | Token | Reads | Format | Example |
    |-------|-------|--------|---------|
    | `[vl_samples]` | `samples` | | `0` |
    | `[mat_override]` | `material_override.name` | | `Clay` *(dims when unset)* |
    | `[vl_active]` | `use` | | `True` |
    | `[pass_z]` | `use_pass_z` | | `False` |

??? info "Studio — 5 tokens (Source: Fixed Text)"
    | Token | Text | Example use |
    |-------|------|-------------|
    | `[studio]` | `MyStudio` | brand every delivery path |
    | `[proj]` | `MyProject` | short project code |
    | `[client]` | `ClientName` | per-client folders |
    | `[dept]` | `Lighting` | department folders |
    | `[version_tag]` | `v001` | bump one token, every path follows |

??? info "Tags — 2 tokens (Source: Assigned Tag)"
    | Token | Source | Example |
    |-------|--------|---------|
    | `[scenetag]` | Assigned Tag — Scene | `hero_shots` |
    | `[vltag]` | Assigned Tag — View Layer | `blue` |

??? info "Putting them together"
    ```
    //renders/[proj]/[client]/[scene]_[view_layer]/[dept]/[version_tag]/[lens]mm_[view_xform]_####
    ```

    resolves to something like:

    ```
    //renders/MyProject/ClientName/ShotA_Beauty/Lighting/v001/50mm_AgX_0001.png
    ```

## :material-help-circle: Troubleshooting

A dimmed token is normal — it just has nothing to read right now. A red message means the name or path is invalid.

??? info "Symptom → meaning → fix"
    | Symptom | Meaning | Fix |
    |---------|---------|-----|
    | Token shows **dimmed** in the grid, **Now:** shows nothing | Nothing to resolve *right now* (no camera, no parent, tag unassigned…) | Not an error — it resolves the moment the data exists |
    | Red message under the fields | The name or path is invalid (built-in clash, illegal characters, private segment) | Follow the message; the token isn't saved as broken |
    | Value looks like raw data (`<bpy_prop_collection…>`) | The path ends on a container instead of a single value | Add the final step, e.g. `.name` |
    | ⚠ *clashes with a built-in token* on a row | A preset from an older version loaded a name that's now built-in | Rename the custom token — the built-in wins until you do |
