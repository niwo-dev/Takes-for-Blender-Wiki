---
icon: material/image-multiple
---

# View Layer Preview

**View Layer Preview** renders a small thumbnail for each View Layer and shows it inline in the Takes Tree. At a glance you can tell what each View Layer will produce without switching to it.

## :material-map-marker: Where to Find It

In the **Context** panel, click the **down-arrow icon (⌄)** in the side column next to the up/down move buttons. The popover that opens has a **Previews** section with a master toggle, the size enum, the background colour picker, and the render / refresh buttons.

## :material-tune: Settings

| Setting | Type | Description |
|---------|------|-------------|
| **Show Preview** | bool | Master toggle for inline thumbnails. |
| **Size** | enum | `Small` (24 px), `Medium` (32 px, default), `Large` (40 px). |
| **Background Colour** | colour | Canvas behind the rendered thumbnail. Baked into the PNG. |
| **Transparent Background** | bool | Render the thumbnail with alpha instead of a solid background. |

## :material-image-sync: Rendering Previews

The Previews row in the Icon Visibility popover has three render buttons:

| Button | Action |
|--------|--------|
| **Viewport** (eye icon) | Snapshot from the active viewport — fastest, no rendering required. |
| **Render** (still-image icon) | Run a real render in the background and save the result as a thumbnail. |
| **Refresh** (refresh icon) | Reload thumbnails from disk without re-rendering — useful if you've manually edited a PNG or restored the file. |

++alt++ + click on the render button targets every View Layer across every scene; a regular click only renders the selection.

While rendering, a progress bar shows `Preview 1/N: <Scene> / <ViewLayer>`. The active scene & View Layer are restored when the run finishes.

## :material-folder: File Storage

Thumbnails live in `tks_previews/` next to the `.blend` file. Filenames follow:

```
{scene_name}__{vl_name}.png
```

Spaces and path separators in scene / View Layer names are replaced with underscores so the files are filesystem-safe. The directory is created on first render.

## :material-keyboard: Hotkeys

| Shortcut | Action |
|----------|--------|
| Click on **Viewport** / **Render** | Render previews for the selected View Layer(s). |
| ++alt++ + click on **Viewport** / **Render** | Render previews for every View Layer across every scene. |

See [Keyboard Shortcuts](../interface/hotkeys.md).
