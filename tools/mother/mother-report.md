# MOTHER // OPS DIAGNOSTIC REPORT

**Timestamp:** 2026-06-10T19:25:33.502Z

## Hero integrity

- Hero stack detected and structurally complete.

## Duplicate selectors

- `.videos-hero`
  - assets\css\videos.css
  - assets\css\global.css
- `0%`
  - assets\css\videos.css
  - assets\css\ticker.css
  - assets\css\home.css
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
  - assets\css\home.css
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
- `.sound-toggle`
  - assets\css\sound-engine.css
  - assets\css\sound-engine.css
  - assets\css\sound-engine.css
  - assets\css\sound-engine.css
- `.sound-toggle img`
  - assets\css\sound-engine.css
  - assets\css\sound-engine.css
  - assets\css\sound-engine.css
  - assets\css\sound-engine.css
- `.sound-toggle:hover img`
  - assets\css\sound-engine.css
  - assets\css\sound-engine.css
  - assets\css\sound-engine.css
  - assets\css\sound-engine.css
- `.sound-on img`
  - assets\css\sound-engine.css
  - assets\css\sound-engine.css
- `.sound-off img`
  - assets\css\sound-engine.css
  - assets\css\sound-engine.css
- `.hero-crown-wrapper,
  .hero-crown`
  - assets\css\home.css
  - assets\css\home.css
  - assets\css\home.css
- `.hero-flex`
  - assets\css\home.css
  - assets\css\home.css
- `.gallery-lane`
  - assets\css\home.css
  - assets\css\home.css
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
- `#evolve-panel,
#evolve-orb`
  - assets\css\global.css
  - assets\css\global.css
- `.videos-hero,
.videos-hero *`
  - assets\css\global.css
  - assets\css\global.css
- `to`
  - assets\css\gallery.css
  - assets\css\cinematic.css

## Issues

