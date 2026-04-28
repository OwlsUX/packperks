# Pack Perks Prototype

Clickable HTML prototype for the Q2 2026 Pack Perks launch. Plain HTML/CSS — no build step.

## Pages

Open `index.html` for the hub linking all six screens:

- `account-perks.html` — Welcome back, Hunter dashboard (3-column account page with the new Pack Perks banner)
- `pack-perks-list.html` — Logged-in perks page (featured Halo Vet card + partner offer grid)
- `offer-detail.html` — Ollie offer detail modal with promo code
- `membership-selection.html` — Pre-login Bronze / Silver / Gold tier picker
- `cancellation.html` — "Here's what you'd lose" cancel flow
- `marketing.html` — Public-facing marketing landing

## How to view

The nav is **inlined directly into each page**, so you can just double-click any `.html` file and it opens in Chrome (or any browser) — no server needed.

### Optional: run a local server (recommended while iterating)

A local server gives you cleaner URLs and lets you swap back to a shared nav include if you want a single source of truth later. Pick whichever is easiest:

**VS Code Live Server extension (easiest)**
1. Install the "Live Server" extension by Ritwick Dey.
2. Right-click any `.html` file → **Open with Live Server**.
3. Pages auto-reload on save.

**Python (one terminal command)**
```bash
cd "Halo Pack Perks/pack-perks-prototype"
python3 -m http.server 8000
```
Then open `http://localhost:8000/`.

**Node**
```bash
cd "Halo Pack Perks/pack-perks-prototype"
npx serve .
```

## Editing the nav

Because the nav is inlined for file:// compatibility, the canonical source is `partials/nav.html` but it isn't loaded at runtime. To update the nav:

1. Edit `partials/nav.html` (the source of truth).
2. Copy the updated `<nav class="halo-navigation">…</nav>` block into each of the 6 page files, replacing the existing inline nav.

If you'd rather keep a single shared nav, switch to running a local server (see above) and replace the inline `<nav>` block in each page with:

```html
<div id="halo-nav-mount"></div>
<script src="js/include-nav.js" defer></script>
```

…then restore the original fetch-based loader in `js/include-nav.js`.

## File layout

```
pack-perks-prototype/
├── index.html                  # Hub
├── account-perks.html          # Screen 1
├── pack-perks-list.html        # Screen 2
├── offer-detail.html           # Screen 3
├── membership-selection.html   # Screen 4
├── cancellation.html           # Screen 5
├── marketing.html              # Screen 6
├── css/styles.css              # All styles (Halo design tokens)
├── js/include-nav.js           # Deprecated no-op; nav is inlined now
└── partials/nav.html           # Canonical nav source (for re-inlining)
```
