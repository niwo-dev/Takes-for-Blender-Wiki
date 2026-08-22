(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const d = document.getElementById("__drawer");
  if (d) { d.checked = true; d.dispatchEvent(new Event("change")); }
  await sleep(600);
  const toggle = document.querySelector(".md-nav--primary .md-nav__item--nested > .md-nav__toggle");
  const nav = toggle.parentElement.querySelector(":scope > .md-nav");
  // Closed steady state: is any of the panel inside the drawer's visible box?
  const drawerBox = document.querySelector(".md-sidebar--primary").getBoundingClientRect();
  const r = nav.getBoundingClientRect();
  const firstLink = nav.querySelector("a.md-nav__link");
  const lr = firstLink ? firstLink.getBoundingClientRect() : null;
  const hit = lr ? document.elementFromPoint(
      Math.min(Math.max(lr.left + 5, 0), innerWidth - 1),
      Math.min(Math.max(lr.top + 5, 0), innerHeight - 1)) : null;
  return {
    drawer: {l: Math.round(drawerBox.left), r: Math.round(drawerBox.right)},
    closedPanel: {l: Math.round(r.left), r: Math.round(r.right)},
    overlapsDrawer: r.left < drawerBox.right && r.right > drawerBox.left,
    firstLinkHitIsPanelLink: !!(hit && nav.contains(hit)),
    docScrollW: document.documentElement.scrollWidth, winW: innerWidth
  };
})()
