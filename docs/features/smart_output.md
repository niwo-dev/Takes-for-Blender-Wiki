---
icon: material/folder-cog
---

# Smart Output

The **Smart Output** system provides dynamic token-based file path resolution for render output. Instead of manually naming each render, tokens are automatically replaced with context-specific values.

## :material-toggle-switch: Enabling Smart Output

1. Go to the **Output** panel in Blender's Properties editor (the printer-icon tab in the regular Properties window — Smart Output replaces the standard output path here).
2. Enable the **Smart Output** toggle.
3. Set your **Directory** and **File Name** patterns using tokens.

## :material-tune: Output Panel Controls

Smart Output adds its own controls to the Output panel:

| Control | What it does |
|---------|--------------|
| **Standard / Compositor** buttons + link toggle | Choose where renders go — the standard output path, the compositor's File Output nodes, or (with the link icon on) both together (`tks.toggle_output_mode`). The buttons sit beside the Smart Output toggle and gray out while Smart Output is off, rather than disappearing. |
| **Browse folder** (folder icon) | **{{ op('tks.browse_directory').bl_label }}** (`tks.browse_directory`) opens a file browser to pick the output directory; ++shift++-click opens the configured folder in your OS file explorer instead. |
| **▾ per-field dropdown** | Each pattern field's actions in one place: **Build Syntax**, **Make Absolute** / **Make Relative** (`tks.toggle_render_path_mode`, directory fields only), an **Insert Token** quick-pick of the field's most-used tokens, **{{ op('tks.reset_directory').bl_label }}** (`tks.reset_directory`), **Clear Last Token**, and **Clear All**. |
| **{{ op('tks.sync_brackets').bl_label }}** (red refresh icon) | Appears beside a field only when its tokens use a bracket style other than the current preference; click to convert them (`tks.sync_brackets`). |
| **Version** counter | The value the `{rev}` token resolves to, kept per scene or per view layer (**{{ pref('smart_output_render_version_scope').label }}** in Preferences). Its refresh button scans the output folder and continues from the highest version found on disk. |

## :material-code-tags: Token Syntax

Tokens are wrapped in configurable brackets. The default style uses square brackets:

```
[view_layer]_[camera]_####.[file_format]
```

This resolves to something like: `Front_3-4_CamHero_0001.png`

### :material-code-brackets: Bracket Styles
Choose your preferred style with the **{{ pref('smart_output_bracket_style').label }}** setting under *Preferences > Workflow > Render > Render Output*:

| Style | Syntax | Example |
|-------|--------|---------|
| Square | `[token]` | `[view_layer]_####` |
| Curly | `{token}` | `{view_layer}_####` |
| Angle | `<token>` | `<view_layer>_####` |
| Parens | `(token)` | `(view_layer)_####` |
| Percent | `%token%` | `%view_layer%_####` |
| Dollar | `$token$` | `$view_layer$_####` |
| Hash | `#token#` | `#view_layer#_####` |

## :material-format-list-bulleted: Available Tokens

The full built-in token registry is below. Tokens written here use curly braces for readability — switch to your configured bracket style at runtime.

!!! tip "Make your own"
    Anything the built-ins don't cover, you can add yourself: **[Custom Tokens](custom_tokens.md)** read live values from the Scene, View Layer, Render settings or Camera (or hold fixed text) — defined in Preferences → Workflow → Token, no scripting involved. That page includes a tutorial and a 50-token example library.

### :material-target: Context
| Token | Resolves To |
|-------|-------------|
| `{scene}` | Active scene name |
| `{view_layer}` / `{viewlayer}` | Active View Layer name |
| `{version}` | Active View Layer Version name |
| `{scenegroup}` | Scene Group name |
| `{viewlayer_group}` | View Layer Group name (`{vlgroup}` still resolves as a legacy alias) |
| `{group}` | Node group / parent name |
| `{camera}` | Active camera name |
| `{marker}` | Current timeline marker |

### :material-cube: Object / Material Context
| Token | Resolves To |
|-------|-------------|
| `{object}` | Target object name |
| `{type}` | Object type (`MESH`, `ARMATURE`, …) |
| `{material}` | Material name |
| `{collection}` | Collection name (use `{collection:N}` for indexed product collections) |
| `{world}` | World name |
| `{parent}` | Parent name (for node trees) |
| `{action}` | Action name |

