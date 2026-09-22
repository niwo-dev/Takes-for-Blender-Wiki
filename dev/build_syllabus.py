"""Rebuild the course syllabus from the module pages.

The module pages are the source. This reads every lesson out of them and writes
the stage tables in `docs/course/index.md`, so the two cannot drift.

It also normalises the lesson headings, which the syllabus links into:

  * a SPACE before the minutes chip. Without it the heading's text content is
    "Build the bottle shot8 min", which is what the Contents column shows.
  * an EXPLICIT anchor that leaves the minutes out. Generated slugs folded the
    chip in ("#3-ship-it6-min"), so correcting a lesson's length silently broke
    every link pointing at it.

Each module is one table: its header row is the module, its body rows are that
module's videos. The old shape carried Module and "What it plants" as columns,
which meant four of five columns sat empty on every row but the first.

Usage:
    python dev/build_syllabus.py [--check]
"""

from __future__ import annotations

import argparse
import re
import sys
import unicodedata
from pathlib import Path

WIKI = Path(__file__).resolve().parent.parent
COURSE = WIKI / "docs" / "course"

BLURB = {
    "A": "Everything you need for real work.",
    "B": "Cameras, lighting, finishes, presets and tags.",
    "C": "Naming, batch render, a whole product.",
    "D": "Hotkeys and pies, the sequencer, the assistant.",
}

STAGES = [
    ("A", "Think in Takes"),
    ("B", "Build looks and shots"),
    ("C", "Ship it"),
    ("D", "Power tools"),
]

TITLE = re.compile(r"^# (?P<id>[A-D]\d+) · (?P<name>.+)$", re.M)
IDEA = re.compile(r"the idea here is that \*\*(?P<idea>.+?)\*\*\.", re.M)
# The recap is the paragraph between a lesson's video frame and its
# "Read more:" line. It is what the syllabus shows on hover.
RECAP = re.compile(
    r'<div class="tks-video"[^>]*>.*?</div>\s*\n\n(?P<recap>.+?)\n\nRead more:',
    re.S,
)

LESSON = re.compile(
    r'^## (?P<n>\d+)\. (?P<title>.+?)\s*'
    # The unit may be bare or wrapped in its own dimming span, because pages
    # written before that became the house chip are still read by this.
    r'<span class="tks-min">(?P<min>\d+)\s*'
    r'(?:<span class="tks-min__u">min</span>|min)</span>'
    # `[ 	]*` and not `\s*`: \s eats the newlines after the heading too,
    # which closed up the blank line before each video frame.
    r'(?:[ 	]*\{[^}]*\})?[ 	]*$',
    re.M,
)


def slug(text: str) -> str:
    """Match MkDocs' own heading slugs for the part we keep."""
    text = unicodedata.normalize("NFKD", text)
    text = "".join(c for c in text if not unicodedata.combining(c))
    text = re.sub(r"[^\w\s-]", "", text.lower())
    return re.sub(r"[\s_]+", "-", text).strip("-")


def plain(text: str) -> str:
    """A recap as a link title: one line, no markup, no quote to break it."""
    text = " ".join(text.split())
    text = text.replace("**", "")           # only four recaps use bold
    return text.replace('"', "'")


def module_files() -> list[Path]:
    return sorted(p for p in COURSE.glob("*.md") if p.name != "index.md")


def read_module(path: Path):
    text = path.read_text(encoding="utf-8")
    t = TITLE.search(text)
    if not t:
        raise SystemExit("%s: no '# A1 . Name' heading" % path.name)
    i = IDEA.search(text)
    if not i:
        raise SystemExit("%s: no 'the idea here is that **...**' line" % path.name)
    recaps = [plain(r.group("recap")) for r in RECAP.finditer(text)]
    lessons = []
    for m in LESSON.finditer(text):
        n, title, mins = m.group("n"), m.group("title").strip(), int(m.group("min"))
        lessons.append((int(n), title, mins, "%s-%s" % (n, slug(title))))
    if not lessons:
        raise SystemExit("%s: no lesson headings" % path.name)
    if len(recaps) != len(lessons):
        raise SystemExit("%s: %d lessons but %d recaps -- every lesson needs "
                         "the one-line description under its video"
                         % (path.name, len(lessons), len(recaps)))
    lessons = [l + (recaps[k],) for k, l in enumerate(lessons)]
    return {
        "id": t.group("id"), "name": t.group("name").strip(),
        "idea": i.group("idea"), "slug": path.stem,
        "lessons": lessons, "path": path, "text": text,
    }


