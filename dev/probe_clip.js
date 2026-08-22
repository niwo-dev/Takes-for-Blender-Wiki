(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const d = document.getElementById("__drawer");
  if (d) { d.checked = true; d.dispatchEvent(new Event("change")); }
  await sleep(600);
  const toggle = document.querySelector(".md-nav--primary .md-nav__item--nested > .md-nav__toggle");
  const nav = toggle.parentElement.querySelector(":scope > .md-nav");
  const chain = [];
  let el = nav.parentElement;
  while (el && el !== document.documentElement) {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (cs.overflow !== "visible" || cs.overflowX !== "visible" || cs.clipPath !== "none") {
      chain.push({ tag: el.tagName.toLowerCase(), cls: (el.className || "").toString().slice(0, 40),
                   overflow: cs.overflow, overflowX: cs.overflowX,
                   right: Math.round(r.right), width: Math.round(r.width) });
    }
    el = el.parentElement;
  }
  return { clippingAncestors: chain };
})()
