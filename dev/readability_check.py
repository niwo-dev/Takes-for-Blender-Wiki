"""Readability gate for the user wiki.

Two things this measures that mkdocs cannot:

1. **Dev talk.** The wiki is read by artists, not scripters. An operator idname
   (`tks.add_take`) or an RNA path in the RENDERED page tells the reader nothing
   they can act on -- it only signals "this page is not for you". Note it counts
   the BUILT html, not the markdown, because `{{ op('tks.x').bl_label }}` macros
   are identifiers in source that render as the real button label. Counting
   source would flag the very pattern we want people to use.

2. **Page length.** Long pages get skimmed, and skimmed pages get misread. The
   house budget is ~300 visible words; detail belongs in a collapsed
   `??? info` block or on a page of its own.

Run `dev/wiki_gate.py` first so `site/` is current.

Usage:
    python dev/readability_check.py               # report
    python dev/readability_check.py --budget 300  # custom word budget
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

WIKI_ROOT = Path(__file__).resolve().parent.parent
SITE = WIKI_ROOT / "site"

# Generated pages mirror add-on sources; they are not hand-written user docs.
SKIP_PREFIXES = ("roadmap", "changelog", "assets", "admin")

DEV_ID = re.compile(r"\btks\.[a-z_]+|bpy\.(?:ops|types|context|data)\.[A-Za-z_.]+")
STRIP_BLOCKS = re.compile(r"(?is)<(script|style|nav|head|footer)\b.*?</\1>")
TAGS = re.compile(r"(?is)<[^>]+>")


def visible_text(html: str) -> str:
    body = STRIP_BLOCKS.sub(" ", html)
    # The article element holds the page body; fall back to the whole document.
    m = re.search(r'(?is)<article\b[^>]*>(.*?)</article>', body)
    if m:
        body = m.group(1)
    return TAGS.sub(" ", body)


def pages():
    for f in sorted(SITE.rglob("index.html")):
        rel = f.parent.relative_to(SITE).as_posix()
        if rel == ".":
            rel = "(home)"
        elif rel.startswith(SKIP_PREFIXES):
            continue
        yield rel, f


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--budget", type=int, default=300,
                    help="visible-word budget per page (default 300)")
    args = ap.parse_args()

    if not SITE.is_dir():
        print("ERROR: site/ not built. Run `python dev/wiki_gate.py` first.")
        return 2

    dev_rows, long_rows, total_ids = [], [], 0
    for rel, f in pages():
        text = visible_text(f.read_text(encoding="utf-8", errors="replace"))
        ids = DEV_ID.findall(text)
        words = len(text.split())
        if ids:
            dev_rows.append((len(ids), rel, sorted(set(ids))[:3]))
            total_ids += len(ids)
        if words > args.budget:
            long_rows.append((words, rel))

    print(f"=== DEV TALK (visible identifiers) — {total_ids} on {len(dev_rows)} pages ===")
    for n, rel, sample in sorted(dev_rows, reverse=True):
        print(f"  {n:>4}  {rel:<38} e.g. {', '.join(sample)}")
    if not dev_rows:
        print("  none — clean")

    print(f"\n=== OVER WORD BUDGET ({args.budget}) — {len(long_rows)} pages ===")
    for n, rel in sorted(long_rows, reverse=True):
        print(f"  {n:>5}  {rel}")
    if not long_rows:
        print("  none — clean")

    return 0


if __name__ == "__main__":
    sys.exit(main())
