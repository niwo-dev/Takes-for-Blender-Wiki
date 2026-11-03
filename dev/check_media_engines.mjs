// Media and frame checks for the section focus pop-up, in three engines.
//
//   node dev/check_media_engines.mjs <base-url> [--engine chromium|firefox|webkit] [--json out.json]
//                                    [--no-movebefore]
//
// <base-url> serves a built site that holds the fixture page (see
// dev/make_media_fixture.py; `python dev/check_section_focus.py media <base-url>`
// builds it and runs this). Playwright is not a dependency of the wiki: install it
// beside the scratch files, `cd dev/temp/pw && npm i playwright@1.63.0`, which is
// where this script looks for it. The browsers are the ones Playwright already
// keeps in %LOCALAPPDATA%\ms-playwright; Chromium is started from its own
// chrome.exe (CHROMIUM_EXE overrides the guess).
//
// For every engine, kind and way of closing (x, scrim, Esc, a link to another
// spot of the page) it opens the kind's section by a real click on the title,
// then checks (after a link the page size is not compared: Material is mid-swap): the same node is in the pop-up and has a box, its state is kept
// while open, it is back in its slot after closing, its state is kept again,
// no hollow is left and the layout did not move. State is what the kind can
// show: playing / paused / time / volume for media, a self-set id and a click
// counter plus load events for frames, pixels for a canvas.
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.join(here, "temp", "pw", "package.json"));
const pw = require("playwright");

const args = process.argv.slice(2);
const base = (args[0] || "").replace(/\/$/, "");
if (!base) { console.error("usage: node dev/check_media_engines.mjs <base-url>"); process.exit(2); }
const opt = (name) => { const i = args.indexOf(name); return i < 0 ? null : args[i + 1]; };
const only = opt("--engine");
const jsonOut = opt("--json");
// Takes `moveBefore` away from the page, so the plain `insertBefore` path runs in
// an engine that has it: shows what an engine without it does to media and frames.
const noMove = args.includes("--no-movebefore");
const URL_ = base + "/__media_fixture/";

const KNOWN_ERRORS = [
  /insertBefore/,                       // nav-icons.js, known
  /NotFoundError/, /The object can not be found here/,   // WebKit and Material, known
];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function chromiumExe() {
  if (process.env.CHROMIUM_EXE) return process.env.CHROMIUM_EXE;
  const root = path.join(process.env.LOCALAPPDATA || "", "ms-playwright");
  const dir = fs.readdirSync(root).filter((d) => /^chromium-\d+$/.test(d)).sort().pop();
  return path.join(root, dir, "chrome-win64", "chrome.exe");
}

// ---- in-page helpers (installed once per load) ----------------------------

