(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  await sleep(800);
  const btn = document.querySelector(".md-header a.md-header__button.md-logo");
  ["pointerenter","pointerover","mouseover","mouseenter"].forEach(t =>
    btn.dispatchEvent(new MouseEvent(t, { bubbles: true })));
  await sleep(900);
  const tip = document.querySelector(".md-tooltip2, .md-tooltip");
  const r = tip.getBoundingClientRect();
  const pr = document.querySelector(".md-path").getBoundingClientRect();
  const y = Math.round((Math.max(r.top, pr.top) + Math.min(r.bottom, pr.bottom)) / 2);
  const x = Math.round(r.left + r.width / 2);
  const hit = document.elementFromPoint(x, y);
  const chain = [];
  let el = hit;
  while (el && el !== document.documentElement) {
    const cs = getComputedStyle(el);
    const b = el.getBoundingClientRect();
    chain.push({ tag: el.tagName.toLowerCase(), cls: (el.className||"").toString().slice(0,32),
                 z: cs.zIndex, pos: cs.position, vis: cs.visibility,
                 box: [Math.round(b.left), Math.round(b.top), Math.round(b.right), Math.round(b.bottom)] });
    el = el.parentElement;
  }
  // Everything the browser stacks at that point, topmost first.
  const stack = (document.elementsFromPoint(x, y) || []).slice(0, 6)
    .map(e => (e.className || e.tagName).toString().slice(0, 34));
  return { point: {x, y}, tipBox: [Math.round(r.left), Math.round(r.top)], hitChain: chain, stack };
})()
