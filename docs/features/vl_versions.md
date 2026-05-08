---
icon: material/source-branch
---

# View Layer Versions

**View Layer Versions** are named snapshots of a View Layer's cascade settings. Use them to keep multiple variations of the same shot side-by-side without duplicating the View Layer itself.

A View Layer Version stores its own value for every cascade property (camera, world, action, compositor, render preset, output rule, etc.) and inherits everything else from its parent View Layer.

## :material-help-circle-outline: When to Use

*Versions vs. a fresh View Layer.*

| Use a View Layer Version when… | Use a new View Layer when… |
|------------------------|----------------------------|
| You want to A/B compare lighting / lensing on the same shot. | You need a fundamentally different shot (different objects rendered, different passes). |
| You want different render-preset variations of one shot. | You need different visibility / collection setups. |
| You want to keep the parent View Layer's animation but tweak rendering. | You need a different animation. |

## :material-plus-circle: Creating a Version

1. Select a View Layer in the Takes Tree.
2. Click **+** → **Add Version**, or press ++ctrl+n++ on the View Layer.
3. The version inherits every cascade value from its parent. Override only what you need.

## :material-stairs: Cascade Position

View Layer Versions sit at the bottom of the cascade hierarchy:

```
Global → Scene Group → Scene → View Layer Group → View Layer → View Layer Version
```

A value set on a Version overrides every parent tier. Values left empty fall back to the parent View Layer.

## :material-swap-horizontal: Switching Versions

Click a Version row in the tree. The cascade re-resolves and the viewport updates to reflect the version's overrides. The version's name appears in `{version}` for Smart Output naming.

## :material-folder-cog: Smart Output

Two tokens identify the active Version:

- `{version}` — the version's own name.
- `{viewlayer}` — the parent View Layer's name.

Combine them in your output pattern, e.g.:

```
{scene}{sep}{viewlayer}{sep}{version}{sep}####.{file_format}
```

## :material-keyboard: Hotkeys

View Layer Versions share the generic tree hotkeys:

| Shortcut | Action |
|----------|--------|
| ++ctrl+n++ | Add a Version under the selected View Layer. |
| ++f2++ | Rename. |
| ++del++ / ++x++ | Delete. |
| ++shift+d++ / ++alt+d++ | Duplicate (full / linked). |

See [Keyboard Shortcuts](../interface/hotkeys.md).
