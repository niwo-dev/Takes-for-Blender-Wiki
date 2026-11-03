/* In-page measuring helpers for the section focus pop-up.
 *
 * Installed by dev/check_section_focus.py after every page load as `window.sf`.
 * Each helper returns plain JSON; the Python side decides pass/fail.
 */
(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const num = (v) => parseFloat(v);
  // a diagram on the page: drawn host, source block, or the hollow that stands for it while moved
  const DIAG = "div.mermaid, pre.mermaid, .tks-focus-hold";
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function lum(rgb) {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]);
  }
  function parse(c) {
    const cm = c.match(/color\(srgb ([^)]+)\)/);   // what color-mix() computes to
    if (cm) {
      const q = cm[1].split(/[ \/]+/).filter(Boolean).map(Number);
      return { rgb: q.slice(0, 3).map((v) => v * 255), a: q.length > 3 ? q[3] : 1 };
    }
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number);
    return { rgb: p.slice(0, 3), a: p.length > 3 ? p[3] : 1 };
  }
  function over(fg, bg) {   // blend fg (with alpha) over opaque bg
    return fg.rgb.map((v, i) => v * fg.a + bg.rgb[i] * (1 - fg.a));
  }
  function ratio(a, b) {
    const la = lum(a), lb = lum(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  }

  const sf = {
    pageState(id) {
      const h = document.getElementById(id);
      return {
        scrollY: window.pageYOffset, scrollX: window.pageXOffset,
        headTop: h.getBoundingClientRect().top, headLeft: h.getBoundingClientRect().left,
        docH: document.documentElement.scrollHeight,
        docW: document.documentElement.scrollWidth,
      };
    },
    scrollHeadingTo(id, top) {
      const h = document.getElementById(id);
      window.scrollTo({ top: h.getBoundingClientRect().top + window.pageYOffset - top, behavior: "instant" });
    },
    // A point on the heading's text (right of the first glyph, inside a text rect).
    titlePoint(id) {
      const h = document.getElementById(id);
      const r = document.createRange();
      r.selectNodeContents(h);
      // The longest rect is the title text; the permalink mark is a short one.
      const q = Array.from(r.getClientRects()).sort((x, y) => y.width - x.width)[0];
      return [Math.round(q.left + Math.min(q.width / 2, 40)), Math.round(q.top + q.height / 2)];
    },
    blankPoint(id) {
      const h = document.getElementById(id);
      const r = document.createRange();
      r.selectNodeContents(h);
      const rects = Array.from(r.getClientRects());
      const right = Math.max(...rects.map((q) => q.right));
      const hb = h.getBoundingClientRect();
      return [Math.round(Math.min(hb.right - 4, right + 120)), Math.round(hb.top + hb.height / 2)];
    },
    headerlinkPoint(id) {
      const h = document.getElementById(id);
      const a = $(".headerlink", h);
      h.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
      const r = a.getBoundingClientRect();
      return [Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2)];
    },
    pointOf(sel) {
      const el = $(sel, $(".tks-focus") || document);   // the copy, not the page's own
      if (el.closest(".tks-focus")) el.scrollIntoView({ block: "center" });
      const r = el.getBoundingClientRect();
      return [Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2)];
    },
    closePoint() { return sf.pointOf(".tks-focus__close"); },
    popupTitlePoint() {
      const h = $(".tks-focus__body > :first-child");
      const r = document.createRange();
      r.selectNodeContents(h);
      const q = Array.from(r.getClientRects()).sort((x, y) => y.width - x.width)[0];
      return [Math.round(q.left + Math.min(q.width / 2, 40)), Math.round(q.top + q.height / 2)];
    },
    scrimStyle(sel) {
      const s = getComputedStyle($(sel));
      return { backdropFilter: s.backdropFilter, backgroundColor: s.backgroundColor, zIndex: s.zIndex };
    },
    geometry() {
      const b = $(".tks-focus"), body = $(".tks-focus__body"), x = $(".tks-focus__close");
      const r = b.getBoundingClientRect(), cr = x.getBoundingClientRect();
      const cs = getComputedStyle(b);
      const inner = $(".md-content__inner"), ics = getComputedStyle(inner);
      const vw = document.documentElement.clientWidth, vh = window.innerHeight;
      return {
        vw, vh, innerW: window.innerWidth,
        boxW: r.width, boxH: r.height,
        gapL: r.left, gapR: vw - r.right, gapT: r.top, gapB: vh - r.bottom,
        padL: num(cs.paddingLeft), padR: num(cs.paddingRight),
        padT: num(cs.paddingTop), padB: num(cs.paddingBottom),
        closeTop: cr.top - r.top, closeRight: r.right - cr.right,
        closeW: cr.width, closeH: cr.height, closeBottom: cr.bottom - r.top - num(cs.borderTopWidth),
        // the text column: the box minus its frame and the scrollbar the body carries,
        // less the room the body keeps for the table wrappers' reach past the text
        textW: body.clientWidth - num(getComputedStyle(body).paddingLeft) - num(getComputedStyle(body).paddingRight),
        pageTextW: inner.clientWidth - num(ics.paddingLeft) - num(ics.paddingRight),
        bodyScrollH: body.scrollHeight, bodyClientH: body.clientHeight,
      };
    },
    scrollInside() {
      const b = $(".tks-focus__body"), x = $(".tks-focus__close");
      const topBefore = x.getBoundingClientRect().top;
      const scrollable = b.scrollHeight > b.clientHeight + 1;
      b.scrollTop = b.scrollHeight;
      const r = x.getBoundingClientRect();
      return {
        scrollable, scrolled: b.scrollTop > 0,
        closeStays: Math.abs(r.top - topBefore) < 0.5 && r.top >= 0 && r.bottom <= window.innerHeight,
        pageScrollMoved: window.pageYOffset,
      };
    },
    typeCompare(id) {
      const head = document.getElementById(id);
      const nodes = [head];
      for (let n = head.nextElementSibling; n; n = n.nextElementSibling) {
        if (/^H[1-2]$/.test(n.tagName)) break;
        nodes.push(n);
      }
      const clone = Array.from($(".tks-focus__body").children);
      const props = ["fontSize", "lineHeight", "color"];
      const out = [];
      let same = true;
      const pair = (a, b, label) => {
        if (!a || !b) { same = false; out.push({ label, missing: true }); return; }
        const sa = getComputedStyle(a), sb = getComputedStyle(b);
        const diff = props.filter((p) => sa[p] !== sb[p]);
        if (diff.length) same = false;
        out.push({ label, diff, page: props.map((p) => sa[p]), popup: props.map((p) => sb[p]) });
      };
      pair(nodes[0], clone[0], "heading");
      for (const tag of ["P", "UL", "DETAILS"]) {
        const i = nodes.findIndex((n) => n.tagName === tag);
        if (i > 0) pair(nodes[i], clone[i], tag.toLowerCase());
      }
      const li = $("li", nodes.find((n) => n.tagName === "UL") || head);
      const ci = clone.find((n) => n.tagName === "UL");
      if (li && ci) pair(li, $("li", ci), "li");
      const code = nodes.map((n) => $("pre code", n)).find(Boolean);
      const ccode = clone.map((n) => $("pre code", n)).find(Boolean);
      if (code && ccode) pair(code, ccode, "pre code");
      return { same, out };
    },
    contrast() {
      const res = {};
      const box = $(".tks-focus"), p = $(".tks-focus__body p") || $(".tks-focus__body");
      for (const [key, scheme] of [["dark", "slate"], ["light", "default"]]) {
        const prev = document.body.getAttribute("data-md-color-scheme");
        document.body.setAttribute("data-md-color-scheme", scheme);
        const bg = parse(getComputedStyle(box).backgroundColor);
        const fg = parse(getComputedStyle(p).color);
        const bgRgb = bg.rgb;
        res[key] = Math.round(ratio(over(fg, { rgb: bgRgb }), bgRgb) * 100) / 100;
        document.body.setAttribute("data-md-color-scheme", prev);
      }
      return res;
    },
    lines() {
      const box = $(".tks-focus"), cs = getComputedStyle(box);
      const bg = parse(cs.backgroundColor).rgb;
      const bc = parse(cs.borderTopColor);
      const line = over(bc, { rgb: bg });
      return {
        borderWidth: cs.borderTopWidth, borderStyle: cs.borderTopStyle,
        borderContrast: Math.round(ratio(line, bg) * 1000) / 1000,
        shadow: cs.boxShadow, radius: cs.borderTopLeftRadius,
      };
    },
    a11y() {
      const b = $(".tks-focus");
      const lab = document.getElementById(b.getAttribute("aria-labelledby"));
      return {
        ok: b.getAttribute("role") === "dialog" && b.getAttribute("aria-modal") === "true" &&
            !!lab && lab.textContent.trim().length > 0 && !!$(".tks-focus__close[aria-label]"),
        label: lab && lab.textContent.trim(),
      };
    },
    focusInside() { return !!$(".tks-focus") && $(".tks-focus").contains(document.activeElement); },
    focusRing() {
      const a = document.activeElement, s = getComputedStyle(a);
      return {
        isClose: a.classList.contains("tks-focus__close"),
        outlineWidth: s.outlineWidth, outlineStyle: s.outlineStyle, outlineColor: s.outlineColor,
        focusVisible: a.matches(":focus-visible"),
      };
    },
    dupIds() {
      const seen = {}, dups = [];
      $$("[id]").forEach((e) => { if (seen[e.id]) dups.push(e.id); seen[e.id] = 1; });
      return dups;
    },
    landingInfo(id) {
      // does the popup's content equal the section's text (minus permalink marks)?
      const head = document.getElementById(id);
      const norm = (t) => t.replace(/¶/g, "").replace(/\s+/g, "");
      let want = norm(head.textContent);
      for (let n = head.nextElementSibling; n; n = n.nextElementSibling) {
        if (/^H([1-6])$/.test(n.tagName) && +n.tagName[1] <= +head.tagName[1]) break;
        want += norm(n.textContent);
      }
      const got = norm($(".tks-focus__body").textContent);
      return { same: norm(want) === got, wantLen: want.length, gotLen: got.length,
               scrollY: window.pageYOffset };
    },
    contentIntact(id) { return sf.landingInfo(id).same ? { ok: true } : { ok: false, info: sf.landingInfo(id) }; },
    // First visible paragraph of the section, so injected test nodes can be clicked.
    firstParagraph(id) {
      for (let n = document.getElementById(id).nextElementSibling; n; n = n.nextElementSibling) {
        if (n.tagName === "P") return n;
      }
    },
    injectLink(href, tag, sectionId) {
      const host = sectionId ? sf.firstParagraph(sectionId) : $(".md-content__inner p");
      const a = document.createElement("a");
      a.href = href; a.textContent = " link " + tag; a.setAttribute("data-sf", tag);
      host.appendChild(a);
    },
    injectImage(sectionId) {
      const p = sf.firstParagraph(sectionId);
      const img = document.createElement("img");
      // a tiny inline PNG, so the check does not depend on a file
      img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNk+M9Qz0AEYBxVSF+FAP5FDvcfRYWgAAAAAElFTkSuQmCC";
      img.setAttribute("data-sf", "img");
      p.appendChild(img);
    },
    injectTabs(sectionId) {
      const p = document.getElementById(sectionId).nextElementSibling;
      const d = document.createElement("div");
      d.setAttribute("data-sf", "tabs");
      d.innerHTML =
        '<div class="tabbed-set tabbed-alternate" data-tabs="9:2">' +
        '<input checked="checked" id="__tabbed_9_1" name="__tabbed_9" type="radio">' +
        '<input id="__tabbed_9_2" name="__tabbed_9" type="radio">' +
        '<div class="tabbed-labels"><label for="__tabbed_9_1">Alpha</label>' +
        '<label for="__tabbed_9_2">Beta</label></div>' +
        '<div class="tabbed-content"><div class="tabbed-block"><p>alpha body</p></div>' +
        '<div class="tabbed-block"><p>beta body</p></div></div></div>';
      p.after(d);
    },
    tabsTest() {
      const popup = $(".tks-focus__body");
      const real = $("[data-sf=tabs]:not(.tks-focus *)") || $$("[data-sf=tabs]").find((e) => !e.closest(".tks-focus"));
      const label = $$("label", popup).find((l) => l.textContent === "Beta");
      label.click();
      const radios = $$("input[type=radio]", popup);
      const pageRadios = $$("input[type=radio]", real);
      const blocks = $$(".tabbed-block", popup);
      const vis = blocks.map((b) => getComputedStyle(b).display);
      const labelFor = label.getAttribute("for");
      return {
        ok: radios[1].checked && !radios[0].checked && pageRadios[0].checked && !pageRadios[1].checked &&
            vis[1] !== "none" && vis[0] === "none" && !!document.getElementById(labelFor) &&
            document.getElementById(labelFor).closest(".tks-focus") !== null,
        popupChecked: radios.map((r) => r.checked), pageChecked: pageRadios.map((r) => r.checked), vis,
      };
    },
    detailsTest() {
      const d = $("details", $(".tks-focus__body"));
      if (!d) return { ok: false, why: "no details in section" };
      const was = d.open;
      d.querySelector("summary").click();
      const mid = d.open;
      d.querySelector("summary").click();
      const orig = $$("details").find((x) => !x.closest(".tks-focus"));
      return { ok: was !== mid && d.open === was, was, mid, pageUnchanged: orig && orig.open === was };
    },
    copyTest() {
      const body = $(".tks-focus__body");
      const btn = $(".md-code__button[data-clipboard-target]", body);
      if (!btn) return { ok: false, why: "no copy button in popup" };
      // Hidden text cannot be selected, so a collapsed block is opened first.
      const wrap = btn.closest("details");
      if (wrap) wrap.open = true;
      const target = btn.getAttribute("data-clipboard-target");
      const el = $(target, document);   // first match in document order
      const inPopup = body.contains(el);
      let copied = null;
      const orig = document.execCommand;
      document.execCommand = function (cmd) {
        if (cmd === "copy") copied = String(window.getSelection());
        return true;
      };
      btn.click();
      document.execCommand = orig;
      const want = ($(target, body) || {}).textContent;
      return { ok: inPopup && copied !== null && copied === want.replace(/\n+$/, "") && copied.length > 0,
               target, inPopup, copiedLen: copied && copied.length, wantLen: want && want.length };
    },
    imagesTest() {
      const imgs = $$("img", $(".tks-focus__body"));
      const r = imgs.map((i) => i.complete && i.naturalWidth > 0 && i.getBoundingClientRect().width > 0);
      return { ok: imgs.length > 0 && r.every(Boolean), count: imgs.length };
    },
    // The marked words in the pop-up (or on the page when `where` is "page").
    markInfo(where) {
      const root = where === "page" ? $(".md-content__inner") : $(".tks-focus__body");
      const marks = $$("mark.tks-text-mark", root);
      const body = $(".tks-focus__body");
      const first = marks[0];
      let inScroll = null;
      if (first && where !== "page" && body) {
        const b = body.getBoundingClientRect(), r = first.getBoundingClientRect();
        inScroll = r.top >= b.top - 0.5 && r.bottom <= b.bottom + 0.5;
      }
      return {
        count: marks.length, texts: marks.map((m) => m.textContent),
        joined: marks.map((m) => m.textContent).join(""),
        inScroll, bodyScrollTop: body ? body.scrollTop : null,
        pageScrollY: window.pageYOffset,
        scrollable: body ? body.scrollHeight > body.clientHeight + 1 : null,
      };
    },
    popupHeights() {
      const b = $(".tks-focus"), body = $(".tks-focus__body");
      return { boxH: b.getBoundingClientRect().height, bodyClientH: body.clientHeight,
               bodyScrollH: body.scrollHeight };
    },
    // Three plain words from the section's last paragraph that occur nowhere
    // earlier in it: a directive aimed at the section's end.
    lastWords(id) {
      const head = document.getElementById(id);
      const all = [];
      let last = null;
      for (let n = head.nextElementSibling; n; n = n.nextElementSibling) {
        if (/^H([1-6])$/.test(n.tagName) && +n.tagName[1] <= +head.tagName[1]) break;
        all.push(n);
        if (n.tagName === "P" && /^[A-Za-z ]{20,}/.test(n.textContent.trim())) last = n;
      }
      const words = last.textContent.trim().replace(/\s+/g, " ").split(" ");
      const hay = all.map((n) => n.textContent.replace(/\s+/g, " ").toLowerCase()).join("|");
      for (let i = 0; i + 3 <= words.length; i++) {
        const w = words.slice(i, i + 3).join(" ");
        if (/^[A-Za-z ]+$/.test(w) && hay.split(w.toLowerCase()).length === 2) return w;
      }
      return null;
    },
    // Pop-up heights with the marks, then the same pop-up with the marks taken
    // out again (details the mark opened stay open: that is not the mark's doing).
    heightsWithoutMarks() {
      const before = sf.popupHeights();
      $$("mark.tks-text-mark", $(".tks-focus__body")).forEach((m) => m.replaceWith(...m.childNodes));
      $(".tks-focus__body").normalize();
      return { withMark: before, without: sf.popupHeights() };
    },
    // Colour and box of the mark in both schemes, against the declaration `::target-text` uses.
    markLook() {
      const host = $(".tks-focus__body p") || $(".tks-focus__body");
      const m = document.createElement("mark");
      m.className = "tks-text-mark"; m.textContent = "x";
      host.appendChild(m);
      const ref = document.createElement("span");
      ref.style.backgroundColor = "var(--tks-text-mark-bg)";
      host.appendChild(ref);
      const out = { schemes: {} };
      for (const [key, scheme] of [["dark", "slate"], ["light", "default"]]) {
        const prev = document.body.getAttribute("data-md-color-scheme");
        document.body.setAttribute("data-md-color-scheme", scheme);
        const cs = getComputedStyle(m);
        out.schemes[key] = { mark: cs.backgroundColor, ref: getComputedStyle(ref).backgroundColor,
                             color: cs.color, hostColor: getComputedStyle(host).color };
        document.body.setAttribute("data-md-color-scheme", prev);
      }
      const cs = getComputedStyle(m);
      out.box = ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "marginTop", "marginRight",
                 "marginBottom", "marginLeft", "borderTopWidth", "borderRadius"].map((k) => cs[k]);
      let rule = null;
      for (const sheet of document.styleSheets) {
        let rules; try { rules = sheet.cssRules; } catch (e) { continue; }
        for (const r of rules) if (r.selectorText === "::target-text") rule = r.style.getPropertyValue("background-color");
      }
      out.targetTextRule = rule;
      m.remove(); ref.remove();
      return out;
    },
    // Index, among the section's top-level nodes, of the node holding a diagram
    // (rendered host or the source block); -1 when there is none.
    diagramIndex(id) {
      const head = document.getElementById(id);
      const nodes = [head];
      for (let n = head.nextElementSibling; n; n = n.nextElementSibling) {
        if (/^H([1-6])$/.test(n.tagName) && +n.tagName[1] <= +head.tagName[1]) break;
        nodes.push(n);
      }
      return nodes.findIndex((n) => n.matches(DIAG) || n.querySelector(DIAG));
    },
    // Scroll the pop-up so its block number `idx` sits at the top of the body.
    scrollPopupToBlock(idx) {
      const body = $(".tks-focus__body"), el = body.children[idx];
      body.scrollTop = el.getBoundingClientRect().top - body.getBoundingClientRect().top + body.scrollTop - 8;
    },
    // Every box in the page's text column plus the document height: the whole
    // layout, for "nothing on the page moved" comparisons.
    layout() {
      const inner = $(".md-content__inner");
      return {
        docH: document.documentElement.scrollHeight, scrollY: window.pageYOffset,
        blocks: Array.from(inner.children).map((e) => {
          const r = e.getBoundingClientRect();
          return [e.tagName, r.top, r.left, r.width, r.height];
        }),
      };
    },
    // Remember the drawn diagram on the page and its neighbours.
    tagHost() {
      const h = $(".md-content__inner div.mermaid");
      if (!h) return null;
      window.__sfHost = h; window.__sfPrev = h.previousElementSibling; window.__sfNext = h.nextElementSibling;
      const r = h.getBoundingClientRect();
      return { w: r.width, h: r.height };
    },
    // Where the remembered host is now, and what is left over.
    hostState() {
      const h = window.__sfHost, r = h.getBoundingClientRect();
      return {
        inPopup: !!h.closest(".tks-focus"), inPage: !!h.closest(".md-content__inner") && !h.closest(".tks-focus"),
        inSlot: h.previousElementSibling === window.__sfPrev && h.nextElementSibling === window.__sfNext,
        holds: $$(".tks-focus-hold").length,
        strayPre: $$(".md-content__inner pre.mermaid").length, hosts: $$("div.mermaid").length,
        w: r.width, h: r.height,
      };
    },
    // The diagram of whichever kind sits in the pop-up now.
    popupDiagram() {
      const d = $(".tks-focus__body div.mermaid"), p = $(".tks-focus__body pre.mermaid");
      const el = d || p;
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { kind: d ? "host" : "pre", w: r.width, h: r.height };
    },
    // Open every h2-h6 section of this page by a title click, compare each block
    // of the page with its block in the pop-up, close again and check the page.
    // Sideways room of the pop-up's scrolling body, and how far the × stands
    // from the body's vertical scrollbar. `sideways` is what the browser would
    // scroll; `out` is the furthest right edge of any block that is not clipped by
    // a scroller of its own, past the body's client box, so a guard that hides a
    // sub-pixel overflow cannot hide real overflow.
    scrollInfo() {
      const body = $(".tks-focus__body"), x = $(".tks-focus__close");
      if (!body || !x) return null;
      const br = body.getBoundingClientRect();
      const clientRight = br.left + body.clientLeft + body.clientWidth;
      const bar = body.offsetWidth - body.clientWidth - 2 * body.clientLeft;
      let out = -1e9, who = "";
      for (const el of $$("*", body)) {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        let clipped = false;
        for (let a = el.parentElement; a && a !== body; a = a.parentElement) {
          if (getComputedStyle(a).overflowX !== "visible") { clipped = true; break; }
        }
        if (clipped || getComputedStyle(el).position === "absolute") continue;
        if (r.right - clientRight > out) {
          out = r.right - clientRight;
          who = el.tagName.toLowerCase() + (typeof el.className === "string" && el.className ? "." + el.className.trim().split(/\s+/).join(".") : "");
        }
      }
      const xr = x.getBoundingClientRect();
      // With no scrollbar shown, the strip a scrollbar would take stands in for it.
      const w = bar > 0 ? bar : 15;
      const sb = { left: br.right - body.clientLeft - w, right: br.right, top: br.top, bottom: br.bottom };
      const dx = Math.max(sb.left - xr.right, xr.left - sb.right);
      const dy = Math.max(sb.top - xr.bottom, xr.top - sb.bottom);
      const clear = Math.max(dx, dy);
      return { sideways: body.scrollWidth - body.clientWidth, bar, out: +out.toFixed(2), who,
               clear: +clear.toFixed(2), dpr: window.devicePixelRatio,
               boxW: $(".tks-focus").getBoundingClientRect().width };
    },
    async sweepPage() {
      const COUNT = ["img", "svg", "table", "pre", "details", "iframe", "video", "div.mermaid"];
      const heads = $$(".md-content__inner h2[id], .md-content__inner h3[id], .md-content__inner h4[id], " +
                       ".md-content__inner h5[id], .md-content__inner h6[id]");
      const level = (n) => +n.tagName[1];
      const walk = (head) => {
        const nodes = [head];
        for (let n = head.nextElementSibling; n; n = n.nextElementSibling) {
          if (/^H([1-6])$/.test(n.tagName) && +n.tagName[1] <= level(head)) break;
          nodes.push(n);
        }
        return nodes;
      };
      const measure = (n) => {
        const r = n.getBoundingClientRect(), cs = getComputedStyle(n);
        const cls = n.className && typeof n.className === "string" ? "." + n.className.trim().split(/\s+/).join(".") : "";
        const o = { vis: r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none",
                    h: r.height, w: r.width, tag: n.tagName.toLowerCase() + cls };
        COUNT.forEach((sel) => { o[sel] = n.querySelectorAll(sel).length + (n.matches(sel) ? 1 : 0); });
        return o;
      };
      const out = { sections: 0, blocks: 0, mismatches: [], notOpened: [], layoutMoved: [], notRestored: [],
                    sideways: [], sticksOut: [], closeNear: [] };
      for (const head of heads) {
        if (head.closest(".tks-focus")) continue;
        out.sections++;
        const nodes = walk(head);
        head.scrollIntoView({ block: "center", behavior: "instant" });
        const before = sf.layout();
        const page = nodes.map(measure);
        const range = document.createRange();
        range.selectNodeContents(head);
        const q = Array.from(range.getClientRects()).sort((x, y) => y.width - x.width)[0];
        head.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0,
          clientX: q.left + Math.min(q.width / 2, 40), clientY: q.top + q.height / 2 }));
        const body = $(".tks-focus__body");
        if (!body) { out.notOpened.push(head.id); continue; }
        const during = sf.layout();
        if (JSON.stringify(before) !== JSON.stringify(during)) out.layoutMoved.push(head.id);
        const pop = Array.from(body.children).map(measure);
        const id = head.id;
        if (pop.length !== page.length) out.mismatches.push({ section: id, block: "count", page: page.length, popup: pop.length });
        page.forEach((a, i) => {
          out.blocks++;
          const b = pop[i];
          if (!b) return;
          const why = [];
          if (a.vis !== b.vis) why.push("visible " + a.vis + " vs " + b.vis);
          if (Math.abs(a.h - b.h) > 1) why.push("height " + a.h.toFixed(1) + " vs " + b.h.toFixed(1));
          if (a.vis && Math.abs(a.w - b.w) > 1 && i > 0) why.push("width " + a.w.toFixed(1) + " vs " + b.w.toFixed(1));
          COUNT.forEach((sel) => { if (a[sel] !== b[sel]) why.push(sel + " " + a[sel] + " vs " + b[sel]); });
          if (why.length) out.mismatches.push({ section: id, block: i, tag: a.tag, why: why.join("; ") });
        });
        // Late sizing (the observer, a diagram) settles before the sideways room is read.
        await sleep(60);
        const si = sf.scrollInfo();
        if (si.sideways > 0) out.sideways.push(id + " " + si.sideways + "px (" + si.who + ")");
        if (si.out > 1) out.sticksOut.push(id + " " + si.out + "px (" + si.who + ")");
        if (si.clear < 4) out.closeNear.push(id + " " + si.clear + "px");
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
        if ($(".tks-focus") || $$(".tks-focus-hold").length) out.notRestored.push(id + " (still open or hollow left)");
        else {
          const after = sf.layout();
          if (JSON.stringify(before.blocks) !== JSON.stringify(after.blocks) || before.docH !== after.docH) out.notRestored.push(id + " layout");
        }
      }
      return out;
    },
    // Close the open pop-up and time the band that follows, from the close.
    async bandTiming(how) {
      const t0 = performance.now();
      if (how === "scrim") $(".tks-focus-scrim").click();
      const at = {};
      await new Promise((resolve) => {
        const tick = () => {
          const now = performance.now() - t0, m = $(".tks-target-mark");
          if (m && at.present === undefined) at.present = now;
          if (m && m.classList.contains("is-fading") && at.fading === undefined) at.fading = now;
          if (!m && at.present !== undefined && at.gone === undefined) { at.gone = now; return resolve(); }
          if (now > 8000) return resolve();
          requestAnimationFrame(tick);
        };
        tick();
      });
      return { present: Math.round(at.present), fading: Math.round(at.fading), gone: Math.round(at.gone) };
    },
  };
  window.sf = sf;
  return true;
})();
