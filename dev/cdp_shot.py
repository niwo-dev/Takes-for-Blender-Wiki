"""Save one real screenshot of a page at a given viewport width.

The other CDP tools measure geometry or hash frames; neither can answer "what
does it LOOK like". This one just looks.

Usage:  python dev/cdp_shot.py <url> <out.png> [--width N] [--height N] [--js file.js]

With --js, the script is run (awaited) before the shot -- scroll somewhere,
open a drawer, walk into a state worth photographing.
"""

from __future__ import annotations

import base64
import json
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

import websocket

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 9335


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
    if len(sys.argv) < 3:
        print(__doc__)
        return 2
    url, out = sys.argv[1], Path(sys.argv[2])
    width = int(sys.argv[sys.argv.index("--width") + 1]) if "--width" in sys.argv else 420
    height = int(sys.argv[sys.argv.index("--height") + 1]) if "--height" in sys.argv else 900
    js = Path(sys.argv[sys.argv.index("--js") + 1]).read_text(encoding="utf-8") \
        if "--js" in sys.argv else None

    proc = subprocess.Popen(
        [CHROME, "--headless=new", "--disable-gpu", "--force-device-scale-factor=1",
         f"--remote-debugging-port={PORT}", "--remote-allow-origins=*",
         "--no-first-run", "--no-default-browser-check",
         f"--window-size={width},{height}",
         "--user-data-dir=" + str(Path.home() / ".cdp-shot-profile"), url],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        ws = websocket.create_connection(target(), timeout=60)
        mid = [0]

        def send(method, params=None):
            mid[0] += 1
            ws.send(json.dumps({"id": mid[0], "method": method, "params": params or {}}))
            while True:
                m = json.loads(ws.recv())
                if m.get("id") == mid[0]:
                    return m

        send("Runtime.enable")
        send("Page.enable")
        time.sleep(1.2)                      # let fonts and JS settle
        if js:
            r = send("Runtime.evaluate", {"expression": js, "awaitPromise": True,
                                          "returnByValue": True, "timeout": 30000})
            if "exceptionDetails" in r.get("result", {}):
                print("JS ERROR:", json.dumps(r["result"]["exceptionDetails"])[:300])
            time.sleep(0.4)
        m = send("Page.captureScreenshot", {"format": "png"})
        out.write_bytes(base64.b64decode(m["result"]["data"]))
        print(f"wrote {out}")
        return 0
    finally:
        proc.terminate()


if __name__ == "__main__":
    raise SystemExit(main())
