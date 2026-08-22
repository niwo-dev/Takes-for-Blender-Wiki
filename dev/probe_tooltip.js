(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  await sleep(700);
  const btn = document.querySelector('.md-header [data-md-component="palette"], .md-header__option label, .md-header__button');
  if (!btn) return { error: "no header button" };
  ["pointerenter","pointerover","mouseover","mouseenter","focus"].forEach(t =>
    btn.dispatchEvent(new (t.startsWith("pointer") ? PointerEvent : (t === "focus" ? FocusEvent : MouseEvent))(t, {bubbles:true})));
  if (btn.focus) btn.focus();
  await sleep(900);
  const tip = document.querySelector(".md-tooltip2, .md-tooltip");
  if (!tip) return { error: "tooltip never rendered", btn: btn.className };
  const chain = [];
  let el = tip;
  while (el && el !== document.documentElement) {
    const cs = getComputedStyle(el);
    const makesContext = cs.zIndex !== "auto" || cs.position === "fixed" ||
      cs.transform !== "none" || cs.filter !== "none" || cs.willChange !== "auto" ||
      cs.opacity !== "1" || cs.contain !== "none";
    chain.push({ tag: el.tagName.toLowerCase(), cls: (el.className||"").toString().slice(0,34),
                 pos: cs.position, z: cs.zIndex, ctx: makesContext });
    el = el.parentElement;
  }
  const r = tip.getBoundingClientRect();
  const path = document.querySelector(".md-path");
  const pr = path ? path.getBoundingClientRect() : null;
  return { tooltipRect: {t: Math.round(r.top), b: Math.round(r.bottom), l: Math.round(r.left)},
           pathRect: pr ? {t: Math.round(pr.top), b: Math.round(pr.bottom)} : null,
           overlaps: !!(pr && r.top < pr.bottom && r.bottom > pr.top),
           ancestry: chain };
})()
