"""Write one context sheet per video into doc/course/.

A context sheet is the preparation for a shoot, not the script. It gathers
what the video has to do, what the viewer already knows, what to show and in
what order, how the file and the add-on have to be set up before recording,
and what to stay away from. The script is written from it afterwards.

The facts that already exist -- title, length, the YouTube title, the
description, which wiki pages the lesson rests on -- are read out of the
module pages in docs/course/, so a sheet cannot disagree with the lesson it
prepares. Everything else comes from dev/context_data.py.

doc/ is hand-written repo documentation. Only docs/ is published, so nothing
here reaches the site.

Usage:
    python dev/build_context.py [--stage A] [--check]
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

WIKI = Path(__file__).resolve().parent.parent
COURSE = WIKI / "docs" / "course"
OUT = WIKI / "doc" / "course"

sys.path.insert(0, str(WIKI / "dev"))
from context_data import CONTEXT  # noqa: E402

STAGES = {"A": "Learn the basics", "B": "Set up cameras, lights and looks",
          "C": "Render and deliver", "D": "Work faster"}

TITLE = re.compile(r"^# (?P<id>[A-D]\d+) · (?P<name>.+)$", re.M)
IDEA = re.compile(r"^\d+ lessons? · [^\n]*? · \*\*(?P<idea>.+?)\*\*\.", re.M)
LESSON = re.compile(
    r'^## (?P<n>\d+)\. (?P<title>.+?)\s*<span class="tks-min">(?P<min>\d+)'
    r'.*?$\n<div class="tks-video"[^>]*>(?P<seo>.*?)</div>\n\n'
    r'(?P<recap>.+?)\n\nRead more: (?P<links>.+?)$',
    re.M | re.S,
)


# A0.1 is the course's own video: it opens the syllabus and belongs to no
# module, so it is described here rather than read out of a module page.
OVERVIEW = {
    "id": "A0", "name": "The overview", "slug": "a0-overview",
    "idea": "the whole course fits in four minutes",
    "lessons": [{
        "n": 1, "title": "The whole course in four minutes", "min": 4,
        "seo": "Learn Takes for Blender: the whole course in four minutes",
        "recap": ("What you will be able to do, the four stages, the one product "
                  "everything is built on, how to watch, and how your ideas steer "
                  "where it goes next."),
        "links": "[The Course](index.md)",
    }],
}


def modules():
    """Every module page, parsed, in course order."""
    out = []
    for p in sorted(COURSE.glob("*.md")):
        if p.name == "index.md":
            continue
        text = p.read_text(encoding="utf-8").replace(chr(13), "")
        t = TITLE.search(text)
        i = IDEA.search(text)
        lessons = []
        for m in LESSON.finditer(text):
            lessons.append({
                "n": int(m.group("n")), "title": m.group("title").strip(),
                "min": int(m.group("min")), "seo": m.group("seo").strip(),
                "recap": " ".join(m.group("recap").split()),
                "links": m.group("links").strip(),
            })
        out.append({"id": t.group("id"), "name": t.group("name").strip(),
                    "idea": i.group("idea"), "slug": p.stem, "lessons": lessons})
    out.sort(key=lambda m: (m["id"][0], int(m["id"][1:])))
    return [OVERVIEW] + out


def bullets(items, empty="_Nothing yet — add what you know._"):
    return "\n".join("- %s" % s for s in items) if items else empty


def steps(items):
    if not items:
        return "_Not planned yet._"
    return "\n".join("%d. %s" % (i + 1, s) for i, s in enumerate(items))


def sheet(mod, lesson, index, total):
    vid = "%s.%d" % (mod["id"], lesson["n"])
    c = CONTEXT.get(vid, {})
    stage = mod["id"][0]
    return "\n".join([
        "# %s · %s" % (vid, lesson["title"]),
        "",
        "**Stage %s · %s** — %s · %s · **%d min** · video %d of %d"
        % (stage, STAGES[stage], mod["id"], mod["name"], lesson["min"], index, total),
        "",
        "The idea this module plants: **%s**." % mod["idea"],
        "",
        "## On YouTube",
        "",
        "**Title**  ", lesson["seo"], "",
        "**Description**  ", lesson["recap"], "",
        "## What this video has to do",
        "", bullets(c.get("job", [])), "",
        "## What the viewer already knows",
        "", bullets(c.get("knows", [])), "",
        "## What they can do afterwards",
        "", bullets(c.get("after", [])), "",
        "## What to show, in order",
        "", steps(c.get("show", [])), "",
        "## Set up before you record",
        "", bullets(c.get("setup", [])), "",
        "## Where to be careful",
        "", bullets(c.get("careful", [])), "",
        "## Out of scope",
        "",
        "Name it and move on. Do not explain it here.",
        "", bullets(c.get("scope", [])), "",
        "## Source of truth",
        "",
        "The lesson links to: %s" % lesson["links"],
        "",
        "Check these before recording. If the page and the add-on disagree, the",
        "page is wrong and gets fixed first.",
        "",
        "## Open questions",
        "", bullets(c.get("questions", []), "_None._"), "",
    ])


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--stage", help="only this stage (A, B, C or D)")
    ap.add_argument("--check", action="store_true", help="write nothing")
    args = ap.parse_args()

    mods = modules()
    total = sum(len(m["lessons"]) for m in mods)
    written = missing = 0
    index = 0
    for mod in mods:
        for lesson in mod["lessons"]:
            index += 1
            if args.stage and mod["id"][0] != args.stage.upper():
                continue
            vid = "%s.%d" % (mod["id"], lesson["n"])
            if vid not in CONTEXT:
                missing += 1
            folder = OUT / mod["slug"]
            path = folder / ("%02d-%s.md" % (lesson["n"], slug(lesson["title"])))
            if not args.check:
                folder.mkdir(parents=True, exist_ok=True)
                path.write_text(sheet(mod, lesson, index, total),
                                encoding="utf-8", newline="")
            written += 1

    print("%d sheets%s, %d still have no context written"
          % (written, " (check only)" if args.check else "", missing))
    return 0


def slug(text: str) -> str:
    text = re.sub(r"[^\w\s-]", "", text.lower())
    return re.sub(r"[\s_]+", "-", text).strip("-")


if __name__ == "__main__":
    sys.exit(main())
