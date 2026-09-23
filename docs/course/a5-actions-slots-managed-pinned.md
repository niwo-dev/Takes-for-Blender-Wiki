---
icon: material/school
---

# A5 · Animation when you switch shots

5 lessons · 22 min · **Why some objects follow the shot and some do not**.

## 1. What happens to animation when you switch shots <span class="tks-min">5 <span class="tks-min__u">min</span></span> { #1-what-happens-to-animation-when-you-switch-shots }
<div class="tks-video" data-video="A5.1">What happens to my animation when I switch View Layers?</div>

Every View Layer carries its own action, the container your keyframes live in. Switch, and Takes swaps the action. Anything with no keys there goes back to its Rest State.

Read more: [Actions, Managed and Pinned](../features/actions.md)

## 2. Managed or pinned: why some objects do not follow <span class="tks-min">4 <span class="tks-min__u">min</span></span> { #2-managed-or-pinned-why-some-objects-do-not-follow }
<div class="tks-video" data-video="A5.2">The Watchlist: managed vs pinned objects explained</div>

Managed objects take their animation from the shot, which suits almost everything. Pinned objects keep their own, like a logo that spins the same in every shot. The Watchlist shows which is which.

Read more: [Actions, Managed and Pinned](../features/actions.md) · [Inspector Panel](../interface/inspector_panel.md)

## 3. Keep one object's own animation <span class="tks-min">4 <span class="tks-min__u">min</span></span> { #3-keep-one-objects-own-animation }
<div class="tks-video" data-video="A5.3">How to keep one object's own animation while the rest follows the take</div>

Click the pin icon on the object's row in the Watchlist, then assign its action by hand. Click the pin again to hand the object back to the shot.

Read more: [Keep an Object's Own Animation](../workflows/keep_an_objects_own_animation.md)

## 4. Auto Keying records nothing? The fix <span class="tks-min">4 <span class="tks-min__u">min</span></span> { #4-auto-keying-records-nothing-the-fix }
<div class="tks-video" data-video="A5.4">Autokey not recording? Only Insert Available in Blender 5.2, and the fix</div>

Since Blender 5.2, Only Insert Available is on by default and skips every channel that has never been keyed. Let Takes Manage switches it off while Auto Keying is on.

Read more: [Autokey Is Being Blocked](../interface/navigation_panel.md#autokey-is-being-blocked)

## 5. A copied object brings its animation. How to stop it <span class="tks-min">5 <span class="tks-min__u">min</span></span> { #5-a-copied-object-brings-its-animation-how-to-stop-it }
<div class="tks-video" data-video="A5.5">Duplicated an object and the animation broke? Strip, Independent Slot, Off</div>

A copy shares the original's animation. The On Duplicate setting chooses what happens instead: Strip it, give the copy its own slot, or leave it Off.

Read more: [Inspector Panel](../interface/inspector_panel.md)
