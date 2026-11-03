# Changelog (technical)

Mirror of [CHANGELOG.md](CHANGELOG.md) with the full detail: causes, file
references, and the reasoning behind each decision. Same sections, same
numbering, so an entry can be traced across both files.

Same scope as the mirror: **technical work only** — build, theme, navigation,
generators, CI. Page wording and content edits are not logged in either file.

## [Unreleased]

### Added

1. 🟢 **A Progress column on the roadmap board.** Every card already carried a
   `## Phases` checklist, but the board only exposed it on hover, so the page
   could not answer "how far along is this" without pointing at each row in
   turn. The count is produced in the add-on repo
   (`Takes-for-Blender/dev/scripts/build_wiki_roadmap.py`, `phases_count()` and
   `progress_cell()`), which reads the SAME lines `phases_tooltip()` renders, so
   the number and the hover checklist cannot disagree. Plain bullets count as
   OPEN work, not as no work: an untouched idea reads `0/6`, and an em dash
   would hide how big it is.

   This repo owns the presentation. `docs/stylesheets/extra.css`: the board's
   fixed layout gained a fourth narrow column, so Progress takes
   `nth-child(4)` and When moves to `nth-child(5)`. The width is 7.8em and it
   was measured, not guessed — at 7.2em the twelve widest cells
   (`18/18 · 100%`) overflowed by 2px and the header sat flush against its sort
   caret. At 7.8em all 169 cells and the header fit on one line at 1500, 1280,
   1024 and 768px, with the Item column still taking 286-411px. Tabular figures
   and `--md-default-fg-color--light` keep the column reading as numbers beside
   the item names rather than competing with them.

   `docs/javascripts/roadmap-sort.js` needed no code change — it already reads
   `data-sort`. Its header comment was corrected: the generator writes the
   share zero-padded to three digits (`075-003`) because the sorter compares
   keys as STRINGS, and the visible "100%" would otherwise land between "1/4"
   and "29%". Ties break on the done count.

   Verified on the live site 2026-09-20 after the deploy went green: 169
   `data-sort="NNN-NNN"` cells and four sortable Progress headers, one per
   table. An earlier check that counted the word "Progress" was worthless — it
   matched the "In Progress" section headings.

2. 🟢 **A section reached by an anchor link gets a fading color band.**
   `docs/javascripts/manual-target-mark.js` (registered in `mkdocs.yml`) runs on
   `document$` and `hashchange`, finds the `:target` heading and lays an
   absolutely positioned overlay over it and its section, up to the next
   heading of the same or higher level. A 12 % accent band with a 3 px accent
   bar; it holds 4 s, fades over 1 s, ignores clicks, moves with a resize, and drops the
   fade under `prefers-reduced-motion`. `docs/stylesheets/extra.css` also
   styles `::target-text` at 30 % accent, the mark a browser draws for the
   add-on's `:~:text=` links. Measured in headless Chrome: heading top and
   page height are identical with and without the band, so nothing moves.
   Commit `4b4b746` (before rebase).

