"""Drive Chrome over the DevTools Protocol for the section focus pop-up.

Two jobs, both against a site served on localhost (see the serve command in
the report / `python -m http.server <port> -d <built site>`):

    python dev/check_section_focus.py shots  <base-url> <out-dir>
    python dev/check_section_focus.py probe  <base-url> [--only NAME]

`shots` takes the before/after pairs (landing, heading click, after close) at
1440x900 and 390x844 into <out-dir>. `probe` runs every measured look rule and
behaviour point and prints one JSON line per check; the in-page measuring code
lives in dev/probe_section_focus.js.

Real input (mouse, Tab, Esc) goes through Input.dispatch*, so focus-visible,
hit testing and the click path are the browser's own.
"""

from __future__ import annotations

import base64
import json
import subprocess
import sys
import tempfile
import time
import urllib.request
from pathlib import Path

import websocket  # websocket-client

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 9341
HERE = Path(__file__).resolve().parent
PROBE_JS = HERE / "probe_section_focus.js"

PAGE = "features/custom_tokens/"
LONG = "tutorial-your-first-custom-token"     # long, has details + code
SHORT = "token-presets"
LAST = "every-token-setting"                    # ends at the page end
MID = "managing-your-tokens"
SIZES = {"1440": (1440, 900, False), "390": (390, 844, True)}


