/* Two halves of one invariant, measured in a real browser.
 *
 * A nested drawer panel must be VISIBLE for exactly as long as it is sliding,
 * and unreachable once it has parked. Checking only the first half passes a
 * `visibility: visible` that leaves a live, clickable menu sitting on top of
 * the page; checking only the second passes the bug where the panel collapses
 * at t=0 and the slide runs where nobody can see it.
 *
 * Returns per-sample transform + visibility across the backward transition,
 * plus the parked panel's reachability with the drawer both open and shut.
 */
(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const drawer = document.getElementById("__drawer");
  const openDrawer = (on) => {
    if (!drawer) return;
    drawer.checked = on;
    drawer.dispatchEvent(new Event("change"));
  };

  openDrawer(true);
  await sleep(600);

  const toggle = document.querySelector(
    ".md-nav--primary .md-nav__item--nested > .md-nav__toggle");
  if (!toggle) return { error: "no nested toggle found" };
  const nav = toggle.parentElement.querySelector(":scope > .md-nav");
  if (!nav) return { error: "no nested nav found" };

  const xOf = el => {
    const t = getComputedStyle(el).transform;
    const m = /matrix\(1, 0, 0, 1, (-?[\d.]+)/.exec(t);
    return m ? Math.round(parseFloat(m[1])) : null;
  };
  const sample = () => `${xOf(nav)} ${getComputedStyle(nav).visibility}`;

  // Walk in, settle, then walk back out sampling across the transition.
  toggle.checked = true; toggle.dispatchEvent(new Event("change"));
  await sleep(800);
  toggle.checked = false; toggle.dispatchEvent(new Event("change"));
  const backward = [];
  for (let i = 0; i < 10; i++) { backward.push(sample()); await sleep(40); }
  await sleep(500);

  // Parked. Can a reader still hit the panel that is supposedly put away?
  const reach = () => {
    const r = nav.getBoundingClientRect();
    if (r.width === 0 || r.right < 0 || r.left > innerWidth) return "offscreen";
    const x = Math.round(Math.min(Math.max(r.left + r.width / 2, 1), innerWidth - 1));
    const y = Math.round(Math.min(Math.max(r.top + 40, 1), innerHeight - 1));
    const hit = document.elementFromPoint(x, y);
    return hit && nav.contains(hit) ? "REACHABLE" : "unreachable";
  };

  const parkedOpen = { vis: getComputedStyle(nav).visibility, reach: reach() };
  openDrawer(false);
  await sleep(700);
  const parkedShut = { vis: getComputedStyle(nav).visibility, reach: reach() };

  return { backward, parkedOpen, parkedShut };
})()