- **z-index-high** — `.sound-toggle` in `assets\css\sound-engine.css` (z-index: 9999) — High z-index may cause layering conflicts with hero/footer.
- **z-index-high** — `.sound-toggle` in `assets\css\sound-engine.css` (z-index: 9999) — High z-index may cause layering conflicts with hero/footer.
- **z-index-high** — `.sound-toggle` in `assets\css\sound-engine.css` (z-index: 9999) — High z-index may cause layering conflicts with hero/footer.
- **z-index-high** — `.sound-toggle` in `assets\css\sound-engine.css` (z-index: 9999) — High z-index may cause layering conflicts with hero/footer.
- **overflow-risk** — `.day-background,
.night-background` in `assets\css\home.css` (width: 140vw, height: 140vh) — Fixed element with viewport-relative size may cause horizontal/vertical scroll.
- **overflow-risk** — `.day-clouds,
.night-nebula` in `assets\css\home.css` (width: 160vw, height: 160vh) — Fixed element with viewport-relative size may cause horizontal/vertical scroll.
- **z-index-high** — `.cc-header` in `assets\css\header.css` (z-index: 1000) — High z-index may cause layering conflicts with hero/footer.
- **z-index-high** — `.theme-toggle` in `assets\css\header.css` (z-index: 2000) — High z-index may cause layering conflicts with hero/footer.
- **z-index-high** — `#evolve-panel,
#evolve-orb` in `assets\css\global.css` (z-index: 999999) — High z-index may cause layering conflicts with hero/footer.
- **z-index-high** — `#evolve-panel,
#evolve-orb` in `assets\css\global.css` (z-index: 999999) — High z-index may cause layering conflicts with hero/footer.
- **z-index-high** — `.lightbox` in `assets\css\gallery.css` (z-index: 9999) — High z-index may cause layering conflicts with hero/footer.
- **html-img-no-alt** — in `videos.html` — snippet: `<img src="/assets/icons/head-crown.svg" class="cc-logo shimmer-crown">` — Image tag missing alt attribute.
- **html-img-no-alt** — in `videos.html` — snippet: `<img src="/assets/icons/sun-moon-magic.svg" class="cc-theme-icon shimmer-crown">` — Image tag missing alt attribute.
- **html-img-no-alt** — in `videos.html` — snippet: `<img src="/assets/icons/facebook-magic.svg" class="footer-icon">` — Image tag missing alt attribute.
- **html-img-no-alt** — in `videos.html` — snippet: `<img src="/assets/icons/instagram-magic.svg" class="footer-icon">` — Image tag missing alt attribute.
- **html-img-no-alt** — in `videos.html` — snippet: `<img src="/assets/icons/email-magic.svg" class="footer-icon">` — Image tag missing alt attribute.
- **html-img-no-alt** — in `videos.html` — snippet: `<img src="/assets/icons/copilot-magic.svg" class="footer-icon">` — Image tag missing alt attribute.
- **html-img-no-alt** — in `videos.html` — snippet: `<img src="/assets/icons/up-arrow-magic.svg" class="footer-icon">` — Image tag missing alt attribute.
- **html-img-no-alt** — in `projects.html` — snippet: `<img src="/assets/icons/head-crown.svg" class="cc-logo shimmer-crown">` — Image tag missing alt attribute.
- **html-img-no-alt** — in `projects.html` — snippet: `<img src="/assets/icons/sun-moon-magic.svg" class="cc-theme-icon shimmer-crown">` — Image tag missing alt attribute.
- **html-img-no-alt** — in `projects.html` — snippet: `<img src="/assets/icons/facebook-magic.svg" class="footer-icon">` — Image tag missing alt attribute.
- **html-img-no-alt** — in `projects.html` — snippet: `<img src="/assets/icons/instagram-magic.svg" class="footer-icon">` — Image tag missing alt attribute.
- **html-img-no-alt** — in `projects.html` — snippet: `<img src="/assets/icons/email-magic.svg" class="footer-icon">` — Image tag missing alt attribute.
- **html-img-no-alt** — in `projects.html` — snippet: `<img src="/assets/icons/copilot-magic.svg" class="footer-icon">` — Image tag missing alt attribute.
- **html-img-no-alt** — in `podcasts.html` — snippet: `<img src="/assets/icons/head-crown.svg" class="cc-logo shimmer-crown">` — Image tag missing alt attribute.
- **html-img-no-alt** — in `podcasts.html` — snippet: `<img src="/assets/icons/sun-moon-magic.svg" class="cc-theme-icon shimmer-crown">` — Image tag missing alt attribute.
- **html-img-no-alt** — in `podcasts.html` — snippet: `<img src="/assets/icons/facebook-magic.svg" class="footer-icon">` — Image tag missing alt attribute.
- **html-img-no-alt** — in `podcasts.html` — snippet: `<img src="/assets/icons/instagram-magic.svg" class="footer-icon">` — Image tag missing alt attribute.
- **html-img-no-alt** — in `podcasts.html` — snippet: `<img src="/assets/icons/email-magic.svg" class="footer-icon">` — Image tag missing alt attribute.
- **html-img-no-alt** — in `podcasts.html` — snippet: `<img src="/assets/icons/copilot-magic.svg" class="footer-icon">` — Image tag missing alt attribute.
- **html-img-no-alt** — in `gallery.html` — snippet: `<img id="lightbox-img" class="lightbox-img" src="">` — Image tag missing alt attribute.
- **html-img-no-alt** — in `blog.html` — snippet: `<img src="/assets/icons/head-crown.svg" class="cc-logo shimmer-crown">` — Image tag missing alt attribute.
- **html-img-no-alt** — in `blog.html` — snippet: `<img src="/assets/icons/sun-moon-magic.svg" class="cc-theme-icon shimmer-crown">` — Image tag missing alt attribute.
- **html-img-no-alt** — in `blog.html` — snippet: `<img src="/assets/icons/facebook-magic.svg" class="footer-icon">` — Image tag missing alt attribute.
- **html-img-no-alt** — in `blog.html` — snippet: `<img src="/assets/icons/instagram-magic.svg" class="footer-icon">` — Image tag missing alt attribute.
- **html-img-no-alt** — in `blog.html` — snippet: `<img src="/assets/icons/email-magic.svg" class="footer-icon">` — Image tag missing alt attribute.
- **html-img-no-alt** — in `blog.html` — snippet: `<img src="/assets/icons/copilot-magic.svg" class="footer-icon">` — Image tag missing alt attribute.
- **html-img-no-alt** — in `blog.html` — snippet: `<img src="/assets/icons/up-arrow-magic.svg" class="footer-icon">` — Image tag missing alt attribute.
- **html-img-no-alt** — in `about.html` — snippet: `<img src="/assets/icons/head-crown.svg" class="cc-logo shimmer-crown">` — Image tag missing alt attribute.
- **html-img-no-alt** — in `about.html` — snippet: `<img src="/assets/icons/sun-moon-magic.svg" class="cc-theme-icon shimmer-crown">` — Image tag missing alt attribute.
- **html-img-no-alt** — in `about.html` — snippet: `<img src="/assets/icons/facebook-magic.svg" class="footer-icon">` — Image tag missing alt attribute.
- **html-img-no-alt** — in `about.html` — snippet: `<img src="/assets/icons/instagram-magic.svg" class="footer-icon">` — Image tag missing alt attribute.
- **html-img-no-alt** — in `about.html` — snippet: `<img src="/assets/icons/email-magic.svg" class="footer-icon">` — Image tag missing alt attribute.
- **html-img-no-alt** — in `about.html` — snippet: `<img src="/assets/icons/copilot-magic.svg" class="footer-icon">` — Image tag missing alt attribute.
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

- `.sound-toggle` in `assets\css\sound-engine.css` — Consider reducing z-index below 500 or documenting intentional overlay.
- `.sound-toggle` in `assets\css\sound-engine.css` — Consider reducing z-index below 500 or documenting intentional overlay.
- `.sound-toggle` in `assets\css\sound-engine.css` — Consider reducing z-index below 500 or documenting intentional overlay.
- `.sound-toggle` in `assets\css\sound-engine.css` — Consider reducing z-index below 500 or documenting intentional overlay.
- `.day-background,
.night-background` in `assets\css\home.css` — Reduce width/height to 100vw/100vh and use transform: scale(...) for cinematic oversize.
- `.day-clouds,
.night-nebula` in `assets\css\home.css` — Reduce width/height to 100vw/100vh and use transform: scale(...) for cinematic oversize.
- `.cc-header` in `assets\css\header.css` — Consider reducing z-index below 500 or documenting intentional overlay.
- `.theme-toggle` in `assets\css\header.css` — Consider reducing z-index below 500 or documenting intentional overlay.
- `#evolve-panel,
#evolve-orb` in `assets\css\global.css` — Consider reducing z-index below 500 or documenting intentional overlay.
- `#evolve-panel,
#evolve-orb` in `assets\css\global.css` — Consider reducing z-index below 500 or documenting intentional overlay.
- `.lightbox` in `assets\css\gallery.css` — Consider reducing z-index below 500 or documenting intentional overlay.
