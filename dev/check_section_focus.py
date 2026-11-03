"""Drive Chrome over the DevTools Protocol for the section focus pop-up.

Two jobs, both against a site served on localhost (see the serve command in
the report / `python -m http.server <port> -d <built site>`):

    python dev/check_section_focus.py shots  <base-url> <out-dir>
    python dev/check_section_focus.py probe  <base-url> [--only NAME]
    python dev/check_section_focus.py markshots <base-url> <out-dir>
    python dev/check_section_focus.py diagshots <base-url> <out-dir>
    python dev/check_section_focus.py sweep  <base-url> [--only PATH-PART] [--dpr 1,1.25,1.5] [--width 840,1440]
    python dev/check_section_focus.py media  <base-url> [--site DIR] [--engine NAME]

`media` writes the test-only media page (dev/make_media_fixture.py) into the
built site folder the base URL serves (`--site`, default dev/temp/site) and runs
dev/check_media_engines.mjs in Chromium, Firefox and WebKit: videos, sound,
frames, canvases and embedded files must show in the pop-up, keep their state
and go back on every way of closing. It needs Playwright in dev/temp/pw (see
the top of that script).

`sweep` opens every h2-h6 section of every page by a title click and
compares each block of the page with its block in the pop-up. `shots` takes the before/after pairs (landing, heading click, after close) at
1440x900 and 390x844 into <out-dir>. `markshots` takes only the pop-up of a text-directive link (words marked inside)
at both sizes. `probe` runs every measured look rule and
behaviour point and prints one JSON line per check; the in-page measuring code
lives in dev/probe_section_focus.js.

Real input (mouse, Tab, Esc) goes through Input.dispatch*, so focus-visible,
hit testing and the click path are the browser's own.
"""

from __future__ import annotations

import base64
import json
import os
import re
import subprocess
import sys
import tempfile
import time
import urllib.request
from pathlib import Path

import websocket  # websocket-client

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
# Another run may hold the default port; SF_CDP_PORT picks a free one.
PORT = int(os.environ.get("SF_CDP_PORT", "9341"))
HERE = Path(__file__).resolve().parent
PROBE_JS = HERE / "probe_section_focus.js"

PAGE = "features/custom_tokens/"
LONG = "tutorial-your-first-custom-token"     # long, has details + code
SHORT = "token-presets"
LAST = "every-token-setting"                    # ends at the page end
MID = "managing-your-tokens"
MARK_PAGE = "preferences/workflow/"
MARK_ID = "action-name-patterns"
MARK_TEXT = "Add Pattern"                       # the words of the directive
MARK_HASH = "#" + MARK_ID + ":~:text=Add%20Pattern"
SIZES = {"1440": (1440, 900, False), "390": (390, 844, True)}


class Chrome:
    def __init__(self, width, height, mobile=False, dpr=1):
        self.dpr = dpr
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
            "width": width, "height": height, "deviceScaleFactor": self.dpr, "mobile": mobile})
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


def run_mark_shots(base, out):
    """The text-directive link just after load, pop-up open, at both sizes."""
    out = Path(out)
    for tag, (w, h, mobile) in SIZES.items():
        c = Chrome(w, h, mobile)
        try:
            c.goto(base.rstrip("/") + "/" + MARK_PAGE + MARK_HASH)
            wait_for(c, "!!document.querySelector('.tks-focus')", 3)
            time.sleep(0.8)
            c.shot(out / f"text_mark_{tag}.png")
        finally:
            c.close()


DIAG_PAGE = "features/rest_state/"
DIAG_ID = "how-it-works"


