// Central Library Initial State (Synced with User Module)
const INITIAL_CONTENT = [
  {
    id: "c01",
    title: "Nomad Skies",
    category: "Sci-Fi & Fantasy",
    year: 2023,
    duration: "10 min",
    rating: 4.6,
    desc: "A lone drifter crosses a sky full of floating ruins in search of a home that may no longer exist.",
    glyph: "N",
    poster: "images/c01.jpg",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    id: "c02",
    title: "Glass Horizon",
    category: "Drama",
    year: 2022,
    duration: "11 min",
    rating: 4.3,
    desc: "Two estranged siblings return to their childhood town to settle their father's final wish.",
    glyph: "G",
    poster: "images/c02.jpg",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  },
  {
    id: "c03",
    title: "Ember & Ash",
    category: "Action",
    year: 2024,
    duration: "1 min",
    rating: 4.1,
    desc: "A courier races through a burning city to deliver the one file that can stop a blackout.",
    glyph: "E",
    poster: "images/c03.jpg",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  },
  {
    id: "c04",
    title: "Midnight Escape",
    category: "Action",
    year: 2021,
    duration: "1 min",
    rating: 4.0,
    desc: "A getaway driver has ninety seconds to clear the checkpoint before the exits seal.",
    glyph: "M",
    poster: "images/c04.jpg",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
  }
];

// Initialize and Fetch Catalog from LocalStorage
function getContentLibrary() {
  const stored = localStorage.getItem("streamhub_catalog");
  if (!stored) {
    localStorage.setItem("streamhub_catalog", JSON.stringify(INITIAL_CONTENT));
    return INITIAL_CONTENT;
  }
  return JSON.parse(stored);
}

// Save Admin Catalog Updates
function saveContentLibrary(library) {
  localStorage.setItem("streamhub_catalog", JSON.stringify(library));
}

// Watchlist Helpers
function getWatchlist() {
  const session = JSON.parse(localStorage.getItem("streamhub_session") || "null");
  if (!session) return [];
  const key = `streamhub_watchlist_${session.email}`;
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function toggleWatchlist(titleId) {
  const session = JSON.parse(localStorage.getItem("streamhub_session") || "null");
  if (!session) return false;
  const key = `streamhub_watchlist_${session.email}`;
  let list = JSON.parse(localStorage.getItem(key) || "[]");
  
  if (list.includes(titleId)) {
    list = list.filter(id => id !== titleId);
  } else {
    list.push(titleId);
  }
  localStorage.setItem(key, JSON.stringify(list));
  return list.includes(titleId);
}

function isInWatchlist(titleId) {
  const list = getWatchlist();
  return list.includes(titleId);
}