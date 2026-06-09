# MOTHER // CSS DIAGNOSTIC REPORT

**Timestamp:** 2026-06-09T21:32:47.768Z

## Hero integrity

- Hero stack detected and structurally complete.

## Duplicate selectors

- `.reel-card`
  - assets\css\videos.css
  - assets\css\home.css
- `.reel-card:hover`
  - assets\css\videos.css
  - assets\css\home.css
- `0%`
  - assets\css\videos.css
  - assets\css\ticker.css
  - assets\css\home.css
  - assets\css\home.css
  - assets\css\home.css
  - assets\css\home.css
  - assets\css\home.css
  - assets\css\home.css
  - assets\css\home.css
  - assets\css\home.css
  - assets\css\home.css
  - assets\css\home.css
  - assets\css\home.css
  - assets\css\global.css
  - assets\css\global.css
  - assets\css\footer.css
- `100%`
  - assets\css\videos.css
  - assets\css\ticker.css
  - assets\css\home.css
  - assets\css\home.css
  - assets\css\home.css
  - assets\css\home.css
  - assets\css\home.css
  - assets\css\home.css
  - assets\css\home.css
  - assets\css\home.css
  - assets\css\home.css
  - assets\css\home.css
  - assets\css\home.css
  - assets\css\global.css
  - assets\css\global.css
  - assets\css\global.css
  - assets\css\footer.css
- `.ticker-wrapper`
  - assets\css\ticker.css
  - assets\css\home.css
  - assets\css\footer.css
- `.ticker-fade-left,
.ticker-fade-right`
  - assets\css\ticker.css
  - assets\css\home.css
  - assets\css\footer.css
- `.ticker-fade-left`
  - assets\css\ticker.css
  - assets\css\home.css
  - assets\css\footer.css
- `.ticker-fade-right`
  - assets\css\ticker.css
  - assets\css\home.css
  - assets\css\footer.css
- `.ticker`
  - assets\css\ticker.css
  - assets\css\home.css
  - assets\css\footer.css
- `.ticker-track`
  - assets\css\ticker.css
  - assets\css\home.css
  - assets\css\footer.css
- `.ticker-track span`
  - assets\css\ticker.css
  - assets\css\ticker.css
  - assets\css\home.css
  - assets\css\footer.css
  - assets\css\footer.css
- `.ticker-fade-left,
  .ticker-fade-right`
  - assets\css\ticker.css
  - assets\css\footer.css
- `to`
  - assets\css\home.css
  - assets\css\gallery.css
- `50%`
  - assets\css\home.css
  - assets\css\home.css
  - assets\css\home.css
  - assets\css\home.css
  - assets\css\home.css
  - assets\css\home.css
  - assets\css\home.css
  - assets\css\home.css
  - assets\css\home.css
  - assets\css\global.css
- `.hero-section`
  - assets\css\home.css
  - assets\css\home.css
- `.hero-crown-wrapper,
  .hero-crown`
  - assets\css\home.css
  - assets\css\home.css
  - assets\css\home.css
- `.hero-flex`
  - assets\css\home.css
  - assets\css\home.css
  - assets\css\home.css
- `.gallery-lane`
  - assets\css\home.css
  - assets\css\home.css
  - assets\css\global.css
- `.gallery-image`
  - assets\css\home.css
  - assets\css\gallery.css
- `.gallery-image.active`
  - assets\css\home.css
  - assets\css\gallery.css
- `.cc-footer`
  - assets\css\home.css
  - assets\css\footer.css
  - assets\css\footer.css
- `.footer-icons`
  - assets\css\home.css
  - assets\css\footer.css
  - assets\css\footer.css
- `.footer-icon`
  - assets\css\home.css
  - assets\css\footer.css
- `.footer-text`
  - assets\css\home.css
  - assets\css\footer.css
  - assets\css\footer.css
- `.back-to-top`
  - assets\css\home.css
  - assets\css\footer.css
  - assets\css\footer.css
- `.gallery-grid`
  - assets\css\home.css
  - assets\css\gallery.css
- `.theme-toggle`
  - assets\css\home.css
  - assets\css\header.css
- `html, body`
  - assets\css\global.css
  - assets\css\global.css
  - assets\css\global.css
- `70%`
  - assets\css\global.css
  - assets\css\global.css

## Issues

- **overflow-risk** — `.day-background,
.night-background` in `assets\css\home.css` (width: 120vw, height: 120vh) — Fixed element with viewport-relative size may cause horizontal/vertical scroll.
- **overflow-risk** — `.day-clouds` in `assets\css\home.css` (width: 160vw, height: 160vh) — Fixed element with viewport-relative size may cause horizontal/vertical scroll.
- **overflow-risk** — `.night-nebula` in `assets\css\home.css` (width: 160vw, height: 160vh) — Fixed element with viewport-relative size may cause horizontal/vertical scroll.
- **z-index-high** — `.theme-toggle` in `assets\css\home.css` (z-index: 999) — High z-index may cause layering conflicts with hero/footer.
- **z-index-high** — `.cc-header` in `assets\css\header.css` (z-index: 1000) — High z-index may cause layering conflicts with hero/footer.
- **z-index-high** — `.theme-toggle` in `assets\css\header.css` (z-index: 2000) — High z-index may cause layering conflicts with hero/footer.
- **z-index-high** — `#evolve-panel,
#evolve-orb` in `assets\css\global.css` (z-index: 999999) — High z-index may cause layering conflicts with hero/footer.
- **z-index-high** — `.lightbox` in `assets\css\gallery.css` (z-index: 9999) — High z-index may cause layering conflicts with hero/footer.
