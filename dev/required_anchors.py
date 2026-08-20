"""List the heading anchors a wiki page is NOT allowed to lose.

Shortening a page is safe right up until you rename or delete a heading that
something links to. Two things link in, and neither is visible from the page
itself:

  * the add-on, whose right-click "Online Manual" targets live in
    `doc/reports/data/wire_assignments.json` in the add-on repo;
  * other wiki pages, via ordinary `page.md#anchor` links.

Run this before editing a page, and keep every anchor it prints.
`dev/anchor_check.py --compare` catches the add-on half afterwards, but it
cannot see wiki-to-wiki links -- `mkdocs build --strict` does that.

Usage:
    python dev/required_anchors.py                     # every page, ranked
    python dev/required_anchors.py features/cascade    # one page, with headings
"""

from __future__ import annotations

import collections
import json
import re
import sys
from pathlib import Path

WIKI_ROOT = Path(__file__).resolve().parent.parent
DOCS = WIKI_ROOT / "docs"
ADDON = WIKI_ROOT.parent / "Takes-for-Blender"
WIRE = ADDON / "doc" / "reports" / "data" / "wire_assignments.json"

LINK = re.compile(r'\(([\w./-]+\.md)#([\w-]+)\)')
HEADING = re.compile(r'^(#{1,6})\s+(.*?)\s*$')
EXPLICIT_ID = re.compile(r'\{:?\s*#([\w-]+)\s*\}')
ICON = re.compile(r':[\w-]+:')


def addon_anchors():
    """{page: {anchor: control_count}} from the add-on's wiring table."""
    out = collections.defaultdict(collections.Counter)
    if not WIRE.is_file():
        return out
    for rna, target in json.loads(WIRE.read_text(encoding="utf-8"))["assignments"].items():
        page, _, anchor = target.partition("#")
        if anchor:
            out[page.strip("/")][anchor] += 1
    return out


def wiki_anchors():
    """{page: {anchor: [source pages]}} from wiki-to-wiki links."""
    out = collections.defaultdict(lambda: collections.defaultdict(list))
    for f in DOCS.rglob("*.md"):
        if any(p in str(f) for p in ("roadmap", "changelog")):
            continue
        here = f.relative_to(DOCS)
        for rel, anchor in LINK.findall(f.read_text(encoding="utf-8")):
            # Resolve against the LINKING FILE's directory, not the process cwd.
            target = (f.parent / rel).resolve()
            try:
                key = target.relative_to(DOCS.resolve()).with_suffix("").as_posix()
            except ValueError:
                continue
            out[key][anchor].append(here.as_posix())
    return out


def slug(text):
    """Approximate mkdocs' heading slug: strip icons, keep word chars and dashes."""
    t = ICON.sub("", EXPLICIT_ID.sub("", text)).strip().lower()
    t = re.sub(r"[^\w\s-]", "", t)
    return re.sub(r"[\s_]+", "-", t).strip("-")


def page_headings(page):
    # A wired target like `preferences/` is a directory URL, so the file behind
    # it is `preferences/index.md`, not `preferences.md`.
    f = DOCS / (page + ".md")
    if not f.is_file():
        f = DOCS / page / "index.md"
    if not f.is_file():
        return []
    rows = []
    for n, line in enumerate(f.read_text(encoding="utf-8").splitlines(), 1):
        m = HEADING.match(line)
        if m:
            explicit = EXPLICIT_ID.search(m.group(2))
            rows.append((n, len(m.group(1)),
                         explicit.group(1) if explicit else slug(m.group(2)),
                         m.group(2)))
    return rows


def main():
    addon, wiki = addon_anchors(), wiki_anchors()
    pages = sorted(set(addon) | set(wiki))

    if len(sys.argv) > 1:
        page = sys.argv[1].strip("/").removesuffix(".md")
        req = dict(addon.get(page, {}))
        inbound = wiki.get(page, {})
        print(f"=== {page} — ANCHORS THAT MUST SURVIVE ===")
        for a in sorted(set(req) | set(inbound)):
            src = []
            if a in req:
                src.append(f"{req[a]} add-on control(s)")
            if a in inbound:
                src.append("linked from " + ", ".join(sorted(set(inbound[a]))))
            print(f"  #{a:<44} {'; '.join(src)}")
        have = {h[2] for h in page_headings(page)}
        missing = sorted((set(req) | set(inbound)) - have)
        print(f"\n=== HEADINGS PRESENT ({len(have)}) ===")
        for n, lvl, s, text in page_headings(page):
            mark = "  <-- REQUIRED" if s in req or s in inbound else ""
            print(f"  {n:>4}  {'#' * lvl} {text}   [#{s}]{mark}")
        if missing:
            print(f"\n!! MISSING {len(missing)}: " + ", ".join('#' + m for m in missing))
        return 0

    print(f"{'REQ':>4}  {'ADDON':>5}  page")
    for p in sorted(pages, key=lambda p: -(len(addon.get(p, {})) + len(wiki.get(p, {})))):
        n_a, n_w = len(addon.get(p, {})), len(wiki.get(p, {}))
        print(f"{n_a + n_w:>4}  {sum(addon.get(p, {}).values()):>5}  {p}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