const PAGE_JS = () => {
  const $ = (s, r) => (r || document).querySelector(s);
  window.mf = {
    movable: window.tksTargetMark && window.tksTargetMark.movable,
    // the element of a case, on the page or in the pop-up
    find(kind, n) {
      const sel = `[data-kind="${kind}"]` + (n ? `[data-n="${n}"]` : ":not([data-n])");
      return $(sel);
    },
    tag(kind, n) { this.find(kind, n).__tag = kind + (n || ""); },
    slot(el) {
      const p = el.parentNode;
      return { parent: p, index: Array.prototype.indexOf.call(p.childNodes, el) };
    },
    layout() {
      const heads = Array.from(document.querySelectorAll("article.md-content__inner > h2[id]")).map(
        (h) => Math.round(h.getBoundingClientRect().top + pageYOffset));
      return { docH: document.documentElement.scrollHeight, docW: document.documentElement.scrollWidth, heads };
    },
    titlePoint(id) {
      const h = document.getElementById(id);
      scrollTo({ top: h.getBoundingClientRect().top + pageYOffset - 220, behavior: "instant" });
      const r = document.createRange();
      r.selectNodeContents(h);
      const q = Array.from(r.getClientRects()).sort((a, b) => b.width - a.width)[0];
      return [Math.round(q.left + Math.min(q.width / 2, 40)), Math.round(q.top + q.height / 2)];
    },
    // everything the "after closing" checks read, in one object
    capture(kind, n) {
      const e = this.find(kind, n);
      const s = e ? this.slot(e) : null;
      return { st: this.state(kind, n), open: this.isOpen(), holds: this.holds(), tag: e && e.__tag,
               idx: s && s.index, parentTag: s && s.parent.tagName,
               parentId: s && (s.parent.id || s.parent.className),
               lay: this.layout(), connected: !!e && e.isConnected };
    },
    // A link to another spot of the page ends in a jump, and Material's instant
    // loading then swaps the page content for any same-page link, pop-up or not.
    // So the state is taken the moment the jump starts, before that swap.
    watchJump(kind, n) {
      this.jump = null;
      addEventListener("hashchange", () => { if (!this.jump) this.jump = this.capture(kind, n); }, true);
    },
    isOpen() { return !!$(".tks-focus"); },
    holds() { return document.querySelectorAll(".tks-focus-hold").length; },
    // is the tagged element the one in the pop-up, with a box
    shown(kind, n) {
      const e = $(".tks-focus " + `[data-kind="${kind}"]` + (n ? `[data-n="${n}"]` : ":not([data-n])"));
      if (!e) return { inPopup: false };
      const r = e.getBoundingClientRect();
      return { inPopup: true, sameNode: e.__tag === kind + (n || ""), w: r.width, h: r.height };
    },
    // state of one element, as plain data
    state(kind, n) {
      const e = this.find(kind, n) || $(".tks-focus " + `[data-kind="${kind}"]` + (n ? `[data-n="${n}"]` : ":not([data-n])"));
      if (!e) return null;
      if (kind === "video" || kind === "audio") {
        return { paused: e.paused, t: e.currentTime, muted: e.muted, vol: e.volume, ended: e.ended };
      }
      if (kind === "canvas") {
        const d = e.getContext("2d").getImageData(0, 0, e.width, e.height).data;
        let h = 0;
        for (let i = 0; i < d.length; i += 7) h = (h * 31 + d[i]) | 0;
        return { hash: h };
      }
      if (kind === "iframe") {
        const w = e.contentWindow, fv = w && w.document.getElementById("fv");
        return { id: w && w.selfId, clicks: w && w.clicks, loads: window.__loads.get(e) || 0,
                 fvPaused: fv && fv.paused, fvT: fv && fv.currentTime };
      }
      if (kind === "object") {
        const d = e.contentDocument, w = d && d.defaultView;
        return { id: w && w.selfId, clicks: w && w.clicks, loads: window.__loads.get(e) || 0 };
      }
      if (kind === "embed") {
        let d = null; try { d = e.getSVGDocument(); } catch (x) { /* not readable */ }
        return { id: d && d.defaultView && d.defaultView.selfId, loads: window.__loads.get(e) || 0 };
      }
      return null;
    },
  };
  // count load events of frames and plug-ins from the parent (set after the first load)
  window.__loads = new WeakMap();
  document.querySelectorAll("iframe, object, embed").forEach((e) => {
    window.__loads.set(e, 0);
    e.addEventListener("load", () => window.__loads.set(e, window.__loads.get(e) + 1));
  });
};

// ---- the cases ------------------------------------------------------------

const CASES = [
  { kind: "video", variants: ["playing", "paused"] },
  { kind: "audio", variants: ["playing", "paused"] },
  { kind: "iframe", variants: ["frame"] },
  { kind: "canvas", variants: ["pixels"] },
  { kind: "object", variants: ["doc"] },
  { kind: "embed", variants: ["doc"] },
  { kind: "video", n: "mixed", sec: "sec-mixed", variants: ["playing"] },
  { kind: "iframe", n: "mixed", sec: "sec-mixed", variants: ["frame"] },
  { kind: "canvas", n: "mixed", sec: "sec-mixed", variants: ["pixels"] },
  { kind: "audio", n: "mixed", sec: "sec-mixed", variants: ["playing"] },
  { kind: "video", n: "details", sec: "sec-nested", variants: ["playing"] },
  { kind: "canvas", n: "cell", sec: "sec-nested", variants: ["pixels"] },
  { kind: "audio", n: "cell", sec: "sec-nested", variants: ["playing"] },
];
const CLOSERS = ["x", "scrim", "esc", "link"];

