(async () => {
  const drawer = document.getElementById("__drawer");
  if (drawer) { drawer.checked = true; drawer.dispatchEvent(new Event("change")); }
  await new Promise(r => setTimeout(r, 700));
  const rows = [...document.querySelectorAll(".md-nav--primary .md-nav__link")];
  const stat = (sel) => {
    const g = rows.filter(r => r.matches(sel));
    const withIcon = g.filter(r => r.querySelector(":scope > svg"));
    return { total: g.length, withIcon: withIcon.length,
             missing: g.filter(r => !r.querySelector(":scope > svg"))
                       .map(r => (r.textContent || "").trim().slice(0, 28)) };
  };
  const one = rows.find(r => r.tagName === "LABEL" && r.querySelector(":scope > svg"));
  const cs = one ? getComputedStyle(one.querySelector(":scope > svg")) : null;
  return { pages: stat("a"), sections: stat("label"),
           sampleSvg: cs ? { w: cs.width, h: cs.height, fill: cs.fill, vis: cs.visibility } : null };
})()
