# StreamHub — SDC Review 1

A multi-page video streaming frontend built with plain HTML, CSS, and JavaScript.
No backend — all data (accounts, sessions, watchlist, watch history) is persisted
in the browser via `localStorage`.

## How to run

Open `index.html` in a browser. You'll be redirected to `login.html` first —
sign up for an account, then you'll land on the Browse page. Keep all files
and folders together; the pages link to each other by relative path.

## Folder structure

```
streamhub-review1/
├── index.html          Browse page
├── watch.html           Watch / player page
├── watchlist.html       My List page
├── login.html            Log in page
├── signup.html            Sign up page
├── css/
│   └── style.css         All shared styling
├── images/                Poster images (one per title, c01.jpg – c12.jpg)
└── js/
    ├── data.js            Content library + localStorage helpers + recommendation logic
    ├── auth.js            Signup / login / session / route protection
    ├── common.js           Shared UI builders (cards, shelves) used by every page
    ├── home.js             Browse page logic
    ├── watch.js             Watch page logic
    ├── watchlist.js          My List page logic
    ├── login.js               Login form handling
    └── signup.js               Signup form handling
```

## Modules and team roles

The project splits into three modules, one per team member, each owning a
clear slice of files and functionality.

### Module 1 — Authentication & Session Management
**Files:** `login.html`, `signup.html`, `js/auth.js`, `js/login.js`, `js/signup.js`

- Signup form creates an account and stores it in `localStorage` under `streamhub_users`
- Login form validates credentials against stored accounts
- Active session stored under `streamhub_session`; every protected page calls
  `requireAuth()` on load and redirects to `login.html` if no session exists
- Nav bar shows "Log in / Sign up" or "Hi, {name} · Log out" depending on session state (`renderAuthNav()`)

### Module 2 — Content Browsing & Playback
**Files:** `index.html`, `watch.html`, `js/data.js`, `js/home.js`, `js/watch.js`

- `data.js` holds the content library (12 titles across 5 categories) and drives every page
- Browse page: search bar, category tabs, horizontally-scrolling shelves per genre
- Watch page: HTML5 `<video>` player, auto-resume via saved playback progress,
  "More Like This" row of same-category titles

**Adding your own poster images:** each item in `CONTENT` (inside `data.js`)
has a `poster` field pointing to a file in `images/`. Drop a `.jpg`/`.png` into
that folder and point the field at it (e.g. `poster: "images/c01.jpg"`).
Recommended size ~400×600 (2:3 portrait). If an image is missing, the card
just falls back to showing the letter glyph — nothing breaks.

### Module 3 — Personalization (Watchlist & Recommendations)
**Files:** `watchlist.html`, `js/watchlist.js`, recommendation logic inside `js/data.js`

- Add/remove titles from a personal watchlist, saved to `localStorage`
- Watch history tracked automatically as videos play (`recordProgress`)
- Recommendation engine scores categories based on watch history (+2) and
  watchlist saves (+1), then ranks all titles by that score — powers both
  "Continue Watching" and "Recommended For You" on the Browse page

## Shared foundation

`js/common.js` and `js/data.js` are used by all three modules — `common.js`
builds the reusable card/shelf HTML, and `data.js` centralizes the content
data and storage helpers so no module duplicates logic.
