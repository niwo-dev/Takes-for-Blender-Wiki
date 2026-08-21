"""Answer "does anything actually MOVE on screen" for a UI interaction.

A computed transform can animate while the reader sees nothing -- a clipped or
hidden element still reports moving values. `cdp_probe.py` measures the former;
this measures the latter, by screenshotting rapidly across the interaction on a
single DevTools connection and counting how many frames are visually distinct.

    1 distinct frame   nothing moved (or the capture missed the window)
    2 distinct frames  it jumped between two states
    many               it animated

Usage:
    python dev/cdp_anim.py <url> <setup.js> <action.js> [--width N] [--frames N]

`setup.js` runs first and is awaited (open the drawer, walk into a submenu).
`action.js` is fired WITHOUT waiting, and capture starts immediately after.
"""

from __future__ import annotations

import base64
import hashlib
import json
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

import websocket

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 9334


def target(timeout=25):
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            with urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json", timeout=2) as r:
                for t in json.load(r):
                    if t.get("type") == "page" and t.get("webSocketDebuggerUrl"):
                        return t["webSocketDebuggerUrl"]
        except Exception:
            pass
        time.sleep(0.4)
    raise SystemExit("Chrome debugging endpoint unreachable")


def main() -> int:
    if len(sys.argv) < 4:
        print(__doc__)
        return 2
    url, setup_js, action_js = sys.argv[1], sys.argv[2], sys.argv[3]
    width = int(sys.argv[sys.argv.index("--width") + 1]) if "--width" in sys.argv else 1500
    frames = int(sys.argv[sys.argv.index("--frames") + 1]) if "--frames" in sys.argv else 14

    proc = subprocess.Popen(
        [CHROME, "--headless=new", "--disable-gpu", "--force-device-scale-factor=1",
         f"--remote-debugging-port={PORT}", "--remote-allow-origins=*",
         "--no-first-run", "--no-default-browser-check",
         f"--window-size={width},900",
         "--user-data-dir=" + str(Path.home() / ".cdp-anim-profile"), url],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        ws = websocket.create_connection(target(), timeout=60)
        mid = [0]

        def send(method, params=None, wait=True):
            mid[0] += 1
            i = mid[0]
            ws.send(json.dumps({"id": i, "method": method, "params": params or {}}))
            if not wait:
                return None
            while True:
                m = json.loads(ws.recv())
                if m.get("id") == i:
                    return m

        send("Runtime.enable")
        send("Page.enable")

        r = send("Runtime.evaluate", {
            "expression": Path(setup_js).read_text(encoding="utf-8"),
            "awaitPromise": True, "returnByValue": True, "timeout": 40000})
        if "exceptionDetails" in r.get("result", {}):
            print("SETUP FAILED:", json.dumps(r["result"]["exceptionDetails"])[:400])
            return 1
        print("setup:", json.dumps(r["result"].get("result", {}).get("value")))

        # Fire the action without waiting, then capture as fast as the socket
        # allows -- the whole point is to land inside the transition.
        send("Runtime.evaluate", {
            "expression": Path(action_js).read_text(encoding="utf-8"),
            "awaitPromise": False, "returnByValue": True}, wait=False)

        shots = []
        for _ in range(frames):
            m = send("Page.captureScreenshot", {"format": "png"})
            data = m.get("result", {}).get("data", "")
            if data:
                shots.append(hashlib.sha1(base64.b64decode(data)).hexdigest()[:8])

        print("frames:", " ".join(shots))
        print(f"distinct: {len(set(shots))} of {len(shots)}")
        print("verdict:", "ANIMATED" if len(set(shots)) > 2
              else ("JUMPED" if len(set(shots)) == 2 else "NO VISIBLE CHANGE"))
        return 0
    finally:
        proc.terminate()


if __name__ == "__main__":
    sys.exit(main())
