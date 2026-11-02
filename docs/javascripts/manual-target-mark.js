/* Marks where an Online Manual link landed.
 *
 * The add-on's right-click "Online Manual" opens `page/#anchor`. The jump
 * itself is exact, but on a long section the eye still has to find where the
 * section ends. This lays a soft accent band over the target heading and
 * everything under it up to the next heading of the same or higher level, then
 * fades it out by itself. Clicks leave it alone, so the reader can click
 * around the page and still see where they landed.
 *
 * The band is an absolutely positioned overlay in document coordinates, never a
 * style on the content itself, so nothing in the page moves: same heading
 * position, same page height with and without it.
 *
 * It runs on `document$` rather than DOMContentLoaded because instant loading
 * swaps the content without a page load, and on `hashchange` because an
 * in-page link to another heading is not a load either.
 */
(function () {
  "use strict";

  var SHOW_MS = 4000;      // full mark
  var FADE_MS = 1000;      // then this long to nothing (matches the CSS)
  var PAD_X = 12;          // px the band extends past the text, each side
  var PAD_Y = 6;
  var HEADING = /^H([1-6])$/;
  var mark = null;
  var timers = [];

  function clear() {
    timers.forEach(clearTimeout);
    timers = [];
    if (mark && mark.parentNode) mark.parentNode.removeChild(mark);
    mark = null;
    window.removeEventListener("resize", place);
  }

  function targetHeading() {
    var id = decodeURIComponent(location.hash.replace(/^#/, ""));
    if (!id) return null;
    var el = document.getElementById(id);
    if (!el || !HEADING.test(el.tagName)) return null;
    return el.closest(".md-typeset") ? el : null;
  }

  // Heading plus following siblings until a heading of the same or higher level.
  function sectionBox(head) {
    var level = +HEADING.exec(head.tagName)[1];
    var first = head.getBoundingClientRect();
    var top = first.top, bottom = first.bottom;
    var left = first.left, right = first.right;
    for (var n = head.nextElementSibling; n; n = n.nextElementSibling) {
      var m = HEADING.exec(n.tagName);
      if (m && +m[1] <= level) break;
      var r = n.getBoundingClientRect();
      if (r.height === 0) continue;
      bottom = Math.max(bottom, r.bottom);
      left = Math.min(left, r.left);
      right = Math.max(right, r.right);
    }
    return { top: top, bottom: bottom, left: left, right: right };
  }

  // Measures the section again, so a resize moves the band with the text.
  function place() {
    var head = mark && document.getElementById(mark.getAttribute("data-target"));
    if (!head) return;
    var box = sectionBox(head);
    // The band reaches a little past the text so the bar never touches a glyph.
    mark.style.top = (box.top + window.pageYOffset - PAD_Y) + "px";
    mark.style.left = (box.left + window.pageXOffset - PAD_X) + "px";
    mark.style.width = (box.right - box.left + 2 * PAD_X) + "px";
    mark.style.height = (box.bottom - box.top + 2 * PAD_Y) + "px";
  }

  function show() {
    clear();
    var head = targetHeading();
    if (!head) return;
    mark = document.createElement("div");
    mark.className = "tks-target-mark";
    mark.setAttribute("data-target", head.id);
    mark.setAttribute("aria-hidden", "true");
    document.body.appendChild(mark);
    place();

    var reduced = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timers.push(setTimeout(function () {
      if (!mark) return;
      if (reduced) { clear(); return; }
      mark.classList.add("is-fading");
      timers.push(setTimeout(clear, FADE_MS));
    }, SHOW_MS));
    window.addEventListener("resize", place);
  }

  // Wait a moment so the browser's own jump to the anchor has happened and the
  // measured box is the final one.
  function later() { requestAnimationFrame(function () { setTimeout(show, 50); }); }

  if (window.document$ && window.document$.subscribe) {
    window.document$.subscribe(later);
  } else {
    document.addEventListener("DOMContentLoaded", later);
  }
  window.addEventListener("hashchange", later);
})();
