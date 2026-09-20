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
