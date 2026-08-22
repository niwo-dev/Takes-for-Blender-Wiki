(async () => {
  await new Promise(r => setTimeout(r, 900));
  const h1 = document.querySelector(".md-content__inner > h1");
  const inner = document.querySelector(".md-content__inner");
  const path = document.querySelector(".md-path");
  const cs = n => n ? getComputedStyle(n) : null;
  return {
    pathMarginBottom: path ? cs(path).marginBottom : null,
    innerPaddingTop: cs(inner).paddingTop,
    innerBeforeDisplay: getComputedStyle(inner, "::before").display,
    innerBeforeHeight: getComputedStyle(inner, "::before").height,
    h1MarginTop: cs(h1).marginTop,
    mainInnerMarginTop: cs(document.querySelector(".md-main__inner")).marginTop,
    contentPaddingTop: cs(document.querySelector(".md-content")).paddingTop
  };
})()
