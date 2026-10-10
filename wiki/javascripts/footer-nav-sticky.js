/* The Previous / Next pair rides the bottom of the window.
 *
 * Why JavaScript at all: `position: sticky` is clipped by its containing block,
 * and this bar's is `.md-footer` -- a box barely taller than the bar itself, so
 * sticky gives it no travel. Floating it needs `position: fixed`, and fixed
 * elements cannot tell when they have reached the place they came from. That
 * one fact is what this file supplies.
 *
 * While it floats it is COMPACT: the "Previous" / "Next" captions go and the
 * padding halves, so it takes as little of the page as it can. The moment its
 * own slot in the document scrolls into view it docks, drops back into flow and
 * grows to the size Material gives it.
 *
 * A spacer holds the slot open while the bar is away, so the document height
 * never changes -- without it the dock point would move as the bar left the
 * flow, and the bar would flicker between the two states at the boundary.
 */
(function () {
  "use strict";

  var FLOAT = "tks-footernav--float";

  function setup() {
    var inner = document.querySelector(".md-footer__inner");
    if (!inner) return;
    // Pages with neither a previous nor a next page get an empty bar; leave it.
    if (!inner.querySelector(".md-footer__link")) return;
    if (inner.dataset.tksSticky === "1") return;
    inner.dataset.tksSticky = "1";

    var spacer = document.createElement("div");
    spacer.className = "tks-footernav-spacer";
    inner.parentNode.insertBefore(spacer, inner);

    // Measured before the bar ever floats, so it is the DOCKED height.
    var docked = inner.offsetHeight;

    var frame = null;
    function sync() {
      frame = null;
      var top = spacer.getBoundingClientRect().top;
      var shouldDock = top + docked <= window.innerHeight;
      inner.classList.toggle(FLOAT, !shouldDock);
      spacer.style.height = shouldDock ? "0px" : docked + "px";
    }

    function request() {
      if (frame === null) frame = window.requestAnimationFrame(sync);
    }

    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", function () {
      // Re-measure: a width change can rewrap a long page title and make the
      // docked bar taller or shorter than it was.
      inner.classList.remove(FLOAT);
      spacer.style.height = "0px";
      docked = inner.offsetHeight;
      request();
    }, { passive: true });

    request();
  }

  // Material swaps page content without a reload when instant navigation is on,
  // so subscribe to its location stream when it exists and fall back otherwise.
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(setup);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup);
  } else {
    setup();
  }
})();
