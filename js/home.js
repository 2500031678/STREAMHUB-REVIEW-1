requireAuth();

const tabsEl = document.getElementById("categoryTabs");
const shelvesEl = document.getElementById("shelves");
const searchInput = document.getElementById("searchInput");

let activeCategory = "All";
let searchQuery = "";

function renderTabs() {
  const cats = ["All", ...CATEGORIES];
  tabsEl.innerHTML = cats.map(cat =>
    `<button class="tab ${cat === activeCategory ? "active" : ""}" data-cat="${cat}">${cat}</button>`
  ).join("");

  tabsEl.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.cat;
      renderTabs();
      renderShelves();
    });
  });
}

function renderShelves() {
  // Search takes priority over category tabs — searching flattens everything
  // into one results shelf regardless of which tab was active.
  if (searchQuery.trim() !== "") {
    const q = searchQuery.trim().toLowerCase();
    const results = CONTENT.filter(c => c.title.toLowerCase().includes(q));
    shelvesEl.innerHTML = results.length
      ? shelfHTML(`Results for "${searchQuery}"`, results)
      : `<p class="empty-state">No titles match "${searchQuery}".</p>`;
    return;
  }

  if (activeCategory !== "All") {
    const items = CONTENT.filter(c => c.category === activeCategory);
    shelvesEl.innerHTML = shelfHTML(activeCategory, items);
    return;
  }

  const continueWatching = getContinueWatching();
  const progressMap = {};
  continueWatching.forEach(cw => progressMap[cw.item.id] = cw.progress);

  const recs = getRecommendations(null, 6);

  let html = "";
  if (continueWatching.length) {
    html += shelfHTML("Continue Watching", continueWatching.map(cw => cw.item), { progressMap });
  }
  html += shelfHTML("Recommended For You", recs);
  CATEGORIES.forEach(cat => {
    html += shelfHTML(cat, CONTENT.filter(c => c.category === cat));
  });
  shelvesEl.innerHTML = html;
}

searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value;
  renderShelves();
});

renderTabs();
renderShelves();
