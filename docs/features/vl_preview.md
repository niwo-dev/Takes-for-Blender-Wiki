---
icon: material/image-multiple
---

# View Layer Preview

Takes renders a small thumbnail for each View Layer and shows it in the Takes Tree.

At a glance you see what each View Layer will produce, without switching to it.

??? note "Preview is not Preload"
    **Preview** — this page — is about thumbnails.

    **Preload** pre-builds layers so the first switch to each one is fast. It is a
    different feature, on the
    [Context Properties](../interface/context_properties.md) page.

## :material-map-marker: Where to Find It

Open the **Context** panel. Click the **down-arrow (⌄)** in the side column, next to the up and down move buttons.

The popover has a **Previews** section holding the toggle, the size, the background colour and the render buttons.

## :material-tune: Settings

| Setting | What it does |
|---------|--------------|
| **Show Preview** | Turns the inline thumbnails on or off. |
| **Size** | Small (24 px), Medium (32 px) or Large (40 px). |
| **Preview Background** | The colour behind the thumbnail. Baked into the image. |
| **Transparent Background** | Renders the thumbnail with alpha instead of a solid colour. |

## :material-image-sync: Rendering Previews

Three buttons sit in the **Previews** row.

| Button | What it does |
|--------|--------------|
| **Viewport** (eye) | Snapshots the active viewport. Fastest, nothing is rendered. |
| **Render** (still image) | Renders in the background and saves the result. |
| **Refresh** | Reloads thumbnails from disk without re-rendering them. |

Both render buttons cover **every render-enabled View Layer in the queue**, not only the active row.

??? info "How the render run behaves"
    Previews ride the [Batch Render](batch_render.md) pipeline in preview mode. So
    progress and per-row status show up in the usual
    [render queue](batch_render.md#render-queue).

    **Viewport** dispatches **{{ op('tks.batch_render').bl_label }}** for fast snapshots.
    **Render** dispatches **{{ op('tks.batch_render_bg').bl_label }}**, which starts
    headless Blender processes one View Layer at a time while you keep working.

    Your active scene and View Layer come back when the run finishes.

    | Shortcut | Action |
    |----------|--------|
    | Click **Viewport** / **Render** | Render previews for the whole queue. |
    | ++alt++ + click | Force-reset a stuck render, and redo takes already marked done. |

    ++alt++ + click does not widen the scope. See
    [Keyboard Shortcuts](../interface/hotkeys.md) for the full list.

??? info "Two older commands with no button"
    **{{ op('tks.render_all_previews').bl_label }}** and
    **{{ op('tks.render_all_previews_bg').bl_label }}** still work, but nothing in the
    UI runs them. Reach them from Blender's operator search (++f3++).

## :material-image-edit: Select Preview Image

Sometimes the render says nothing useful — a wireframe layer, for example. Then use your own image.

**Select Preview Image** opens a file browser. Choose any PNG, JPG or EXR and it becomes that View Layer's thumbnail.

??? info "Running it, and clearing it again"
    The command has no button yet. Run it from Blender's operator search (++f3++) and
    give it the scene name and the View Layer name. A row-menu entry is planned.

    Your file is copied into the `tks_previews/` folder under the View Layer's own
    filename, so a later **Refresh** will not overwrite it.

    To go back to an automatic thumbnail, run a fresh **Render** for that View Layer.
    The new render replaces your picked image.

## :material-folder: File Storage

Thumbnails live in a `tks_previews/` folder next to your `.blend` file. It is created on the first render.

Each file is named *scene name*, two underscores, *View Layer name*:

```
SceneName__ViewLayerName.png
```

??? info "Names with spaces or slashes"
    Spaces and path separators in a scene or View Layer name become underscores. That
    keeps the filenames safe on every operating system.
