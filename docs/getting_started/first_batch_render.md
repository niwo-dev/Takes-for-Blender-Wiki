---
icon: material/image-multiple
---

# Your First Batch Render

In this lesson you render two View Layers in one click, with files that name themselves. It takes about 15 minutes.

It builds on [Your First Take](first_take.md) — do that lesson first.

## 1. Save your file

Save the file anywhere you like (**File > Save**). Your renders will land in a folder next to it.

<!-- img: Blender save dialog -->

## 2. Add a second View Layer

Click the **Scene** row in the tree, then **+**, then **New** under *New View Layer*. The new layer appears and becomes active.

<!-- img: add menu with the New View Layer options -->

## 3. Give the new layer a take

Click **+** again. **Take_001** appears under the new layer, already live.

<!-- img: tree with the second layer and its first take -->

## 4. Frame a new angle

Orbit the viewport with the middle mouse button to a view you like.

<!-- img: viewport orbited to a third angle on the cube -->

## 5. Create the layer's camera

Click the camera icon on the new layer's row and choose **Create New Camera**. Each layer now looks through its own camera.

<!-- img: Create New Camera on the second layer's row -->

## 6. Switch on Smart Output

Open the **Output** panel in Blender's Properties editor and turn on the **Smart Output** toggle.

<!-- img: Smart Output toggle in the Output panel -->

## 7. Name the output

Set **Directory** to `//renders/` and **File Name** to `{scene}{sep}{viewlayer}{sep}{take}{sep}####.{file_format}`. Each field previews the real name it will write.

<!-- img: Directory and File Name fields with live preview -->

## 8. Render the batch

Click the render button in the tree sidebar. Set **Render Mode** to **In Blender — you wait**, then click **This Scene** under **Selected Layers**.

Both layers render because their render toggles — the camera icon at the far right of each row — are on. The queue shows each layer's progress until both rows say **Done**.

<!-- img: render menu with Render Mode and the This Scene row -->

## Done

Open the `renders` folder next to your saved file. Two images sit there, each named after its scene, layer and take. Next: [Batch Rendering](../workflows/batch_rendering.md) shows background mode, so you keep working while renders run.
