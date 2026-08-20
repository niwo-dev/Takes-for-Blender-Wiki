---
icon: material/folder-cog
---

# Smart Output

Smart Output builds your render paths out of tokens instead of names you type by hand.

You write the pattern once. Every render fills in the current scene, take, camera and frame.

## :material-toggle-switch: Enabling Smart Output

1. Open the **Output** panel in Blender's Properties editor.
2. Switch on the **Smart Output** toggle.
3. Write your **Directory** and **File Name** patterns using tokens.

Smart Output replaces the standard output path in that panel.

## :material-tune: Output Panel Controls

The **Standard** and **Compositor** buttons choose where renders go. Turn on the link icon to use both.

Each pattern field carries a ▾ dropdown with its actions, plus a folder button for browsing.

??? info "Every control in the row"
    | Control | What it does |
    |---------|--------------|
    | **Standard / Compositor** buttons + link toggle | Choose where renders go — the standard output path, the compositor's File Output nodes, or (with the link icon on) both together. The buttons sit beside the Smart Output toggle and gray out while Smart Output is off, rather than disappearing. |
    | **Browse folder** (folder icon) | **{{ op('tks.browse_directory').bl_label }}** opens a file browser to pick the output directory; ++shift++-click opens the configured folder in your OS file explorer instead. |
    | **▾ per-field dropdown** | Each pattern field's actions in one place: **Build Syntax**, **Make Absolute** / **Make Relative** (directory fields only), an **Insert Token** quick-pick of the field's most-used tokens, **{{ op('tks.reset_directory').bl_label }}**, **Clear Last Token**, and **Clear All**. |
    | **{{ op('tks.sync_brackets').bl_label }}** (red refresh icon) | Appears beside a field only when its tokens use a bracket style other than the current preference; click to convert them. |
    | **Version** counter | The value the `{rev}` token resolves to, kept per scene or per view layer (**{{ pref('smart_output_render_version_scope').label }}** in Preferences). Its refresh button scans the output folder and continues from the highest version found on disk. |

## :material-code-tags: Token Syntax

A token is a name in brackets. Square brackets are the default style.

```
[view_layer]_[camera]_####.[file_format]
```

That resolves to something like `Front_3-4_CamHero_0001.png`.

Blender's own `####` frame padding keeps working. The preview shows the real frame number.

!!! note "Why this wiki writes `{take}` and your fields show `[take]`"

    The rest of the wiki writes tokens with curly braces, because that is what the
    naming templates use and it reads cleanly next to Blender's `####`. Your output
    fields use whichever style you picked below — square by default. Same token
    either way, and **{{ op('tks.sync_brackets').bl_label }}** converts a field that
    is in the wrong style.

### :material-code-brackets: Bracket Styles

Choose the style you like with **{{ pref('smart_output_bracket_style').label }}**, under *Preferences > Workflow > Render > Render Output*.

??? info "All seven styles"
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

These few cover most jobs:

| Token | Resolves to |
|-------|-------------|
| `{scene}` | Active scene name |
| `{view_layer}` | Active View Layer name |
| `{take}` | Active Take name |
| `{camera}` | Active camera name |
| `{rev}` | Render version number |
| `{frame}` | Current frame, four digits |
| `{engine}` | Render engine |
| `{file_format}` | Output file format |
| `{date}` | `YYYY-MM-DD` |


