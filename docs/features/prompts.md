---
icon: material/text-box-edit-outline
---

# Prompts

*A prompt is a saved instruction for the [AI Assistant](ai_assistant.md). Write it once, put it on a level of the tree, and the assistant follows it for every take below.*

## :material-lightbulb-outline: What a prompt is

A prompt is a short text file, saved like a preset, in one of three kinds. **General** applies to all work, **Camera** when the assistant touches a camera, **World** when it touches a world. Example: *Cameras: always 85 mm, f/2.8.* The first line is the prompt's title in lists and tooltips.

## :material-text-box-edit-outline: Write and edit prompts

Open *Globals > **Prompts** mode*. The list groups your prompts by kind, with a count per kind in the row above it.

1. Click **+** to add a prompt.
2. Select it. A box under the list shows its row and the first three lines of its **Text**.
3. Click the Text Editor button in the row. The prompt opens in a small Text Editor window, cursor at the end.
4. Change the text. Click the red check ({{ op('tks.prompt_apply_text').bl_label }}) to save and close the window, or the arrow ({{ op('tks.prompt_discard_text').bl_label }}) to drop the edit and close it.

The row holds the storage menu, storage icon, name, **+**, pencil, Text Editor button and **X**. A prompt with a file has its own Text Editor button in the list too.

??? info "Rename, move, switch and delete"
    - Click the name (**{{ op('tks.prompt_pick').bl_label }}**) to look at another prompt of the same kind.
    - The pencil renames; the storage menu moves the file. While the text is open, the pencil becomes the cancel arrow and a move is refused: apply or cancel first.
    - **X** deletes after a confirmation and drops an open edit.

??? info "Storage places"
    A prompt lives in one of the four places presets use: **Addon**, **Project**, **Shared** or **Local**. See [Storage Tiers](render_presets.md#storage-tiers). A place you have not set up in the preferences is greyed out.

## :material-source-branch: Give a prompt to a level

Every row of the Takes tree has a **Prompts** icon. Use it to say which prompts the assistant follows at that level.

| Gesture | Result |
|---------|--------|
| Click | A quick list of prompt rules. |
| ++shift++ + click | The full popover: a rule, plus **General**, **Camera** and **World** fields. |
| ++alt++ + click | Clear this level. |
| ++shift+alt++ + click | Clear this level and every level below it. |

The most specific level wins: a prompt on a take beats one on its scene. A level with no prompt of its own shows the one that plays for it, greyed, as *name (Level)*. A prompt whose file is gone keeps its name and turns red.

??? info "Prompt rules"
    A **prompt rule** bundles one prompt per kind. Create one in *Globals > **Rules** mode* with the **Prompts** category. Its prompts count only when no level names a prompt itself.

## :material-robot-outline: What the assistant does

The assistant follows the prompt in force at each level and names it before it changes a camera or world.

??? info "Details"
    Anything you ask for in the moment beats a saved prompt. A prompt from a shared folder is treated as information, never as a command.

??? warning "Renaming a prompt in another file"
    Renaming a prompt updates the levels in the open file. Other `.blend` files that name the old prompt keep the old name and show it as missing, in red.
