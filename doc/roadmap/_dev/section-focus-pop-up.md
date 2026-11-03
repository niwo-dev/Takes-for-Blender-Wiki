# Section Focus Pop-Up — dev notes

## Problem

The add-on's right-click Online Manual opens `page/#anchor`. `manual-target-mark.js` lays a band over the target section for 4 s, then fades it. On a long page the rest of the page still competes for the eye.

## Value

The reader sees only the part that answers the question. One click on any section title gives the same focus view while reading.

## Where it lives

- `docs/javascripts/manual-target-mark.js` — already owns "where does a section start and end" (`sectionBox`: heading plus siblings up to the next heading of the same or higher level). The pop-up reuses that walk; no second copy.
- `docs/stylesheets/extra.css` — the new scrim joins the existing `.md-overlay, .tks-toc-scrim` blur rule, so the drawer, the contents panel and the pop-up share one backdrop look.

## Triggers

- First page load with a hash that names a heading (the add-on case, also a shared link) → pop-up opens.
- Click on a heading's title text in `.md-typeset` → pop-up for that heading.
- In-page anchor jumps (contents list, links, `hashchange`) and instant navigation to another page → no pop-up; the band behaves as today.

## Close

Click on the scrim, `Esc`, or the close button. Focus returns to the heading.

The moment the pop-up is gone, the accent band appears on that section on the page: full for 4 s, then the 1 s fade (`SHOW_MS` / `FADE_MS`, unchanged). This holds for every way of closing and for both triggers. While the pop-up is open no band runs; on an add-on landing the band's 4 s start at close, not at page load.

## Alternatives

- Pop-up on every hash jump — rejected: contents clicks would open it every time.
- A URL marker from the add-on (`?focus=1`) — rejected for now: needs an add-on change and the first-load rule covers the case.

## Risks

- Section content with tabs, admonitions, images or code copy buttons must still work inside the pop-up (cloned nodes lose listeners; copy buttons and tabs need checking).
- Duplicate `id`s from cloned headings — strip ids in the clone.
- Material's own heading permalink `¶` must keep working.

Changeable design:
1. More than 2–3 files if a fact changes? — no: the section rule lives only in `manual-target-mark.js`, the backdrop look only in the shared scrim rule
2. Same fact in two places / lists kept in step by hand? — no: the pop-up calls the existing section walk; the scrim joins the existing selector list
3. One owner for each fact? — yes: section extent → `manual-target-mark.js`; backdrop blur → the `.md-overlay, .tks-toc-scrim` rule in `extra.css`
4. Wrong-way import, or core logic touching the outside tool? — no
5. Hard to undo? — no: front-end behaviour only, no saved format, no public name

## Marked words inside the pop-up

Add-on links often end in `:~:text=<words>`. The pop-up shows a clone, so the browser's own mark never reaches it; the script reads the words itself and wraps them in `mark.tks-text-mark`. The colour lives once, in `--tks-text-mark-bg`, read by both `::target-text` and `.tks-text-mark`.

Where each engine leaves the words for scripts (measured 2026-11-03):

| Engine | Source |
|---|---|
| Chromium (Chrome, Edge) | navigation timing entry `name` |
| Firefox | `navigation.currentEntry.url` |
| WebKit (Safari) | nowhere — hidden from every script source |

## Open questions

- Safari shows no marked words inside the pop-up; after close Safari marks the page itself. The fix would be a second, script-readable copy of the words in the add-on's links (e.g. `?mark=`), a new public link format.
  → Answer (owner, 2026-11-03): accept the Safari limit; no second copy in the links.