// Puts the element into the state the variant stands for.
async function prepare(page, c, variant) {
  const sel = `[data-kind="${c.kind}"]` + (c.n ? `[data-n="${c.n}"]` : ":not([data-n])");
  const el = page.locator(sel).first();
  await el.scrollIntoViewIfNeeded();
  if (c.kind === "video" || c.kind === "audio") {
    // The media may not play at all (the WebKit build Playwright ships here never
    // settles `play()`); then only the structural checks apply, as for a paused one.
    const ok = await el.evaluate(async (e, v) => {
      e.muted = true; e.volume = 0.4;
      const wait = (p) => Promise.race([p, new Promise((r) => setTimeout(() => r("stuck"), 4000))]);
      if ((await wait(e.play().catch(() => "failed"))) === "stuck") { e.pause(); return false; }
      await wait(new Promise((r) => (e.readyState >= 3 ? r() : e.addEventListener("canplay", r, { once: true }))));
      e.pause();
      e.currentTime = 3;
      await new Promise((r) => setTimeout(r, 300));
      if (v === "playing") await wait(e.play());
      return true;
    }, variant);
    if (!ok) { await page.evaluate(([k, n]) => mf.tag(k, n), [c.kind, c.n || ""]); return "unplayable"; }
    await sleep(1200);
  } else if (c.kind === "iframe") {
    const fr = await (await el.elementHandle()).contentFrame();
    const playing = await fr.evaluate(async () => {
      const v = document.getElementById("fv");
      v.muted = true;
      const r = await Promise.race([v.play().then(() => true, () => false),
        new Promise((x) => setTimeout(() => x(false), 4000))]);
      if (!r) v.pause();
      return r;
    });
    await fr.locator("p").click();       // a real click inside the frame
    await fr.locator("p").click();
    await sleep(1200);
    if (!playing) { await page.evaluate(([k, n]) => mf.tag(k, n), [c.kind, c.n || ""]); return "frame-nomedia"; }
  } else if (c.kind === "object") {
    const fr = await (await el.elementHandle()).contentFrame();
    if (fr) { await fr.locator("p").click(); await sleep(200); }
  }
  await page.evaluate(([k, n]) => mf.tag(k, n), [c.kind, c.n || ""]);
}

// Do two states agree, given that `ms` passed in between? Returns a list of faults.
function compare(kind, variant, a, b, ms, label) {
  const bad = [];
  if (!a || !b) return [label + ": no state"];
  if (kind === "video" || kind === "audio") {
    if (b.paused !== a.paused) bad.push(`${label}: paused ${a.paused}->${b.paused}`);
    if (b.muted !== a.muted || Math.abs(b.vol - a.vol) > 0.001) bad.push(`${label}: sound settings changed`);
    if (a.paused) { if (Math.abs(b.t - a.t) > 0.05) bad.push(`${label}: time moved while paused ${a.t}->${b.t}`); }
    else if (b.t < a.t - 0.05) bad.push(`${label}: time jumped back ${a.t.toFixed(2)}->${b.t.toFixed(2)}`);
    else if (b.t > a.t + ms / 1000 + 1.5) bad.push(`${label}: time jumped ahead`);
  } else if (kind === "canvas") {
    if (b.hash !== a.hash) bad.push(`${label}: pixels changed`);
  } else {
    if (b.id !== a.id || b.loads !== a.loads) bad.push(`${label}: reloaded (id ${a.id}->${b.id}, loads ${a.loads}->${b.loads})`);
    if (kind !== "embed" && b.clicks !== a.clicks) bad.push(`${label}: click counter ${a.clicks}->${b.clicks}`);
    if (kind === "iframe" && variant !== "frame-nomedia") {
      if (b.fvPaused) bad.push(`${label}: video in frame stopped`);
      else if (b.fvT < a.fvT - 0.05) bad.push(`${label}: video in frame restarted ${a.fvT.toFixed(2)}->${b.fvT.toFixed(2)}`);
    }
  }
  return bad;
}

