/* The lesson length, as a pill in the Contents column.
 *
 * A lesson heading carries its length in a `<span class="tks-min">`, but
 * Material builds the Contents column from the heading's TEXT, so the span
 * does not survive the trip -- the entry arrived as "Build the bottle shot
 * 8 min", one run of plain text that a reader has to parse by eye.
 *
 * This puts the span back on the Contents side: the trailing "N min" is split
 * off and wrapped, so the same pill that sits beside the heading sits at the
 * end of its Contents row. Nothing else on the row moves.
 *
 * It runs on `document$` rather than DOMContentLoaded because instant loading
 * swaps the content without a page load, and the Contents column is rebuilt
 * each time.
 */
(function () {
  "use strict";

  // " 8 min" at the very end, and only there: a lesson title may well contain
  // a number, and "Render 3 min out of 12" must not be mistaken for a length.
  // The trailing `\s*` matters: Material's TOC text node keeps the newlines
  // and indentation from the template, so "8 min" is never the last
  // character in the string even when it is the last thing a reader sees.
  var TAIL = /\s+(\d+\s*min)\s*$/;

  function decorate() {
    var links = document.querySelectorAll(
      '.md-sidebar--secondary .md-nav__link, [data-md-component="toc"] .md-nav__link'
    );
    Array.prototype.forEach.call(links, function (link) {
      var host = link.querySelector(".md-ellipsis") || link;
      if (host.querySelector(".tks-min")) return;          // already done
      // Only the text node that ends the row, so an icon cloned in by
      // toc-icons.js keeps its place.
      var last = host.lastChild;
      if (!last || last.nodeType !== 3) return;
      var m = TAIL.exec(last.nodeValue);
      if (!m) return;
      last.nodeValue = last.nodeValue.slice(0, m.index) + " ";
      var pill = document.createElement("span");
      pill.className = "tks-min";
      // Number bright, unit dimmed -- the same split the syllabus chips use.
      var parts = /^(\d+)\s*(min)$/.exec(m[1]);
      if (parts) {
        pill.appendChild(document.createTextNode(parts[1] + " "));
        var u = document.createElement("span");
        u.className = "tks-min__u";
        u.textContent = parts[2];
        pill.appendChild(u);
      } else {
        pill.textContent = m[1];
      }
      host.appendChild(pill);
    });
  }

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(decorate);
  } else {
    document.addEventListener("DOMContentLoaded", decorate);
  }
})();
