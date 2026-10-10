// ============ SHARED UI HELPERS ============

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// Builds a single content card. `progress` (0-1) optionally draws a progress bar.
function cardHTML(item, { progress = null } = {}) {
  return `
    <a class="card" href="watch.html?id=${item.id}">
      <div class="card__poster">
        <span>${item.glyph}</span>
        <img class="card__poster-img" src="${item.poster}" alt="${escapeHTML(item.title)} poster" loading="lazy" onerror="this.style.display='none'">
        <div class="card__play">▶</div>
      </div>
      ${progress !== null ? `<div class="card__progress"><div class="card__progress-fill" style="width:${Math.round(progress * 100)}%"></div></div>` : ""}
      <div class="card__body">
        <div class="card__title">${escapeHTML(item.title)}</div>
        <div class="card__meta">${escapeHTML(item.category)} · ${item.year}</div>
      </div>
      
    </a>
  `;
}

// Builds a horizontally scrolling shelf/row for a set of items.
function shelfHTML(title, items, { progressMap = null } = {}) {
  if (items.length === 0) return "";
  const cards = items.map(item => cardHTML(item, { progress: progressMap ? progressMap[item.id] : null })).join("");
  return `
    <section class="shelf">
      <h2 class="shelf__title">${escapeHTML(title)}</h2>
      <div class="shelf__row">${cards}</div>
    </section>
  `;
}

// Highlights the active nav link based on current page filename.
function highlightNav() {
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav__links a").forEach(a => {
    if (a.getAttribute("href") === page) a.classList.add("active");
  });
}

document.addEventListener("DOMContentLoaded", highlightNav);