class Chrome:
    def __init__(self, width, height, mobile=False):
        self.profile = tempfile.mkdtemp(prefix="sf-profile-", dir=str(HERE / "temp"))
        self.proc = subprocess.Popen(
            [CHROME, "--headless=new", "--disable-gpu", "--force-device-scale-factor=1",
             f"--remote-debugging-port={PORT}", "--remote-allow-origins=*",
             "--no-first-run", "--no-default-browser-check",
             f"--window-size={width},{height}", f"--user-data-dir={self.profile}",
             "about:blank"],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        self.ws = websocket.create_connection(self._target(), timeout=60)
        self._id = 0
        self.errors = []
        self.call("Runtime.enable")
        self.call("Page.enable")
        self.resize(width, height, mobile)

    def _target(self):
        end = time.time() + 25
        while time.time() < end:
            try:
                with urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json", timeout=2) as r:
                    for t in json.load(r):
                        if t.get("type") == "page" and t.get("webSocketDebuggerUrl"):
                            return t["webSocketDebuggerUrl"]
            except Exception:
                pass
            time.sleep(0.3)
        raise SystemExit("Chrome debugging endpoint unreachable")

    def call(self, method, params=None):
        self._id += 1
        mid = self._id
        self.ws.send(json.dumps({"id": mid, "method": method, "params": params or {}}))
        while True:
            msg = json.loads(self.ws.recv())
            if msg.get("method") == "Runtime.exceptionThrown":
                d = msg["params"]["exceptionDetails"]
                self.errors.append(d.get("exception", {}).get("description") or d.get("text"))
            if msg.get("id") == mid:
                if "error" in msg:
                    raise RuntimeError(f"{method}: {msg['error']}")
                return msg.get("result", {})

    def resize(self, width, height, mobile=False):
        self.call("Emulation.setDeviceMetricsOverride", {
            "width": width, "height": height, "deviceScaleFactor": 1, "mobile": mobile})
        self.width, self.height = width, height

    def js(self, expr):
        res = self.call("Runtime.evaluate", {
            "expression": expr, "awaitPromise": True, "returnByValue": True,
            "timeout": 60000})
        if "exceptionDetails" in res:
            d = res["exceptionDetails"]
            raise RuntimeError(d.get("exception", {}).get("description") or str(d))
        return res.get("result", {}).get("value")

    def goto(self, url, settle=0.0):
        self.call("Page.navigate", {"url": "about:blank"})
        time.sleep(0.15)
        self.call("Page.navigate", {"url": url})
        end = time.time() + 30
        while time.time() < end:
            try:
                if self.js("document.readyState") == "complete" and \
                        self.js("!!document.querySelector('.md-content__inner')"):
                    break
            except RuntimeError:
                pass
            time.sleep(0.1)
        self.install_probe()
        time.sleep(settle)

    def install_probe(self):
        self.js(PROBE_JS.read_text(encoding="utf-8"))

    def click(self, x, y):
        for kind in ("mouseMoved", "mousePressed", "mouseReleased"):
            self.call("Input.dispatchMouseEvent", {
                "type": kind, "x": x, "y": y, "button": "left", "buttons": 1,
                "clickCount": 1})

    def key(self, key, code, vk, shift=False):
        mod = 8 if shift else 0
        for kind in ("rawKeyDown", "keyUp"):
            self.call("Input.dispatchKeyEvent", {
                "type": kind, "key": key, "code": code, "windowsVirtualKeyCode": vk,
                "modifiers": mod})

    def shot(self, path):
        data = self.call("Page.captureScreenshot", {"format": "png"})["data"]
        Path(path).parent.mkdir(parents=True, exist_ok=True)
        Path(path).write_bytes(base64.b64decode(data))

    def close(self):
        try:
            self.ws.close()
        finally:
            self.proc.terminate()


def wait_for(chrome, expr, timeout=5.0):
    end = time.time() + timeout
    while time.time() < end:
        if chrome.js(expr):
            return True
        time.sleep(0.05)
    return False


def click_title(chrome, hid, top=220):
    """Scroll the heading to a fixed place, then click on its title text."""
    chrome.js(f"sf.scrollHeadingTo({json.dumps(hid)}, {top})")
    time.sleep(0.25)
    x, y = title_point(chrome, hid)
    chrome.click(x, y)


def title_point(chrome, hid):
    """Viewport point on the heading's text, scrolled to a fixed place."""
    return chrome.js(f"sf.titlePoint({json.dumps(hid)})")


# ---- shots -----------------------------------------------------------------

def run_shots(base, out):
    out = Path(out)
    for tag, (w, h, mobile) in SIZES.items():
        c = Chrome(w, h, mobile)
        try:
            url = base.rstrip("/") + "/" + PAGE
            # landing: the add-on URL just after load
            c.goto(url + "#" + LONG)
            wait_for(c, "!!document.querySelector('.tks-focus, .tks-target-mark')")
            time.sleep(0.8)
            c.shot(out / f"landing_{tag}.png")

            # heading click: a mid-page heading clicked
            c.goto(url)
            c.js(f"sf.scrollHeadingTo({json.dumps(MID)}, 220)")
            time.sleep(0.4)
            click_title(c, MID)
            time.sleep(0.8)
            c.shot(out / f"heading_click_{tag}.png")

            # after close: 500 ms after closing with a click outside
            c.goto(url + "#" + LONG)
            if wait_for(c, "!!document.querySelector('.tks-focus')", 2.5):
                c.click(6, 6)
                wait_for(c, "!!document.querySelector('.tks-target-mark')", 1)
            else:  # before build: no pop-up, the band is the same moment
                wait_for(c, "!!document.querySelector('.tks-target-mark')", 3)
            time.sleep(0.5)
            c.shot(out / f"after_close_{tag}.png")
        finally:
            c.close()
        errs = sorted({e.splitlines()[0] for e in c.errors if e})
        if errs:
            print("JS errors", tag, errs)


# ---- probe -----------------------------------------------------------------

RESULTS = []


def report(name, passed, **values):
    RESULTS.append((name, passed))
    print(json.dumps({"check": name, "pass": passed, **values}, default=str), flush=True)


def probe_desktop(base):
    c = Chrome(1440, 900, False)
    url = base.rstrip("/") + "/" + PAGE
    try:
        # ---- heading click: SM1, scrim, AL, SP3, close, width, TY, a11y ----
        c.goto(url)
        # the contents panel's scrim, for the backdrop comparison
        c.js("document.querySelector('.tks-toc-fab').click()")
        time.sleep(0.3)
        toc = c.js("sf.scrimStyle('.tks-toc-scrim')")
        c.js("document.body.click()")
        time.sleep(0.2)

        c.js(f"sf.scrollHeadingTo({json.dumps(LONG)}, 140)")
        time.sleep(0.3)
        before = c.js(f"sf.pageState({json.dumps(LONG)})")
        x, y = title_point(c, LONG)
        c.click(x, y)
        opened = wait_for(c, "!!document.querySelector('.tks-focus')", 2)
        time.sleep(0.4)
        report("trigger-heading-click-opens", opened)
        report("no-band-while-open", c.js("!document.querySelector('.tks-target-mark')"))
        during = c.js(f"sf.pageState({json.dumps(LONG)})")
        report("SM1-during", abs(during["scrollY"] - before["scrollY"]) <= 0 and
               abs(during["headTop"] - before["headTop"]) <= 0 and
               abs(during["headLeft"] - before["headLeft"]) <= 0 and
               abs(during["docH"] - before["docH"]) <= 0,
               before=before, during=during)
        scrim = c.js("sf.scrimStyle('.tks-focus-scrim')")
        report("scrim-backdrop", scrim["backdropFilter"] == toc["backdropFilter"] and
               scrim["backgroundColor"] == toc["backgroundColor"], toc=toc, focus=scrim)
        geo = c.js("sf.geometry()")
        report("AL-centred", abs(geo["gapL"] - geo["gapR"]) <= 1, gapL=geo["gapL"], gapR=geo["gapR"],
               gapT=geo["gapT"], gapB=geo["gapB"])
        report("SP3-padding", abs(geo["padL"] - geo["padR"]) <= 0.5 and
               abs(geo["padT"] - geo["padB"]) <= 0.5,
               padL=geo["padL"], padR=geo["padR"], padT=geo["padT"], padB=geo["padB"])
        report("close-inset-hit", abs(geo["closeTop"] - geo["closeRight"]) <= 1 and
               geo["closeW"] >= 32 and geo["closeH"] >= 32,
               top=geo["closeTop"], right=geo["closeRight"], w=geo["closeW"], h=geo["closeH"])
        report("width-vs-page-column", abs(geo["textW"] - geo["pageTextW"]) <= 1,
               panelText=geo["textW"], pageText=geo["pageTextW"])
        report("height-85vh", geo["boxH"] <= 0.85 * geo["vh"] + 0.5, boxH=geo["boxH"], vh=geo["vh"])
        report("TY-type", c.js(f"sf.typeCompare({json.dumps(LONG)})")["same"],
               detail=c.js(f"sf.typeCompare({json.dumps(LONG)})"))
        con = c.js("sf.contrast()")
        report("contrast-dark", con["dark"] >= 4.5, ratio=con["dark"])
        report("contrast-light", con["light"] >= 4.5, ratio=con["light"])
        ln = c.js("sf.lines()")
        report("lines", ln["borderWidth"] == "1px" and 1.05 <= ln["borderContrast"] <= 1.35,
               **ln)
        report("a11y-attrs", c.js("sf.a11y()")["ok"], detail=c.js("sf.a11y()"))
        report("content-intact", c.js(f"sf.contentIntact({json.dumps(LONG)})")["ok"],
               detail=c.js(f"sf.contentIntact({json.dumps(LONG)})"))
        report("ids-unique", c.js("sf.dupIds()") == [], dups=c.js("sf.dupIds()"))
        # keyboard: focus inside, Tab stays inside, visible focus ring
        report("focus-into-popup", c.js("sf.focusInside()"))
        stays = True
        rings = None
        for i in range(14):
            c.key("Tab", "Tab", 9)
            st = c.js("sf.focusInside()")
            stays = stays and st
            if i == 0:
                rings = c.js("sf.focusRing()")
        for i in range(6):
            c.key("Tab", "Tab", 9, shift=True)
            stays = stays and c.js("sf.focusInside()")
        report("tab-trap", stays)
        report("close-focus-ring", rings and rings["isClose"] and rings["outlineWidth"] != "0px"
               and rings["outlineStyle"] != "none", **(rings or {}))
        # heading inside the popup does not open another
        px, py = c.js("sf.popupTitlePoint()")
        c.click(px, py)
        time.sleep(0.2)
        report("popup-heading-no-second", c.js("document.querySelectorAll('.tks-focus').length") == 1)
        # close by Esc; band timing
        t0 = time.time()
        c.key("Escape", "Escape", 27)
        band_now = wait_for(c, "!!document.querySelector('.tks-target-mark')", 0.3)
        band_ms = (time.time() - t0) * 1000
        report("close-esc-band", band_now and not c.js("!!document.querySelector('.tks-focus')"),
               approx_ms=round(band_ms))
        after = c.js(f"sf.pageState({json.dumps(LONG)})")
        report("SM1-after-close", after["scrollY"] == before["scrollY"] and
               after["headTop"] == before["headTop"] and after["docH"] == before["docH"] and
               after["headLeft"] == before["headLeft"] and after["docW"] == before["docW"],
               after=after)
        report("focus-returns-to-heading", c.js(f"document.activeElement.id === {json.dumps(LONG)}"))
        report("band-on-clicked-heading",
               c.js(f"document.querySelector('.tks-target-mark').dataset.target === {json.dumps(LONG)}"))

        # ---- long content scrolls inside the panel (short window, own load) ----
        c.resize(1440, 500)
        c.goto(url)
        click_title(c, LONG, 120)
        wait_for(c, "!!document.querySelector('.tks-focus')", 2)
        time.sleep(0.3)
        g5 = c.js("sf.geometry()")
        sc = c.js("sf.scrollInside()")
        report("height-85vh-short-viewport", g5["boxH"] <= 0.85 * 500 + 0.5, boxH=g5["boxH"], vh=g5["vh"])
        report("scrolls-inside-close-stays", sc["scrollable"] and sc["scrolled"] and sc["closeStays"], **sc)
        c.resize(1440, 900)

        # ---- band timing (in-page, exact) via a scrim click close ----
        c.goto(url)
        click_title(c, SHORT)
        wait_for(c, "!!document.querySelector('.tks-focus')", 2)
        bt = c.js("sf.bandTiming('scrim')")
        report("band-timing", bt["present"] <= 100 and abs(bt["fading"] - 4000) <= 200
               and abs(bt["gone"] - 5000) <= 200, **bt)

        # ---- close by button and by scrim: band appears ----
        for how in ("button", "scrim"):
            c.goto(url)
            click_title(c, SHORT)
            wait_for(c, "!!document.querySelector('.tks-focus')", 2)
            if how == "button":
                bx, by = c.js("sf.closePoint()")
                c.click(bx, by)
            else:
                c.click(5, 5)
            ok = wait_for(c, "!!document.querySelector('.tks-target-mark')", 0.5)
            report(f"close-{how}-band", ok and not c.js("!!document.querySelector('.tks-focus')"))

        # ---- landing (add-on): opens, band starts at close ----
        for hid in (LONG, SHORT, LAST):
            c.goto(url + "#" + hid)
            op = wait_for(c, "!!document.querySelector('.tks-focus')", 2.5)
            time.sleep(0.6)
            nb = c.js("!document.querySelector('.tks-target-mark')")
            info = c.js(f"sf.landingInfo({json.dumps(hid)})")
            report(f"landing-{hid}", op and nb and info["same"], noBandWhileOpen=nb, **info)
        # band's 4 s start at close, not at load: wait past 5 s after load, then close
        c.goto(url + "#" + SHORT)
        wait_for(c, "!!document.querySelector('.tks-focus')", 2.5)
        time.sleep(5.3)
        still = c.js("!!document.querySelector('.tks-focus')")
        c.click(5, 5)
        band = wait_for(c, "!!document.querySelector('.tks-target-mark')", 0.5)
        report("landing-band-starts-at-close", still and band)

        # ---- no pop-up cases ----
        c.goto(url)
        c.js("document.querySelector('.tks-toc-fab').click()")
        time.sleep(0.3)
        c.js("document.querySelector('.tks-toc-panel a[href$=\"#" + SHORT + "\"]').click()")
        time.sleep(0.8)
        report("toc-click-no-popup", c.js("!document.querySelector('.tks-focus')") and
               c.js("!!document.querySelector('.tks-target-mark')"))
        c.js("location.hash = '#" + MID + "'")
        time.sleep(0.8)
        report("hashchange-no-popup", c.js("!document.querySelector('.tks-focus')") and
               c.js("!!document.querySelector('.tks-target-mark')"))
        c.js("sf.injectLink('#" + SHORT + "', 'inpage-link')")
        c.js("document.querySelector('[data-sf=inpage-link]').click()")
        time.sleep(0.8)
        report("inpage-link-no-popup", c.js("!document.querySelector('.tks-focus')"))
        # instant navigation to another page (with a hash naming a heading)
        c.js("sf.injectLink('../smart_output/#build-syntax-token-builder', 'nav-link')")
        c.js("window.__instant = 1")          # survives only if the page was not reloaded
        c.js("document.querySelector('[data-sf=nav-link]').click()")
        time.sleep(1.5)
        report("instant-nav-no-popup", c.js("location.pathname.includes('smart_output')") and
               c.js("window.__instant === 1") and
               c.js("!document.querySelector('.tks-focus')") and
               c.js("!!document.querySelector('.tks-target-mark')"),
               path=c.js("location.pathname"),
               band=c.js("!!document.querySelector('.tks-target-mark')"))
        # permalink
        c.goto(url)
        c.js(f"sf.scrollHeadingTo({json.dumps(MID)}, 220)")
        hx, hy = c.js(f"sf.headerlinkPoint({json.dumps(MID)})")
        c.click(hx, hy)
        time.sleep(0.8)
        report("headerlink-no-popup", c.js("!document.querySelector('.tks-focus')") and
               c.js(f"location.hash === '#{MID}'"), hash=c.js("location.hash"))
        # blank space beside the title does not open
        c.goto(url)
        c.js(f"sf.scrollHeadingTo({json.dumps(MID)}, 220)")
        bx, by = c.js(f"sf.blankPoint({json.dumps(MID)})")
        c.click(bx, by)
        time.sleep(0.4)
        report("blank-beside-title-no-popup", c.js("!document.querySelector('.tks-focus')"))

        # ---- content: details, copy, tabs, links, images ----
        c.goto(url)
        c.js("sf.injectTabs(" + json.dumps(LONG) + ")")
        c.js("sf.injectLink('#" + MID + "', 'sec-link', " + json.dumps(LONG) + ")")
        c.js("sf.injectLink('../smart_output/', 'page-link', " + json.dumps(LONG) + ")")
        c.js("sf.injectImage(" + json.dumps(LONG) + ")")
        click_title(c, LONG, 140)
        wait_for(c, "!!document.querySelector('.tks-focus')", 2)
        time.sleep(0.4)
        report("ids-unique-with-tabs", c.js("sf.dupIds()") == [], dups=c.js("sf.dupIds()"))
        tabs = c.js("sf.tabsTest()")
        report("tabs-switch-in-popup", tabs["ok"], **tabs)
        det = c.js("sf.detailsTest()")
        report("details-toggle", det["ok"], **det)
        cp = c.js("sf.copyTest()")
        report("copy-button-text", cp["ok"], **cp)
        report("images-show", c.js("sf.imagesTest()")["ok"], detail=c.js("sf.imagesTest()"))
        # section link: close then jump + band
        lx, ly = c.js("sf.pointOf('[data-sf=sec-link]')")
        c.click(lx, ly)
        time.sleep(0.6)
        report("section-link-closes-and-jumps", c.js("!document.querySelector('.tks-focus')") and
               c.js(f"location.hash === '#{MID}'") and
               c.js(f"(document.querySelector('.tks-target-mark')||{{dataset:{{}}}}).dataset.target === '{MID}'"),
               hash=c.js("location.hash"))
        # page link
        c.goto(url)
        c.js("sf.injectLink('../smart_output/', 'page-link', " + json.dumps(LONG) + ")")
        click_title(c, LONG)
        wait_for(c, "!!document.querySelector('.tks-focus')", 2)
        lx, ly = c.js("sf.pointOf('[data-sf=page-link]')")
        c.click(lx, ly)
        time.sleep(1.5)
        report("page-link-navigates", c.js("location.pathname.includes('smart_output')") and
               c.js("!document.querySelector('.tks-focus')"), path=c.js("location.pathname"))

        # ---- reduced motion ----
        c.goto(url)
        c.call("Emulation.setEmulatedMedia", {"features": [
            {"name": "prefers-reduced-motion", "value": "reduce"}]})
        click_title(c, SHORT)
        wait_for(c, "!!document.querySelector('.tks-focus')", 2)
        report("reduced-motion-no-animation", c.js(
            "getComputedStyle(document.querySelector('.tks-focus')).animationName === 'none' && "
            "getComputedStyle(document.querySelector('.tks-focus-scrim')).animationName === 'none'"))
        c.call("Emulation.setEmulatedMedia", {"features": []})

        # ---- landing SM1: doc height / scroll same open vs closed ----
        c.goto(url + "#" + LONG)
        wait_for(c, "!!document.querySelector('.tks-focus')", 2.5)
        time.sleep(0.3)
        a = c.js(f"sf.pageState({json.dumps(LONG)})")
        c.click(5, 5)
        time.sleep(0.3)
        b = c.js(f"sf.pageState({json.dumps(LONG)})")
        report("SM1-landing", a["scrollY"] == b["scrollY"] and a["headTop"] == b["headTop"] and
               a["docH"] == b["docH"] and a["headLeft"] == b["headLeft"], open=a, closed=b)
        # nav-icons.js throws on fast reloads on the unchanged site too: not ours.
        errs = sorted({e.splitlines()[0] for e in c.errors if e and "nav-icons.js" not in e})
        if errs:
            report("no-js-errors", False, errors=errs)
        else:
            report("no-js-errors", True)
    finally:
        c.close()


def probe_mobile(base):
    c = Chrome(390, 844, True)
    url = base.rstrip("/") + "/" + PAGE
    try:
        c.goto(url + "#" + LONG)
        op = wait_for(c, "!!document.querySelector('.tks-focus')", 2.5)
        time.sleep(0.4)
        g = c.js("sf.geometry()")
        report("m390-opens", op)
        report("m390-gutter", g["gapL"] >= 16 and g["gapR"] >= 16 and abs(g["gapL"] - g["gapR"]) <= 1,
               gapL=g["gapL"], gapR=g["gapR"], boxW=g["boxW"], vw=g["vw"])
        report("m390-AL", abs(g["gapL"] - g["gapR"]) <= 1)
        report("m390-SP3", abs(g["padL"] - g["padR"]) <= 0.5 and abs(g["padT"] - g["padB"]) <= 0.5)
        report("m390-close", abs(g["closeTop"] - g["closeRight"]) <= 1 and g["closeW"] >= 32
               and g["closeH"] >= 32, top=g["closeTop"], right=g["closeRight"])
        report("m390-height", g["boxH"] <= 0.85 * g["vh"] + 0.5, boxH=g["boxH"], vh=g["vh"])
        report("m390-no-hscroll", c.js("document.documentElement.scrollWidth <= window.innerWidth"))
        c.click(3, 3)
        report("m390-close-band", wait_for(c, "!!document.querySelector('.tks-target-mark')", 0.5))
    finally:
        c.close()


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        return 2
    (HERE / "temp").mkdir(exist_ok=True)
    mode, base = sys.argv[1], sys.argv[2]
    if mode == "shots":
        run_shots(base, sys.argv[3])
        return 0
    if mode == "probe":
        probe_desktop(base)
        probe_mobile(base)
        bad = [n for n, ok in RESULTS if not ok]
        print(json.dumps({"summary": f"{len(RESULTS) - len(bad)}/{len(RESULTS)} pass", "failed": bad}))
        return 1 if bad else 0
    print(__doc__)
    return 2


if __name__ == "__main__":
    sys.exit(main())