### :material-image-multiple: Render
| Token | Resolves To |
|-------|-------------|
| `{engine}` | Render engine (`CYCLES`, `EEVEE` …) |
| `{preset}` | Active render preset name |
| `{samples}` | Render samples count |
| `{resolution_x}` | Resolution X (resolution % applied; `{res_x}` still resolves) |
| `{resolution_y}` | Resolution Y (resolution % applied; `{res_y}` still resolves) |
| `{resolution_percentage}` | Resolution percentage (`{res_pct}` still resolves) |
| `{rev}` | Render version number, per scene or per view layer (zero-pad with `{rev:03d}`) |
| `{frame}` | Current frame, 4-digit zero-padded |
| `{file_format}` | Output file format (`png`, `exr` …) |
| `{color_depth}` | Color bit depth |
| `{compression}` | Compression setting |

### :material-camera: Camera
| Token | Resolves To |
|-------|-------------|
| `{focal_length}` | Lens length in mm |
| `{fstop}` | F-stop label (`f2.8`, `f16` …) |

### :material-animation: Animation
| Token | Resolves To |
|-------|-------------|
| `{frame_start}` | Scene start frame |
| `{frame_end}` | Scene end frame |
| `{frame_range}` | `start-end` |
| `{fps}` | Frames per second |
| `{duration}` | Duration in seconds |
| `{slot}` | Active action slot name (Blender 5.1+) |
| `{motion_blur}` | Motion blur status |
| `{shutter}` | Shutter speed |

### :material-swap-horizontal: Variant
| Token | Resolves To |
|-------|-------------|
| `{product}` | Product name (use `{product:N}` for index N) |
| `{state}` | Active state (alias for `{variant}`) |
| `{part}` | Part name (use `{part:N}`) |
| `{variant}` | Active variant (use `{variant:N}`) |
| `{variant_tag}` | Active variant tag (use `{variant_tag:N}`) |
| `{variant_index}` | Numerical index of active variant |

### :material-calendar-clock: Date / Time
| Token | Resolves To |
|-------|-------------|
| `{timestamp}` | `YYYYMMDD_HHMMSS` |
| `{date}` | `YYYY-MM-DD` — or your own format: `{date:%Y%m%d}` → `20260705` |
| `{time}` | `HH-MM-SS` — or your own format: `{time:%H%M}` → `1432` |
| `{Y}` `{M}` `{D}` | Year / month / day (zero-padded) |
| `{h}` `{m}` `{s}` | Hour / minute / second (zero-padded) |

### :material-file: File / System
| Token | Resolves To |
|-------|-------------|
| `{blend_name}` | `.blend` filename without extension (`{blend}` still resolves) |
| `{blend_dir}` | Folder containing the `.blend` (`{blend_folder}` still resolves) |
| `{blend_name_lib}` / `{blend_dir_lib}` | Library-blend variants of the two above |
| `{user}` | OS username |
| `{hostname}` | Computer name |
| `{workspace}` | Active workspace name |

### :material-toggle-switch-variant: TKS Overrides
| Token | Resolves To |
|-------|-------------|
| `{tks_action}` | Cascade-resolved action override |
| `{tks_camera}` | Cascade-resolved camera override |

### :material-numeric: Index
| Token | Resolves To |
|-------|-------------|
| `{index}` | Auto-incrementing number |
| `{index:03d}` | Same, zero-padded to N digits |

### :material-vector-link: Node Context (for File Output / Compositor sockets)
| Token | Resolves To |
|-------|-------------|
| `{node_name}` | Node name (`{node}` still resolves) |
| `{label}` | Node label (or name if blank) |
| `{input}` | Input socket name |
| `{socket}` | Socket name |

!!! tip "Cheat Sheet"
    The interactive token picker lives on each pattern field: open the ▾ dropdown
    beside the **Directory** / **File Name** field and choose **Build Syntax** for
    the full categorized token grid with live values — or insert one of the field's
    most-used tokens straight from the dropdown, no popover needed.

## :material-gesture-tap-button: Build Syntax (Token Builder)