def run_diag_shots(base, out):
    """The diagram section just after load, pop-up open, scrolled to the diagram."""
    out = Path(out)
    for tag, (w, h, mobile) in SIZES.items():
        c = Chrome(w, h, mobile)
        try:
            c.goto(base.rstrip("/") + "/" + DIAG_PAGE + "#" + DIAG_ID)
            wait_for(c, "!!document.querySelector('.tks-focus')", 3)
            # Material draws the diagram from a script it fetches; wait for it
            wait_for(c, "!!document.querySelector('.md-content__inner div.mermaid, "
                        ".tks-focus div.mermaid')", 8)
            time.sleep(0.8)
            idx = c.js(f"sf.diagramIndex({json.dumps(DIAG_ID)})")
            c.js(f"sf.scrollPopupToBlock({idx})")
            time.sleep(0.4)
            c.shot(out / f"diagram_{tag}.png")
        finally:
            c.close()


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
        # the top row belongs to the close button, so the scrollbar starts 4 px below it
        report("SP3-padding", abs(geo["padL"] - geo["padR"]) <= 0.5 and
               abs(geo["padB"] - geo["padL"]) <= 0.5 and
               abs(geo["padT"] - (geo["closeBottom"] + 4)) <= 0.5,
               padL=geo["padL"], padR=geo["padR"], padT=geo["padT"], padB=geo["padB"],
               closeBottom=geo["closeBottom"])
        si = c.js("sf.scrollInfo()")
        report("no-sideways-scroll", si["sideways"] == 0 and si["out"] <= 1, **si)
        report("close-clear-of-scrollbar", si["clear"] >= 4, **si)
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


def open_popup(c, url, hash_, settle=0.5):
    c.goto(url + hash_)
    ok = wait_for(c, "!!document.querySelector('.tks-focus')", 3)
    time.sleep(settle)
    return ok


def probe_marks(base):
    """Text-directive marks inside the pop-up (Chrome keeps the directive in the
    navigation timing entry; the other engines run in dev/temp/pw)."""
    c = Chrome(1440, 900, False)
    url = base.rstrip("/") + "/" + MARK_PAGE
    plain = "#" + MARK_ID
    try:
        open_popup(c, url, MARK_HASH)
        info = c.js("sf.markInfo()")
        report("mark-in-popup", info["count"] >= 1 and info["joined"].lower() == MARK_TEXT.lower(), **info)
        report("mark-one-per-item", info["count"] == 1, count=info["count"])
        look = c.js("sf.markLook()")

        # no layout change: same pop-up heights with the marks taken out again
        h = c.js("sf.heightsWithoutMarks()")
        report("mark-no-reflow", all(abs(h["withMark"][k] - h["without"][k]) <= 0 for k in h["withMark"]), **h)
        open_popup(c, url, plain)
        report("no-mark-without-directive", c.js("sf.markInfo()")["count"] == 0)

        # look: colour equals the browser mark's declaration in both schemes; no box
        same = all(v["mark"] == v["ref"] for v in look["schemes"].values())
        report("mark-colour-both-schemes", same and "var(--tks-text-mark-bg)" in (look["targetTextRule"] or ""),
               rule=look["targetTextRule"], **look["schemes"])
        report("mark-box-zero", all(v in ("0px", "normal") for v in look["box"]), box=look["box"])
        report("mark-text-colour-inherits", all(v["color"] == v["hostColor"] for v in look["schemes"].values()))

        # one match per text= item, case-insensitive, textStart,textEnd, spans inline elements
        open_popup(c, url, plain + ":~:text=Pattern&text=Add%20Pattern")
        two = c.js("sf.markInfo()")
        report("mark-two-items", two["texts"] == ["Pattern", "Add Pattern"], **two)
        open_popup(c, url, plain + ":~:text=add%20pattern")
        report("mark-case-insensitive", c.js("sf.markInfo()")["joined"] == "Add Pattern")
        open_popup(c, url, plain + ":~:text=Edit,menu")
        rng = c.js("sf.markInfo()")
        report("mark-text-range", rng["joined"] == "Edit Name Patterns… in the New Action menu", **rng)
        open_popup(c, url, plain + ":~:text=Name%20Patterns%E2%80%A6%20in%20the")
        span = c.js("sf.markInfo()")
        report("mark-spans-inline-elements", span["count"] >= 2 and
               span["joined"] == "Name Patterns… in the", **span)

        # words that are not on the page: pop-up as before, no mark, no error
        c.errors.clear()
        opened = open_popup(c, url, plain + ":~:text=zzzqqq%20nothere")
        errs = [e for e in c.errors if e and "nav-icons.js" not in e]
        report("mark-missing-words", opened and c.js("sf.markInfo()")["count"] == 0 and not errs, errors=errs)
        # a malformed directive must not break either
        opened = open_popup(c, url, plain + ":~:text=%E0%A4%A")
        errs = [e for e in c.errors if e and "nav-icons.js" not in e]
        report("mark-malformed-directive", opened and not errs, errors=errs)

        # parse and heading lookup on a string, the way an engine that keeps the
        # directive in location.hash would hand it over
        parsed = c.js("tksTargetMark.parseDirective('#a:~:text=pre-,Add%20Pattern,-suf&text=x,y&text=,')")
        report("parse-directive", parsed == [{"start": "Add Pattern", "end": ""},
                                             {"start": "x", "end": "y"}], parsed=parsed)
        head = c.js("(tksTargetMark.targetHeading('#action-name-patterns:~:text=Add%20Pattern')||{}).id")
        report("heading-from-hash-with-directive", head == MARK_ID, id=head)

        # a page left alone where the browser marks it itself
        open_popup(c, url, MARK_HASH)
        c.click(5, 5)
        wait_for(c, "!!document.querySelector('.tks-target-mark')", 1)
        report("page-left-alone-when-supported", c.js("sf.markInfo('page')")["count"] == 0)

        # first mark inside the visible scroll area: long section, short window
        c.resize(1440, 300)
        long_url = base.rstrip("/") + "/" + PAGE
        c.goto(long_url)
        words = c.js(f"sf.lastWords({json.dumps(LONG)})")
        open_popup(c, long_url, "#" + LONG + ":~:text=" + words.replace(" ", "%20"))
        far = c.js("sf.markInfo()")
        report("mark-first-visible-in-scroll-area", far["count"] >= 1 and far["inScroll"] and
               far["scrollable"] and far["bodyScrollTop"] > 0, words=words, **far)
        c.resize(1440, 900)
    finally:
        c.close()