??? info "The complete token list"
    **Context**

    | Token | Resolves To |
    |-------|-------------|
    | `{scene}` | Active scene name |
    | `{view_layer}` / `{viewlayer}` | Active View Layer name |
    | `{take}` | Active Take name (the old spelling `{version}` keeps working) |
    | `{take_number}` | Running take number — the active take's position in its list; pad explicitly like `{take_number:02d}` |
    | `{scenegroup}` | Scene Group name |
    | `{viewlayer_group}` | View Layer Group name (`{vlgroup}` still resolves as a legacy alias) |
    | `{group}` | Node group / parent name |
    | `{camera}` | Active camera name |
    | `{marker}` | Current timeline marker |

    **Object / Material Context**

    | Token | Resolves To |
    |-------|-------------|
    | `{object}` | Target object name |
    | `{type}` | Object type (`MESH`, `ARMATURE`, …) |
    | `{material}` | Material name |
    | `{collection}` | Collection name (use `{collection:N}` for indexed product collections) |
    | `{world}` | World name |
    | `{parent}` | Parent name (for node trees) |
    | `{action}` | Action name |

    **Render**

    | Token | Resolves To |
    |-------|-------------|
    | `{engine}` | Render engine (`CYCLES`, `EEVEE` …) |
    | `{preset}` | Active render preset name |
    | `{samples}` | Render samples count |
    | `{resolution_x}` | Resolution X (resolution % applied; `{res_x}` still resolves) |
    | `{resolution_y}` | Resolution Y (resolution % applied; `{res_y}` still resolves) |
    | `{resolution_percentage}` | Resolution percentage (`{res_pct}` still resolves) |
    | `{rev}` | Render version number, per scene or per view layer; a bare `{rev}` pads per the preference, `{rev:03d}` overrides |
    | `{subrev}` | Render sub-version for small iterations (`v{rev:03d}.{subrev:02d}` → `v002.03`); resets to 0 when the version bumps |
    | `{frame}` | Current frame, 4-digit zero-padded |
    | `{file_format}` | Output file format (`png`, `exr` …) |
    | `{color_depth}` | Color bit depth |
    | `{compression}` | Compression setting |

    **Camera**

    | Token | Resolves To |
    |-------|-------------|
    | `{focal_length}` | Lens length in mm |
    | `{fstop}` | F-stop label (`f2.8`, `f16` …) |

    **Animation**

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

    **Variant**

    | Token | Resolves To |
    |-------|-------------|
    | `{product}` | Product name (use `{product:N}` for index N) |
    | `{state}` | Active state (alias for `{variant}`) |
    | `{part}` | Part name (use `{part:N}`) |
    | `{variant}` | Active variant (use `{variant:N}`) |
    | `{variant_tag}` | Active variant tag (use `{variant_tag:N}`) |
    | `{variant_index}` | Numerical index of active variant |

    **Date / Time**

    | Token | Resolves To |
    |-------|-------------|
    | `{timestamp}` | `YYYYMMDD_HHMMSS` |
    | `{date}` | `YYYY-MM-DD` — or your own format: `{date:%Y%m%d}` → `20260705` |
    | `{time}` | `HH-MM-SS` — or your own format: `{time:%H%M}` → `1432` |
    | `{Y}` `{M}` `{D}` | Year / month / day (zero-padded) |
    | `{h}` `{m}` `{s}` | Hour / minute / second (zero-padded) |

    **File / System**

    | Token | Resolves To |
    |-------|-------------|
    | `{blend_name}` | `.blend` filename without extension (`{blend}` still resolves) |
    | `{blend_dir}` | Folder containing the `.blend` (`{blend_folder}` still resolves) |
    | `{blend_name_lib}` / `{blend_dir_lib}` | Library-blend variants of the two above |
    | `{user}` | OS username |
    | `{hostname}` | Computer name |
    | `{workspace}` | Active workspace name |

    **Cascade Overrides**

    | Token | Resolves To |
    |-------|-------------|
    | `{tks_action}` | Cascade-resolved action override |
    | `{tks_camera}` | Cascade-resolved camera override |

    **Index**

    | Token | Resolves To |
    |-------|-------------|
    | `{index}` | Auto-incrementing number |
    | `{index:03d}` | Same, zero-padded to N digits |

    **Node Context** (for File Output / Compositor sockets)

    | Token | Resolves To |
    |-------|-------------|
    | `{node_name}` | Node name (`{node}` still resolves) |
    | `{label}` | Node label (or name if blank) |
    | `{input}` | Input socket name |
    | `{socket}` | Socket name |

??? tip "Make your own"
    Anything the built-ins don't cover, you can add yourself: **[Custom Tokens](custom_tokens.md)** read live values from the Scene, View Layer, Render settings or Camera (or hold fixed text) — defined in Preferences → Workflow → Token, no scripting involved. That page includes a tutorial and a 50-token example library.

## :material-gesture-tap-button: Build Syntax (Token Builder)

**Build Syntax** assembles a pattern by clicking instead of typing. Open it from the ▾ dropdown beside any token field.

The pattern appears twice: as an editable field on top, and as movable chips below. A searchable token grid fills the rest.

Your edits stay in a draft. Nothing reaches the real field until you click the red **Apply** flag.

