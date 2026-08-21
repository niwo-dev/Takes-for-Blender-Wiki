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

  // The breadcrumb bar sticks directly under the header, but Material scales
  // the root font between breakpoints so the header's height is not a constant
  // we can hard-code. Measure it and publish it as a custom property instead.
  function syncHeaderHeight() {
    var root = document.documentElement;
    var h = document.querySelector(".md-header");
    if (h) {
      root.style.setProperty(
        "--tks-header-h", h.getBoundingClientRect().height + "px");
    }
    // The breadcrumb bar's height is needed too, so the back-to-top button can
    // clear it instead of hiding behind it.
    var bar = document.querySelector(".md-path");
    root.style.setProperty(
      "--tks-bar-h", bar ? bar.getBoundingClientRect().height + "px" : "0px");

    // 100vw counts the scrollbar, so a full-bleed strip built from it overhangs
    // the header by the scrollbar's width and forces a horizontal scroll.
    // Publish the real gutter so the strip can subtract it.
    root.style.setProperty(
      "--tks-sbw", (window.innerWidth - root.clientWidth) + "px");
  }
  window.addEventListener("resize", syncHeaderHeight);

  // Material renders no breadcrumb on a page with no parents -- the home page.
  // With the bar carrying the layout (sticky strip, contents button, the
  // back-to-top offset), its absence made Home the odd one out. Give those
  // pages a one-crumb bar so every page is built the same way.
  function ensurePathBar() {
    if (document.querySelector(".md-path")) return;
    // Material puts the real bar BEFORE .md-content__inner. Inserting it inside
    // instead drops the list into .md-typeset, which styles it as prose -- list
    // margins and bullets -- so the bar came out nearly twice as tall and
    // off-centre. Match Material's placement exactly.
    var inner = document.querySelector(".md-content__inner");
    if (!inner || !inner.parentNode) return;

    var active = document.querySelector(".md-nav__link--active");
    var label = (active && active.textContent.trim()) ||
                document.title.split("—")[0].trim() || "Home";

    var nav = document.createElement("nav");
    nav.className = "md-path";
    nav.setAttribute("aria-label", "Navigation");
    var ul = document.createElement("ul");
    ul.className = "md-path__list";
    var li = document.createElement("li");
    li.className = "md-path__item";
    li.textContent = label;                 // textContent, never innerHTML
    ul.appendChild(li);
    nav.appendChild(ul);
    inner.parentNode.insertBefore(nav, inner);
  }

  // Sections have no page of their own since their landing pages were removed,
  // but Material still renders their crumb as a link -- pointing at whichever
  // child happens to come first. "Features" led to Variant Switch, which is a
  // lie about where you are. Only crumbs that genuinely address a page stay
  // clickable: Home, and any crumb whose target is not simply a descendant of
  // itself. The current page is never a link to itself either.
  function unlinkSectionCrumbs() {
    var items = document.querySelectorAll(".md-path__item");
    items.forEach(function (li, i) {
      var a = li.querySelector("a.md-path__link");
      if (!a) return;

      var isHome = i === 0;
      var isCurrent = i === items.length - 1;
      if (isHome && !isCurrent) return;          // Home is a real page

      var span = document.createElement("span");
      span.className = a.className;
      span.textContent = a.textContent.trim();
      a.parentNode.replaceChild(span, a);
    });
  }

  function teardown() {
    document.querySelectorAll(".tks-toc-fab, .tks-toc-panel").forEach(function (n) {
      n.remove();
    });
  }

  function build() {
    teardown();
    ensurePathBar();
    unlinkSectionCrumbs();
    syncHeaderHeight();

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

    // Prefer living inside the breadcrumb bar: it is already a full-width
    // strip at the right height, so the button lines up with the reading
    // column at any font scale instead of being positioned by guesswork.
    var host = document.querySelector(".md-path__list");
    if (host) {
      btn.classList.add("tks-toc-fab--inbar");
      host.appendChild(btn);
    } else {
      document.body.appendChild(btn);
    }
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
