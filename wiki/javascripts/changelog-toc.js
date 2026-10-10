/* Fold the changelog's table of contents into release series.
 *
 * The changelog carries every release as its own heading, so the sidebar grew to
 * forty-odd entries and buried everything else on the page. This groups them by
 * minor version — 0.7.x, 0.6.x, … — with the newest series open and the rest
 * collapsed, so the current release is at the top and history is one click away.
 *
 * It runs on the rendered TOC, not on the changelog source: the page is mirrored
 * from the add-on repo at build time and stays a flat list of releases.
 *
 * Entries that aren't versions ([Unreleased], say) keep their place untouched.
 * Below MIN_ENTRIES the list is short enough to read as-is and is left alone. */

const MIN_ENTRIES = 8;
const VERSION = /^\[?v?(\d+)\.(\d+)(?:\.\d+)?\]?/;

function seriesOf(item) {
  const label = item.querySelector(".md-ellipsis, .md-nav__link");
  const match = label && VERSION.exec(label.textContent.trim());
  return match ? `${match[1]}.${match[2]}.x` : null;
}

function buildSeries(name, items, open) {
  const li = document.createElement("li");
  li.className = "md-nav__item cl-series";

  const fold = document.createElement("details");
  fold.className = "cl-series__fold";
  fold.open = open;

  const summary = document.createElement("summary");
  summary.className = "md-nav__link cl-series__summary";
  summary.innerHTML =
    `<span class="md-ellipsis">${name}</span>` +
    `<span class="cl-series__count">${items.length}</span>`;

  const list = document.createElement("ul");
  list.className = "md-nav__list cl-series__list";
  items.forEach((item) => list.appendChild(item));

  fold.appendChild(summary);
  fold.appendChild(list);
  li.appendChild(fold);
  return li;
}

function groupToc(toc) {
  if (toc.dataset.clGrouped) return;
  const items = Array.from(toc.children);
  if (items.filter(seriesOf).length < MIN_ENTRIES) return;
  toc.dataset.clGrouped = "1";

  // Collect runs of same-series entries, keeping the list's original order:
  // the newest series stays at the top, where the current release belongs.
  const runs = [];
  items.forEach((item) => {
    const name = seriesOf(item);
    const last = runs[runs.length - 1];
    if (name && last && last.name === name) last.items.push(item);
    else runs.push({ name, items: [item] });
  });

  let firstSeries = true;
  runs.forEach((run) => {
    if (!run.name) {
      toc.appendChild(run.items[0]);          // [Unreleased] and friends, as-is
      return;
    }
    toc.appendChild(buildSeries(run.name, run.items, firstSeries));
    firstSeries = false;
  });
}

/* Material marks the section you're reading as you scroll. When that lands in a
 * collapsed series, open it — otherwise the sidebar looks unresponsive. */
function followActiveLink(toc) {
  const observer = new MutationObserver((records) => {
    records.forEach((record) => {
      const link = record.target;
      if (!link.classList.contains("md-nav__link--active")) return;
      const fold = link.closest("details.cl-series__fold");
      if (fold) fold.open = true;
    });
  });
  observer.observe(toc, {
    subtree: true,
    attributes: true,
    attributeFilter: ["class"],
  });
}

function applyChangelogToc() {
  document.querySelectorAll('[data-md-component="toc"]').forEach((toc) => {
    groupToc(toc);
    if (toc.dataset.clGrouped) followActiveLink(toc);
  });
}

if (typeof document$ !== "undefined" && document$.subscribe) {
  document$.subscribe(applyChangelogToc);
} else {
  // Instant loading swaps page content without a reload, so DOMContentLoaded
  // fires only once for the whole session. Material's document$ observable
  // emits on every navigation; fall back when it is unavailable.
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(applyChangelogToc);
  } else {
    document.addEventListener("DOMContentLoaded", applyChangelogToc);
  }
}