??? info "Working in the popover"
    Every token-capable field carries it — the Smart Output **Directory** / **File Name** rows, the naming-template fields in Preferences, and File Output node fields (a File Output node's per-slot rows use an inline pencil ✏️ launcher instead).

    **The editable field on top.** Type into it directly. The red **Apply** flag appears beside the pattern field as soon as the draft differs from the field's live value; only clicking that flag writes the pattern back. For a directory pattern the field carries the same absolute/relative badge and browse-folder button as the Output panel row. Beside it, a ▾ dropdown holds **Copy**, **Make Absolute** / **Make Relative** (directory patterns only), **Reset to Default**, **Clear Last Token** and **Clear All**. Below the field, the resolved result is previewed live — or a red *Invalid Syntax* message with the reason (see [Path Validation](#path-validation)).

    **The movable chips below.** One chip per token or literal, each showing its current resolved value underneath. Click a chip to select it (click again to deselect), then step it left or right with ◀ / ▶, send it to the start or end with the far arrows, or delete it with ✕. A leading `//` root is pinned to the far left — it can't be moved, and no chip can slide in front of it.

    **The token grid.** Clicking any token appends it to the end of the pattern in your configured bracket style. Hovering a token shows what it is *and* what it resolves to right now. Searching dims non-matching tokens in place (the grid never reflows while you type), and tokens with nothing to resolve in the current context are dimmed as a hint.

??? info "The three header toggles"
    | Toggle | What it does |
    |--------|--------------|
    | **Values** (eye icon) | Swaps every token's label in the grid for its live resolved value. |
    | **Blender tokens** (Blender logo) | Render-path fields only — marks the tokens Blender resolves natively. |
    | **Chips** | Hides the movable chip row for a compact, field-only layout. |

??? note "Move and Remove need a selection"
    The move arrows and ✕ stay greyed out until a chip is selected — they only
    ever act on the currently selected chip, never the whole pattern.

??? info "Popover actions you can bind to a hotkey"
    Every button in the popover is also reachable from Blender's operator search:

    - Click a grid token to append it to the pattern
    - Select or deselect a chip
    - Step a chip ◀ / ▶ or send it to an edge
    - Delete the selected chip (✕)
    - Clear Last Token / Clear All
    - Reset the pattern to its default
    - Copy the assembled pattern
    - Write the draft back to the field (the red **Apply** flag)

??? info "Blender's own filepath tokens"
    On render-path fields — the Output panel rows and File Output node fields, not naming templates — the grid also offers Blender's native filepath tokens alongside the addon's. `####` (frame number, one `#` per digit), `//` (blend-relative root) and `../` (up one folder) appear as their own cells and are inserted verbatim, never rewritten to your bracket style.

    With the Blender-logo toggle on, tokens whose name matches a Blender filepath token — `{scene}`, `{camera}`, `{fps}`, `{resolution_x}`, `{blend_name}`, `{node_name}`, … — are marked with the Blender logo in the grid.

## :material-alert-circle-check: Path Validation

Patterns are checked as you type. A bad field turns red and the preview line names the reason.

A render directory must start with `//` (blend-relative) or an absolute path.

??? info "The three checks"
    - **Writable root** — a render directory must start with `//` or an absolute path (`C:/`, a POSIX `/` root, a UNC share). Anything else, including an empty directory, would render to an unpredictable location.
    - **Absolute / relative badge** — the directory field's icon shows an `A` (absolute) or `R` (blend-relative) letter badge. It is a read-only indicator; switching is done with **Make Absolute** / **Make Relative** in the field's ▾ dropdown, which stays grayed out until the `.blend` file has been saved.
    - **Separator syntax** — a separator only makes sense *between* two values, so a pattern that starts with a separator token, ends with one, or puts two in a row is flagged as invalid syntax.

    Validation runs everywhere: the Output panel rows, File Output nodes, and inside the Build Syntax popover.

## :material-vector-link: File Output Nodes

A File Output node's **Directory** and **File Name** fields carry the same ▾ dropdown, validation and badges as the Output panel rows.

Select the node in the Compositor to edit its fields in the node editor's **Smart Output** sidebar panel, with a live preview per field.

??? info "What the dropdown holds here"
    **Build Syntax**, **Make Absolute** / **Make Relative** (directory only), the **Insert Token** quick-picks, **Reset to Default**, and **Clear Last Token** / **Clear All** — plus the same writable-root validation and absolute/relative badge on the directory field. Multi-slot nodes get a Build Syntax launcher per output slot.

## :material-minus: Separators

Separator tokens give you stable spacing without hardcoding characters.

Use `{sep}` for the configurable, project-wide character. Use `{sep1}`–`{sep5}` for fixed delimiters — folders versus fields versus versions.

??? info "What each separator produces"
    | Token | Default Character |
    |-------|-------------------|
    | `{sep}` | Main separator (configurable in *Preferences > Workflow > Pie & Misc > Tokens*; default `_`) |
    | `{sep1}` | `-` |
    | `{sep2}` | `.` |
    | `{sep3}` | (space) |
    | `{sep4}` | `/` (path) |
    | `{sep5}` | `__` (double underscore) |