def probe_marks_unsupported(base):
    """A browser without text fragments: the page gets the mark after close."""
    c = Chrome(1440, 900, False)
    url = base.rstrip("/") + "/" + MARK_PAGE
    try:
        c.call("Page.addScriptToEvaluateOnNewDocument", {
            "source": "delete Document.prototype.fragmentDirective;"})
        ok = open_popup(c, url, MARK_HASH, 0.4)
        report("nofrag-engine-simulated", c.js("!('fragmentDirective' in document)"))
        report("nofrag-popup-marked", ok and c.js("sf.markInfo().joined") == MARK_TEXT)
        report("nofrag-page-unmarked-while-open", c.js("sf.markInfo('page').count") == 0)
        doc_h = c.js("document.documentElement.scrollHeight")
        c.click(5, 5)
        wait_for(c, "!document.querySelector('.tks-focus')", 1)
        time.sleep(0.3)
        page = c.js("sf.markInfo('page')")
        report("nofrag-page-marked-after-close", page["joined"] == MARK_TEXT and page["count"] == 1, **page)
        report("nofrag-no-page-reflow", c.js("document.documentElement.scrollHeight") == doc_h)
    finally:
        c.close()


# Stands in for the diagram script Material fetches, so a test decides when the
# diagram is drawn: the pop-up can open with the source block still undrawn.
FAKE_MERMAID = (
    "window.mermaid = {initialize(){}, render(id, src){ return new Promise((r) => {"
    "window.__release = () => r({svg: '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"600\" "
    "height=\"300\" viewBox=\"0 0 600 300\"><rect width=\"600\" height=\"300\" fill=\"#456\"/></svg>', "
    "fn: null}); }); }};")


def same_layout(a, b):
    return a["docH"] == b["docH"] and a["scrollY"] == b["scrollY"] and a["blocks"] == b["blocks"]


