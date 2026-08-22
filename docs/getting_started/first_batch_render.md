---
icon: material/image-multiple
---

# Your First Batch Render

In this lesson you render two View Layers in one click, with files that name themselves. It takes about 15 minutes.

It builds on [Your First Take](first_take.md) — do that lesson first.

## 1. Save your file

Save the file anywhere you like (**File > Save**). Your renders will land in a folder next to it.

<div class="tks-shot" data-shot="getting-started_first-batch-render_save-dialog">Blender save dialog</div>

## 2. Add a second View Layer

Click the **Scene** row in the tree, then **+**, then **New** under *New View Layer*. The new layer appears and becomes active.

<div class="tks-shot" data-shot="getting-started_first-batch-render_add-menu">add menu with the New View Layer options</div>

## 3. Give the new layer a take

Click **+** again. **Take_001** appears under the new layer, already live.

<div class="tks-shot" data-shot="getting-started_first-batch-render_second-layer">tree with the second layer and its first take</div>

## 4. Frame a new angle

Orbit the viewport with the middle mouse button to a view you like.

<div class="tks-shot" data-shot="getting-started_first-batch-render_third-angle">viewport orbited to a third angle on the cube</div>

## 5. Create the layer's camera

Click the camera icon on the new layer's row and choose **Create New Camera**. Each layer now looks through its own camera.

<div class="tks-shot" data-shot="getting-started_first-batch-render_new-camera">Create New Camera on the second layer's row</div>

## 6. Switch on Smart Output

Open the **Output** panel in Blender's Properties editor and turn on the **Smart Output** toggle.

<div class="tks-shot" data-shot="getting-started_first-batch-render_smart-output">Smart Output toggle in the Output panel</div>

## 7. Name the output

Set **Directory** to `//renders/` and **File Name** to `{scene}{sep}{viewlayer}{sep}{take}{sep}####.{file_format}`. Each field previews the real name it will write.

<div class="tks-shot" data-shot="getting-started_first-batch-render_name-preview">Directory and File Name fields with live preview</div>

## 8. Render the batch

Click the render button in the tree sidebar. Set **Render Mode** to **In Blender — you wait**, then click **This Scene** under **Selected Layers**.

Both layers render because their render toggles — the camera icon at the far right of each row — are on. The queue shows each layer's progress until both rows say **Done**.

<div class="tks-shot" data-shot="getting-started_first-batch-render_render-menu">render menu with Render Mode and the This Scene row</div>

## Done

Open the `renders` folder next to your saved file. Two images sit there, each named after its scene, layer and take. Next: [Batch Rendering](../workflows/batch_rendering.md) shows background mode, so you keep working while renders run.
