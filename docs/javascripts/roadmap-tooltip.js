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

  function ensureTip() {
    if (!tip || !document.body.contains(tip)) {
      tip = document.createElement("div");
      tip.className = "rm-tip";
      document.body.appendChild(tip);
    }
    return tip;
  }

  function show(host) {
    const t = ensureTip();
    t.textContent = host.getAttribute("data-tip");
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
})();
