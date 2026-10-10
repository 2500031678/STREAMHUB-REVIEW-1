requireAuth();

const params = new URLSearchParams(location.search);
const itemId = params.get("id");
const item = getContentById(itemId);

const video = document.getElementById("videoPlayer");
const titleEl = document.getElementById("videoTitle");
const metaEl = document.getElementById("videoMeta");
const descEl = document.getElementById("videoDesc");
const watchlistBtn = document.getElementById("watchlistBtn");
const relatedEl = document.getElementById("related");

if (!item) {
  document.querySelector(".player-wrap").innerHTML = `<p class="empty-state">That title couldn't be found. <a href="index.html" style="color:var(--accent)">Back to Browse</a></p>`;
} else {
  titleEl.textContent = item.title;
  metaEl.textContent = `${item.category} · ${item.year} · ${item.duration} · ★ ${item.rating}`;
  descEl.textContent = item.desc;
  video.src = item.video;

  const history = getHistory();
  const saved = history[item.id];
  video.addEventListener("loadedmetadata", () => {
    if (saved && saved.progress > 0.02 && saved.progress < 0.95) {
      video.currentTime = saved.progress * video.duration;
    }
  });

  video.addEventListener("timeupdate", () => {
    if (!video.duration) return;
    recordProgress(item.id, video.currentTime / video.duration);
  });

  function refreshWatchlistBtn() {
    const active = isInWatchlist(item.id);
    watchlistBtn.textContent = active ? "✓ In My List" : "+ My List";
    watchlistBtn.classList.toggle("btn--active", active);
  }
  watchlistBtn.addEventListener("click", () => {
    toggleWatchlist(item.id);
    refreshWatchlistBtn();
  });
  refreshWatchlistBtn();

  const sameCategory = CONTENT.filter(c => c.category === item.category && c.id !== item.id);
  relatedEl.innerHTML = shelfHTML("More Like This", sameCategory.length ? sameCategory : getRecommendations(item.id));
}
