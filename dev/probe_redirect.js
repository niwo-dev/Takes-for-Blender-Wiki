(async () => {
  const start = location.pathname;
  await new Promise(r => setTimeout(r, 2500));
  return { startedAt: start, endedAt: location.pathname,
           redirected: location.pathname.includes("bookmark_a_property"),
           h1: (document.querySelector(".md-content__inner > h1") || {}).textContent };
})()
