# Installation

## Requirements

- **Blender 5.1** or newer
- Windows, macOS, or Linux

## Download

Download the latest release ZIP from the [GitHub Releases](https://github.com/niwo-dev/Takes-for-Blender/releases) page.

!!! warning "Do Not Unzip"
    Blender installs addons directly from the `.zip` file. Do **not** extract it before installing.

## Install in Blender

1. Open Blender and go to **Edit > Preferences > Add-ons**.
2. Click **Install from Disk...** (top-right dropdown).
3. Navigate to the downloaded `.zip` file and select it.
4. Enable the addon by checking the box next to **Takes for Blender**.

## Verify Installation

After activation, a new **Takes** tab appears in the **Properties Editor** sidebar (++n++ to toggle the sidebar if hidden).

You should see:

- The **Navigation Panel** with Take/View Layer selectors
- The **Takes Tree** showing your current scenes and view layers

!!! tip "First Launch"
    On first launch with default settings, the addon automatically enables
    **Auto-Assign** and **Auto-Rename** for cascade actions.
    This means animation data is managed per-View Layer out of the box.

## Updating

To update to a newer version:

1. Go to **Edit > Preferences > Add-ons**.
2. Find **Takes for Blender** and click the dropdown arrow.
3. Click **Remove**.
4. Restart Blender.
5. Follow the installation steps above with the new `.zip`.

!!! note "Settings Persistence"
    Your addon preferences are saved to a JSON file and persist across updates
    as long as **Autosave Preferences** is enabled (default).
