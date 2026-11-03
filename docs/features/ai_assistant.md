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

It can describe your project, create and switch takes, set cascade overrides, and switch product variants. It can also make scenes, view layers and groups, assign saved presets and prompts, set a scene's output folder and file name, and render one take.

Tiers are **named, not numbered**: `take`, `view_layer`, `vl_group`, `scene`, `scene_group`, `global`.

You can also give it standing instructions. See [Prompts](prompts.md).

??? info "The main verbs"
    These are the main verbs. `api.help()` lists every verb the installed build has.

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
    | `api.create_action(...)` | Make a new action for a tier — by your standard name, one of your name patterns, or a name of its own. |
    | `api.action_name_patterns()` / `api.set_action_name_patterns(...)` | Read or set your action name patterns, your standard, and how the list shows names. |
    | `api.create_scene(...)` / `api.create_view_layer(...)` | Make a new scene or view layer, empty or as a copy of another. |
    | `api.create_group(...)` / `api.assign_to_group(...)` | Make a Scene or View Layer Group and move scenes or view layers into it. |
    | `api.create_world(...)` / `api.create_camera(...)` | Make a new World or camera for a level. |
    | `api.list_presets(...)` / `api.assign_preset(...)` / `api.apply_preset(...)` | List saved presets, put one on a take, view layer, group, scene or Global (or clear it), or apply one once. Saving and deleting have their own verbs. |
    | `api.get_prompt(...)` / `api.set_prompt(...)` / `api.prompts_in_force(...)` | Ask which saved prompt is in force for a take, and assign one to any level of the tree. |
    | `api.set_output(...)` / `api.resolve_path(...)` | Set a scene's render output folder and file name, and check what a path turns into, including every token that will not be filled in. |
    | `api.render_view_layer(..., confirm=True)` / `api.render_status()` / `api.cancel_render()` | Render one take, follow the job, and stop a background render. Status also says how the last job ended. |
    | `api.restore_takes()` / `api.keep_current_takes()` | The two ways out of a lost-take-data state. |
    | `api.reset()` | Free a lock a previous assistant call left behind. |

## :material-shield-check: What keeps it safe

Every change an assistant makes becomes one labelled undo step. A single undo in Blender takes it back.

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
    **Starting a whole batch** has no verb: a long job wants start / status / cancel
    rather than one blocking call. An assistant can render one take and follow it
    with `api.render_status()`, but the batch itself stays a click.

    Where a capability *does* have a scripted route, the refusal names it.

??? tip "`api.help()` is the authority"
    It lists the verbs the *installed* build actually has, read from the live module, and labels each one: read-only, destructive, safe to repeat, needs a confirm, runs long. `api.help(verb=...)` gives one verb in full, with its inputs and errors.
    If this page and `help()` ever disagree, believe `help()`.
