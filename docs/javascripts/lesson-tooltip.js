/* What a lesson covers, on hover, without leaving the syllabus.
 *
 * Every lesson link on the syllabus carries its one-line description in a
 * `title`, written there by dev/build_syllabus.py out of the recap on the
 * module page. That already gives a browser-native tooltip, but a native one
 * waits about a second, ignores the site's styling and cannot be read by a
 * keyboard user.
 *
 * Why not Material's own: `content.tooltips` is enabled and does not convert
 * link titles in 9.7.7 -- measured, zero `[data-md-tooltip]` on any page. Its
 * `.md-tooltip2` styling could be borrowed, but it is positioned through five
 * private CSS variables that its own JS sets, so leaning on it would tie this
 * to theme internals. The panel below uses the same design tokens instead.
 *
 * The `title` is moved onto a data attribute while the page is open, so the
 * native tooltip never fires on top of this one, and moved back if the
 * attribute is ever needed again.
 */
(function () {
  "use strict";

  var SELECTOR = ".tks-lessons a[title], .tks-lessons a[data-tks-tip]";
  var GAP = 8;          // px between the link and the panel
  var tip = null;       // one panel, reused
  var current = null;

  function panel() {
    if (!tip) {
      tip = document.createElement("div");
      tip.className = "tks-tip";
      tip.setAttribute("role", "tooltip");
      document.body.appendChild(tip);
    }
    return tip;
  }

  function show(link) {
    var text = link.getAttribute("data-tks-tip");
    if (!text) return;
    current = link;
    var el = panel();
    el.textContent = text;
    el.classList.add("tks-tip--on");

    // Measure after the text is in, or the height is last hover's.
    var r = link.getBoundingClientRect();
    var t = el.getBoundingClientRect();
    var x = r.left + window.scrollX;
    // Keep it on screen at both edges.
    x = Math.min(x, window.scrollX + document.documentElement.clientWidth - t.width - GAP);
    x = Math.max(x, window.scrollX + GAP);

    // Above by default; below when the top of the window is in the way.
    var above = r.top > t.height + GAP;
    var y = above ? r.top + window.scrollY - t.height - GAP
                  : r.bottom + window.scrollY + GAP;

    el.style.left = Math.round(x) + "px";
    el.style.top = Math.round(y) + "px";
  }

  function hide() {
    current = null;
    if (tip) tip.classList.remove("tks-tip--on");
  }

  function arm() {
    Array.prototype.forEach.call(document.querySelectorAll(SELECTOR), function (a) {
      var t = a.getAttribute("title");
      if (t) {
        // Park it, so the browser's own tooltip stays out of the way.
        a.setAttribute("data-tks-tip", t);
        a.removeAttribute("title");
      }
      if (a.dataset.tksTipArmed === "1") return;
      a.dataset.tksTipArmed = "1";
      a.addEventListener("mouseenter", function () { show(a); });
      a.addEventListener("mouseleave", hide);
      a.addEventListener("focus", function () { show(a); });
      a.addEventListener("blur", hide);
    });
  }

  // A panel pinned to a link on the page has to go when the page moves.
  window.addEventListener("scroll", function () { if (current) hide(); }, true);
  window.addEventListener("resize", function () { if (current) hide(); });

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(function () { hide(); arm(); });
  } else {
    document.addEventListener("DOMContentLoaded", arm);
  }
})();
