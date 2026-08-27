# screenshots-for-every-page — dev companion

Filling the manual with pictures. Moved here from WikiShot, and merged from the
two cards that lived there ("Shoot the Takes Wiki" and "Author the Remaining
Shot Recipes").

## Why it lives in this repo

WikiShot is a **general** add-on: it shoots documentation for any Blender
add-on, and this wiki is only its first playground. A card saying "fill the
Takes manual" is not a WikiShot feature — it is this wiki's own unfinished
work, and the question it answers ("is this page finished?") is asked here.

WikiShot's roadmap keeps only tool features: the interactive recorder, the
two-way sync engine.

## Why recipes and shooting are ONE card

They were split on the theory that they finish at different times. In practice
they advance per shot, in lockstep: a shot cannot be published without a recipe,
and a recipe exists in order to be shot. Two cards would have to be ticked
together, which is the same signal twice and hides neither.

## The numbers (2026-08-26)

Source of truth: `dev/shots/SHOT_LIST.md`, with `dev/shots/shotlist.json`
beside it in WikiShot's machine-readable format.

- 132 shots declared, across 36 pages
- 16 placeholders exist, on the two tutorial pages only
- 9 captured, 7 published as real `![...]` markup
- 116 shots on 43 pages have no placeholder yet

Pages that deliberately get none: FAQ, Keyboard Shortcuts, Comparisons, and the
generated Changelog and Roadmap. They are lists and tables; a picture of a table
restates it.

## Constraints learned the hard way

- Names are `<section>_<page>_<subject>.png` into `docs/assets/shots/`. No
  sequence numbers — inserting a step used to renumber every file after it, and
  renaming an image breaks every page that links it.
- Placeholders carry `data-shot="<name>"`; that is how the scanner pairs a page
  to its row. Without it the placeholder is reported as unnamed.
- Captures must run in a factory Blender session. Against the normal profile,
  Blender opens the author's real scenes, add-on list and recent files — none of
  which may reach a public page.
- WikiShot's `_NAME_RE` allows `[a-z0-9_]+`, which rejects every one of these
  names. One character (`-`) unblocks the whole list.

## Sequencing

Placeholders first, then shoot section by section. A placeholder renders as a
dashed frame, so a page carrying them reads as honestly unfinished — better than
one that looks complete while silently missing its pictures. Shooting soon after
placing keeps that window short.

The last phase is a read-through, not a shoot. The audit that corrected 31 pages
found text describing UI that no longer existed; pictures drift the same way,
and only reading the page catches a shot that is correct on its own but no
longer matches the words around it.
