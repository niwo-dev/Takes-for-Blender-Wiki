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

Owner, 2026-11-17: all of this waits until the last phase of the add-on's Value Order card is confirmed in the app. Then the pages are corrected once, for the final behaviour; items 4-9 are re-checked against the code of that day first. The Planned notes on the Value Order page are removed in the same pass.

Changeable design: skipped - wording fixes on existing pages; no list, key or format is added.

## The Value Order page itself (review of 2026-11-17)

The page is live and states the target order. Until the add-on's phases land it is ahead of the add-on in these places; correct or mark them in the same pass:

- Step 4 says an object set by hand keeps its action. From the add-on's fourth phase a mode button also rules such an object.
- Step 5: Value Lock against the Rest snap, and Still against an output preset with Revert & Re-apply, do not hold on every path yet.
- Step 5 lists some mode buttons; complete the list or point to The Modes.
- Step 6 says animation wins; the Rest snap does not yet skip values held by a driver.
- Batch render is not named among the things that are not steps, and it does not follow the order fully yet.
- The source mark, the tooltip lines and the held key are not on the page; add them when they ship.
- The silent places listed above are part of this card's second phase.
- `cascade.md:162,168-169`: describe the behaviour of that day, not today's.
