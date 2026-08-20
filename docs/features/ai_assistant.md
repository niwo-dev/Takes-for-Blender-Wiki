---
icon: material/robot-outline
---

# AI Assistant

*An assistant connected to Blender can read your project, switch takes, and set cascade overrides — each action a single labelled undo step.*

## :material-lightbulb-outline: What this is

Takes offers a small set of named verbs that an outside assistant calls over an MCP bridge — Blender's own `blender_mcp` server, or another that speaks the same protocol.

It is not a chat window inside the add-on. It is the surface an assistant drives while it works on your file.

??? danger "Why an assistant must not just write `scene.camera`"
    Takes owns every native property that has a cascade counterpart — camera, world,
    compositor node group, action, output rule. Write one natively and it *appears to
    work and is then lost*: the next take switch, layer switch, file load or cascade
    refire overwrites it. The assistant is told the change landed, and later it is gone.

    The facade writes the *intent* instead, and lets the cascade push it down.
    Creation stays native — modelling, materials, geometry, and the existence of
    scenes and objects are Blender's. **Configuration goes through the add-on.**

## :material-hammer-wrench: What it can do

It can describe your project, create and switch takes, set cascade overrides, and switch product variants.

Tiers are **named, not numbered**: `take`, `view_layer`, `vl_group`, `scene`, `scene_group`, `global`.

??? info "The full verb list"
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

## :material-shield-check: What keeps it safe

Every change an assistant makes becomes one labelled undo step. A single ++ctrl+z++ takes it back.

Bad values, risky deletions and a busy engine are refused with an explanation, never stored quietly.

??? info "The four guardrails"
    **One call, one undo step.** Every mutating verb pushes a single labelled step
    (`AI: Set camera`). A verb that changed nothing pushes none.

    **Destructive actions refuse until they are meant.** `api.delete_take(...)` without
    `confirm=True` returns a refusal that *describes what it would do* — which take, how
    many survive, what becomes active — rather than a bare "no". The same gate sits on
    the operators themselves: a script calling `bpy.ops.tks.delete_take()` directly is
    refused unless it passes `confirm=True`, because the confirmation dialog a human
    sees does not survive a scripted call.

    **Busy is not failure.** The engine refuses mutations while it is switching,
    preloading or rendering in the background. `api.status()` says which, so an
    assistant knows whether to retry in a second or in ten minutes. Read-only verbs
    always answer.

    **Typos are refused, not stored.** Values are validated against real datablocks
    first, and a refusal lists the actual candidates — an assistant that invents a
    camera name gets told, instead of quietly storing a dangling reference.

## :material-backup-restore: When take data is missing

If the World carrying your take organisation is deleted, **every verb refuses** with `NEEDS_RESTORE`.

The assistant is expected to ask you, then call `api.restore_takes()` or `api.keep_current_takes()`.

??? info "Why it blocks everything until you answer"
    The tree on screen is a flat rebuild. Reorganising it now would be thrown away by
    the restore. See [Snapshots & Recovery](../preferences/data.md#snapshots).

## :material-cursor-default-click: What stays click-only

Popovers, dialogs and pie menus are human affordances. An assistant cannot use them, and is told so honestly rather than handed a verb that opens a window nobody is looking at.

??? info "Two gaps, recorded rather than papered over"
    **Batch rendering** has no verb yet: a long job wants start / status / cancel
    rather than one blocking call. **Group hierarchy** — moving scenes and layers
    between groups — has none either.

    Where a capability *does* have a scripted route, the refusal names it.

??? tip "`api.help()` is the authority"
    It lists the verbs the *installed* build actually has, read from the live module.
    If this page and `help()` ever disagree, believe `help()`.
