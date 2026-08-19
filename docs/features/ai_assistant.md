---
icon: material/robot-outline
---

# AI Assistant

*An assistant connected to Blender can read your project, switch takes, and set cascade overrides — each action a single labelled undo step.*

## :material-lightbulb-outline: What this is

Takes ships a **facade for scripted callers**: a small set of named verbs an AI assistant reaches over an MCP bridge (Blender's own `blender_mcp` server and friends). It is not a chat window inside the add-on — it is the surface an outside assistant drives, and the reason it exists is that the obvious alternative silently fails.

!!! danger "Why an assistant must not just write `scene.camera`"
    Takes owns every native property that has a cascade counterpart — camera, world, compositor node group, action, output rule. Write one natively and it **appears to work and is then lost**: the next take switch, layer switch, file load or cascade refire overwrites it. The assistant is told the change landed, and later it is gone.

    The facade writes the *intent* instead, and lets the cascade push it down. Creation stays native — modelling, materials, geometry, and the existence of scenes and objects are Blender's. **Configuration goes through the add-on.**

## :material-hammer-wrench: What it can do

| Verb | What it does |
|------|--------------|
| `api.status()` | What the engine is doing right now — switching, preloading, or rendering. |
| `api.describe()` | The project's shape: scenes, view layers, takes, and their names. |
| `api.help()` | The guide plus the live verb list, read from the installed build. |
| `api.explain(...)` | Which cascade tier won for a property, and with what value. |
| `api.list_variants()` | Every product and its variant names. |
| `api.create_take(...)` | Start the next round — returns the name the engine chose. |
| `api.rename_take(...)` | Give a take a meaningful name instead of `Take_002`. |
| `api.switch_take(...)` | Activate a take. |
| `api.delete_take(..., confirm=True)` | Remove one. Refuses without the confirmation. |
| `api.set_override(...)` / `api.clear_override(...)` | Write or remove a cascade override at a named tier. |
| `api.switch_variant(...)` | Point a product at one of its variants. |
| `api.restore_takes()` / `api.keep_current_takes()` | The two ways out of a lost-take-data state. |
| `api.reset()` | Free a lock a previous assistant call left behind. |

Tiers are **named, not numbered**: `take`, `view_layer`, `vl_group`, `scene`, `scene_group`, `global`.

## :material-shield-check: What keeps it safe

**One call, one undo step.** Every mutating verb pushes a single labelled step (`AI: Set camera`), so one ++ctrl+z++ undoes the whole action. A verb that changed nothing pushes none.

**Destructive actions refuse until they are meant.** `api.delete_take(...)` without `confirm=True` returns a refusal that *describes what it would do* — which take, how many survive, what becomes active — rather than a bare "no". The same gate sits on the operators themselves: a script calling `bpy.ops.tks.delete_take()` directly is refused unless it passes `confirm=True`, because the confirmation dialog a human sees does not survive a scripted call.

**Busy is not failure.** The engine refuses mutations while it is switching, preloading or rendering in the background; `api.status()` says which, so an assistant knows whether to retry in a second or in ten minutes. Read-only verbs always answer.

**Typos are refused, not stored.** Values are validated against real datablocks first, and a refusal lists the actual candidates — an assistant that invents a camera name gets told, instead of quietly storing a dangling reference.

## :material-backup-restore: When take data is missing

If the World carrying your take organisation is deleted, **every verb refuses** with `NEEDS_RESTORE` until the question is answered — because the tree on screen is a flat rebuild, and reorganising it would be thrown away by the restore. The assistant is expected to ask you, then call either `api.restore_takes()` or `api.keep_current_takes()`. See [Snapshots & Recovery](../preferences/data.md#snapshots).

## :material-cursor-default-click: What stays click-only

Popovers, dialogs and pie menus are human affordances; an assistant cannot use them and is told so honestly rather than being given a verb that opens a window nobody is looking at. Where a capability has a scripted route, the refusal names it.

Two capabilities have no verb yet and are deliberately recorded as gaps rather than papered over: **batch rendering** (a long job that wants start / status / cancel rather than one blocking call) and **group hierarchy** (moving scenes and layers between groups).

!!! tip "`api.help()` is the authority"
    It lists the verbs the *installed* build actually has, read from the live module. If this page and `help()` ever disagree, believe `help()`.
