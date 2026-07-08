---
icon: material/image-multiple
---

# View Layer Preview

**View Layer Preview** renders a small thumbnail for each View Layer and shows it inline in the Takes Tree. At a glance you can tell what each View Layer will produce without switching to it.

!!! note "Preview ≠ Preload"
    View Layer **Preview** (this page) is about thumbnails. View-Layer **Preload** — pre-building layers so the first switch to each one is fast — is a different feature, documented on the [Context Properties](../interface/context_properties.md) page.

## :material-map-marker: Where to Find It

In the **Context** panel, click the **down-arrow icon (⌄)** in the side column next to the up/down move buttons. The popover that opens has a **Previews** section with a master toggle, the size enum, the background colour picker, and the render / refresh buttons.

## :material-tune: Settings

| Setting | Type | Description |
|---------|------|-------------|
| **Show Preview** | bool | Master toggle for inline thumbnails. |
| **Size** | enum | `Small` (24 px, default), `Medium` (32 px), `Large` (40 px). |
| **Preview Background** | colour | Canvas behind the rendered thumbnail. Baked into the PNG. |
| **Transparent Background** | bool | Render the thumbnail with alpha instead of a solid background. |

## :material-image-sync: Rendering Previews

The Previews row in the Icon Visibility popover has three render buttons:

| Button | Action |
|--------|--------|
| **Viewport** (eye icon) | Snapshot from the active viewport — fastest, no rendering required. |
| **Render** (still-image icon) | Run a real render in the background and save the result as a thumbnail. |
| **Refresh** (refresh icon) | Reload thumbnails from disk without re-rendering — useful if you've manually edited a PNG or restored the file. |

Both render buttons run the [Batch Render](batch_render.md) pipeline in preview mode: a normal click renders **every render-enabled View Layer in the queue** at preview settings — the same queue a real batch would process, not just the active row. **Viewport** dispatches **{{ op('tks.batch_render').bl_label }}** for fast snapshot captures; **Render** dispatches **{{ op('tks.batch_render_bg').bl_label }}**, which fires off headless Blender subprocesses, one View Layer at a time, while the foreground stays interactive. ++alt++ + click doesn't widen the scope — it force-resets a stuck render state and disables skip-completed, so already-finished takes are rendered again. Because previews ride the batch queue, progress and per-row status show up in the same queue and progress UI as a real batch — see [Batch Render](batch_render.md#render-queue). The active scene & View Layer are restored when the run finishes.

The older standalone operators **{{ op('tks.render_all_previews').bl_label }}** and **{{ op('tks.render_all_previews_bg').bl_label }}** still exist as legacy entry points, but no button runs them anymore — they're reachable only through Blender's operator search (++f3++).

## :material-image-edit: Pick Preview Image

You can replace any auto-rendered thumbnail with a custom image — useful when the rendered preview isn't representative (e.g. a wireframe layer that doesn't render anything visible).

- **Pick Preview Image** opens a file browser; choose any PNG / JPG / EXR. The selected file is copied into the `tks_previews/` directory under the View Layer's canonical filename, so future refreshes don't overwrite it.
- The operator (`tks.vl_preview_pick`) currently has no permanent button in the UI — invoke it from Blender's operator search (++f3++) with the View Layer's scene name and view-layer name as parameters. A row-menu entry is planned.
- Clear the override by running a fresh **Render** of the View Layer — the auto-rendered output replaces the picked image.

## :material-folder: File Storage

Thumbnails live in `tks_previews/` next to the `.blend` file. Filenames follow
the pattern *scene name*, two underscores, *View Layer name*:

```
SceneName__ViewLayerName.png
```

Spaces and path separators in scene / View Layer names are replaced with underscores so the files are filesystem-safe. The directory is created on first render.

## :material-keyboard: Hotkeys

| Shortcut | Action |
|----------|--------|
| Click on **Viewport** / **Render** | Render previews for every render-enabled View Layer in the queue. |
| ++alt++ + click on **Viewport** / **Render** | Force-reset a stuck preview render and re-render takes already marked completed. |

See [Keyboard Shortcuts](../interface/hotkeys.md).
