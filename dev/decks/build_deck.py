"""Bundle a folder of slide sections into ONE offline HTML presentation.

    python dev/decks/build_deck.py doc/course/a1-why-takes/01-slides

The folder holds deck.json (title, order, faces) and one <section> file per
slide, the same files the claude.ai Slides deck uses. The output is written
next to the folder as <folder-name-without-"-slides">-slides.html... in short:
a single file you double-click. No server, no internet (fonts are embedded
when they can be fetched at build time; otherwise the file falls back to
Arial and still works).

Keys in the finished file:
    Right / Space / PageDown / click   next slide
    Left / PageUp                      previous slide
    Home / End                         first / last slide
    F                                  full screen
    N                                  notes under the slide (one screen)
    P                                  presenter window (notes, next slide, timer)
    R                                  replay this slide's animations
"""
from __future__ import annotations

import base64
import json
import re
import sys
import urllib.request
from pathlib import Path

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0 Safari/537.36")
LATIN = re.compile(r"/\*\s*latin\s*\*/\s*(@font-face\s*\{[^}]*\})")
FONT_URL = re.compile(r"url\((https://[^)]+)\)")


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read()


def embed_faces(faces: dict) -> tuple[str, list[str]]:
    """Return (@font-face css with data: URIs, families that failed)."""
    css, failed = [], []
    for face in faces.values():
        try:
            sheet = fetch(face["href"]).decode("utf-8")
            blocks = LATIN.findall(sheet)
            if not blocks:
                raise ValueError("no latin block")
            for block in blocks:
                url = FONT_URL.search(block).group(1)
                data = base64.b64encode(fetch(url)).decode("ascii")
                css.append(FONT_URL.sub(f"url(data:font/woff2;base64,{data})", block))
        except Exception as exc:  # offline build: fall back, never fail
            print(f"  font {face['family']}: not embedded ({exc})")
            failed.append(face["family"])
    return "\n".join(css), failed


def build(folder: Path) -> Path:
    deck = json.loads((folder / "deck.json").read_text(encoding="utf-8"))
    sections = []
    for sid in deck["order"]:
        text = (folder / f"{sid}.html").read_text(encoding="utf-8").strip()
        assert text.startswith("<section") and text.count("<section") == 1, sid
        sections.append(text)
    font_css, failed = embed_faces(deck.get("faces", {}))
    links = "".join(f'<link rel="stylesheet" href="{f["href"]}">'
                    for f in deck.get("faces", {}).values() if f["family"] in failed)
    page = (TEMPLATE
            .replace("@@TITLE@@", deck["title"])
            .replace("@@FONTLINKS@@", links)
            .replace("@@FONTCSS@@", font_css)
            .replace("@@SLIDES@@", "\n".join(sections)))
    out = folder.parent / (folder.name.removesuffix("-slides") + "-" + slug(deck["title"]) + "-slides.html")
    out.write_text(page, encoding="utf-8", newline="\n")
    return out


def slug(title: str) -> str:
    title = title.split("·", 1)[-1]
    return re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")


TEMPLATE = r"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>@@TITLE@@</title>
@@FONTLINKS@@
<style>
@@FONTCSS@@
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; height: 100%; background: #0B0B0C; overflow: hidden;
  font-family: Inter, Arial, sans-serif; color: #F2F2EF; }
section h1, section h2, section h3, section p, section ul, section ol { margin: 0; }
section h1 { font-size: 96px; font-weight: 600; line-height: 1.1; }
section h2 { font-size: 64px; font-weight: 600; line-height: 1.15; }
section h3 { font-size: 44px; font-weight: 600; line-height: 1.2; }
section p  { font-size: 32px; line-height: 1.4; }
section svg { display: block; flex: none; }
section aside { display: none; }

/* ---- one slide canvas, scaled to the window ---- */
.canvas { position: absolute; width: 1920px; height: 1080px; left: 0; top: 0;
  transform-origin: 0 0; overflow: hidden; }
.canvas > section { position: absolute; inset: 0; opacity: 0; visibility: hidden;
  transition: opacity .5s ease, visibility 0s linear .5s; }