def probe_diagram(base):
    """The diagram moves into the pop-up and back: same node, same box, the page
    does not shift, nothing is left behind."""
    url = base.rstrip("/") + "/" + DIAG_PAGE
    c = Chrome(1440, 900, False)
    try:
        # ---- title click on a drawn diagram: identity, boxes, layout ----
        c.goto(url)
        drawn = wait_for(c, "!!document.querySelector('.md-content__inner div.mermaid')", 10)
        report("diagram-drawn-on-page", drawn)
        time.sleep(0.5)
        c.js(f"sf.scrollHeadingTo({json.dumps(DIAG_ID)}, 140)")
        time.sleep(0.3)
        page_box = c.js("sf.tagHost()")
        lay = c.js("sf.layout()")
        x, y = title_point(c, DIAG_ID)
        c.click(x, y)
        wait_for(c, "!!document.querySelector('.tks-focus')", 2)
        time.sleep(0.4)
        st = c.js("sf.hostState()")
        report("diagram-click-same-node-in-popup", st["inPopup"] and st["holds"] == 1, **st)
        report("diagram-click-box-matches-page", abs(st["w"] - page_box["w"]) <= 1 and
               abs(st["h"] - page_box["h"]) <= 1, page=page_box, popup={"w": st["w"], "h": st["h"]})
        during = c.js("sf.layout()")
        report("diagram-click-page-layout-unmoved", same_layout(lay, during),
               before=lay["docH"], during=during["docH"])
        report("diagram-click-copy-has-no-twin",
               c.js("document.querySelectorAll('.tks-focus__body div.mermaid').length") == 1)
        # scheme toggle while open
        c.js("document.body.setAttribute('data-md-color-scheme', 'default')")
        time.sleep(0.2)
        c.key("Escape", "Escape", 27)
        wait_for(c, "!document.querySelector('.tks-focus')", 1)
        st2 = c.js("sf.hostState()")
        report("diagram-scheme-toggle-while-open", st2["inPage"] and st2["inSlot"] and st2["holds"] == 0 and
               st2["w"] > 0 and st2["h"] > 0, **st2)
        c.js("document.body.setAttribute('data-md-color-scheme', 'slate')")
        report("diagram-click-back-in-slot", st2["inSlot"] and st2["strayPre"] == 0 and st2["hosts"] == 1, **st2)
        report("diagram-click-layout-after-close", same_layout(lay, c.js("sf.layout()")))
        # every other way of closing
        for how in ("button", "scrim"):
            c.js(f"sf.scrollHeadingTo({json.dumps(DIAG_ID)}, 140)")
            time.sleep(0.2)
            x, y = title_point(c, DIAG_ID)
            c.click(x, y)
            wait_for(c, "!!document.querySelector('.tks-focus')", 2)
            if how == "button":
                bx, by = c.js("sf.closePoint()")
                c.click(bx, by)
            else:
                c.click(5, 5)
            wait_for(c, "!document.querySelector('.tks-focus')", 1)
            s3 = c.js("sf.hostState()")
            report(f"diagram-close-{how}-restores", s3["inPage"] and s3["inSlot"] and s3["holds"] == 0, **s3)
        # a same-page link inside the pop-up
        c.js(f"sf.injectLink('#controls', 'jump', {json.dumps(DIAG_ID)})")
        c.js(f"sf.scrollHeadingTo({json.dumps(DIAG_ID)}, 140)")
        x, y = title_point(c, DIAG_ID)
        c.click(x, y)
        wait_for(c, "!!document.querySelector('.tks-focus')", 2)
        lx, ly = c.js("sf.pointOf('[data-sf=jump]')")
        c.click(lx, ly)
        time.sleep(0.6)
        # Material draws the page again on an in-page link (with or without the
        # pop-up), so the node is a new one: what counts is one drawn diagram, no leftovers.
        c.js("sf.tagHost()")
        s4 = c.js("sf.hostState()")
        report("diagram-close-link-restores", s4["inPage"] and s4["holds"] == 0 and s4["hosts"] == 1 and
               s4["strayPre"] == 0 and s4["h"] > 0 and
               c.js("!document.querySelector('.tks-focus')"), **s4)
        # instant navigation away while open: nothing is left over
        c.goto(url)
        wait_for(c, "!!document.querySelector('.md-content__inner div.mermaid')", 10)
        c.js(f"sf.scrollHeadingTo({json.dumps(DIAG_ID)}, 140)")
        c.js("sf.injectLink('../smart_output/', 'nav', " + json.dumps(DIAG_ID) + ")")
        x, y = title_point(c, DIAG_ID)
        c.click(x, y)
        wait_for(c, "!!document.querySelector('.tks-focus')", 2)
        c.js("window.__instant = 1")
        lx, ly = c.js("sf.pointOf('[data-sf=nav]')")
        c.click(lx, ly)
        time.sleep(1.5)
        report("diagram-instant-nav-clean", c.js("location.pathname.includes('smart_output')") and
               c.js("window.__instant === 1") and c.js("!document.querySelector('.tks-focus')") and
               c.js("document.querySelectorAll('.tks-focus-hold').length") == 0)

        # ---- landing on the real site (network diagram script) ----
        c.goto(url + "#" + DIAG_ID)
        opened = wait_for(c, "!!document.querySelector('.tks-focus')", 3)
        wait_for(c, "!!document.querySelector('.tks-focus__body div.mermaid')", 10)
        time.sleep(0.5)
        pd = c.js("sf.popupDiagram()")
        report("diagram-landing-in-popup", opened and pd and pd["kind"] == "host", popup=pd)
        c.click(5, 5)
        wait_for(c, "!document.querySelector('.tks-focus')", 1)
        time.sleep(0.4)
        c.js("sf.tagHost()")
        s5 = c.js("sf.hostState()")
        report("diagram-landing-back-on-page", s5["inPage"] and s5["holds"] == 0 and s5["strayPre"] == 0 and
               s5["hosts"] == 1 and s5["w"] > 0 and s5["h"] > 0, **s5)
    finally:
        c.close()

    # ---- the race: the pop-up opens before the diagram is drawn ----
    c = Chrome(1440, 900, False)
    try:
        c.call("Page.addScriptToEvaluateOnNewDocument", {"source": FAKE_MERMAID})
        c.goto(url + "#" + DIAG_ID)
        opened = wait_for(c, "!!document.querySelector('.tks-focus')", 3)
        time.sleep(0.4)
        pd = c.js("sf.popupDiagram()")
        report("race-opens-with-source-block", opened and pd and pd["kind"] == "pre", popup=pd)
        holds = c.js("document.querySelectorAll('.tks-focus-hold').length")
        report("race-hollow-for-source-block", holds == 1, holds=holds)
        c.js("window.__release()")                       # Material draws it while the pop-up is open
        time.sleep(0.6)
        pd2 = c.js("sf.popupDiagram()")
        report("race-drawn-inside-popup", pd2 and pd2["kind"] == "host" and
               c.js("document.querySelectorAll('.md-content__inner div.mermaid').length") == 0, popup=pd2)
        c.click(5, 5)
        wait_for(c, "!document.querySelector('.tks-focus')", 1)
        time.sleep(0.3)
        c.js("sf.tagHost()")
        s6 = c.js("sf.hostState()")
        report("race-host-lands-in-slot", s6["inPage"] and s6["holds"] == 0 and s6["strayPre"] == 0 and
               s6["hosts"] == 1 and s6["w"] > 0 and s6["h"] > 0, **s6)
        # the node swapped by a script while open, not only by Material
        c.goto(url)
        wait_for(c, "!!window.__release", 5)
        c.js("window.__release()")
        wait_for(c, "!!document.querySelector('.md-content__inner div.mermaid')", 3)
        c.js("sf.tagHost()")
        c.js(f"sf.scrollHeadingTo({json.dumps(DIAG_ID)}, 140)")
        x, y = title_point(c, DIAG_ID)
        c.click(x, y)
        wait_for(c, "!!document.querySelector('.tks-focus')", 2)
        c.js("(() => { const n = document.createElement('div'); n.className = 'mermaid'; n.id = 'sf-swap';"
             "window.__sfHost.replaceWith(n); window.__sfHost = n; })()")
        c.key("Escape", "Escape", 27)
        wait_for(c, "!document.querySelector('.tks-focus')", 1)
        report("race-replaced-node-goes-home", c.js("!!document.querySelector('.md-content__inner #sf-swap')") and
               c.js("document.querySelectorAll('.tks-focus-hold').length") == 0)
        errs = sorted({e.splitlines()[0] for e in c.errors if e and "nav-icons.js" not in e})
        report("diagram-no-js-errors", not errs, errors=errs)
    finally:
        c.close()


