(async () => {
  await new Promise(r => setTimeout(r, 900));
  const h1 = document.querySelector(".md-content__inner h1");
  const crumbs = [...document.querySelectorAll(".md-path__item")]
    .map(li => li.textContent.trim()).filter(Boolean);
  const drawer = document.getElementById("__drawer");
  if (drawer) { drawer.checked = true; drawer.dispatchEvent(new Event("change")); }
  await new Promise(r => setTimeout(r, 500));
  const first = document.querySelector(
    ".md-nav--primary > .md-nav__list > .md-nav__item > .md-nav__link .md-ellipsis");
  return { h1: h1 ? h1.textContent.replace("¶", "").trim() : null,
           breadcrumbs: crumbs, firstMenuRow: first ? first.textContent.trim() : null,
           tab: document.title };
})()
