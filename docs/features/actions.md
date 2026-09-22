---
icon: material/play-box-multiple
---

# Actions, Managed and Pinned

Every View Layer wears an **action** — the container Blender keeps keyframes in.

Switch to a layer and Takes puts that layer's action on your objects. Switch away and it comes off again. That is why the same object can move one way in one shot and another way in the next.

## :material-cog-sync: What a switch does

Takes walks every object the layer manages and hands it the action the [cascade](cascade.md) resolved.

An object with no keyframes there does not stay where it was. It goes home to its [Rest State](rest_state.md) value.

So a switch is not a camera change. It is a change of what is animated.

## :material-pin: Managed or pinned

Each object is one of two things.

| | Takes its action from | Renamed and re-slotted for you |
|---|---|---|
| **Managed** | the cascade of the active View Layer | yes |
| **Pinned** | you, by hand | no |

Managed is the default and suits almost everything. Pin the exception — a logo that spins the same way in every shot, say.

Pin with the **Pin** button on the object's row in the [Inspector](../interface/inspector_panel.md). Steps: [Keep an Object's Own Animation](../workflows/keep_an_objects_own_animation.md).

??? warning "Unpinning replaces the action"
    Hand a pinned object back and the cascade's action takes the place of its
    own. The keyframes are not merged in. **Merge All into Cascade** does that
    first, if you want to keep them.

## :material-shape: One action, many slots

An action holds a **slot** per animated thing. That is how one action carries a whole shot.

??? info "What gets a slot, and how it is named"
    The object itself, and each material, node tree and shape key on it.

    Each slot is named from your [naming template](../preferences/workflow.md#syntax).
    A slot whose name drifts out of sync raises a warning you can fix in a click.

## :material-alert-outline: Autokey needs one setting

Blender 5.2 ships *Only Insert Available* switched on. It skips any channel that was never keyed — which is how every fresh take begins.

Autokey then looks active and records nothing. Takes offers to manage the setting for you the first time you use Autokey. See [Autokey Is Being Blocked](../interface/navigation_panel.md#autokey-is-being-blocked).
