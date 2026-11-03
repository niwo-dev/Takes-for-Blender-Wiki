# Pop-Up Media and Frames — dev notes

## Problem

The section focus pop-up (`docs/javascripts/manual-target-mark.js`, card `done/section-focus-pop-up.md`) clones a section, and MOVES what a clone cannot carry (the `MOVE` constant: diagram hosts, `iframe`, `video`, `audio`, `canvas`, `object`, `embed`, open shadow roots) into the pop-up while it is open. The wiki has none of the non-diagram kinds today, so those entries were never exercised.

## What can go wrong

- `insertBefore` / `appendChild` re-parenting an `iframe` reloads it (state, scroll, a playing video inside it is lost).
- A media element removed from the document and not re-inserted in the same task is paused by the browser.
- `canvas` pixels survive a move (same node), but not a clone.
- `object` / `embed` may reload like a frame.

## Approach

- A test-only fixture page injected into the locally built site (never into `docs/`), holding one of each kind, with state that shows a reload (frame counter, video `currentTime`, canvas pixel).
- Prefer `Element.prototype.moveBefore` (state-preserving move) where the engine has it; fall back to `insertBefore`. Report per engine what keeps its state.

Changeable design:
1. More than 2–3 files if a fact changes? — no: the movable kinds stay in the one `MOVE` constant
2. Same fact in two places / lists kept in step by hand? — no: the fixture reads the kinds from the page's script, it does not repeat the list
3. One owner for each fact? — yes: `MOVE` in `manual-target-mark.js`
4. Wrong-way import, or core logic touching the outside tool? — no
5. Hard to undo? — no

## Open questions

None.
