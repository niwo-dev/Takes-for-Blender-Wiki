---
icon: material/folder-cog
---

# Smart Output

The **Smart Output** system provides dynamic token-based file path resolution for render output. Instead of manually naming each render, tokens are automatically replaced with context-specific values.

## :material-toggle-switch: Enabling Smart Output

1. Go to the **Output** panel in Blender's Properties editor (the printer-icon tab in the regular Properties window — Smart Output replaces the standard output path here).
2. Enable the **Smart Output** toggle.
3. Set your **Directory Pattern** and **File Name Pattern** using tokens.

## :material-code-tags: Token Syntax

Tokens are wrapped in configurable brackets. The default style uses square brackets:

```
[view_layer]_[camera]_####.[file_format]
```

This resolves to something like: `Front_3-4_CamHero_0001.png`

### :material-code-brackets: Bracket Styles
Choose your preferred style in **Addon Preferences > Behavior Options > Syntax Brackets**:

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

The full token registry is below. Tokens written here use curly braces for readability — switch to your configured bracket style at runtime.

### :material-target: Context
| Token | Resolves To |
|-------|-------------|
| `{scene}` | Active scene name |
| `{view_layer}` / `{viewlayer}` | Active View Layer name |
| `{version}` | Active View Layer Version name |
| `{scenegroup}` | Scene Group name |
| `{vlgroup}` | View Layer Group name |
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
| `{res_x}` | Resolution X (resolution % applied) |
| `{res_y}` | Resolution Y (resolution % applied) |
| `{res_pct}` | Resolution percentage |
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
| `{date}` | `YYYY-MM-DD` |
| `{time}` | `HH-MM-SS` |
| `{Y}` `{M}` `{D}` | Year / month / day (zero-padded) |
| `{h}` `{m}` `{s}` | Hour / minute / second (zero-padded) |

### :material-file: File / System
| Token | Resolves To |
|-------|-------------|
| `{blend}` | `.blend` filename without extension |
| `{blend_folder}` | Folder containing the `.blend` |
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
| `{node}` | Node name |
| `{label}` | Node label (or name if blank) |
| `{input}` | Input socket name |
| `{socket}` | Socket name |

!!! tip "Cheat Sheet"
    Click the **Syntax Tokens** button (book icon) in the Output panel header
    for an interactive in-Blender token picker with live preview.

## :material-gesture-tap-button: Build Syntax (Token Builder)

Rather than typing tokens by hand, click the **Build Syntax** launcher (pencil icon, ✏️) beside any token-capable field — the Smart Output **Directory Pattern** / **File Name Pattern**, the naming-template fields in Preferences, and File Output node sockets all expose it. It opens a popover with the full token list and a live pattern preview at the top.

In that preview the assembled pattern is shown as a row of **chips**, one chip per token. The chips and the pattern buttons below them drive the builder:

| Chip action | Button | What it does |
|-------------|--------|--------------|
| **Add Token** | Click any token in the list | Appends that token to the end of the pattern in your configured bracket style. |
| **Select Token** | Click a chip in the preview | Selects that token so it can be moved or removed; clicking the selected chip again deselects it. |
| **Move Token** | ◀ / ▶ arrows | Shifts the selected chip one step left or right; the far arrows send it all the way to the start or end of the pattern. |
| **Remove Token** | ✕ on a chip | Deletes the selected token from the pattern. |
| **Clear Pattern** | Trash / backspace | Empties the whole pattern, or removes just the last token. |
| **Reset to Default** | Reset | Restores the field's default pattern (the Smart Output prefs default, or the naming-template default for naming fields). |
| **Copy Pattern** | Copy | Copies the assembled pattern to the clipboard. Disabled while the pattern is empty or its bracket syntax is invalid. |

!!! note "Move and Remove need a selection"
    **Move Token** and **Remove Token** stay greyed out until you first **Select Token** a chip — they only ever act on the currently selected token, never the whole pattern.

## :material-minus: Separators

The separator tokens give you stable spacing without hardcoding characters:

| Token | Default Character |
|-------|-------------------|
| `{sep}` | Main separator (configurable in *Preferences > Workflow > Naming > Separator*; default `_`) |
| `{sep1}` | `-` |
| `{sep2}` | `.` |
| `{sep3}` | (space) |
| `{sep4}` | `/` (path) |
| `{sep5}` | `__` (double underscore) |

Use `{sep}` everywhere for the configurable, project-wide character; use `{sep1}`–`{sep5}` for fixed semantic delimiters (folders vs. fields vs. versions).

## :material-numeric: Frame Numbers

Use Blender's native `####` syntax for padded frame numbers. Smart Output preserves this and shows a live preview with the current frame number substituted.