3. 🟢 **A focus pop-up shows only the linked section, with its words marked.**
   `docs/javascripts/manual-target-mark.js` stays the one home of the section
   walk (`sectionNodes`; `sectionBox` reuses it). On the FIRST `document$`
   emission with a hash that names an h2–h6, and on a click on a heading's
   title text, it clones the section into a `role="dialog"` box over a
   `.tks-focus-scrim`; the scrim joins the shared `.md-overlay, .tks-toc-scrim`
   blur rule in `extra.css`, so the menu, the contents panel and the pop-up
   share one backdrop. In-page jumps, `hashchange`, instant navigation and the
   `¶` permalink open nothing. Cloned ids are stripped or suffixed so tabs,
   `<details>` and code copy work inside. Scroll is locked with the scrollbar
   gap filled; page scroll, heading position and document height measure
   identical before open and after close. Closing (scrim, Esc, ×) hands focus
   back to the heading (no focus ring: the band marks it) and starts the
   existing 4 s band; no band runs while the pop-up is open.

   The add-on's `:~:text=` words are marked inside the clone as
   `mark.tks-text-mark`. Browsers hide the directive from `location`, so the
   words are read from wherever the engine leaves them, first load only:
   Chromium keeps them in the navigation timing entry's `name`, Firefox in
   `navigation.currentEntry.url`; an engine that keeps them in the hash gets
   the hash stripped from `:~:` on. WebKit hides them from every script
   source, so Safari shows the pop-up without marked words and marks the page
   itself after close; the owner accepted that limit on 2026-11-03 rather
   than add a second copy of the words to the add-on's links. The mark colour
   lives once, in `--tks-text-mark-bg`, read by `::target-text` and
   `.tks-text-mark` in separate rules (a shared selector list would be dropped
   whole by an engine without `::target-text`).

   Diagrams: Material draws each `mermaid` block into a host with a CLOSED
   shadow root, which `cloneNode` never copies, so the first build showed an
   empty box where the flowchart sits. Elements a clone cannot carry (the
   `MOVE` constant: diagram hosts, the undrawn source `pre`, `iframe`,
   `video`, `audio`, `canvas`, `object`, `embed`, open shadow roots) are now
   MOVED into the pop-up while it is open, with a same-size hollow left on
   the page, and moved back on every way of closing. The slot is tracked, not
   the node, so a diagram Material draws while it sits in the pop-up still
   goes home. The box width (`fitWidth`) follows resizes and late scrollbars
   through a `ResizeObserver`, so the pop-up text column stays the page's.

   Probe: `dev/check_section_focus.py` + `dev/probe_section_focus.js`, 105/105
   in Chromium; a sweep of 83 pages, 495 sections and 2252 blocks compares
   every page block with its pop-up twin, 0 mismatches. Playwright pass in
   Chromium, Firefox and WebKit, except WebKit's pop-up marks as above.
   Commits `257fdb3e`, `16008476`, `3b0a6804`, `0b6d89fe`, `be080762`
   (before rebase).

### Fixed

1. 🔴 **The section pop-up shows no sideways scroll bar, and its close button sits clear of the scroll bar.**
   Root cause: Material's `.md-typeset__scrollwrap` (tables) reaches 0.8rem
   past the text column on both sides; the page's margin absorbs that, the
   pop-up body had none, so every section with a table overflowed by 16 px.
   Same at device scale 1–1.75 and widths 800–1920, so not a rounding fault.
   `.tks-focus__body` now takes 0.8rem horizontal padding with a matching
   negative margin, so the text column keeps its width; no `overflow-x`
   guard. The × gets its own row above the scrolling body, which starts 4 px
   below it; the inset, size and gap are CSS variables in `extra.css`.
   Sweep (`dev/check_section_focus.py sweep --dpr --width`, 83 pages, 495
   sections): sideways 76 → 0, block overhang 76 → 0, × under 4 px from the
   bar 495 → 0, at scale 1/1.25/1.5/1.75. Probe 109/109. Known and older:
   at ≤1000 px the pop-up column is 35 px narrower than the page column
   (the box's own side insets). Commits `2f002a8e`, `a8201487` (before rebase).
2. 🔴 **Videos, sound, embedded frames and drawings keep playing and keep their state when the section pop-up opens and closes.**
   One `relocate()` helper in `docs/javascripts/manual-target-mark.js` moves
   the `MOVE` kinds both ways: `Element.prototype.moveBefore` where it
   exists, `insertBefore` as fallback (also when `moveBefore` throws).
   Chromium had reloaded frames because the pop-up was not yet attached and
   `moveBefore` refuses a disconnected target; the pop-up is now attached
   before the move, with the hollow measured first. `MOVE` is exposed as
   `window.tksTargetMark.movable`; the fixture and engine script read it.
   Results: Chromium keeps every state; Firefox reloads `object`/`embed`;
   WebKit (no `moveBefore`) reloads frames, `object` and `embed`. The owner
   accepted those reloads on 2026-11-03, no overlay trick. Checks:
   `dev/make_media_fixture.py`, `dev/check_media_engines.mjs`,
   `dev/check_section_focus.py media`. Commits `530fcd84`, `8e0ade70`
   (before rebase).
