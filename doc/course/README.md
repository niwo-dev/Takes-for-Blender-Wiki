# Course preparation

One context sheet per video, so a shoot starts from notes rather than from a
blank timeline. **Nothing here is published.** MkDocs builds `docs/`; this is
`doc/`, hand-written repo documentation like `doc/roadmap/`.

```
doc/course/
  <module-slug>/
    01-<lesson-slug>.md      one video
  README.md
```

## The order of work

1. **Context sheet** — what the video has to do, what the viewer already
   knows, what to show and in what order, how to set the file up, what to stay
   away from. This is the thinking.
2. **Script** — written from the sheet afterwards, as spoken lines with
   direction. Lives beside the sheet as `01-<slug>-script.md`.
3. **Shoot** — the sheet's *Set up before you record* section is the checklist.

A sheet is not a script. If a sentence in it sounds like something you would
say out loud, it belongs in the script instead.

## Generated, so it cannot drift

`python dev/build_context.py` writes every sheet.

The facts a sheet repeats — the lesson title, its length, its YouTube title,
its description, the wiki pages it rests on — are **read out of the module
pages in `docs/course/`**. Change a lesson there and the sheet follows. Never
hand-edit those parts; they are overwritten on the next run.

Everything else — the job, the running order, the setup, the warnings — lives
in `dev/context_data.py`, keyed by video id (`A1.1`, `B2.3`). That is the file
to edit.

`--stage A` limits a run to one stage. `--check` writes nothing and reports how
many videos still have no context.

## House rules for a sheet

- **No product names.** "Product", "finish", "environment" — never bottle,
  shoe, or a material by name. A published video title cannot be edited, and
  the footage is the only place the demo asset should appear.
- **Say what is out of scope.** A video that wanders is a video that runs long.
  Every sheet names what it will not cover and which lesson covers it.
- **The wiki is the source of truth.** If a page and the add-on disagree, the
  page is wrong and gets fixed *before* the video is shot. A video freezes
  whatever it shows.
- **Real numbers or none.** A placeholder read aloud is worse than no number.
