"""Drive a real Chrome over the DevTools Protocol and run JS in the page.

Why this exists: `chrome --headless --dump-dom --virtual-time-budget` cannot
observe CSS transitions. Virtual time fast-forwards timers but leaves transition
values pinned, so a working animation and a broken one both sample as a constant
-- which made every measurement of the drawer's sliding meaningless, including
at mobile width where it demonstrably works.

This attaches to a real page instead, so transitions actually run.

Usage:
    python dev/cdp_probe.py <url> <path-to-js-file> [--width 1500] [--height 900]

The JS file's last expression must be a Promise resolving to something
JSON-serialisable; its value is printed.
"""

from __future__ import annotations

import json
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

import websocket  # websocket-client

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 9333


def wait_for_target(timeout=25):
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
    raise SystemExit("could not reach Chrome's debugging endpoint")


def main() -> int:
    if len(sys.argv) < 3:
        print(__doc__)
        return 2
    url, js_path = sys.argv[1], sys.argv[2]
    width = int(sys.argv[sys.argv.index("--width") + 1]) if "--width" in sys.argv else 1500
    height = int(sys.argv[sys.argv.index("--height") + 1]) if "--height" in sys.argv else 900

    proc = subprocess.Popen(
        [CHROME, "--headless=new", "--disable-gpu", "--force-device-scale-factor=1",
         f"--remote-debugging-port={PORT}", "--remote-allow-origins=*",
         "--no-first-run", "--no-default-browser-check",
         f"--window-size={width},{height}", "--user-data-dir=" + str(Path.home() / ".cdp-profile"),
         url],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    try:
        ws = websocket.create_connection(wait_for_target(), timeout=60)
        ws.send(json.dumps({"id": 1, "method": "Runtime.enable"}))
        ws.recv()

        script = Path(js_path).read_text(encoding="utf-8")
        ws.send(json.dumps({
            "id": 2,
            "method": "Runtime.evaluate",
            "params": {"expression": script, "awaitPromise": True,
                       "returnByValue": True, "timeout": 45000},
        }))
        while True:
            msg = json.loads(ws.recv())
            if msg.get("id") == 2:
                break
        ws.close()

        # --frames N: after the script resolves, grab N screenshots and report
        # how many are visually distinct. That answers "does anything MOVE on
        # screen", which a computed transform cannot -- a clipped element can
        # animate its transform while showing nothing.
        if "--frames" in sys.argv:
            import base64, hashlib
            n = int(sys.argv[sys.argv.index("--frames") + 1])
            shots = []
            for i in range(n):
                ws2 = websocket.create_connection(wait_for_target(), timeout=30)
                ws2.send(json.dumps({"id": 10 + i, "method": "Page.captureScreenshot",
                                     "params": {"format": "png"}}))
                while True:
                    m2 = json.loads(ws2.recv())
                    if m2.get("id") == 10 + i:
                        break
                ws2.close()
                data = m2.get("result", {}).get("data", "")
                shots.append(hashlib.sha1(base64.b64decode(data)).hexdigest()[:10])
                time.sleep(0.03)
            print("frame hashes:", shots)
            print("distinct frames:", len(set(shots)), "of", len(shots))

        res = msg.get("result", {})
        if "exceptionDetails" in res:
            print("JS ERROR:", json.dumps(res["exceptionDetails"])[:600])
            return 1
        print(json.dumps(res.get("result", {}).get("value"), indent=2))
        return 0
    finally:
        proc.terminate()


if __name__ == "__main__":
    sys.exit(main())
