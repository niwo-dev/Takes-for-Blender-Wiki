(async () => {
  await new Promise(r => setTimeout(r, 900));
  const bar = document.querySelector(".md-path");
  if (!bar) return { error: "no breadcrumb bar" };
  const list = document.querySelector(".md-path__list");
  const items = [...document.querySelectorAll(".md-path__item")];
  const cs = getComputedStyle(bar);
  const lcs = list ? getComputedStyle(list) : null;
  const r = bar.getBoundingClientRect();
  const last = items[items.length - 1].getBoundingClientRect();
  const header = document.querySelector(".md-header").getBoundingClientRect();
  return {
    viewport: innerWidth, docScrollW: document.documentElement.scrollWidth,
    horizontalScroll: document.documentElement.scrollWidth > innerWidth,
    bar: { bg: cs.backgroundColor, color: cs.color, left: Math.round(r.left),
           width: Math.round(r.width), overflowX: cs.overflowX,
           padding: cs.padding },
    list: lcs ? { overflowX: lcs.overflowX, whiteSpace: lcs.whiteSpace,
                  scrollW: list.scrollWidth, clientW: list.clientWidth,
                  overflowing: list.scrollWidth > list.clientWidth + 1 } : null,
    crumbs: items.map(i => i.textContent.trim()),
    lastCrumbRight: Math.round(last.right),
    lastCrumbClipped: last.right > innerWidth - 2,
    header: { bg: getComputedStyle(document.querySelector(".md-header")).backgroundColor,
              bottom: Math.round(header.bottom) },
    barTop: Math.round(r.top)
  };
})()
