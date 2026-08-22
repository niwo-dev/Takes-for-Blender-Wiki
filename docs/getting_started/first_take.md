---
icon: material/movie-open-plus
---

# Your First Take

In this lesson you build one shot with two takes and flip between two camera angles. It takes about 10 minutes.

New to the panel? Skim [First Steps](first_steps.md) first.

## 1. Open a fresh file

In Blender, choose **File → New → General**. You get the default cube, camera and light.

![fresh default scene with the cube](../assets/shots/getting-started_first-take_default-scene.png)

## 2. Open the Takes tab

Press ++n++ in the 3D Viewport and click the **Takes** tab. The tree shows your scene and its View Layer.

![sidebar open on the Takes tab, tree visible](../assets/shots/getting-started_first-take_takes-panel.png)

## 3. Add your first take

Click the **ViewLayer** row, then the **+** button beside the tree. **Take_001** appears under the layer, already live.

![tree with Take_001 under ViewLayer, highlighted as active](../assets/shots/getting-started_first-take_first-take-row.png)

## 4. Give it the default camera

Click the camera icon on the take's row and pick **Camera** from the menu.

<div class="tks-shot" data-shot="getting-started_first-take_camera-menu">camera menu on the take row, Camera entry</div>

## 5. Add a second take

Click **+** again. **Take_002** appears and is now the live take.

![tree with two takes, Take_002 active](../assets/shots/getting-started_first-take_two-takes.png)

## 6. Frame a new angle

Orbit the viewport with the middle mouse button until you see the cube from a different side.

![viewport orbited to a new angle on the cube](../assets/shots/getting-started_first-take_new-angle.png)

## 7. Create a camera for this angle

Click the camera icon on the **ViewLayer** row and choose **Create New Camera**. The view snaps into the new camera — **Take_002** has no camera of its own, so it uses the layer's.

<div class="tks-shot" data-shot="getting-started_first-take_new-camera">Create New Camera entry in the layer's camera menu</div>

## 8. Flip between your takes

Click **Take_001** — the viewport jumps to the first framing. Click **Take_002** — back to the new one.

<div class="tks-shot" data-shot="getting-started_first-take_flip-compare">side-by-side of the two framings while flipping takes</div>

## Done

You made one shot with two takes, each showing its own angle. Next: [Switch Between Takes](../workflows/switch_takes.md) — it also shows **{{ op('tks.new_take_from_here').bl_label }}**, which starts your next round as a full copy.