// Playing media must still advance a moment later.
async function advancing(page, c, variant) {
  if (variant !== "playing" && !(c.kind === "iframe" && variant === "frame")) return true;
  const s1 = await page.evaluate(([k, n]) => mf.state(k, n), [c.kind, c.n || ""]);
  await sleep(700);
  const s2 = await page.evaluate(([k, n]) => mf.state(k, n), [c.kind, c.n || ""]);
  if (!s1 || !s2) return false;
  return c.kind === "iframe" ? s2.fvT > s1.fvT + 0.3 : s2.t > s1.t + 0.3;
}

async function openClose(page, c, variant, closer, report) {
  const sec = c.sec || "sec-" + c.kind;
  const key = [c.kind + (c.n ? ":" + c.n : ""), variant, closer].join(" / ");
  const before = await page.evaluate(([k, n]) => ({ st: mf.state(k, n), slot: (() => { const e = mf.find(k, n); const s = mf.slot(e); return { idx: s.index, parentTag: s.parent.tagName, parentId: s.parent.id || s.parent.className }; })(), lay: mf.layout() }), [c.kind, c.n || ""]);
  const [px, py] = await page.evaluate((id) => mf.titlePoint(id), sec);
  await sleep(250);
  const t0 = Date.now();
  await page.mouse.click(px, py);
  await page.waitForFunction(() => mf.isOpen(), null, { timeout: 5000 }).catch(() => {});
  await sleep(500);
  const ms1 = Date.now() - t0;
  const shown = await page.evaluate(([k, n]) => mf.shown(k, n), [c.kind, c.n || ""]);
  const during = await page.evaluate(([k, n]) => mf.state(k, n), [c.kind, c.n || ""]);
  const layOpen = await page.evaluate(() => mf.layout());
  const holds = await page.evaluate(() => mf.holds());
  const adv1 = await advancing(page, c, variant);

  const faults = [];
  if (!shown.inPopup) faults.push("not in the pop-up");
  else {
    if (!shown.sameNode) faults.push("not the same node");
    if (!(shown.w > 0 && shown.h > 0)) faults.push(`no box ${shown.w}x${shown.h}`);
  }
  const open = compare(c.kind, variant, before.st, during, ms1, "open");
  if (!adv1) open.push("open: not advancing");
  if (JSON.stringify(layOpen) !== JSON.stringify(before.lay)) open.push("open: layout moved " + JSON.stringify([before.lay, layOpen]).slice(0, 160));
  if (holds < 1) open.push("open: no hollow");

  // close
  if (closer === "x") await page.click(".tks-focus__close");
  else if (closer === "scrim") await page.mouse.click(4, 4);
  else if (closer === "esc") await page.keyboard.press("Escape");
  else {
    await page.evaluate(([k, n]) => mf.watchJump(k, n), [c.kind, c.n || ""]);
    await page.click(".tks-focus .sf-link");
  }
  await page.waitForFunction(() => !mf.isOpen(), null, { timeout: 5000 }).catch(() => {});
  await sleep(500);
  const closed = await page.evaluate(([k, n, link]) => (link && mf.jump) || mf.capture(k, n), [c.kind, c.n || "", closer === "link"]);
  const adv2 = closer === "link" || await advancing(page, c, variant);
  const close = compare(c.kind, variant, before.st, closed.st, Date.now() - t0, "close");
  if (!adv2) close.push("close: not advancing");
  const slotOk = closed.connected && closed.tag === c.kind + (c.n || "") && closed.idx === before.slot.idx &&
    closed.parentTag === before.slot.parentTag && closed.parentId === before.slot.parentId;
  if (!slotOk) close.push(`close: not back in slot (${JSON.stringify(before.slot)} -> ${closed.idx},${closed.parentTag})`);
  if (closed.holds) close.push("close: hollow left");
  if (closer !== "link" && JSON.stringify(closed.lay) !== JSON.stringify(before.lay)) close.push("close: layout moved");
  report.push({ key, shown: faults.length === 0, open, close, faults });
  return { open, close, faults };
}

