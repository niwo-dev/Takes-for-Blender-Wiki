/* Cursor-anchored tooltips for the roadmap board.
 *
 * The board generator writes `data-tip` attributes instead of `title`, so
 * neither the browser nor Material renders a competing tooltip. This script
 * shows one shared bubble (.rm-tip, styled in extra.css) that appears at the
 * mouse pointer and follows it, flipping to the other side of the cursor when
 * it would leave the viewport.
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

  function move(event) {
    const t = ensureTip();
    const pad = 14;
    let x = event.clientX + pad;
    let y = event.clientY + pad;
    if (x + t.offsetWidth > window.innerWidth - 8) {
      x = event.clientX - t.offsetWidth - pad;
    }
    if (y + t.offsetHeight > window.innerHeight - 8) {
      y = event.clientY - t.offsetHeight - pad;
    }
    t.style.left = x + "px";
    t.style.top = y + "px";
  }

  document.addEventListener("mouseover", (event) => {
    if (!event.target.closest) return;
    const host = event.target.closest(".roadmap-board [data-tip]");
    if (!host) return;
    const t = ensureTip();
    t.textContent = host.getAttribute("data-tip");
    t.classList.add("visible");
    move(event);
  });

  document.addEventListener("mousemove", (event) => {
    if (!tip || !tip.classList.contains("visible") || !event.target.closest) return;
    if (event.target.closest(".roadmap-board [data-tip]")) {
      move(event);
    } else {
      tip.classList.remove("visible");
    }
  });

  document.addEventListener("mouseout", (event) => {
    if (!tip || !event.target.closest) return;
    if (event.target.closest(".roadmap-board [data-tip]")) {
      tip.classList.remove("visible");
    }
  });
})();
