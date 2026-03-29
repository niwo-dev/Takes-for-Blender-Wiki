# FAQ

## General

??? question "What Blender version do I need?"
    Takes for Blender requires **Blender 5.1** or newer. It relies on
    the Slotted Action system introduced in Blender 5.0.

??? question "Does it work with EEVEE and Cycles?"
    Yes. The cascade and batch render systems are engine-agnostic.
    Render presets capture engine-specific settings automatically.

??? question "Can I use it with other addons?"
    Generally yes. Takes for Blender uses standard Blender API and
    does not monkey-patch core functionality. If you encounter
    conflicts, please report them.

## Takes & Cascade

??? question "What happens to my animation when I switch View Layers?"
    Objects snap to their Rest State (neutral pose) if they don't have
    animation on the target View Layer. If they do, the cascade action
    is applied automatically.

??? question "Why is my cascade icon dimmed?"
    A dimmed icon means the value is **inherited** from a parent tier.
    A bright icon means it's **explicitly set** at that tier.
    Alt+Click to clear an override.

??? question "Can I have different frame ranges per View Layer?"
    Frame ranges are a Scene-level property in Blender. Use different
    Scenes if you need different frame ranges.

## Inspector

??? question "Why is my list red?"
    A red highlight in the watchlist indicates a **dangling action** warning —
    an object has animation data that isn't managed by the cascade.
    Pin the object or enable Auto-Assign to resolve it.

??? question "What's the difference between Managed and Pinned?"
    **Managed** objects follow the cascade — their action is assigned
    automatically. **Pinned** objects keep their own action regardless
    of View Layer switches.

## Batch Render

??? question "Why didn't my render start?"
    Check that:

    1. The file is saved (required for background mode).
    2. A camera is assigned in the cascade.
    3. The batch system isn't stuck (Alt+Click the Render button to reset).

??? question "Can I render only specific View Layers?"
    Yes. Enable multi-select in the tree sidebar, select the VLs you
    want, then click Render. Only selected VLs are queued.

??? question "Where are my renders saved?"
    Output paths are determined by the Smart Output pattern.
    Check **Properties > Output** to see the current pattern.
    Token resolution happens at render time.

## Variant Switch

??? question "Can I mix Swap and Pool modes?"
    Each Part uses one mode at a time. Different Parts within the same
    Product can use different modes.

## Troubleshooting

??? question "The addon isn't showing up after installation."
    Make sure you installed from the `.zip` without extracting.
    Check Blender's console (Window > Toggle System Console) for errors.

??? question "I'm getting crashes during View Layer switches."
    This usually indicates a conflict with another addon's depsgraph handler.
    Try disabling other addons to isolate the issue. Enable debug logging
    and share the log file when reporting.
