---
icon: material/account-group
---

# Set Up a Project for a Team

When your settings and presets should travel with the `.blend` instead of living on your machine.

1. Save your `.blend` where the project lives.
2. Open *Preferences ▸ Data ▸ Add-on*.
3. Click **{{ op('tks.init_project_prefs').bl_label }}**.
4. Carry on working. Your settings now save beside the file.

You now have a project anyone can open with the same setup.

??? info "What that one button did"
    It made a **presets** folder next to your `.blend`, linked it through the
    scene's World, switched **Save Mode** to *Project*, and wrote your current
    settings there.

    Because the link rides on the World, anyone opening that file loads the
    same settings — as long as their own Save Mode is on *Project*.

    Save the `.blend` first. An unsaved file has no project folder yet.

## :material-folder-multiple: Presets the whole team shares

Project presets travel with one file. **Shared** presets are for a studio standard across many files.

1. Open *Preferences ▸ Data ▸ Storage*.
2. Point **Shared Presets Folder** at a folder everyone can reach.
3. Leave **Lock Shared Folder** on.
4. Set **Master Default** under *Presets* to the tier new presets should go to.

??? info "The four tiers, and why Shared is locked"
    | Tier | Lives | Use it for |
    |---|---|---|
    | **Add-on** | inside the add-on | the shipped defaults |
    | **Project** | beside the `.blend` | presets for this job |
    | **Shared** | your team folder | studio standards |
    | **Local** | your user folder | your own work in progress |

    **Lock Shared Folder** is on by default and stops the add-on writing into
    the team folder. A dirty shared preset shows a lock instead of **Accept**,
    so nobody overwrites a studio standard by accident. Revert still works.

    Each of the nine preset types can override the Master Default.

Full reference: [Preferences](../preferences/index.md) · [Data Tab](../preferences/data.md) · [Render Presets](../features/render_presets.md#storage-tiers)