def normalise_headings(mod, write: bool) -> bool:
    """Give each lesson heading its space and its minutes-free anchor."""
    out = mod["text"]

    def repl(m):
        n, title, mins = m.group("n"), m.group("title").strip(), m.group("min")
        return ('## %s. %s <span class="tks-min">%s '
                '<span class="tks-min__u">min</span></span> { #%s-%s }'
                % (n, title, mins, n, slug(title)))

    new = LESSON.sub(repl, out)
    if new != out and write:
        mod["path"].write_text(new, encoding="utf-8", newline="")
    return new != out


# The words that are the same on every row: a reader wants the number.
UNIT = re.compile(r"\b(videos?|min|h)\b")


def ident(text: str) -> str:
    """The stage letter, or a module id, as a chip. Same shape as the
    figures wear, so a row reads as one family of small marks."""
    return '<span class="tks-id">%s</span>' % text


def pill(text: str) -> str:
    """The same chip the lesson headings wear, with its unit word stepped back."""
    marked = UNIT.sub(lambda m: '<span class="tks-min__u">%s</span>' % m.group(1),
                      text)
    return '<span class="tks-min">%s</span>' % marked


def stage_block(letter: str, name: str, mods: list) -> list[str]:
    videos = sum(len(m["lessons"]) for m in mods)
    mins = sum(sum(l[2] for l in m["lessons"]) for m in mods)
    head = "???+" if letter == "A" else "???"
    out = ['%s info "Stage %s · %s — %d videos · %s"'
           % (head, letter, name, videos, hm(mins)), ""]
    for mod in mods:
        total = sum(l[2] for l in mod["lessons"])
        # The wrapper is what the stylesheet hooks on to: it pins the right-hand
        # column so every module's table lines up with every other one, which a
        # plain table cannot do because each sizes its own columns to its text.
        out += [
            '    <div class="tks-lessons" markdown="1">', "",
            "    | [%s · %s](%s.md) — %s | %s %s |"
            % (ident(mod["id"]), mod["name"], mod["slug"], mod["idea"],
               pill("%d videos" % len(mod["lessons"])), pill("%d min" % total)),
            "    |---|---|",
        ]
        for n, title, mins_, anchor, recap in mod["lessons"]:
            # The third argument of a markdown link is its title attribute,
            # and `content.tooltips` styles that into a tooltip. A phone has
            # no hover, and the title stays an ordinary link there.
            out.append('    | %d · [%s](%s.md#%s "%s") | %s |'
                       % (n, title, mod["slug"], anchor, recap,
                          pill("%d min" % mins_)))
        out += ["", "    </div>", ""]
    return out


def hm(total: int) -> str:
    return "%d h %02d" % (total // 60, total % 60) if total >= 60 else "%d min" % total


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true",
                    help="report what would change, write nothing")
    args = ap.parse_args()
    write = not args.check

    mods = [read_module(p) for p in module_files()]
    touched = [m["id"] for m in mods if normalise_headings(m, write)]
    if touched:
        print("headings normalised: %s" % ", ".join(touched))

    by_stage = {letter: [m for m in mods if m["id"][0] == letter]
                for letter, _ in STAGES}
    for letter, _ in STAGES:
        by_stage[letter].sort(key=lambda m: int(m["id"][1:]))

    overview = 4  # the A0.1 overview at the top of the page, not a lesson
    grand = overview + sum(sum(l[2] for l in m["lessons"]) for m in mods)
    lines: list[str] = [
        "## :material-stairs: The four stages", "",
        "%s in all, counting the overview above. Stage A alone is enough to "
        "run a real job." % hm(grand), "",
        '<div class="tks-stages" markdown="1">', "",
        "| Stage | What you get | |",
        "|---|---|---|",
    ]
    for letter, name in STAGES:
        mods_ = by_stage[letter]
        # Name with its sentence, and the two figures together -- the shape
        # the module tables already use for both.
        videos = sum(len(m["lessons"]) for m in mods_)
        minutes = sum(sum(l[2] for l in m["lessons"]) for m in mods_)
        lines.append("| %s | **%s** \u2014 %s | %s %s |" % (
            ident(letter), name, BLURB[letter],
            pill("%d videos" % videos), pill(hm(minutes))))
    lines += ["", "</div>", ""]
    for letter, name in STAGES:
        lines += stage_block(letter, name, by_stage[letter])

    index = COURSE / "index.md"
    text = index.read_text(encoding="utf-8")
    anchor = text.index("## :material-stairs: The four stages")
    new = text[:anchor] + "\n".join(lines).rstrip() + "\n"

    videos = sum(len(m["lessons"]) for m in mods)
    total = sum(sum(l[2] for l in m["lessons"]) for m in mods)
    print("%d modules, %d lesson videos, %s" % (len(mods), videos, hm(total)))

    if args.check:
        print("check only — nothing written")
        return 0 if new == text else 1
    index.write_text(new, encoding="utf-8", newline="")
    print("wrote docs/course/index.md")
    return 0


if __name__ == "__main__":
    sys.exit(main())