Rather than typing tokens by hand, open the **Build Syntax** popover from the ▾ dropdown beside any token-capable field — the Smart Output **Directory** / **File Name** rows, the naming-template fields in Preferences, and File Output node fields all carry it (a File Output node's per-slot rows use an inline pencil ✏️ launcher instead).

The popover shows two live views of the same pattern, both visible at all times:

- **The editable field on top.** Type into it directly — the popover edits a private draft, and a red **Apply** flag appears beside the pattern field as soon as the draft differs from the field's live value; only clicking that flag writes the pattern back to the field the popover was opened from. For a directory pattern the field carries the same absolute/relative badge and browse-folder button as the Output panel row. Beside it, a ▾ dropdown holds the pattern actions: **Copy**, **Make Absolute** / **Make Relative** (directory patterns only), **Reset to Default**, **Clear Last Token**, and **Clear All**. Below the field, the resolved result is previewed live — or a red *Invalid Syntax* message with the reason (see [Path Validation](#path-validation)).
- **The movable chips below.** One chip per token or literal, each showing its current resolved value underneath. Click a chip to select it (click again to deselect), then step it left or right with ◀ / ▶, send it to the start or end with the far arrows, or delete it with ✕. A leading `//` root is pinned to the far left — it can't be moved, and no chip can slide in front of it.

Underneath sit a search box and the categorized token grid. Clicking any token appends it to the end of the pattern in your configured bracket style, and hovering a token shows what it is *and* what it resolves to right now. Searching dims non-matching tokens in place (the grid never reflows while you type), and tokens with nothing to resolve in the current context are dimmed as a hint.

Three toggles live in the popover header:

| Toggle | What it does |
|--------|--------------|
| **Values** (eye icon) | Swaps every token's label in the grid for its live resolved value. |
| **Blender tokens** (Blender logo) | Render-path fields only — marks the tokens Blender resolves natively (see below). |
| **Chips** | Hides the movable chip row for a compact, field-only layout. |

!!! note "Move and Remove need a selection"
    The move arrows and ✕ stay greyed out until a chip is selected — they only
    ever act on the currently selected chip, never the whole pattern.

### :material-blender-software: Blender's Own Filepath Tokens

On render-path fields — the Output panel rows and File Output node fields, not naming templates — the grid also offers Blender's native filepath tokens alongside the addon's. `####` (frame number, one `#` per digit), `//` (blend-relative root) and `../` (up one folder) appear as their own cells and are inserted verbatim, never rewritten to the addon bracket style. With the Blender-logo toggle on, addon tokens whose name matches a Blender filepath token — `{scene}`, `{camera}`, `{fps}`, `{resolution_x}`, `{blend_name}`, `{node_name}`, … — are marked with the Blender logo in the grid.

## :material-alert-circle-check: Path Validation

Smart Output validates patterns as you type — in the Output panel rows, on File Output nodes, and inside the Build Syntax popover:

- **Writable root** — a render directory must start with `//` (blend-relative) or an absolute path (`C:/`, a POSIX `/` root, a UNC share). Anything else, including an empty directory, would render to an unpredictable location — so the field turns red and the preview line names the reason.
- **Absolute / relative badge** — the directory field's own icon shows an `A` (absolute) or `R` (blend-relative) letter badge. The badge is a read-only indicator; switching is done with **Make Absolute** / **Make Relative** in the field's ▾ dropdown (`tks.toggle_render_path_mode`), which stays grayed out until the `.blend` file has been saved.
- **Separator syntax** — a separator only makes sense *between* two values, so a pattern that starts with a separator token, ends with one, or puts two in a row is flagged as invalid syntax.

## :material-vector-link: File Output Nodes

The **Directory** and **File Name** fields of a File Output compositor node carry the same ▾ dropdown as the Properties Output rows — **Build Syntax**, **Make Absolute** / **Make Relative** (directory only), the **Insert Token** quick-picks, **Reset to Default**, and **Clear Last Token** / **Clear All** — plus the same writable-root validation and absolute/relative badge on the directory field. Multi-slot nodes get a Build Syntax launcher per output slot. Select a File Output node in the Compositor to edit its fields in the node editor's **Smart Output** sidebar panel, with live path previews per field.

## :material-minus: Separators

The separator tokens give you stable spacing without hardcoding characters:

| Token | Default Character |
|-------|-------------------|
| `{sep}` | Main separator (configurable in *Preferences > Workflow > Pie & Misc > Tokens*; default `_`) |
| `{sep1}` | `-` |
| `{sep2}` | `.` |
| `{sep3}` | (space) |
| `{sep4}` | `/` (path) |
| `{sep5}` | `__` (double underscore) |

Use `{sep}` everywhere for the configurable, project-wide character; use `{sep1}`–`{sep5}` for fixed semantic delimiters (folders vs. fields vs. versions).

## :material-numeric: Frame Numbers

Use Blender's native `####` syntax for padded frame numbers. Smart Output preserves this and shows a live preview with the current frame number substituted.
