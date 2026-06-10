# MOTHER // OPS DIAGNOSTIC REPORT

**Timestamp:** 2026-06-10T00:16:48.723Z

## Hero integrity

- Hero stack detected and structurally complete.

## Duplicate selectors

- `0%`
  - assets\css\videos.css
  - assets\css\ticker.css
  - assets\css\global.css
  - assets\css\global.css
  - assets\css\footer.css
  - assets\css\cinematic.css
  - assets\css\cinematic.css
  - assets\css\cinematic.css
  - assets\css\cinematic.css
  - assets\css\cinematic.css
  - assets\css\cinematic.css
  - assets\css\cinematic.css
  - assets\css\cinematic.css
  - assets\css\cinematic.css
- `100%`
  - assets\css\videos.css
  - assets\css\ticker.css
  - assets\css\global.css
  - assets\css\global.css
  - assets\css\global.css
  - assets\css\footer.css
  - assets\css\cinematic.css
  - assets\css\cinematic.css
  - assets\css\cinematic.css
  - assets\css\cinematic.css
  - assets\css\cinematic.css
  - assets\css\cinematic.css
  - assets\css\cinematic.css
  - assets\css\cinematic.css
  - assets\css\cinematic.css
- `.ticker-wrapper`
  - assets\css\ticker.css
  - assets\css\footer.css
- `.ticker-fade-left,
.ticker-fade-right`
  - assets\css\ticker.css
  - assets\css\footer.css
- `.ticker-fade-left`
  - assets\css\ticker.css
  - assets\css\footer.css
- `.ticker-fade-right`
  - assets\css\ticker.css
  - assets\css\footer.css
- `.ticker`
  - assets\css\ticker.css
  - assets\css\footer.css
- `.ticker-track`
  - assets\css\ticker.css
  - assets\css\footer.css
- `.ticker-track span`
  - assets\css\ticker.css
  - assets\css\ticker.css
  - assets\css\footer.css
  - assets\css\footer.css
- `.ticker-fade-left,
  .ticker-fade-right`
  - assets\css\ticker.css
  - assets\css\footer.css
- `.hero-crown-wrapper,
  .hero-crown`
  - assets\css\home.css
  - assets\css\home.css
  - assets\css\home.css
- `.gallery-lane`
  - assets\css\home.css
  - assets\css\home.css
  - assets\css\home.css
  - assets\css\global.css
- `.hero-flex`
  - assets\css\home.css
  - assets\css\home.css
- `.gallery-image`
  - assets\css\home.css
  - assets\css\gallery.css
- `.gallery-image.active`
  - assets\css\home.css
  - assets\css\gallery.css
- `.theme-toggle`
  - assets\css\home.css
  - assets\css\header.css
- `50%`
  - assets\css\global.css
  - assets\css\cinematic.css
  - assets\css\cinematic.css
  - assets\css\cinematic.css
  - assets\css\cinematic.css
  - assets\css\cinematic.css
  - assets\css\cinematic.css
  - assets\css\cinematic.css
  - assets\css\cinematic.css
- `70%`
  - assets\css\global.css
  - assets\css\global.css
- `to`
  - assets\css\gallery.css
  - assets\css\cinematic.css
- `.cc-footer`
  - assets\css\footer.css
  - assets\css\footer.css
- `.footer-icons`
  - assets\css\footer.css
  - assets\css\footer.css
- `.back-to-top`
  - assets\css\footer.css
  - assets\css\footer.css
- `.footer-text`
  - assets\css\footer.css
  - assets\css\footer.css

## Issues

- **overflow-risk** — `.day-background,
.night-background` in `assets\css\home.css` (width: 100vw, height: 100vh) — Fixed element with viewport-relative size may cause horizontal/vertical scroll.
- **overflow-risk** — `.night-nebula` in `assets\css\home.css` (width: 100vw, height: 100vh) — Fixed element with viewport-relative size may cause horizontal/vertical scroll.
- **z-index-high** — `.theme-toggle` in `assets\css\home.css` (z-index: 999) — High z-index may cause layering conflicts with hero/footer.
- **z-index-high** — `.cc-header` in `assets\css\header.css` (z-index: 1000) — High z-index may cause layering conflicts with hero/footer.
- **z-index-high** — `.theme-toggle` in `assets\css\header.css` (z-index: 2000) — High z-index may cause layering conflicts with hero/footer.
- **z-index-high** — `#evolve-panel,
#evolve-orb` in `assets\css\global.css` (z-index: 999999) — High z-index may cause layering conflicts with hero/footer.
- **z-index-high** — `.lightbox` in `assets\css\gallery.css` (z-index: 9999) — High z-index may cause layering conflicts with hero/footer.
- **js-selector-usage** — `.animated-toggle-icon` in `assets\js\theme.js` — JS uses this selector; ensure it exists in HTML.
- **js-selector-usage** — `.day-background` in `assets\js\theme.js` — JS uses this selector; ensure it exists in HTML.
- **js-selector-usage** — `.night-background` in `assets\js\theme.js` — JS uses this selector; ensure it exists in HTML.
- **js-selector-usage** — `.day-clouds` in `assets\js\theme.js` — JS uses this selector; ensure it exists in HTML.
- **js-selector-usage** — `.night-nebula` in `assets\js\theme.js` — JS uses this selector; ensure it exists in HTML.
- **js-selector-usage** — `.crown-day` in `assets\js\theme.js` — JS uses this selector; ensure it exists in HTML.
- **js-selector-usage** — `.crown-night` in `assets\js\theme.js` — JS uses this selector; ensure it exists in HTML.
- **js-selector-usage** — `.gallery-left .gallery-lane-inner` in `assets\js\hero-gallery.js` — JS uses this selector; ensure it exists in HTML.
- **js-selector-usage** — `.gallery-right .gallery-lane-inner` in `assets\js\hero-gallery.js` — JS uses this selector; ensure it exists in HTML.

## Fix suggestions

- `.day-background,
.night-background` in `assets\css\home.css` — Reduce width/height to 100vw/100vh and use transform: scale(...) for cinematic oversize.
- `.night-nebula` in `assets\css\home.css` — Reduce width/height to 100vw/100vh and use transform: scale(...) for cinematic oversize.
- `.theme-toggle` in `assets\css\home.css` — Consider reducing z-index below 500 or documenting intentional overlay.
- `.cc-header` in `assets\css\header.css` — Consider reducing z-index below 500 or documenting intentional overlay.
- `.theme-toggle` in `assets\css\header.css` — Consider reducing z-index below 500 or documenting intentional overlay.
- `#evolve-panel,
#evolve-orb` in `assets\css\global.css` — Consider reducing z-index below 500 or documenting intentional overlay.
- `.lightbox` in `assets\css\gallery.css` — Consider reducing z-index below 500 or documenting intentional overlay.
