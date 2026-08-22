(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  await sleep(800);
  const drawer = document.getElementById("__drawer");
  const btn = document.querySelector(".md-header a.md-header__button.md-logo")
           || document.querySelector('.md-header [data-md-component="palette"]');
  if (!btn) return { error: "no target button" };
  ["pointerenter","pointerover","mouseover","mouseenter"].forEach(t =>
    btn.dispatchEvent(new MouseEvent(t, { bubbles: true })));
  await sleep(900);
  const tip = document.querySelector(".md-tooltip2, .md-tooltip");
  if (!tip) return { error: "tooltip never rendered", btn: btn.className };
  const r = tip.getBoundingClientRect();
  const pr = document.querySelector(".md-path").getBoundingClientRect();
  const overlaps = r.top < pr.bottom && r.bottom > pr.top;
  // Hit-test inside the overlapping band only.
  const y = Math.round((Math.max(r.top, pr.top) + Math.min(r.bottom, pr.bottom)) / 2);
  const x = Math.round(r.left + r.width / 2);
  const hit = document.elementFromPoint(x, y);
  return {
    drawerOpen: !!(drawer && drawer.checked),
    tooltip: { t: Math.round(r.top), b: Math.round(r.bottom), l: Math.round(r.left) },
    strip: { t: Math.round(pr.top), b: Math.round(pr.bottom) },
    overlaps, testPoint: { x, y },
    topmostIsTooltip: !!(hit && (hit === tip || tip.contains(hit))),
    topmost: hit ? (hit.className || hit.tagName).toString().slice(0, 40) : null,
    z: { header: getComputedStyle(document.querySelector(".md-header")).zIndex,
         path: getComputedStyle(document.querySelector(".md-path")).zIndex }
  };
})()
