# Smart Output

The **Smart Output** system provides dynamic token-based file path resolution for render output. Instead of manually naming each render, tokens are automatically replaced with context-specific values.

## Enabling Smart Output

1. Go to the **Output** panel in Blender's Properties Editor.
2. Enable the **Smart Output** toggle.
3. Set your **Directory Pattern** and **File Name Pattern** using tokens.

## Token Syntax

Tokens are wrapped in configurable brackets. The default style uses square brackets:

```
[view_layer]_[camera]_####.[file_format]
```

This resolves to something like: `Front_3-4_CamHero_0001.png`

### Bracket Styles

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

## Available Tokens

### Context Tokens

| Token | Resolves To | Example |
|-------|-------------|---------|
| `scene` | Active scene name | `Kitchen` |
| `view_layer` | Active View Layer name | `Front_3-4` |
| `camera` | Active camera name | `CamHero` |
| `group` | VL Group name | `Hero_Shots` |

### Animation Tokens

| Token | Resolves To | Example |
|-------|-------------|---------|
| `frame` | Current frame number | `42` |
| `frame_start` | Scene start frame | `1` |
| `frame_end` | Scene end frame | `250` |
| `frame_range` | Start-end range | `1-250` |
| `action` | Active scene action | `CameraFly` |
| `tks_action` | Cascade-resolved action | `SpinX` |

### Render Tokens

| Token | Resolves To | Example |
|-------|-------------|---------|
| `engine` | Render engine name | `cycles` |
| `samples` | Sample count | `128` |
| `res_x` | Resolution X | `1920` |
| `res_y` | Resolution Y | `1080` |
| `file_format` | Output format | `png` |

### System Tokens

| Token | Resolves To | Example |
|-------|-------------|---------|
| `blend` | Blend file name | `project` |
| `date` | Current date | `2026-03-29` |
| `time` | Current time | `14-30-00` |
| `sep` | Separator character | `_` |

!!! tip "Cheat Sheet"
    Click the **Syntax Tokens** button (book icon) in the Output panel header
    for a full interactive token reference with all categories.

## Separators

Use up to 5 independent separator tokens (`[sep1]` through `[sep5]`) for different delimiters:

- `[sep1]` = `_` for folders
- `[sep2]` = `-` for variables
- `[sep3]` = `.` for versioning

Configure separator characters in **Addon Preferences**.

## Frame Numbers

Use Blender's native `####` syntax for padded frame numbers. Smart Output preserves this and shows a live preview with the current frame number substituted.
