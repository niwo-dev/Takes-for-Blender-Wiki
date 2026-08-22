(async () => {
  await new Promise(r => setTimeout(r, 900));
  const els = [...document.querySelectorAll(".tks-shot")];
  if (!els.length) return { error: "no placeholders on this page" };
  const cs = getComputedStyle(els[0]);
  const before = getComputedStyle(els[0], "::before");
  const r = els[0].getBoundingClientRect();
  return { count: els.length, border: cs.borderTop, minHeight: cs.minHeight,
           label: before.content, height: Math.round(r.height),
           text: els[0].textContent.trim().slice(0, 40) };
})()
