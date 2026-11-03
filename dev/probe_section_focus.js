/* In-page measuring helpers for the section focus pop-up.
 *
 * Installed by dev/check_section_focus.py after every page load as `window.sf`.
 * Each helper returns plain JSON; the Python side decides pass/fail.
 */
(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const num = (v) => parseFloat(v);
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
        closeW: cr.width, closeH: cr.height,
        textW: r.width - num(cs.borderLeftWidth) - num(cs.borderRightWidth) - num(cs.paddingLeft) - num(cs.paddingRight),
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
