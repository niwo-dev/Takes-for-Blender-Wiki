---
icon: material/school
---

# B2 · Looks: swap first, then variants

5 lessons · 25 min · the idea here is that **you swap materials instead of duplicating objects**.

## 1. The quick way: the Swap List <span class="tks-min">4 min</span> { #1-the-quick-way-the-swap-list }
<div class="tks-video" data-video="B2.1">Swap one material per take with no setup: the Swap List</div>

One row is one material slot on one object. Each take keeps its own rows, so every take can wear its own look. No setup at all.

Read more: [Swap List](../interface/inspector_panel.md#swap-list)

## 2. Product, Part, Pool, State <span class="tks-min">5 min</span> { #2-product-part-pool-state }
<div class="tks-video" data-video="B2.2">Variant Switch explained: Product, Part, Pool, State</div>

Four words cover the whole system. A Part is linked to a collection and owns a pool of materials. A State remembers one pool entry per Part.

Read more: [Variant Switch](../features/variant_switch.md) · [Variant Tree](../interface/variant_tree.md)

## 3. Building three finishes <span class="tks-min">7 min</span> { #3-building-three-finishes }
<div class="tks-video" data-video="B2.3">How to build three finishes of one product, start to finish</div>

Build the product: a Part per component, a pool of materials each, then a State per finish. Live shows your picks in the viewport.

Read more: [Make Material Variants](../workflows/material_variants.md)

## 4. Rendering every finish <span class="tks-min">5 min</span> { #4-rendering-every-finish }
<div class="tks-video" data-video="B2.4">How to render every finish in one go: variants in the cascade</div>

A variant is a cascade value, so any level can demand one. Give each finish a View Layer and the batch covers all of them.

Read more: [Variant Switch](../features/variant_switch.md#variants-in-the-cascade)

## 5. When two looks collide <span class="tks-min">4 min</span> { #5-when-two-looks-collide }
<div class="tks-video" data-video="B2.5">Variant conflicts explained: collapse and shared objects</div>

Two materials from one pool on one object, or one object inside two Products. The badge names both before a switch bites.

Read more: [Conflicts](../features/variant_switch.md#conflicts)
