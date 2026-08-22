(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  await sleep(900);
  const h1 = document.querySelector(".md-content__inner > h1");
  if (!h1) return { error: "no page title" };
  const host = document.body.hasAttribute("data-md-color-scheme")
    ? document.body : document.documentElement;
  const read = () => {
    const cs = getComputedStyle(h1);
    const r = h1.getBoundingClientRect();
    const path = document.querySelector(".md-path");
    const pr = path ? path.getBoundingClientRect() : null;
    return { scheme: host.getAttribute("data-md-color-scheme"),
             align: cs.textAlign, bg: cs.backgroundColor, radius: cs.borderRadius,
             left: Math.round(r.left), width: Math.round(r.width),
             gapAboveStrip: pr ? Math.round(r.top - pr.bottom) : null };
  };
  const was = host.getAttribute("data-md-color-scheme");
  const a = read();
  host.setAttribute("data-md-color-scheme", was === "slate" ? "default" : "slate");
  await sleep(300);
  const b = read();
  host.setAttribute("data-md-color-scheme", was);
  return { win: innerWidth, root: document.documentElement.clientWidth, a, b };
})()
