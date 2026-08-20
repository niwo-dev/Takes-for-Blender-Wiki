"""Check that add-on deep-links land on something the reader can actually read.

Most readers do not browse this wiki -- they right-click a control in Blender,
choose "Online Manual", and get dropped at `page/#anchor`. Folding detail into
`??? info` blocks is good for browsing, but it fails that reader if the ONLY
thing under their anchor is a closed fold: they arrive, and the answer is
invisible until they guess to click.

This reports wired anchors whose section has little or no open content. The fix
is not to unfold everything -- it is to put one or two plain sentences under the
heading, or to open the fold by default with `???+` where the table IS the answer.

Run `dev/wiki_gate.py` first so `site/` is current.

Usage:
    python dev/landing_check.py            # anchors with < 12 open words
    python dev/landing_check.py --min 20   # stricter
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter
from pathlib import Path

WIKI_ROOT = Path(__file__).resolve().parent.parent
SITE = WIKI_ROOT / "site"
WIRE = WIKI_ROOT.parent / "Takes-for-Blender" / "doc" / "reports" / "data" / "wire_assignments.json"

CLOSED = re.compile(r'(?is)<details(?![^>]*\bopen\b)[^>]*>.*?</details>')
TAGS = re.compile(r'(?is)<[^>]+>')
HEADING = re.compile(r'(?is)<h([2-6])[^>]*\sid="([^"]+)"[^>]*>')


def wired():
    out = Counter()
    if not WIRE.is_file():
        return out
    for _rna, target in json.loads(WIRE.read_text(encoding="utf-8"))["assignments"].items():
        page, _, anchor = target.partition("#")
        if anchor:
            out[(page.strip("/"), anchor)] += 1
    return out


def open_words_by_anchor(page):
    """{anchor: open-word-count} for one built page."""
    html_file = SITE / page / "index.html"
    if not html_file.is_file():
        return None
    html = html_file.read_text(encoding="utf-8", errors="replace")
    m = re.search(r'(?is)<article\b[^>]*>(.*?)</article>', html)
    body = m.group(1) if m else html
    # Drop closed folds entirely -- their text is not on screen.
    body = CLOSED.sub(" ", body)

    spans, marks = {}, [(mm.start(), mm.group(2)) for mm in HEADING.finditer(body)]
    for i, (pos, anchor) in enumerate(marks):
        end = marks[i + 1][0] if i + 1 < len(marks) else len(body)
        text = TAGS.sub(" ", body[pos:end])
        spans[anchor] = len(text.split())
    return spans


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--min", type=int, default=12,
                    help="open words a wired section should have (default 12)")
    args = ap.parse_args()

    if not SITE.is_dir():
        print("ERROR: site/ not built. Run `python dev/wiki_gate.py` first.")
        return 2

    cache, thin, unresolved = {}, [], []
    for (page, anchor), controls in wired().items():
        if page not in cache:
            cache[page] = open_words_by_anchor(page)
        spans = cache[page]
        if spans is None:
            continue
        if anchor not in spans:
            unresolved.append((controls, page, anchor))
        elif spans[anchor] < args.min:
            thin.append((controls, page, anchor, spans[anchor]))

    print(f"=== WIRED SECTIONS WITH UNDER {args.min} OPEN WORDS ({len(thin)}) ===")
    print("  A reader arriving here from a right-click sees almost nothing until")
    print("  they open a fold. Add a sentence, or make the fold `???+` (open).\n")
    for controls, page, anchor, n in sorted(thin, reverse=True):
        print(f"  {controls:>4} controls  {n:>3} open words  {page}#{anchor}")
    if not thin:
        print("  none — every wired section says something on arrival")

    if unresolved:
        print(f"\n=== ANCHOR NOT FOUND ON PAGE ({len(unresolved)}) ===")
        for controls, page, anchor in sorted(unresolved, reverse=True):
            print(f"  {controls:>4} controls  {page}#{anchor}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
