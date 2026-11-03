/* Marks where an Online Manual link landed, and shows that section alone.
 *
 * The add-on's right-click "Online Manual" opens `page/#anchor`. The jump
 * itself is exact, but on a long section the eye still has to find where the
 * section ends. Two things answer that, both built on one walk (`sectionNodes`:
 * the heading plus its siblings up to the next heading of the same or higher
 * level):
 *
 *  - A focus pop-up. The first page load that carries a hash naming a heading
 *    opens that section in a pop-up over the dimmed, blurred page, and so does
 *    a click on the title text of any h2-h6. It shows a copy of the section;
 *    the copy cannot carry some things (a diagram lives in a closed shadow
 *    root, a frame or video does not survive cloning), so those real elements
 *    move into the pop-up for as long as it is open and a same-sized
 *    placeholder keeps their place on the page. Everything else stays put. Esc,
 *    a click outside or the close button end it, and the elements go home.
 *    In-page jumps and instant navigation to another page never open it.
 *  - A soft accent band over the section, then faded out by itself. It starts
 *    the moment the pop-up closes (or at once for a jump, which has no pop-up).
 *    Clicks leave it alone, so the reader can click around the page and still
 *    see where they landed.
 *
 * Links from the add-on can also carry a text directive
 * (`page/#anchor:~:text=words`). The browser marks those words on the page, but
 * the pop-up shows a copy, so the same words are marked inside it
 * (`<mark class="tks-text-mark">`), and the pop-up scrolls to the first one. A
 * browser that cannot mark text fragments gets the same mark on the page after
 * the pop-up closes. Browsers differ in where a script can still read the
 * directive: Chrome keeps it in the navigation timing entry, Firefox in the
 * navigation API's current entry, an engine without support in `location.hash`.
 * All three are asked, first load only.
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
  var FOCUS_HEADING = /^H[2-6]$/;   // h1 is the whole page, not a section
  var SUFFIX = "-in-focus";         // keeps ids unique in the copied section
  // Elements a copy cannot carry, so the real one moves into the pop-up while it
  // is open. An element with an open shadow root counts too (see `isMovable`).
  var MOVE =
    "div.mermaid, " +   // Material's diagram host: a closed shadow root, never cloned
    "pre.mermaid, " +   // the diagram's source block, before Material has drawn it
    // Material takes the `mermaid` class off the source block while it waits for
    // its diagram script, so in that gap the only sign is a `pre` that is not
    // inside a code block (those are always wrapped in `.highlight`).
    "pre:not(.highlight pre), " +
    "iframe, video, audio, " +   // loaded content: a copy would reload or lose its state
    "canvas, " +                 // drawn pixels are not part of the markup
    "object, embed";             // plug-in content, same as a frame
  var HOLD = "tks-focus-hold";      // the placeholder that keeps a moved element's place
  var CLOSE_ICON =
    '<svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">' +
    '<path fill="currentColor" d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 ' +
    '10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
  var mark = null;
  var timers = [];
  var pop = null;                   // the open pop-up, or null
  var firstLoad = true;
  var DIRECTIVE = ":~:";
  var TEXT_MARK = "tks-text-mark";
  var BLOCK = "p, li, div, h1, h2, h3, h4, h5, h6, pre, td, th, tr, ul, ol, " +
    "table, details, summary, blockquote, dd, dt, dl, figure, figcaption, " +
    "section, article, aside, header, footer";
  var WORD = /[\p{L}\p{N}]/u;

  function clear() {
    timers.forEach(clearTimeout);
    timers = [];
    if (mark && mark.parentNode) mark.parentNode.removeChild(mark);
    mark = null;
    window.removeEventListener("resize", place);
  }

  function targetHeading(hash) {
    var id = decodeURIComponent(stripDirective(hash || location.hash).replace(/^#/, ""));
    if (!id) return null;
    var el = document.getElementById(id);
    if (!el || !HEADING.test(el.tagName)) return null;
    return el.closest(".md-typeset") ? el : null;
  }

  // `#anchor:~:text=x` names the heading `anchor`; an engine that does not take
  // the directive off leaves it in the hash.
  function stripDirective(str) {
    var i = str.indexOf(DIRECTIVE);
    return i < 0 ? str : str.slice(0, i);
  }

  // The text items of a directive: [{ start, end }], `end` empty when absent.
  // Several `text=` joined by `&`; each `[prefix-,]start[,end][,-suffix]`. The
  // add-on never sends a prefix or suffix, so they parse and are then ignored.
  function parseDirective(str) {
    var i = str.indexOf(DIRECTIVE);
    if (i < 0) return [];
    var items = [];
    str.slice(i + DIRECTIVE.length).split("&").forEach(function (part) {
      if (part.indexOf("text=") !== 0) return;
      var terms = part.slice(5).split(",").map(function (t) {
        try { return decodeURIComponent(t); } catch (e) { return t; }
      });
      if (terms.length > 1 && /-$/.test(terms[0])) terms.shift();
      if (terms.length > 1 && /^-/.test(terms[terms.length - 1])) terms.pop();
      if (terms[0]) items.push({ start: terms[0], end: terms[1] || "" });
    });
    return items;
  }

  // Where a script can still read the directive of the address the visit began
  // with. The browser takes it out of `location`; what it leaves behind differs.
  function readDirective() {
    var found = "";
    if (location.href.indexOf(DIRECTIVE) >= 0) {
      found = location.href;
    } else {
      try {
        var nav = performance.getEntriesByType("navigation")[0];
        if (nav && nav.name.indexOf(DIRECTIVE) >= 0) found = nav.name;
      } catch (e) { /* no navigation timing */ }
      try {
        var cur = window.navigation && window.navigation.currentEntry;
        if (!found && cur && cur.url && cur.url.indexOf(DIRECTIVE) >= 0) found = cur.url;
      } catch (e) { /* no navigation API */ }
    }
    return parseDirective(found);
  }

  // The visible text of some nodes as one lower-case string with whitespace
  // collapsed, and for each character the text node and offset it came from. A
  // change of block ends a run of text (a match never spans two paragraphs).
  function isMovable(el) {
    return !!el.shadowRoot || el.matches(MOVE);
  }

  function inMovable(el) {
    for (var a = el; a; a = a.parentElement) if (isMovable(a)) return true;
    return false;
  }

  function textIndex(roots) {
    var text = "", map = [], lastBlock = null;
    roots.forEach(function (root) {
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      for (var n = walker.nextNode(); n; n = walker.nextNode()) {
        var el = n.parentElement;
        if (!el || el.closest("script, style, noscript, .headerlink")) continue;
        if (inMovable(el)) continue;     // a moved element is the page's own
        var block = el.closest(BLOCK);
        if (block !== lastBlock && text) { text += "\n"; map.push(null); }
        lastBlock = block;
        var raw = n.nodeValue;
        for (var k = 0; k < raw.length; k++) {
          var ch = raw.charAt(k);
          if (/\s/.test(ch)) {
            var tail = text.charAt(text.length - 1);
            if (text && tail !== " " && tail !== "\n") {
              text += " "; map.push({ node: n, at: k });
            }
          } else {
            var low = ch.toLowerCase();
            for (var j = 0; j < low.length; j++) {
              text += low.charAt(j); map.push({ node: n, at: k });
            }
          }
        }
      }
    });
    return { text: text, map: map };
  }

  function normal(str) {
    return str.replace(/\s+/g, " ").trim().toLowerCase();
  }

  // First hit of `needle` at or after `from` that starts and ends on a word
  // edge, the way the browser's own text matching does.
  function findWord(hay, needle, from) {
    for (var i = hay.indexOf(needle, from); i >= 0; i = hay.indexOf(needle, i + 1)) {
      var before = i ? hay.charAt(i - 1) : "";
      var after = hay.charAt(i + needle.length);
      if (WORD.test(needle.charAt(0)) && before && WORD.test(before)) continue;
      if (WORD.test(needle.charAt(needle.length - 1)) && after && WORD.test(after)) continue;
      return i;
    }
    return -1;
  }

  function findItem(hay, item) {
    var a = normal(item.start);
    if (!a) return null;
    for (var s = findWord(hay, a, 0); s >= 0; s = findWord(hay, a, s + 1)) {
      if (!item.end) return [s, s + a.length];
      var b = normal(item.end);
      var e = b ? findWord(hay, b, s + a.length) : -1;
      if (e >= 0 && hay.slice(s, e).indexOf("\n") < 0) return [s, e + b.length];
    }
    return null;
  }

  // One `<mark>` per text node a match touches; nothing else in the DOM moves.
  function wrapRange(index, from, to) {
    var spans = [];
    for (var i = from; i < to; i++) {
      var m = index.map[i];
      if (!m) continue;
      var last = spans[spans.length - 1];
      if (last && last.node === m.node) last.to = m.at + 1;
      else spans.push({ node: m.node, from: m.at, to: m.at + 1 });
    }
    return spans.map(function (sp) {
      var part = sp.node.splitText(sp.from);
      part.splitText(sp.to - sp.from);
      var wrap = document.createElement("mark");
      wrap.className = TEXT_MARK;
      part.parentNode.insertBefore(wrap, part);
      wrap.appendChild(part);
      return wrap;
    });
  }

  // Marks the first match of every text item inside `roots`. Returns the marks
  // in the order they were made.
  function markText(roots, items) {
    var marks = [];
    items.forEach(function (item) {
      var index = textIndex(roots);
      var hit = findItem(index.text, item);
      if (hit) marks = marks.concat(wrapRange(index, hit[0], hit[1]));
    });
    // Like the browser's own reveal: words inside a closed block are shown.
    marks.forEach(function (m) {
      for (var d = m.closest("details:not([open])"); d; d = d.parentElement &&
           d.parentElement.closest("details:not([open])")) d.open = true;
    });
    return marks;
  }

  // Heading plus following siblings until a heading of the same or higher level.
  function sectionNodes(head) {
    var level = +HEADING.exec(head.tagName)[1];
    var nodes = [head];
    for (var n = head.nextElementSibling; n; n = n.nextElementSibling) {
      var m = HEADING.exec(n.tagName);
      if (m && +m[1] <= level) break;
      nodes.push(n);
    }
    return nodes;
  }

  function sectionBox(head) {
    var first = head.getBoundingClientRect();
    var top = first.top, bottom = first.bottom;
    var left = first.left, right = first.right;
    sectionNodes(head).slice(1).forEach(function (n) {
      var r = n.getBoundingClientRect();
      if (r.height === 0) return;
      bottom = Math.max(bottom, r.bottom);
      left = Math.min(left, r.left);
      right = Math.max(right, r.right);
    });
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

  function show(head) {
    clear();
    if (pop) return;                // the band starts when the pop-up closes
    head = head || targetHeading();
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

  // A copy of the section's nodes. Ids get a suffix so none exists twice, and
  // so do the names and references that tie tab radios, labels, details and
  // copy buttons together -- otherwise a copied tab set would switch the real
  // one underneath.
  function copySection(head) {
    var holder = document.createElement("div");
    var pairs = [];                 // [real, its stand-in in the copy]
    sectionNodes(head).forEach(function (n) {
      var copy = n.cloneNode(true);
      var from = n.querySelectorAll("input"), to = copy.querySelectorAll("input");
      for (var i = 0; i < from.length; i++) to[i].checked = from[i].checked;
      // The copy has the same shape, so the two lists line up one to one. Only
      // the outermost movable of a nest is taken: it carries the rest with it.
      var a = [n].concat(Array.prototype.slice.call(n.querySelectorAll("*")));
      var b = [copy].concat(Array.prototype.slice.call(copy.querySelectorAll("*")));
      for (var k = 0; k < a.length; k++) {
        if (isMovable(a[k]) && !pairs.some(function (p) { return p[0].contains(a[k]); })) {
          pairs.push([a[k], b[k]]);
        }
      }
      holder.appendChild(copy);
    });
    var ids = {};
    holder.querySelectorAll("[id]").forEach(function (el) {
      ids[el.id] = true;
      el.id += SUFFIX;
    });
    holder.querySelectorAll("input[name], a[name]").forEach(function (el) {
      el.name += SUFFIX;
    });
    // Links to a spot inside the copy (code line numbers) stay inside it.
    holder.querySelectorAll('a[href^="#"]').forEach(function (el) {
      var id = decodeURIComponent(el.getAttribute("href").slice(1));
      if (ids[id]) el.setAttribute("href", "#" + id + SUFFIX);
    });
    ["for", "aria-labelledby", "aria-controls", "aria-describedby"].forEach(function (a) {
      holder.querySelectorAll("[" + a + "]").forEach(function (el) {
        el.setAttribute(a, el.getAttribute(a).split(/\s+/).map(function (id) {
          return ids[id] ? id + SUFFIX : id;
        }).join(" "));
      });
    });
    holder.querySelectorAll("[data-clipboard-target]").forEach(function (el) {
      el.setAttribute("data-clipboard-target",
        el.getAttribute("data-clipboard-target").replace(/^#([^\s>]+)/, function (m, id) {
          return ids[id] ? "#" + id + SUFFIX : m;
        }));
    });
    // Words the page already marks are not marked again in the copy.
    holder.querySelectorAll("mark." + TEXT_MARK).forEach(function (el) {
      el.replaceWith.apply(el, el.childNodes);
    });
    holder.normalize();
    // A permalink inside the copy would point at the page, not at the copy.
    holder.querySelectorAll(".headerlink").forEach(function (el) { el.remove(); });
    return { holder: holder, pairs: pairs };
  }

  // The real element goes where its copy stands. A hollow of the same outer box
  // takes its place on the page, so nothing around it moves. Two comment nodes
  // fence the spot inside the pop-up: Material may swap the element for its
  // drawn diagram while it sits there, so what is between them at close is what
  // goes home, not the node that left.
  function moveIn(real, stand) {
    var r = real.getBoundingClientRect(), cs = getComputedStyle(real);
    var hold = document.createElement("div");
    hold.className = HOLD;
    hold.setAttribute("aria-hidden", "true");
    var st = hold.style;
    st.display = cs.display === "inline" ? "inline-block" : cs.display;
    st.boxSizing = "border-box";
    st.width = r.width + "px";
    st.height = r.height + "px";
    ["Top", "Right", "Bottom", "Left"].forEach(function (side) {
      st["margin" + side] = cs["margin" + side];
    });
    st.verticalAlign = cs.verticalAlign;
    st.cssFloat = cs.cssFloat;
    var from = document.createComment("tks-focus-slot"), to = document.createComment("/tks-focus-slot");
    real.replaceWith(hold);
    stand.replaceWith(from, real, to);
    return { hold: hold, from: from, to: to, real: real };
  }

  function moveOut(slot) {
    var nodes = [];
    for (var n = slot.from.nextSibling; n && n !== slot.to; n = n.nextSibling) nodes.push(n);
    if (!nodes.length) nodes.push(slot.real);
    if (slot.hold.parentNode) slot.hold.replaceWith.apply(slot.hold, nodes);
    slot.from.remove();
    slot.to.remove();
  }

  function focusables(box) {
    return Array.prototype.filter.call(box.querySelectorAll(
      "a[href], button, input, summary, select, textarea, [tabindex]"
    ), function (el) {
      return !el.disabled && el.tabIndex >= 0 && el.getClientRects().length > 0;
    });
  }

  function onKey(e) {
    if (!pop) return;
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      closeFocus(true);
    } else if (e.key === "Tab") {
      var list = focusables(pop.box);
      if (!list.length) { e.preventDefault(); return; }
      var first = list[0], last = list[list.length - 1];
      var at = document.activeElement;
      if (!pop.box.contains(at) || at === pop.box) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && at === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && at === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  // A link in the copy to an anchor on this page: leave the pop-up, then jump,
  // which the band treats like any other jump.
  function jumpTo(hash) {
    closeFocus(false);
    if (location.hash === hash) {
      var el = document.getElementById(decodeURIComponent(hash.replace(/^#/, "")));
      if (el) el.scrollIntoView();
      later();
    } else {
      location.hash = hash;         // fires hashchange, which shows the band
    }
  }

  function onBoxClick(e) {
    var a = e.target.closest("a[href]");
    if (!a || !pop || !pop.box.contains(a)) return;
    var inside = a.hash && pop.box.querySelector(
      '[id="' + decodeURIComponent(a.hash.slice(1)).replace(/"/g, '\\"') + '"]');
    if (inside) {
      e.preventDefault();
      inside.scrollIntoView({ block: "nearest" });
      return;
    }
    var u = new URL(a.href, location.href);
    var samePage = u.origin + u.pathname + u.search ===
      location.origin + location.pathname + location.search;
    if (u.hash && samePage) {
      e.preventDefault();
      jumpTo(u.hash);
    }
  }

  // The pop-up scrolls inside itself so the first marked word shows; the page
  // underneath stays where it is.
  function scrollToMark(body, mark) {
    var box = body.getBoundingClientRect(), r = mark.getBoundingClientRect();
    if (r.top >= box.top && r.bottom <= box.bottom) return;
    body.scrollTop += r.top - box.top - (box.height - r.height) / 2;
  }

  function openFocus(head, items) {
    clear();
    closeFocus(false);
    var root = document.documentElement;
    var inner = document.querySelector(".md-content__inner");
    var cs = inner && getComputedStyle(inner);
    var textW = inner
      ? inner.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      : 0;

    var scrim = document.createElement("div");
    scrim.className = "tks-focus-scrim";
    var box = document.createElement("div");
    box.className = "tks-focus";
    box.tabIndex = -1;
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-labelledby", "tks-focus-title");
    var body = document.createElement("div");
    body.className = "tks-focus__body md-typeset";
    var made = copySection(head);
    var copy = made.holder;
    while (copy.firstChild) body.appendChild(copy.firstChild);
    // Measured before anything moves; every box on the page stays where it is.
    var moved = made.pairs.map(function (p) { return moveIn(p[0], p[1]); });
    body.firstElementChild.id = "tks-focus-title";
    var close = document.createElement("button");
    close.type = "button";
    close.className = "tks-focus__close";
    close.setAttribute("aria-label", "Close");
    close.innerHTML = CLOSE_ICON;
    box.appendChild(close);
    box.appendChild(body);

    pop = {
      head: head, scrim: scrim, box: box, items: items || [], moved: moved,
      x: window.pageXOffset, y: window.pageYOffset
    };
    // Taking the scrollbar away would widen the page and move the text, so the
    // gap it leaves is filled and the page stays exactly where it was.
    root.style.setProperty("--tks-focus-sbw", (window.innerWidth - root.clientWidth) + "px");
    root.classList.add("tks-focus-lock");
    document.body.appendChild(scrim);
    document.body.appendChild(box);
    // Wide screens: no wider than the page's own text column.
    var bs = getComputedStyle(box);
    var edge = parseFloat(bs.paddingLeft) + parseFloat(bs.borderLeftWidth);
    if (textW) {
      box.style.width = (textW + 2 * edge) + "px";
      // A scrollbar that takes room from the text would wrap lines differently
      // from the page, so the box grows by its width (unless the extra room
      // makes the scrollbar unnecessary).
      var bar = body.offsetWidth - body.clientWidth;
      if (bar > 0) {
        box.style.width = (textW + 2 * edge + bar) + "px";
        if (body.offsetWidth === body.clientWidth) box.style.width = (textW + 2 * edge) + "px";
      }
    }

    scrim.addEventListener("click", function () { closeFocus(true); });
    close.addEventListener("click", function () { closeFocus(true); });
    box.addEventListener("click", onBoxClick);
    document.addEventListener("keydown", onKey, true);
    box.focus({ preventScroll: true });
    if (pop.items.length) {
      var marks = markText(Array.prototype.slice.call(body.children), pop.items);
      if (marks.length) scrollToMark(body, marks[0]);
    }
  }

  // A browser that marks text fragments does it on the page itself; for one
  // that does not, the page gets the same mark once the pop-up is gone.
  function markPage(head, items) {
    if (!items.length || "fragmentDirective" in document) return;
    markText(sectionNodes(head), items);
  }

  function closeFocus(withBand) {
    if (!pop) return;
    var p = pop;
    pop = null;
    document.removeEventListener("keydown", onKey, true);
    p.moved.forEach(moveOut);
    p.scrim.remove();
    p.box.remove();
    var root = document.documentElement;
    root.classList.remove("tks-focus-lock");
    root.style.removeProperty("--tks-focus-sbw");
    if (window.pageXOffset !== p.x || window.pageYOffset !== p.y) {
      window.scrollTo({ left: p.x, top: p.y, behavior: "instant" });
    }
    if (p.head.isConnected) {
      markPage(p.head, p.items);
      if (!p.head.hasAttribute("tabindex")) {
        p.head.tabIndex = -1;
        p.head.addEventListener("blur", function () {
          p.head.removeAttribute("tabindex");
        }, { once: true });
      }
      p.head.focus({ preventScroll: true });
    }
    if (withBand) show(p.head);
  }

  // A click on the title text itself (not the blank space beside it, not the
  // permalink, not a drag to select) opens that section.
  function onTitleClick(e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey ||
        e.shiftKey || e.altKey || pop) return;
    var head = e.target.closest && e.target.closest("h2, h3, h4, h5, h6");
    if (!head || !head.id || !FOCUS_HEADING.test(head.tagName)) return;
    if (!head.closest(".md-typeset") || head.closest(".tks-focus")) return;
    var a = e.target.closest("a");
    if (a && head.contains(a)) return;
    if (String(window.getSelection())) return;
    var range = document.createRange();
    range.selectNodeContents(head);
    var hit = Array.prototype.some.call(range.getClientRects(), function (r) {
      return e.clientX >= r.left && e.clientX <= r.right &&
             e.clientY >= r.top && e.clientY <= r.bottom;
    });
    if (hit) openFocus(head);
  }

  // Wait a moment so the browser's own jump to the anchor has happened and the
  // measured box is the final one. Only the very first page of a visit
  // (`landing`) can open the pop-up from its address; a jump or an instant
  // navigation keeps the band's old rule.
  function later(landing, items) {
    requestAnimationFrame(function () {
      setTimeout(function () {
        var head = targetHeading();
        // An engine that left the directive in the hash did not jump to the
        // anchor, so the heading is brought to where the page lands.
        if (landing === true && head && location.hash.indexOf(DIRECTIVE) >= 0) {
          head.scrollIntoView();
        }
        if (landing === true && head && FOCUS_HEADING.test(head.tagName)) {
          openFocus(head, items);
        } else {
          show();
          if (landing === true && head) markPage(head, items);
        }
      }, 50);
    });
  }

  function onDocument() {
    var landing = firstLoad;
    firstLoad = false;
    closeFocus(false);              // instant loading swaps the page under it
    later(landing, landing ? readDirective() : []);
  }

  if (window.document$ && window.document$.subscribe) {
    window.document$.subscribe(onDocument);
  } else {
    document.addEventListener("DOMContentLoaded", onDocument);
  }
  window.addEventListener("hashchange", function () {
    closeFocus(false);
    later();
  });
  document.addEventListener("click", onTitleClick);
  // The two lookups the address goes through, for dev/check_section_focus.py.
  window.tksTargetMark = { parseDirective: parseDirective, targetHeading: targetHeading };
})();
