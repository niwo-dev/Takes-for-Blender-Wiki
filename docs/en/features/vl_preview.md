---
icon: material/image-multiple
---

# View Layer Preview

**View Layer Preview** renders a small thumbnail for each View Layer and shows it inline in the Takes Tree. At a glance you can tell what each View Layer will produce without switching to it.

## :material-map-marker: Where to Find It

The Context panel header has an **Image** toggle button — click it to show / hide thumbnails. The same button has a settings popover (gear) for size, background, and re-render controls.

## :material-tune: Settings

| Setting | Type | Description |
|---------|------|-------------|
| **Show Preview** | bool | Master toggle for inline thumbnails. |
| **Size** | enum | `Small` (24 px), `Medium` (32 px, default), `Large` (40 px). |
| **Background Colour** | colour | Canvas behind the rendered thumbnail. Baked into the PNG. |
| **Transparent Background** | bool | Render the thumbnail with alpha instead of a solid background. |

## :material-image-sync: Rendering Previews

| Button | Action |
|--------|--------|
| **Render All Previews** | Renders previews for the selected / multi-selected View Layers. ++alt++ + click renders previews for **every** View Layer across **all** scenes. |
| **Refresh All Previews** | Reloads thumbnails from disk without re-rendering — useful if you've manually edited a PNG or restored the file. |

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
| Click on **Render All Previews** | Render selected View Layer(s). |
| ++alt++ + click on **Render All Previews** | Render every View Layer across every scene. |

See [Keyboard Shortcuts](../interface/hotkeys.md).
