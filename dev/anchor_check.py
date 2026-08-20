"""Anchor safety net for the wiki rebuild.

The add-on's right-click "Online Manual" deep-links ~867 UI controls straight at
`page/#anchor` targets, wired in the add-on repo's
`doc/reports/data/wire_assignments.json`. Moving or re-heading a wiki page can
silently break those links: mkdocs --strict only checks links *between docs*, it
knows nothing about targets stored in the add-on.

This script resolves every wired target against the freshly built `site/` and
reports which ones no longer land. Run `dev/wiki_gate.py` first so `site/` is
current.

Usage:
    python dev/anchor_check.py                    # check against site/
    python dev/anchor_check.py --freeze           # also write the baseline
    python dev/anchor_check.py --compare          # diff against the baseline
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

WIKI_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_ADDON_ROOT = WIKI_ROOT.parent / "Takes-for-Blender"
SITE = WIKI_ROOT / "site"
BASELINE = Path(__file__).resolve().parent / "anchor_baseline.json"

ID_RE = re.compile(r'\sid="([^"]+)"')


def load_targets(addon_root: Path) -> dict[str, str]:
    path = addon_root / "doc" / "reports" / "data" / "wire_assignments.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    return data["assignments"]


def page_ids(page_path: str) -> set[str] | None:
    """Return the HTML ids on a built page, or None if the page is missing."""
    html = SITE / page_path.strip("/") / "index.html"
    if not html.is_file():
        html = SITE / (page_path.strip("/") + ".html")
    if not html.is_file():
        return None
    return set(ID_RE.findall(html.read_text(encoding="utf-8", errors="replace")))


def check(targets: dict[str, str]) -> dict:
    cache: dict[str, set[str] | None] = {}
    ok: list[str] = []
    missing_page: list[tuple[str, str]] = []
    missing_anchor: list[tuple[str, str]] = []

    for control, target in sorted(targets.items()):
        page, _, anchor = target.partition("#")
        page = page.strip("/")
        if page not in cache:
            cache[page] = page_ids(page)
        ids = cache[page]

        if ids is None:
            missing_page.append((control, target))
        elif anchor and anchor not in ids:
            missing_anchor.append((control, target))
        else:
            ok.append(control)

    return {
        "total": len(targets),
        "ok": len(ok),
        "missing_page": missing_page,
        "missing_anchor": missing_anchor,
        "pages_referenced": sorted(p for p in cache),
    }


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--addon-root", type=Path, default=DEFAULT_ADDON_ROOT)
    ap.add_argument("--freeze", action="store_true",
                    help="write the current result as the baseline")
    ap.add_argument("--compare", action="store_true",
                    help="report regressions against the frozen baseline")
    args = ap.parse_args()

    if not SITE.is_dir():
        print("ERROR: site/ not built. Run `python dev/wiki_gate.py` first.")
        return 2

    result = check(load_targets(args.addon_root.resolve()))
    broken = result["missing_page"] + result["missing_anchor"]

    print(f"wired controls   : {result['total']}")
    print(f"pages referenced : {len(result['pages_referenced'])}")
    print(f"resolving        : {result['ok']}")
    print(f"broken           : {len(broken)}")

    for label, rows in (("MISSING PAGE", result["missing_page"]),
                        ("MISSING ANCHOR", result["missing_anchor"])):
        if rows:
            print(f"\n{label} ({len(rows)}):")
            for control, target in rows[:40]:
                print(f"  {control:<52} -> {target}")
            if len(rows) > 40:
                print(f"  ... and {len(rows) - 40} more")

    if args.freeze:
        BASELINE.write_text(json.dumps({
            "total": result["total"],
            "ok": result["ok"],
            "broken": sorted(t for _, t in broken),
            "pages_referenced": result["pages_referenced"],
        }, indent=2), encoding="utf-8")
        print(f"\nBaseline frozen -> {BASELINE}")

    if args.compare:
        if not BASELINE.is_file():
            print("\nNo baseline to compare against. Run with --freeze first.")
            return 2
        base = json.loads(BASELINE.read_text(encoding="utf-8"))
        was_broken = set(base["broken"])
        now_broken = {t for _, t in broken}
        regressions = sorted(now_broken - was_broken)
        fixed = sorted(was_broken - now_broken)
        print(f"\nvs baseline: {len(regressions)} new breakage(s), {len(fixed)} fixed")
        for t in regressions:
            print(f"  NEW BREAK  {t}")
        if regressions:
            return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
