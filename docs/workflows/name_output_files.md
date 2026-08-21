---
icon: material/rename-box
---

# Name Your Output Files

When you are tired of retyping render paths for every shot, take and revision.

1. Open the **Output** panel in Blender's Properties editor.
2. Switch on the **Smart Output** toggle.
3. Click the ▾ dropdown beside **File Name** and choose **Build Syntax**.
4. Click tokens in the grid to assemble a pattern, like `{scene}{sep}{take}{sep}####.{file_format}`.
5. Click the red **Apply** flag to write the pattern into the field.
6. Repeat for the **Directory** field, so renders land in the right folder too.

You now have file names that write themselves — the current scene, take, camera and frame, every render.

??? info "Details and edge cases"
    Every field previews its resolved result live, so you see the real name
    before you render. A bad pattern turns the field red and the preview names
    the reason.

    A render directory has to start with `//` (next to your .blend file) or with
    a full drive path. Anything else would render somewhere unpredictable.

    Use `{rev}` for the render version number, and `{sep}` between values
    instead of typing underscores by hand.

    The same ▾ dropdown holds **Insert Token**, **Clear Last Token** and
    **Clear All**, and **{{ op('tks.browse_directory').bl_label }}** opens a file
    browser for the folder.

Full reference: [Smart Output](../features/smart_output.md)
