requireAuth();

const gridEl = document.getElementById("watchlistGrid");
const emptyEl = document.getElementById("emptyState");

function renderWatchlist() {
  const ids = getWatchlist();
  const items = ids.map(getContentById).filter(Boolean);

  if (items.length === 0) {
    gridEl.hidden = true;
    emptyEl.hidden = false;
    return;
  }

  gridEl.hidden = false;
  emptyEl.hidden = true;
  gridEl.innerHTML = items.map(item => cardHTML(item)).join("");
}

renderWatchlist();
