# Roadmap

!!! abstract "Live progress"
    What’s shipped, what’s underway, and what’s planned for Takes for Blender. Generated from the development roadmap.

## 🗺️ Planned

- [CRASH-06 v2 — More Crash Checks](crash06-v2.md) — Static-analysis checks that catch six more crash-prone code patterns before release `Quality` `Audit`
- [Developer Docs](docs-developer.md) — Developer API reference plus a test-suite setup guide `Docs` `Docs`
- [Event-Bus Migration](event-bus-migration.md) — Decouple modules through the shared event bus, and add test coverage `Architecture` `Core`
- [Hot-Path Performance](perf-hotpaths.md) — Performance pass — large-scene overrides, lazy module loading, dead-code cleanup `Performance` `Core`
- [PoseBone Rest Support](posebone-rest-support.md) — Rest-state capture and revert extended to pose bones (not just whole objects) `Feature` `Core`
- [Preview Render Preset](preview-render-preset.md) — Reusable capture settings for view-layer preview thumbnails, so you don't reconfigure before each capture `Feature` `Render`
- [Smart Ops Audit](smart-ops-audit.md) — Verify and document the variant-switch smart-add behaviour `Docs` `Core`
- [Wiki Gaps](docs-wiki.md) — Remaining user-wiki pages — overrides, hotkeys, screenshots, changelog `Docs` `Wiki`

## ✅ Shipped

- [Blender Version Guard](version-guard.md) — Warns in the side panel when Blender is older than the supported version `Quality` `Core`
- [Context-Aware Creation](context-aware-creation.md) — The + button creates the right item for the selected group, scene, or layer `Feature` `UI`
- [pycache Auto-Invalidation](pycache-sentinel.md) — Auto-clears stale bytecode on a version change, with a Reload Add-on button `Tooling` `Core`
- [Variant Tokens for Smart Output](variant-token-formatting.md) — Variant name, tag, and index tokens for Smart Output file paths `Feature` `Render`