.canvas > section.on { opacity: 1; visibility: visible; transition: opacity .5s ease; }

/* ---- build-in animations ---- */
.live [data-build-in] { opacity: 0; }
.live section.on [data-build-in].go { animation: var(--anim) .7s cubic-bezier(.2,.75,.25,1) var(--delay) both; }
@keyframes b-fade  { from { opacity: 0 } to { opacity: 1 } }
@keyframes b-rise  { from { opacity: 0; translate: 0 70px } to { opacity: 1; translate: 0 0 } }
@keyframes b-drop  { from { opacity: 0; translate: 0 -90px } to { opacity: 1; translate: 0 0 } }
@keyframes b-left  { from { opacity: 0; translate: -140px 0 } to { opacity: 1; translate: 0 0 } }
@keyframes b-right { from { opacity: 0; translate: 140px 0 } to { opacity: 1; translate: 0 0 } }
@keyframes b-scale { from { opacity: 0; scale: .85 } to { opacity: 1; scale: 1 } }
@keyframes b-pop   { 0% { opacity: 0; scale: .5 } 70% { opacity: 1; scale: 1.06 } 100% { opacity: 1; scale: 1 } }
/* keep an element's own opacity (faint copies) once it has landed */
.live section.on [data-build-in].go.faint { animation-name: var(--anim-faint); }
@keyframes b-fade-faint { from { opacity: 0 } to { opacity: var(--rest) } }
@keyframes b-drop-faint { from { opacity: 0; translate: 0 -90px } to { opacity: var(--rest); translate: 0 0 } }

/* ---- audience view ---- */
#stage { position: absolute; inset: 0; }
#notesbar { position: absolute; left: 0; right: 0; bottom: 0; max-height: 32%; overflow: auto;
  background: #141416ee; border-top: 1px solid #2E2E33; padding: 18px 28px;
  font: 20px/1.5 Inter, Arial, sans-serif; white-space: pre-wrap; display: none; }
body.shownotes #notesbar { display: block; }
#hint { position: absolute; left: 50%; bottom: 24px; translate: -50% 0; background: #1E1E22e6;
  border: 1px solid #2E2E33; border-radius: 999px; padding: 10px 22px; color: #9A9AA0;
  font: 15px Inter, Arial, sans-serif; transition: opacity 1s; pointer-events: none; }
#hint b { color: #E87D0D; font-weight: 600; }
#count { position: absolute; right: 18px; bottom: 12px; color: #6E6E76; font: 14px Inter, Arial, sans-serif;
  opacity: 0; transition: opacity .3s; }
body:hover #count { opacity: 1; }

/* ---- presenter view ---- */
body.presenter { overflow: auto; }
.pv { display: grid; grid-template-columns: 1.7fr 1fr; gap: 24px; height: 100vh; padding: 20px; }
.pv .main { display: flex; flex-direction: column; min-height: 0; }
.pv .frame { position: relative; background: #000; border: 1px solid #2E2E33; border-radius: 10px; overflow: hidden; }
.pv .label { color: #6E6E76; font: 600 13px Inter, Arial, sans-serif; letter-spacing: 2px;
  text-transform: uppercase; margin: 0 0 8px; }
.pv #pv-notes { flex: 1; min-height: 0; background: #141416; border: 1px solid #2E2E33; border-radius: 10px;
  padding: 22px 28px; font: 26px/1.55 Inter, Arial, sans-serif; white-space: pre-wrap; overflow: auto; }
