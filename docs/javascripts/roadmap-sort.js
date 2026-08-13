/* Click-to-sort for the roadmap board tables.
 *
 * Only headers the generator marked `.sortable` react (Feature, When) — the Meta
 * column is icons, which sort into nonsense. The key is the cell's `data-sort`
 * attribute when it has one (the When column carries an ISO date there, so the
 * column sorts chronologically instead of by the "8 Jul 2026" label), otherwise
 * its text. Cards with no date sort last in both directions.
 *
 * Subscribes to Material's document$ so it re-runs after instant-navigation. */

function sortKey(row, index) {
  const cell = row.cells[index];
  if (!cell) return "";
  const explicit = cell.getAttribute("data-sort");
  return (explicit !== null ? explicit : cell.textContent).trim().toLowerCase();
}

function wireSortableTable(table) {
  table.querySelectorAll("thead th.sortable").forEach((header) => {
    const index = header.cellIndex;
    header.tabIndex = 0;
    header.setAttribute("role", "button");

    const sort = () => {
      const body = table.tBodies[0];
      if (!body) return;
      const ascending = header.dataset.dir !== "asc";
      const rows = Array.from(body.rows).sort((a, b) => {
        const left = sortKey(a, index);
        const right = sortKey(b, index);
        if (left === right) return 0;
        if (!left) return 1;                       // undated rows stay at the bottom
        if (!right) return -1;
        return (left < right ? -1 : 1) * (ascending ? 1 : -1);
      });
      table.querySelectorAll("th[data-dir]").forEach((other) => {
        if (other !== header) delete other.dataset.dir;
      });
      header.dataset.dir = ascending ? "asc" : "desc";
      rows.forEach((row) => body.appendChild(row));
    };

    header.addEventListener("click", sort);
    header.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        sort();
      }
    });
  });
}

function applyRoadmapSort() {
  document.querySelectorAll(".roadmap-board table").forEach(wireSortableTable);
}

if (typeof document$ !== "undefined" && document$.subscribe) {
  document$.subscribe(applyRoadmapSort);
} else {
  document.addEventListener("DOMContentLoaded", applyRoadmapSort);
}
