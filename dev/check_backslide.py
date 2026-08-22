"""Assert the drawer's nested panels stay VISIBLE while they slide out.

The failure this guards against is invisible to a transform-only check, which
is why it survived two fix attempts: going back, the panel's `transform` DOES
animate 0 -> 100% exactly as it should. Material's desktop stylesheet also sets

    .md-nav__toggle~.md-nav { visibility: collapse; transition: ..., visibility 0ms .25s }

and the ported mobile rules replace `transition` wholesale without declaring
`visibility`. Losing that `.25s` delay means the panel collapses at t=0 and the
slide runs where nobody can see it.

So this measures `visibility` across the backward transition, at desktop AND at
mobile width -- mobile is the reference the desktop drawer is meant to match.

Usage:  python dev/check_backslide.py
Exit 0 = both widths stay visible through the slide.
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

WIKI = Path(__file__).resolve().parent.parent
PORT = 8901
PROBE = WIKI / "dev" / "probe_backslide.js"


def serve():
    handler = partial(SimpleHTTPRequestHandler, directory=str(WIKI / "site"))
    httpd = ThreadingHTTPServer(("127.0.0.1", PORT), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


def measure(width):
    out = subprocess.run(
        [sys.executable, str(WIKI / "dev" / "cdp_probe.py"),
         f"http://127.0.0.1:{PORT}/faq/", str(PROBE), "--width", str(width)],
        capture_output=True, text=True, timeout=180).stdout
    m = re.search(r"\{.*\}", out, re.S)
    if not m:
        raise SystemExit(f"probe returned no JSON at {width}px:\n{out[:400]}")
    return json.loads(m.group())


def main() -> int:
    if not (WIKI / "site" / "faq" / "index.html").exists():
        print("ERROR: no built site. Run a build first.")
        return 2
    httpd = serve()
    try:
        failures = []
        for width, label in ((1500, "desktop"), (420, "mobile")):
            r = measure(width)
            if "error" in r:
                raise SystemExit(f"{label}: {r['error']}")
            back = r["backward"]
            xs = [int(s.split()[0]) for s in back]
            end = max(xs)
            # Mid-flight only. Once the panel has parked at its final x it is
            # allowed -- required, in fact -- to be hidden again.
            flight = [s for s, x in zip(back, xs) if 0 < x < end]
            hidden = [s for s in flight if "visible" not in s]
            moved = len(set(xs)) > 2
            print(f"  {label:8} {width}px  backward: "
                  f"{'MOVES' if moved else 'STATIC'}, "
                  f"{len(flight) - len(hidden)}/{len(flight)} mid-slide samples visible"
                  f"  |  parked: open={r['parkedOpen']['reach']}, "
                  f"shut={r['parkedShut']['reach']}")
            if not moved:
                failures.append(f"{label}: transform never moved going back")
            elif not flight:
                failures.append(f"{label}: never sampled mid-slide -- test is blind")
            elif hidden:
                failures.append(f"{label}: {len(hidden)} sample(s) hidden mid-slide "
                                f"-- e.g. {hidden[0]}")
            for state in ("parkedOpen", "parkedShut"):
                if r[state]["reach"] == "REACHABLE":
                    failures.append(
                        f"{label}: a parked panel is still clickable ({state}) "
                        f"-- visibility {r[state]['vis']}")
        print()
        if failures:
            for f in failures:
                print(f"  FAIL  {f}")
            return 1
        print("  PASS  the panel is visible while it slides and unreachable once parked")
        return 0
    finally:
        httpd.shutdown()


if __name__ == "__main__":
    raise SystemExit(main())
