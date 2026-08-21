/* Mirror inline H2/H3 icons into the sidebar TOC entries.
 * Material strips SVGs from TOC text by default; this clones them back.
 * Subscribes to Material's document$ so it re-runs after instant-navigation. */

function applyTocIcons() {
  const headings = document.querySelectorAll(
    ".md-content h2, .md-content h3, .md-content h4"
  );

  headings.forEach((heading) => {
    const icon = heading.querySelector(".twemoji");
    if (!icon || !heading.id) return;

    // Material may emit multiple sidebars (primary nav + integrated TOC);
    // attribute selector with escaped id covers ids that contain special chars.
    const cssId = CSS.escape(heading.id);
    const tocLinks = document.querySelectorAll(
      `.md-nav__link[href="#${cssId}"], .md-nav__link[href$="#${cssId}"]`
    );

    tocLinks.forEach((link) => {
      const label = link.querySelector(".md-ellipsis") || link;
      if (label.querySelector(".twemoji")) return;
      const clone = icon.cloneNode(true);
      clone.classList.add("toc-icon");
      label.insertBefore(clone, label.firstChild);
    });
  });
}

if (typeof document$ !== "undefined" && document$.subscribe) {
  document$.subscribe(applyTocIcons);
} else {
  // Instant loading swaps page content without a reload, so DOMContentLoaded
  // fires only once for the whole session. Material's document$ observable
  // emits on every navigation; fall back when it is unavailable.
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(applyTocIcons);
  } else {
    document.addEventListener("DOMContentLoaded", applyTocIcons);
  }
}
