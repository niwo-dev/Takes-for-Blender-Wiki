# Workflow: Material Variants

This workflow shows how to set up product color/finish variants using the Variant Switch system.

## Scenario

You have a product (e.g., a water bottle) that needs to be rendered in three finishes: Matte Black, Brushed Aluminum, and Rose Gold.

## Setup

### 1. Create the Product

1. Open the **Variant Switch** panel.
2. Click **+** to create a new Product named "Bottle".
3. A default Part ("base") is created automatically.

### 2. Define Parts

Split the product into components:

1. Add a Part called "Body" → assign the body collection.
2. Add a Part called "Cap" → assign the cap collection.
3. Add a Part called "Label" → assign the label collection.

### 3. Add Materials to Pools

For each Part, populate the material pool:

1. Expand "Body" to see its pool.
2. Assign `Mat_Matte_Black` to slot 1.
3. Assign `Mat_Aluminum` to slot 2 (auto-creates).
4. Assign `Mat_Rose_Gold` to slot 3 (auto-creates).
5. Repeat for Cap and Label with their respective materials.

### 4. Create States

Add a State for each variant:

1. Add State "Matte Black" → set pool index 1 for all parts.
2. Add State "Aluminum" → set pool index 2 for all parts.
3. Add State "Rose Gold" → set pool index 3 for all parts.

## Previewing

Click the **diamond icon** on any State to instantly see that variant in the viewport.

## Rendering All Variants

### Option A: Manual

1. Activate each State.
2. Render with ++f12++.

### Option B: Cascade Integration

1. Create a View Layer per variant.
2. In each VL's cascade, assign the matching Variant Switch state.
3. Batch Render all VLs in one go.

### Option C: Combined with Camera Angles

Create a VL for each combination (variant × angle):

| View Layer | Variant | Camera |
|------------|---------|--------|
| Black_Front | Matte Black | Cam_Front |
| Black_Side | Matte Black | Cam_Side |
| Alu_Front | Aluminum | Cam_Front |
| Alu_Side | Aluminum | Cam_Side |

Batch Render handles all combinations with Smart Output tokens:

```
[variant]_[camera]_####.[file_format]
```
