// ============ CONTENT LIBRARY (INITIAL FALLBACK) ============
const INITIAL_CONTENT = [
  { id: "c01", title: "Nomad Skies", category: "Sci-Fi & Fantasy", year: 2023, duration: "10 min", rating: 4.6,
    desc: "A lone drifter crosses a sky full of floating ruins in search of a home that may no longer exist.",
    glyph: "N", poster: "images/c01.jpg", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
  { id: "c02", title: "Glass Horizon", category: "Drama", year: 2022, duration: "11 min", rating: 4.3,
    desc: "Two estranged siblings return to their childhood town to settle their father's final wish.",
    glyph: "G", poster: "images/c02.jpg", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
  { id: "c03", title: "Ember & Ash", category: "Action", year: 2024, duration: "1 min", rating: 4.1,
    desc: "A courier races through a burning city to deliver the one file that can stop a blackout.",
    glyph: "E", poster: "images/c03.jpg", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
  { id: "c04", title: "Midnight Escape", category: "Action", year: 2021, duration: "1 min", rating: 4.0,
    desc: "A getaway driver has ninety seconds to clear the checkpoint before the exits seal.",
    glyph: "M", poster: "images/c04.jpg", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
  { id: "c05", title: "Joyride", category: "Comedy", year: 2023, duration: "1 min", rating: 4.4,
    desc: "Four friends borrow a car they were absolutely not supposed to borrow.",
    glyph: "J", poster: "images/c05.jpg", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" },
  { id: "c06", title: "Meltdown City", category: "Action", year: 2020, duration: "1 min", rating: 3.9,
    desc: "An engineer has one shift left to keep the reactor core from going critical.",
    glyph: "M", poster: "images/c06.jpg", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4" },
  { id: "c07", title: "Sintel's Quest", category: "Sci-Fi & Fantasy", year: 2022, duration: "15 min", rating: 4.8,
    desc: "A girl's search for a lost dragon becomes a journey across a war-scarred world.",
    glyph: "S", poster: "images/c07.jpg", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
  { id: "c08", title: "Steel Tears", category: "Drama", year: 2021, duration: "12 min", rating: 4.5,
    desc: "A retired soldier confronts the machine that was built to replace him.",
    glyph: "S", poster: "images/c08.jpg", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" },
  { id: "c09", title: "Bullrun Diaries", category: "Documentary", year: 2023, duration: "2 min", rating: 4.2,
    desc: "Behind the scenes with a road crew chasing the horizon across three countries.",
    glyph: "B", poster: "images/c09.jpg", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4" },
  { id: "c10", title: "Fun & Games", category: "Comedy", year: 2024, duration: "1 min", rating: 4.0,
    desc: "A weekend at the lake goes sideways in the best possible way.",
    glyph: "F", poster: "images/c10.jpg", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" },
  { id: "c11", title: "What You Can Get", category: "Documentary", year: 2022, duration: "2 min", rating: 3.8,
    desc: "A field test asks what a modest budget actually buys you these days.",
    glyph: "W", poster: "images/c11.jpg", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4" },
  { id: "c12", title: "Grand Outback", category: "Documentary", year: 2021, duration: "1 min", rating: 4.1,
    desc: "On-road and off-road, a single trip pushes a machine to its limits.",
    glyph: "G", poster: "images/c12.jpg", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4" },
];

// ============ DYNAMIC LOCALSTORAGE CATALOG ============
function getContentLibrary() {
  const stored = localStorage.getItem("streamhub_catalog");
  if (!stored) {
    localStorage.setItem("streamhub_catalog", JSON.stringify(INITIAL_CONTENT));
    return INITIAL_CONTENT;
  }
  return JSON.parse(stored);
}

function saveContentLibrary(catalog) {
  localStorage.setItem("streamhub_catalog", JSON.stringify(catalog));
  CONTENT = catalog; // Sync global state
}

// Read dynamic catalog state
let CONTENT = getContentLibrary();
const CATEGORIES = [...new Set(CONTENT.map(c => c.category))];

function getContentById(id) {
  CONTENT = getContentLibrary(); // Refresh state
  return CONTENT.find(c => c.id === id);
}

// ============ LOCAL STORAGE HELPERS ============
const storage = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const WATCHLIST_KEY = "streamhub_watchlist";
const HISTORY_KEY = "streamhub_history";

function getWatchlist() {
  return storage.get(WATCHLIST_KEY, []);
}
function isInWatchlist(id) {
  return getWatchlist().includes(id);
}
function toggleWatchlist(id) {
  const list = getWatchlist();
  const idx = list.indexOf(id);
  if (idx === -1) list.push(id); else list.splice(idx, 1);
  storage.set(WATCHLIST_KEY, list);
  return list.includes(id);
}

function getHistory() {
  return storage.get(HISTORY_KEY, {});
}
function recordProgress(id, progress) {
  const history = getHistory();
  history[id] = { progress, lastWatched: Date.now() };
  storage.set(HISTORY_KEY, history);
}

// ============ RECOMMENDATION LOGIC ============
function getRecommendations(excludeId = null, limit = 6) {
  CONTENT = getContentLibrary(); // Refresh dynamic list
  const history = getHistory();
  const watchlist = getWatchlist();

  const categoryScore = {};
  Object.keys(history).forEach(id => {
    const item = getContentById(id);
    if (item) categoryScore[item.category] = (categoryScore[item.category] || 0) + 2;
  });
  watchlist.forEach(id => {
    const item = getContentById(id);
    if (item) categoryScore[item.category] = (categoryScore[item.category] || 0) + 1;
  });

  const scored = CONTENT
    .filter(c => c.id !== excludeId)
    .map(c => ({ item: c, score: categoryScore[c.category] || 0 }))
    .sort((a, b) => b.score - a.score || b.item.rating - a.item.rating);

  return scored.slice(0, limit).map(s => s.item);
}

function getContinueWatching() {
  const history = getHistory();
  return Object.entries(history)
    .filter(([id, h]) => h.progress > 0.02 && h.progress < 0.95)
    .sort((a, b) => b[1].lastWatched - a[1].lastWatched)
    .map(([id, h]) => ({ item: getContentById(id), progress: h.progress }))
    .filter(x => x.item);
}