def sweep(base, only=None, dprs=(1,), widths=(1440,)):
    """Every page, every h2-h6 section: page block against pop-up block, and the
    pop-up's sideways room (no sideways scroll, no block past the body's client
    box by more than 1 px, the x at least 4 px clear of the scrollbar), at every
    device scale and width given."""
    sm = urllib.request.urlopen(base.rstrip("/") + "/sitemap.xml", timeout=20).read().decode("utf8")
    pages = re.findall(r"<loc>([^<]+)</loc>", sm)
    root = base.rstrip("/") + "/"
    problems = 0
    for dpr in dprs:
        for width in widths:
            c = Chrome(width, 900, False, dpr=dpr)
            totals = {"dpr": dpr, "width": width, "pages": 0, "sections": 0, "blocks": 0,
                      "sideways": 0, "sticksOut": 0, "closeNear": 0}
            try:
                for u in pages:
                    if not u.startswith(root) or (only and only not in u):
                        continue
                    c.goto(u)
                    # a diagram page: let Material draw before measuring
                    wait_for(c, "!document.querySelector('.md-content__inner pre.mermaid')", 10)
                    time.sleep(0.3)
                    r = c.js("sf.sweepPage()")
                    totals["pages"] += 1
                    totals["sections"] += r["sections"]
                    totals["blocks"] += r["blocks"]
                    keys = ("mismatches", "notOpened", "layoutMoved", "notRestored",
                            "sideways", "sticksOut", "closeNear")
                    bad = any(r[k] for k in keys)
                    problems += sum(len(r[k]) for k in keys)
                    for k in ("sideways", "sticksOut", "closeNear"):
                        totals[k] += len(r[k])
                    print(json.dumps({"page": u[len(root):], "sections": r["sections"], "blocks": r["blocks"],
                                      "ok": not bad}), flush=True)
                    for m in r["mismatches"]:
                        print("  MISMATCH", u[len(root):], json.dumps(m), flush=True)
                    for k in keys[1:]:
                        for m in r[k]:
                            print("  ", k.upper(), u[len(root):], m, flush=True)
            finally:
                c.close()
            print(json.dumps({"sweep": totals}), flush=True)
    print(json.dumps({"problems": problems}))
    return 1 if problems else 0


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
        report("m390-SP3", abs(g["padL"] - g["padR"]) <= 0.5 and abs(g["padB"] - g["padL"]) <= 0.5 and
               abs(g["padT"] - (g["closeBottom"] + 4)) <= 0.5)
        si = c.js("sf.scrollInfo()")
        report("m390-no-sideways-scroll", si["sideways"] == 0 and si["out"] <= 1, **si)
        report("m390-close-clear-of-scrollbar", si["clear"] >= 4, **si)
        report("m390-close", abs(g["closeTop"] - g["closeRight"]) <= 1 and g["closeW"] >= 32
               and g["closeH"] >= 32, top=g["closeTop"], right=g["closeRight"])
        report("m390-height", g["boxH"] <= 0.85 * g["vh"] + 0.5, boxH=g["boxH"], vh=g["vh"])
        report("m390-no-hscroll", c.js("document.documentElement.scrollWidth <= window.innerWidth"))
        c.click(3, 3)
        report("m390-close-band", wait_for(c, "!!document.querySelector('.tks-target-mark')", 0.5))
    finally:
        c.close()


