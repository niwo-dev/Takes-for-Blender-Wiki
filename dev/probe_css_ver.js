(async () => {
  await new Promise(r => setTimeout(r, 800));
  const link = document.querySelector('link[href*="extra.css"]');
  let found = false, total = 0;
  for (const sheet of document.styleSheets) {
    try {
      if (!/extra\.css/.test(sheet.href || "")) continue;
      for (const rule of sheet.cssRules) {
        total++;
        if (rule.cssText && rule.cssText.includes("--tks-sbw") &&
            rule.selectorText && rule.selectorText.includes("md-path")) found = true;
      }
    } catch (e) { /* cross-origin */ }
  }
  return { href: link ? link.getAttribute("href") : null,
           rulesInExtraCss: total, hasGlobalPathRule: found,
           barBg: getComputedStyle(document.querySelector(".md-path")).backgroundColor };
})()