.pv .side { display: flex; flex-direction: column; gap: 14px; min-height: 0; }
.pv .clock { display: flex; gap: 24px; align-items: baseline; font: 600 36px 'JetBrains Mono', Consolas, monospace; }
.pv .clock small { font: 16px Inter, Arial, sans-serif; color: #9A9AA0; }
.pv button { background: #26262B; color: #F2F2EF; border: 1px solid #3A3A40; border-radius: 8px;
  padding: 10px 18px; font: 16px Inter, Arial, sans-serif; cursor: pointer; }
.pv button:hover { border-color: #E87D0D; }
</style>
</head>
<body class="live">
<div id="stage"><div class="canvas" id="canvas">
@@SLIDES@@
</div></div>
<div id="notesbar"></div>
<div id="count"></div>
<div id="hint"><b>&#8594;</b> next &#183; <b>&#8592;</b> back &#183; <b>F</b> full screen &#183; <b>P</b> presenter view &#183; <b>N</b> notes &#183; <b>R</b> replay</div>
<script>
(() => {
  const STEP = 0.35, FIRST = 0.35;              // seconds between build-ins, and before the first
  const canvas = document.getElementById("canvas");
  const slides = [...canvas.children];
  const notes = slides.map(s => (s.querySelector("aside")?.textContent || "").trim());
  const isPresenter = location.hash === "#presenter";
  let index = 0, peer = null, started = Date.now(), slideStarted = Date.now();

  // Read each build-in once: kind, order, and an element's own resting opacity.
  slides.forEach(s => s.querySelectorAll("[data-build-in]").forEach(el => {
    const [kind, order] = el.getAttribute("data-build-in").split(/\s+/);
    el.style.setProperty("--anim", "b-" + kind);
    el.style.setProperty("--delay", (FIRST + (Number(order || 1) - 1) * STEP) + "s");
    const rest = parseFloat(el.style.opacity);
    if (!isNaN(rest) && rest < 1) {
      el.classList.add("faint");
      el.style.setProperty("--rest", rest);
      el.style.setProperty("--anim-faint", kind === "drop" ? "b-drop-faint" : "b-fade-faint");
    }
  }));

  function fit(box, frame) {
    const w = frame.clientWidth, h = frame.clientHeight;
    const k = Math.min(w / 1920, h / 1080);
    box.style.transform = `translate(${(w - 1920 * k) / 2}px, ${(h - 1080 * k) / 2}px) scale(${k})`;
  }

  function play(slide) {
    const items = slide.querySelectorAll("[data-build-in]");
    items.forEach(el => el.classList.remove("go"));
    void slide.offsetWidth;                      // restart the animations
    items.forEach(el => el.classList.add("go"));
  }

  function show(i, fromPeer) {
    index = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach((s, n) => s.classList.toggle("on", n === index));
    play(slides[index]);
    slideStarted = Date.now();
    history.replaceState(null, "", isPresenter ? "#presenter" : "#" + (index + 1));
    const bar = document.getElementById("notesbar"), count = document.getElementById("count");
    if (bar) bar.textContent = notes[index];        // the presenter window has neither
    if (count) count.textContent = (index + 1) + " / " + slides.length;
    if (isPresenter) renderPresenter();
    if (!fromPeer && peer && !peer.closed) peer.postMessage({ deck: "go", index }, "*");
  }

  window.addEventListener("message", e => {
    if (e.data && e.data.deck === "go") show(e.data.index, true);
    if (e.data && e.data.deck === "hello") { peer = e.source; peer.postMessage({ deck: "go", index }, "*"); }
    if (e.data && e.data.deck === "replay") play(slides[index]);
  });

  function key(e) {
    const k = e.key;
    if (["ArrowRight", "PageDown", " ", "Enter"].includes(k)) show(index + 1);
    else if (["ArrowLeft", "PageUp", "Backspace"].includes(k)) show(index - 1);
    else if (k === "Home") show(0);
    else if (k === "End") show(slides.length - 1);
    else if (k === "f" || k === "F") document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
    else if (k === "n" || k === "N") document.body.classList.toggle("shownotes");
    else if (k === "r" || k === "R") { play(slides[index]); if (peer && !peer.closed) peer.postMessage({ deck: "replay" }, "*"); }
    else if ((k === "p" || k === "P") && !isPresenter) openPresenter();
    else return;
    e.preventDefault();
  }
  document.addEventListener("keydown", key);

  function openPresenter() {
    const url = location.href.split("#")[0] + "#presenter";
    peer = window.open(url, "takes-presenter", "width=1400,height=900");
  }

  // ---------------- presenter window ----------------
  let pvNow, pvNext, pvPrev;
  function buildPresenter() {
    document.body.classList.add("presenter");
    document.body.classList.remove("live");      // previews show the finished slide
    document.getElementById("stage").remove();
    ["notesbar", "hint", "count"].forEach(id => document.getElementById(id).remove());
    document.body.insertAdjacentHTML("afterbegin", `
      <div class="pv">
        <div class="main"><p class="label">Now</p><div class="frame" id="pv-now" style="aspect-ratio:16/9"></div>
          <p class="label" style="margin-top:14px">Speaker notes</p><div id="pv-notes"></div></div>
        <div class="side">
          <div><p class="label">Next</p><div class="frame" id="pv-next" style="aspect-ratio:16/9"></div></div>
          <div><p class="label">Previous</p><div class="frame" id="pv-prev" style="aspect-ratio:16/9;opacity:.7"></div></div>
          <div class="clock"><span id="pv-total">00:00</span><small>total</small><span id="pv-slide">00:00</span><small>this slide</small></div>
          <div style="color:#9A9AA0;font:18px Inter,Arial,sans-serif" id="pv-pos"></div>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <button id="b-prev">&#8592; Back</button><button id="b-next">Next &#8594;</button>
            <button id="b-replay">Replay</button><button id="b-reset">Reset timer</button>
          </div>
        </div>
      </div>`);
    pvNow = document.getElementById("pv-now");
    pvNext = document.getElementById("pv-next");
    pvPrev = document.getElementById("pv-prev");
    document.getElementById("b-prev").onclick = () => show(index - 1);
    document.getElementById("b-next").onclick = () => show(index + 1);
    document.getElementById("b-replay").onclick = () => peer && peer.postMessage({ deck: "replay" }, "*");
    document.getElementById("b-reset").onclick = () => { started = Date.now(); slideStarted = Date.now(); };
    peer = window.opener;
    if (peer) peer.postMessage({ deck: "hello" }, "*");
    setInterval(tick, 500);
    window.addEventListener("resize", renderPresenter);
  }

  function preview(frame, i) {
    frame.innerHTML = "";
    if (i < 0 || i >= slides.length) {
      frame.insertAdjacentHTML("beforeend", '<p style="color:#6E6E76;font:20px Inter,Arial,sans-serif;position:absolute;inset:0;display:grid;place-items:center">' + (i < 0 ? "Start of deck" : "End of deck") + '</p>');
      return;
    }
    const box = document.createElement("div");
    box.className = "canvas";
    const clone = slides[i].cloneNode(true);
    clone.classList.add("on");
    clone.style.transition = "none";
    box.appendChild(clone);
    frame.appendChild(box);
    fit(box, frame);
  }

  function renderPresenter() {
    if (!pvNow) return;
    preview(pvNow, index);
    preview(pvNext, index + 1);
    preview(pvPrev, index - 1);
    document.getElementById("pv-notes").textContent = notes[index] || "(no notes)";
    document.getElementById("pv-pos").textContent = "Slide " + (index + 1) + " of " + slides.length;
  }

  function mmss(ms) {
    const s = Math.floor(ms / 1000);
    return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  }
  function tick() {
    document.getElementById("pv-total").textContent = mmss(Date.now() - started);
    document.getElementById("pv-slide").textContent = mmss(Date.now() - slideStarted);
  }

  // ---------------- start ----------------
  if (isPresenter) {
    buildPresenter();
    show(0, true);
  } else {
    const stage = document.getElementById("stage");
    const refit = () => fit(canvas, stage);
    window.addEventListener("resize", refit);
    refit();
    stage.addEventListener("click", () => show(index + 1));
    const start = parseInt(location.hash.slice(1), 10);
    show(isNaN(start) ? 0 : start - 1);
    setTimeout(() => { document.getElementById("hint").style.opacity = 0; }, 5000);
  }
})();
</script>
</body>
</html>
"""


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    out = build(Path(sys.argv[1]).resolve())
    print(f"wrote {out}  ({out.stat().st_size // 1024} KB)")
