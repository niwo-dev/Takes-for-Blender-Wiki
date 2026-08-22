(async () => {
  await new Promise(r => setTimeout(r, 900));
  const inner = document.querySelector(".md-content__inner");
  const last = inner.lastElementChild;
  const footer = document.querySelector(".md-footer");
  const lr = last.getBoundingClientRect(), fr = footer.getBoundingClientRect();
  const cs = getComputedStyle(inner);
  return { lastEl: last.tagName.toLowerCase(),
           gapToFooter: Math.round(fr.top - lr.bottom),
           innerPaddingBottom: cs.paddingBottom, innerMarginBottom: cs.marginBottom };
})()
