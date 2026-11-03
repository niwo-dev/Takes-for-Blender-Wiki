---
icon: material/palette
description: "Step by step: render one product in several finishes. A look dev workflow for Blender."
---

# Workflow: Material Variants

When one product has to render in several finishes, using the Variant Switch system.

A look dev workflow: build every finish once, then compare them shot by shot.

## :material-script-text-outline: Scenario

You have a water bottle that ships in three finishes: Matte Black, Brushed Aluminum and Rose Gold.

## :material-cog-outline: Setup

### 1. Create the Product
1. Open the **Globals** panel and switch it to the **Variant** mode with the mode buttons in the Variants header.
2. Click **+** and choose **Add Product**. The new Product comes with one Part, one Materials row and one State.
3. Double-click the Product name, or press ++f2++, and type "Bottle".
4. Click the collection button on the Product row and pick the collection that holds the bottle. The pickers further down then offer only collections inside it.

### 2. Add the Materials
Each Materials row owns one pool of materials and one target collection. The swap happens on the objects in that collection.

1. Rename the starter Materials row "Body" and click its collection button to pick the body collection.
2. Select that row and click **+** to add a second Materials row. Name it "Cap" and give it the cap collection.
3. Add a third one called "Label" with the label collection.

### 3. Fill the Pools
1. Expand "Body" to see its pool. The number in front of each slot is its pool index, counted from 0.
2. Drop the matte black material into slot 0. A new empty slot appears below it.
3. Drop the aluminum material into slot 1, then the rose gold material into slot 2.
4. Repeat for Cap and Label with their own materials.

### 4. Create States
1. Rename the starter State "default" to "Matte Black".
2. Select the State row and click **+** to add a State. Name it "Aluminum", then add "Rose Gold" the same way.
3. Click the diamond icon at the start of the "Matte Black" State to edit it. On each Materials row, set the pool index field to 0.
4. Pick "Aluminum" the same way and set every pool index to 1, then "Rose Gold" with 2.

??? info "What the Parts are for"
    The **Parts** group is not needed for a pure material change. A Part holds a
    collection whose visibility each State can set, with toggles for select, viewport,
    render, holdout and indirect-only. The starter Part is named "base part".

## :material-eye: Previewing

Switch on **Variant Live** in the Navigation panel header. Then click the diamond icon at the start of any State to see that variant in the viewport.

## :material-image-multiple: Rendering All Variants

### :material-alpha-a-circle: Option A: Manual
1. Activate each State.
2. Render with ++f12++.

### :material-alpha-b-circle: Option B: Cascade Integration
1. Create a View Layer per variant.
2. Click the variant cascade icon on the tree row to open its popover.
3. Pick the matching state.
4. Batch Render all View Layers in one go.

??? info "Finding the variant cascade icon"
    It is the same UV-sync icon as the **Variant** mode button in the Globals
    header, sitting with the other cascade icons on the tree row.
    ++alt++-click it to clear that tier's variant. ++shift+alt++ also clears
    every tier below.

### :material-alpha-c-circle: Option C: Combined with Camera Angles

Give every combination of variant and angle its own View Layer. Batch Render then covers all of them, and Smart Output writes the names for you:

```
[variant]_[camera]_####.[file_format]
```

??? info "What the View Layers look like"
    | View Layer | Variant | Camera |
    |------------|---------|--------|
    | Black_Front | Matte Black | Cam_Front |
    | Black_Side | Matte Black | Cam_Side |
    | Alu_Front | Aluminum | Cam_Front |
    | Alu_Side | Aluminum | Cam_Side |
