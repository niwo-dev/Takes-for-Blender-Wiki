(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  await sleep(900);
  const h1 = document.querySelector(".md-content__inner h1");
  if (!h1) return { error: "no h1" };
  // Material stamps the scheme on <body>, not the root element.
  const host = document.body.hasAttribute("data-md-color-scheme")
    ? document.body : document.documentElement;
  const read = () => {
    const cs = getComputedStyle(h1);
    return { scheme: host.getAttribute("data-md-color-scheme"),
             align: cs.textAlign, bg: cs.backgroundColor, color: cs.color };
  };
  const was = host.getAttribute("data-md-color-scheme");
  const a = read();
  host.setAttribute("data-md-color-scheme", was === "slate" ? "default" : "slate");
  await sleep(300);
  const b = read();
  host.setAttribute("data-md-color-scheme", was);
  return { host: host.tagName, a, b,
           bothTinted: ![a.bg, b.bg].some(x => x.includes("rgba(0, 0, 0, 0)")),
           differ: a.bg !== b.bg };
})()
