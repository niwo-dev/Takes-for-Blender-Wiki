(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const drawer = document.getElementById("__drawer");
  if (drawer) { drawer.checked = true; drawer.dispatchEvent(new Event("change")); }
  await sleep(500);

  const toggle = document.querySelector(
    ".md-nav--primary .md-nav__item--nested > .md-nav__toggle");
  if (!toggle) return { error: "no nested toggle found" };
  const nav = toggle.parentElement.querySelector(":scope > .md-nav");
  if (!nav) return { error: "no nested nav found" };

  const sample = () => {
    const cs = getComputedStyle(nav);
    return { t: cs.transform, vis: cs.visibility, op: cs.opacity, disp: cs.display };
  };

  // FORWARD: check the toggle, sample across the transition.
  toggle.checked = true;
  toggle.dispatchEvent(new Event("change"));
  const fwd = [];
  for (let i = 0; i < 8; i++) { fwd.push(sample()); await sleep(40); }
  await sleep(400);
  const settled = sample();

  // BACKWARD: uncheck, sample across the transition.
  toggle.checked = false;
  toggle.dispatchEvent(new Event("change"));
  const back = [];
  for (let i = 0; i < 8; i++) { back.push(sample()); await sleep(40); }

  const brief = a => a.map(s => `${s.t.replace(/matrix\(1, 0, 0, 1, /, "x=").replace(/, 0\)/, "")} ${s.vis}`);
  return { forward: brief(fwd), settled: `${settled.t} ${settled.vis}`, backward: brief(back) };
})()
