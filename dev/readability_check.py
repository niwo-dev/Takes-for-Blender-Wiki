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
# `??? info "..."` renders as a COLLAPSED <details>. Its body is real content the
# reader can reach, but it is not on screen until they ask for it -- which is the
# whole point of folding detail away. `???+` renders as <details open> and counts.
COLLAPSED = re.compile(r'(?is)<details(?![^>]*\bopen\b)[^>]*>.*?</details>')


def visible_text(html: str, *, folded=False) -> str:
    body = STRIP_BLOCKS.sub(" ", html)
    # The article element holds the page body; fall back to the whole document.
    m = re.search(r'(?is)<article\b[^>]*>(.*?)</article>', body)
    if m:
        body = m.group(1)
    if not folded:
        # Keep the <summary> label -- that line IS on screen.
        body = COLLAPSED.sub(
            lambda d: ' '.join(re.findall(r'(?is)<summary[^>]*>(.*?)</summary>', d.group())),
            body)
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
        html = f.read_text(encoding="utf-8", errors="replace")
        text = visible_text(html)
        # Dev talk is measured on the FULL page: an idname hidden in a fold is
        # still an idname the reader can hit.
        ids = DEV_ID.findall(visible_text(html, folded=True))
        words = len(text.split())
        if ids:
            dev_rows.append((len(ids), rel, sorted(set(ids))[:3]))
            total_ids += len(ids)
        if words > args.budget:
            long_rows.append((words, rel, len(visible_text(html, folded=True).split())))

    print(f"=== DEV TALK (visible identifiers) — {total_ids} on {len(dev_rows)} pages ===")
    for n, rel, sample in sorted(dev_rows, reverse=True):
        print(f"  {n:>4}  {rel:<38} e.g. {', '.join(sample)}")
    if not dev_rows:
        print("  none — clean")

    print(f"\n=== OVER WORD BUDGET ({args.budget}) — {len(long_rows)} pages ===")
    print(f"  {'ON SCREEN':>9}  {'TOTAL':>6}  page")
    for n, rel, full in sorted(long_rows, reverse=True):
        print(f"  {n:>9}  {full:>6}  {rel}")
    if not long_rows:
        print("  none — clean")
    print("\n  ON SCREEN excludes collapsed ??? blocks; TOTAL counts everything.")

    return 0


if __name__ == "__main__":
    sys.exit(main())
