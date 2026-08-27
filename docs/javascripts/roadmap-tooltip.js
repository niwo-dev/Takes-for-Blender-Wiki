/* Bubble tooltips for the roadmap board.
 *
 * The board generator writes `data-tip` attributes instead of `title`, so
 * neither the browser nor Material renders a competing tooltip. This script
 * shows one shared bubble (.rm-tip, styled in extra.css) centered ABOVE the
 * hovered element, with an arrow pointing down at it. The bubble is clamped
 * to the viewport; the arrow keeps pointing at the element even when the
 * bubble had to shift sideways, and the bubble flips below the element (arrow
 * up, .below) when there is no room above.
 *
 * Listeners are delegated on `document`, so Material's instant navigation
 * (which swaps page content without a reload) needs no re-wiring; the bubble
 * itself is re-created if a swap ever drops it from the body. */

(function () {
  let tip = null;

  /* The checklist tooltip arrives as plain text with ☑ / ☐ / • line markers
     (attributes cannot carry SVG). These are swapped for drawn icons here. */
  const ICONS = {
    "☑": '<svg viewBox="0 0 24 24"><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m-9 14-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8z"/></svg>',
    "☐": '<svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 2v14H5V5z"/></svg>',
    "•": '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/></svg>',
  };
  const CLASSES = { "☑": "done", "☐": "open", "•": "dot" };

  function ensureTip() {
    if (!tip || !document.body.contains(tip)) {
      tip = document.createElement("div");
      tip.className = "rm-tip";
      document.body.appendChild(tip);
    }
    return tip;
  }

  function fill(t, text) {
    const lines = text.split("\n");
    if (!lines.some((line) => ICONS[line.charAt(0)])) {
      t.textContent = text;                     // plain tooltip (info, clock)
      return;
    }
    t.textContent = "";
    for (const line of lines) {
      const row = document.createElement("div");
      row.className = "rm-tip-row";
      const marker = line.charAt(0);
      if (ICONS[marker]) {
        const icon = document.createElement("span");
        icon.className = "rm-tip-ico " + CLASSES[marker];
        icon.innerHTML = ICONS[marker];
        row.appendChild(icon);
        const txt = document.createElement("span");
        txt.className = "rm-tip-txt";      // one line, CSS-trimmed with "…"
        txt.textContent = line.slice(1).trimStart();
        row.appendChild(txt);
      } else {
        row.textContent = line;
      }
      t.appendChild(row);
    }
  }

  function show(host) {
    const t = ensureTip();
    fill(t, host.getAttribute("data-tip"));
    t.classList.remove("below");
    t.classList.add("visible");

    const r = host.getBoundingClientRect();
    const gap = 9;
    let x = r.left + r.width / 2 - t.offsetWidth / 2;
    x = Math.max(8, Math.min(x, window.innerWidth - t.offsetWidth - 8));
    let y = r.top - t.offsetHeight - gap;
    if (y < 8) {
      y = r.bottom + gap;
      t.classList.add("below");
    }
    t.style.left = x + "px";
    t.style.top = y + "px";
    t.style.setProperty("--rm-tip-arrow-x", (r.left + r.width / 2 - x) + "px");
  }

  document.addEventListener("mouseover", (event) => {
    if (!event.target.closest) return;
    const host = event.target.closest(".roadmap-board [data-tip]");
    if (host) show(host);
  });

  document.addEventListener("mouseout", (event) => {
    if (!tip || !event.target.closest) return;
    if (event.target.closest(".roadmap-board [data-tip]")) {
      tip.classList.remove("visible");
    }
  });

  /* The bubble is fixed to the viewport, so anything that moves or replaces
     the page under it must hide it: clicking a link (Material's instant
     navigation swaps the content without a mouseout), scrolling (the anchor
     element moves away), and the navigation event itself. */
  function hide() {
    if (tip) tip.classList.remove("visible");
  }
  document.addEventListener("click", hide, true);
  window.addEventListener("scroll", hide, true);
  if (typeof document$ !== "undefined" && document$.subscribe) {
    document$.subscribe(hide);
  } else if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(hide);
  }
})();
