---
icon: material/school
---

# A5 · Actions, slots, managed and pinned

5 lessons · 22 min · the idea here is that **every layer wears an action**.

## 1. What a switch does<span class="tks-min">5 min</span>

<div class="tks-video" data-video="A5.1">What happens to my animation when I switch View Layers?</div>

The layer's action goes on every managed object. Anything with no keys there goes home to its rest value.

Read more: [Actions, Managed and Pinned](../features/actions.md)

## 2. Managed or pinned<span class="tks-min">4 min</span>

<div class="tks-video" data-video="A5.2">The Watchlist: managed vs pinned objects explained</div>

Managed objects take the cascade's action. Pinned objects keep the one you gave them, and are skipped by renaming too.

Read more: [Actions, Managed and Pinned](../features/actions.md) · [Inspector Panel](../interface/inspector_panel.md)

## 3. Keeping one object's animation<span class="tks-min">4 min</span>

<div class="tks-video" data-video="A5.3">How to keep one object's own animation while the rest follows the take</div>

Pin it. Unpinning replaces its action rather than merging, so run **Merge All into Cascade** first if you want the keys.

Read more: [Keep an Object's Own Animation](../workflows/keep_an_objects_own_animation.md)

## 4. Why Autokey records nothing<span class="tks-min">4 min</span>

<div class="tks-video" data-video="A5.4">Autokey not recording? Only Insert Available in Blender 5.2, and the fix</div>

Blender 5.2 skips channels that were never keyed, which is how every fresh take starts. Let Takes manage that setting.

Read more: [Autokey Is Being Blocked](../interface/navigation_panel.md#autokey-is-being-blocked)

## 5. Duplicating an object<span class="tks-min">5 min</span>

<div class="tks-video" data-video="A5.5">Duplicated an object and the animation broke? Strip, Independent Slot, Off</div>

Blender copies the action when you duplicate. Three modes decide what happens: strip it, give the copy its own slot, or stay out of it.

Read more: [Inspector Panel](../interface/inspector_panel.md)

## Done

Next: [A6 · Frame 0 is home](a6-frame-0-is-home.md).
