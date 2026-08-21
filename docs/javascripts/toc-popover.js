/* Contents button.
 *
 * Focus mode (see extra.css) hides Material's permanent right-hand contents
 * column, because on most pages it is a second menu framing the text. The
 * headings are still worth reaching, so this moves them behind one small
 * button pinned to the top-left of the reading column.
 *
 * The panel reuses Material's own rendered TOC markup, so heading links,
 * anchors and active-state styling keep working -- nothing is rebuilt here.
 * Pages with no headings never show the button.
 *
 * Runs on every SPA navigation: Material swaps page content without a reload,
 * so binding once on DOMContentLoaded would leave the button stale.
 */
(function () {
  "use strict";

  var ICON =
    '<svg viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M3 5h2v2H3V5zm4 0h14v2H7V5zM3 11h2v2H3v-2zm4 0h14v2H7v-2zm-4 6h2v2H3v-2zm4 0h14v2H7v-2z"/>' +
    "</svg>";

  function teardown() {
    document.querySelectorAll(".tks-toc-fab, .tks-toc-panel").forEach(function (n) {
      n.remove();
    });
  }

  function build() {
    teardown();

    // Material renders the page TOC here even when the column is hidden.
    var toc = document.querySelector(".md-sidebar--secondary .md-nav--secondary");
    if (!toc) return;

    // A lone title with no links means the page has no headings worth listing.
    if (toc.querySelectorAll(".md-nav__link").length === 0) return;

    var btn = document.createElement("button");
    btn.className = "tks-toc-fab";
    btn.type = "button";
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Show this page's contents");
    btn.innerHTML = ICON + "<span>Contents</span>";

    var panel = document.createElement("div");
    panel.className = "tks-toc-panel";
    panel.appendChild(toc.cloneNode(true));

    function close() {
      panel.setAttribute("data-open", "false");
      btn.setAttribute("aria-expanded", "false");
    }
    function open() {
      panel.setAttribute("data-open", "true");
      btn.setAttribute("aria-expanded", "true");
    }

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (panel.getAttribute("data-open") === "true") close();
      else open();
    });

    // Picking a heading is a navigation -- get out of the way.
    panel.addEventListener("click", function (e) {
      if (e.target.closest("a")) close();
      else e.stopPropagation();
    });

    document.addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });

    // The drawer and this panel both live at the top-left, so they would sit
    // on top of each other. Opening the drawer wins; the button hides while
    // it is open so there is nothing to click behind the slide-in.
    var drawer = document.getElementById("__drawer");
    var sync;
    if (drawer) {
      sync = function () {
        if (drawer.checked) {
          close();
          btn.style.display = "none";
        } else {
          btn.style.display = "flex";
        }
      };
      drawer.addEventListener("change", sync);
    }

    document.body.appendChild(btn);
    document.body.appendChild(panel);
    btn.style.display = "flex";

    // Sync LAST: the line above unconditionally shows the button, so an
    // already-open drawer has to win after it, not before.
    if (drawer) sync();
  }

  if (window.document$ && typeof window.document$.subscribe === "function") {
    // Material's own navigation observable -- fires on every page swap.
    window.document$.subscribe(build);
  } else {
    document.addEventListener("DOMContentLoaded", build);
  }
})();
