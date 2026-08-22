---
icon: material/palette
---

# Workflow: Material Variants

When one product has to render in several finishes, using the Variant Switch system.

## :material-script-text-outline: Scenario

You have a water bottle that ships in three finishes: Matte Black, Brushed Aluminum and Rose Gold.

## :material-cog-outline: Setup

### 1. Create the Product
1. Open the **Variant Switch** panel.
2. Click **+** and name the new Product "Bottle".
3. A default Part called "base" appears with it.

### 2. Define Parts
Split the product into components:

1. Add a Part called "Body" and assign the body collection.
2. Add a Part called "Cap" and assign the cap collection.
3. Add a Part called "Label" and assign the label collection.

### 3. Add Materials to Pools
1. Expand "Body" to see its material pool.
2. Assign the matte black material to slot 1.
3. Assign the aluminum material to slot 2. The slot is created for you.
4. Assign the rose gold material to slot 3.
5. Repeat for Cap and Label with their own materials.

### 4. Create States
1. Add a State "Matte Black" and set pool index 1 on every part.
2. Add "Aluminum" with pool index 2.
3. Add "Rose Gold" with pool index 3.

## :material-eye: Previewing

Click the **diamond icon** on any State to see that variant in the viewport.

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
    It is the same UV-sync icon as the **Variants** mode button in the Globals
    header, sitting with the other cascade icons on the tree row.

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