def probe_width(base):
    """The box width follows the window and late content, not just the moment of
    opening: a resize to phone width fits the gutters, and a diagram that draws
    after a landing still gets the scrollbar compensation."""
    sizes = ("({box: document.querySelector('.tks-focus').getBoundingClientRect().width,"
             " inline: document.querySelector('.tks-focus').style.width,"
             " doc: document.documentElement.scrollWidth,"
             " body: (b => b.clientWidth - 2 * parseFloat(getComputedStyle(b).paddingLeft))"
             "(document.querySelector('.tks-focus__body'))})")
    c = Chrome(1440, 900, False)
    try:
        c.goto(base.rstrip("/") + "/features/rest_state/")
        wait_for(c, "!!document.querySelector('.md-content__inner')", 5)
        time.sleep(0.5)
        c.js("sf.scrollHeadingTo('how-it-works', 140)")
        time.sleep(0.3)
        x, y = title_point(c, "how-it-works")
        c.click(x, y)
        report("width-resize-opens", wait_for(c, "!!document.querySelector('.tks-focus')", 2))
        time.sleep(0.4)
        c.resize(390, 844, True)
        time.sleep(0.6)
        r = c.js(sizes)
        report("width-resize-390-fits-gutters", abs(r["box"] - 358) <= 1, **r)
        report("width-resize-390-no-hscroll", r["doc"] <= 390, **r)
        c.resize(1440, 900, False)
        time.sleep(0.6)
        r = c.js(sizes)
        report("width-resize-back-wide", r["box"] > 700 and r["doc"] <= 1440, **r)
    finally:
        c.close()
    url = base.rstrip("/") + "/interface/variant_tree/"
    c = Chrome(1440, 900, False)
    try:
        c.goto(url + "#hierarchy")
        wait_for(c, "!!document.querySelector('.tks-focus')", 3)
        time.sleep(0.3)
        landed = c.js(sizes)
        time.sleep(1.0)
        later = c.js(sizes)
        report("width-landing-text-column-820", later["body"] == 820, landed=landed, later=later)
        c.js("document.querySelector('.tks-focus__close').click()")
        time.sleep(0.4)
        x, y = title_point(c, "hierarchy")
        c.click(x, y)
        wait_for(c, "!!document.querySelector('.tks-focus')", 2)
        time.sleep(0.8)
        clicked = c.js(sizes)
        report("width-landing-equals-title-click", later["inline"] == clicked["inline"],
               landing=later, click=clicked)
    finally:
        c.close()