async function runEngine(name, type, launch) {
  const rows = [];
  const out = { engine: name, version: "", moveBefore: null, kinds: {}, errors: [], missing: [] };
  for (const c of CASES) {
    for (const variant of c.variants) {
      // A fresh browser per case: WebKit's headless build can die when a page
      // that played media is closed, and one dead browser must not end the run.
      const browser = await type.launch(launch);
      out.version = browser.version();
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await ctx.newPage();
      page.setDefaultTimeout(15000);
      if (noMove) await page.addInitScript(() => { Element.prototype.moveBefore = undefined; });
      page.on("pageerror", (e) => out.errors.push(String(e.message || e)));
      await page.goto(URL_, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForFunction(() => !!window.tksTargetMark, null, { timeout: 15000 });
      await page.evaluate(PAGE_JS);
      await sleep(1500);   // the page's own first-load work and the first frame loads
      if (out.moveBefore === null) out.moveBefore = await page.evaluate(() => typeof Element.prototype.moveBefore === "function");
      await page.evaluate(() => { window.__loads.forEach; });
      // every kind the script moves must have an element in the fixture
      const gaps = await page.evaluate(() => {
        const list = (mf.movable || "").split(",").map((s) => s.trim()).filter((s) => /^[a-z]+$/.test(s));
        return list.filter((t) => !document.querySelector(".md-typeset " + t));
      });
      gaps.forEach((g) => { if (!out.missing.includes(g)) out.missing.push(g); });
      try {
        const eff = (await prepare(page, c, variant)) || variant;
        for (const closer of CLOSERS) {
          const rep = [];
          try { await openClose(page, c, eff, closer, rep); }
          catch (e) { rep.push({ key: `${c.kind}/${variant}/${closer}`, shown: false, open: [], close: [], faults: ["script error: " + String(e.message).split("\n")[0]] }); }
          rows.push(...rep);
          // cycles after the first start from the state they ended in
          const back = await page.evaluate(() => !mf.isOpen());
          if (!back) await page.keyboard.press("Escape");
        }
      } catch (e) {
        rows.push({ key: `${c.kind}/${variant}`, shown: false, open: [], close: [], faults: ["setup error: " + String(e.message).split("\n")[0]] });
      }
      await browser.close().catch(() => {});
      console.error(`[${name}] ${c.kind}${c.n ? ":" + c.n : ""} / ${variant} done`);
    }
  }
  out.rows = rows;
  return out;
}

const engines = [
  ["chromium", pw.chromium, { executablePath: chromiumExe() }],
  ["firefox", pw.firefox, {}],
  ["webkit", pw.webkit, {}],
].filter(([n]) => !only || only === n);

const results = [];
for (const [n, t, l] of engines) results.push(await runEngine(n, t, l));

let failed = 0;
for (const r of results) {
  const errs = r.errors.filter((e) => !KNOWN_ERRORS.some((k) => k.test(e)));
  console.log(`\n== ${r.engine} ${r.version} · moveBefore: ${r.moveBefore} · js errors: ${errs.length}`);
  if (r.missing.length) { console.log("  kinds without a fixture element: " + r.missing.join(", ")); failed++; }
  for (const row of r.rows) {
    const bad = [...row.faults, ...row.open, ...row.close];
    if (bad.length) failed++;
    console.log(`  ${bad.length ? "FAIL" : "ok  "} ${row.key}${bad.length ? "  " + bad.join("; ") : ""}`);
  }
  errs.slice(0, 5).forEach((e) => console.log("  js error: " + e.slice(0, 160)));
  if (errs.length) failed++;
}
if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(results, null, 1));
console.log(`\n${failed ? failed + " problem line(s)" : "all media checks pass"}`);
process.exit(failed ? 1 : 0);
