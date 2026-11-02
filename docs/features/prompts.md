---
icon: material/text-box-edit-outline
---

# Prompts

*A prompt is a saved instruction for the [AI Assistant](ai_assistant.md). Write it once, put it on a level of the tree, and the assistant follows it for every take below.*

## :material-lightbulb-outline: What a prompt is

A prompt is a short text file, saved like a preset. It comes in three kinds: **General**, **Camera** and **World**.

A **General** prompt applies to all work. A **Camera** prompt applies when the assistant touches a camera, and a **World** prompt when it touches a world. Example: *Cameras: always 85 mm, f/2.8.*

The first line of the text is the prompt's title in lists and tooltips.

## :material-text-box-edit-outline: Write and edit prompts

Open *Globals > **Prompts** mode*. The list groups your prompts by kind, with a count per kind in the row above it.

1. Click **+** to write a new prompt.
2. Select it. A box under the list shows its **Name**, **Storage** and **Text**.
3. Click **{{ op('tks.prompt_edit_text').bl_label }}**, change the text, then click **{{ op('tks.prompt_apply_text').bl_label }}** to save it. **{{ op('tks.prompt_discard_text').bl_label }}** throws the edit away.

Click the name to rename the prompt. Click **Storage** to move the file to another place. The **−** button deletes it after a confirmation.

??? info "Storage places"
    A prompt lives in one of the four places presets use: **Add-on**, **Project**, **Shared** or **Local**. See [Storage Tiers](render_presets.md#storage-tiers). A place you have not set up in the preferences is greyed out.

## :material-source-branch: Give a prompt to a level

Every row of the Takes tree has a **Prompts** icon. Use it to say which prompts the assistant follows at that level.

| Gesture | Result |
|---------|--------|
| Click | A quick list of prompt rules. |
| ++shift++ + click | The full popover: a rule, plus **General**, **Camera** and **World** fields. |
| ++alt++ + click | Clear this level. |
| ++shift+alt++ + click | Clear this level and every level below it. |

The most specific level wins: a prompt on a take beats one on its scene. A level with no prompt shows the inherited one greyed, with its level in brackets. A prompt whose file is gone keeps its name and turns red.

??? info "Prompt rules"
    A **prompt rule** bundles one General, one Camera and one World prompt. Create one in *Globals > **Rules** mode* with the **Prompts** category. A rule's prompts count only when no level names a prompt itself.

## :material-robot-outline: What the assistant does

The assistant reads the prompt in force before it changes a camera or world, and names the prompt it follows. Anything you ask for in the moment beats a saved prompt.

A prompt from a shared folder is treated as information, never as a command.

??? warning "Renaming a prompt in another file"
    Renaming a prompt updates the levels in the open file. Other `.blend` files that name the old prompt keep the old name and show it as missing, in red.