def run_media(base, argv):
    """Builds the media fixture into the served site and runs the engine checks."""
    site = argv[argv.index("--site") + 1] if "--site" in argv else str(HERE / "temp" / "site")
    made = subprocess.run([sys.executable, str(HERE / "make_media_fixture.py"), site])
    if made.returncode:
        return made.returncode
    cmd = ["node", str(HERE / "check_media_engines.mjs"), base]
    if "--engine" in argv:
        cmd += ["--engine", argv[argv.index("--engine") + 1]]
    return subprocess.run(cmd).returncode


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        return 2
    (HERE / "temp").mkdir(exist_ok=True)
    mode, base = sys.argv[1], sys.argv[2]
    if mode == "shots":
        run_shots(base, sys.argv[3])
        return 0
    if mode == "markshots":
        run_mark_shots(base, sys.argv[3])
        return 0
    if mode == "diagshots":
        run_diag_shots(base, sys.argv[3])
        return 0
    if mode == "media":
        return run_media(base, sys.argv)
    if mode == "sweep":
        only = sys.argv[sys.argv.index("--only") + 1] if "--only" in sys.argv else None
        def listed(flag, default):
            if flag not in sys.argv:
                return default
            return tuple(float(v) if "." in v else int(v)
                         for v in sys.argv[sys.argv.index(flag) + 1].split(","))
        return sweep(base, only, listed("--dpr", (1,)), listed("--width", (1440,)))
    if mode == "probe":
        probe_desktop(base)
        probe_mobile(base)
        probe_marks(base)
        probe_marks_unsupported(base)
        probe_diagram(base)
        probe_width(base)
        bad = [n for n, ok in RESULTS if not ok]
        print(json.dumps({"summary": f"{len(RESULTS) - len(bad)}/{len(RESULTS)} pass", "failed": bad}))
        return 1 if bad else 0
    print(__doc__)
    return 2


if __name__ == "__main__":
    sys.exit(main())
