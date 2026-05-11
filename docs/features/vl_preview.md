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

Both render buttons follow the same pattern: a normal click renders the active / multi-selected View Layer, while ++alt++ + click renders **all** View Layers across every scene. The real render runs as **Render Previews (Background)** — a queued background-render operator that fires off headless Blender subprocesses, one View Layer at a time, while the foreground stays interactive. A progress bar shows `Preview 1/N: <Scene> / <ViewLayer>`. The active scene & View Layer are restored when the run finishes.

## :material-image-edit: Pick Preview Image

You can replace any auto-rendered thumbnail with a custom image — useful when the rendered preview isn't representative (e.g. a wireframe layer that doesn't render anything visible).

- **Pick Preview Image** opens a file browser; choose any PNG / JPG / EXR. The selected file is copied into the `tks_previews/` directory under the View Layer's canonical filename, so future refreshes don't overwrite it.
- The button is exposed per–View Layer via the preview's right-click / context menu.
- Clear the override by running a fresh **Render** of the View Layer — the auto-rendered output replaces the picked image.

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
