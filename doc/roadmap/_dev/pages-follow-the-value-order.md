# Pages Follow the Value Order - technical note

Review of 2026-11-17 against `docs/features/value_order.md`. Line numbers are of that day; confirm before editing. Keep every linked anchor.

## Sentences that go against the order

1. `docs/features/cascade.md:23` - "a Take beats everything above it". Modes, an object set by hand and animation are stronger than a take.
2. `docs/features/cascade.md:231` - the take's variant "beats everything below". Variant Live is a mode and sits above the levels.
3. `docs/features/render_presets.md:47` - "A deeper tier always beats a wider one". Not "always": modes, a hand-set object and animation are stronger; and today a preset on a far level wins over a rule on a nearer one.

## Sentences that promise more than the add-on does today

4. `docs/features/cascade.md:49,63-64` - the Camera Rule and World Rule rows promise an automatic choice. A camera rule copies its camera once and is not followed afterwards; a world rule does nothing.
5. `docs/features/rules.md:7` - "Apply it on any cascade tier". Rules on scene groups and view layer groups do nothing.
6. `docs/features/rules.md:16,41` - Camera row and Camera Object: the camera is copied once.
7. `docs/features/rules.md:17,43` - World row and World slot: nothing resolves a world rule.
8. `docs/features/rules.md:47,49` - "applied to the cascade at that tier". Today a rule's presets apply only when no level holds a preset of that kind.
9. `docs/features/rules.md:63` - "reaches every tier using that rule on the next sync". Not for group levels, world rules or camera rules.

Also `docs/features/rules.md:55` ("evaluated on every View Layer switch, batch render and cascade sync") holds for output rules only.

## Silent places worth one line or a link

- `cascade.md:162,168-169` - pushing an action onto every watched object: say that an object set to This Take or All Takes is left alone.
- `render_presets.md:50` - "Global - default render settings" reads like the Default preset; they are two different steps.
- `render_presets.md:64` - the Default preset applies when no level holds a preset.
- `modes.md` - does not say that a mode sits above the levels while it is on.

## Pages that need a link to the Value Order page

`cascade.md`, `rules.md`, `modes.md`, `render_presets.md`, `actions.md`, `takes.md`, `value_lock.md`, `still_mode.md`, `rest_state.md`, `variant_switch.md`, `multi_cam.md`, `diff_state.md`, `globals.md`, `batch_render.md`; also `getting_started/first_steps.md` and `course/a4-the-cascade.md`.

## Timing

Items 4-9 change again when the add-on's Value Order card ships its camera and rules phases. Word them for today's behaviour now; the add-on card's wiki phase updates them then.

Changeable design: skipped - wording fixes on existing pages; no list, key or format is added.
