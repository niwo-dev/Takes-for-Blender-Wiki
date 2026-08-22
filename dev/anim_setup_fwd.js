(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const until = async (fn, ms = 15000) => {
    const end = Date.now() + ms;
    for (;;) { const v = fn(); if (v) return v; if (Date.now() > end) return null; await sleep(100); }
  };
  const d = await until(() => document.getElementById("__drawer"));
  if (!d) return { error: "drawer never appeared" };
  d.checked = true; d.dispatchEvent(new Event("change"));
  await sleep(600);
  const t = await until(() => document.querySelector(
    ".md-nav--primary .md-nav__item--nested > .md-nav__toggle"));
  if (!t) return { error: "nested toggle never appeared" };
  window.__tks_toggle = t;
  t.checked = false; t.dispatchEvent(new Event("change"));
  await sleep(700);
  return { ready: true, toggle: t.id };
})()
