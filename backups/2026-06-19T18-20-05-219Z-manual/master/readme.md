1. Overview
Crown Creatives is evolving into a modular, OS‑like website architecture where:

Global layout (header, footer, ticker, backgrounds)

Global behaviour (theme toggle, sound engine)

Page‑specific engines (hero gallery, videos, podcasts)

Manifest‑driven media systems

…are all controlled through a single master template system.

This ensures:

Consistency

Easy maintenance

Easy page creation

Zero duplication

Admin‑only editing

Future‑proof structure

🗂️ 2. Folder Structure (High‑Level)
Code
/
├── master/                 ← GLOBAL TEMPLATE SYSTEM
│   ├── css/
│   │   └── master.css      ← global layout + background + header + footer
│   ├── js/
│   │   └── master.js       ← global behaviour + page engine loader
│   ├── header.html         ← global header
│   ├── footer.html         ← global footer
│   ├── ticker.html         ← global ticker
│   ├── background.html     ← day/night layers
│   └── page-wrapper.html   ← master page structure
│
├── assets/
│   ├── css/                ← page-specific CSS
│   ├── js/                 ← page-specific JS engines
│   ├── images/
│   ├── videos/
│   ├── podcasts/
│   └── sounds/
│
├── index.html              ← uses master template
├── gallery.html            ← uses master template
├── videos.html             ← uses master template
└── etc...
🧩 3. Master Template Flow
Code
┌──────────────────────────────────────────────┐
│                master.js                     │
│  (loads global template + page engine)       │
└──────────────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────────┐
│            page-wrapper.html                 │
│  (defines global structure for all pages)    │
└──────────────────────────────────────────────┘
                │
                ├─────────────── loads ────────────────┐
                ▼                                        ▼
      header.html                                 background.html
      footer.html                                 ticker.html
                │                                        │
                └─────────────── injects ───────────────┘
                                ▼
                     ┌──────────────────┐
                     │   page-content   │
                     │ (unique per page)│
                     └──────────────────┘
                                │
                                ▼
                     page-specific JS engine
🌗 4. Background System (Global)
The master template injects:

day-background

night-background

day-clouds

night-nebula

These are controlled by:

theme.js

master.css

Diagram:
Code
[ day-background ]   ← visible in light mode
[ night-background ] ← visible in dark mode
[ day-clouds ]       ← fades in/out
[ night-nebula ]     ← fades in/out
🧱 5. Header System (Global)
Includes:

Crown logo

Navigation

Theme toggle

Sound toggle

Diagram:
Code
┌──────────────────────────────────────────────┐
│  [CROWN]   HOME | ABOUT | GALLERY | ...      │
│            [theme toggle] [sound toggle]     │
└──────────────────────────────────────────────┘
📰 6. Ticker System (Global)
A scrolling ticker injected into every page:

Code
Crown Creatives — Artistry • Resilience • Imagination — Evolve OS
🦶 7. Footer System (Global)
Includes:

Social icons

Email

Back‑to‑top button

Copyright

Diagram:
Code
┌──────────────────────────────────────────────┐
│ © Crown Creatives 2026                       │
│ [FB] [IG] [Email] [↑ Back to top]            │
└──────────────────────────────────────────────┘
⚙️ 8. Page Engines (Modular)
Each page loads its own engine:

Code
home → hero-gallery.js
gallery → gallery.js
videos → videos.js
podcasts → podcasts.js
blog → blog.js
Diagram:
Code
master.js
   ├── theme.js
   ├── sound-engine.js
   └── page-engine.js (based on data-page attribute)
🧬 9. How a Page Works (Example: index.html)
Code
<html>
<head>
  <link rel="stylesheet" href="/master/css/master.css">
  <link rel="stylesheet" href="/assets/css/home.css">
</head>

<body>
  <div id="master-container" data-page="home"></div>

  <script src="/master/js/master.js"></script>
  <script src="/assets/js/hero-gallery.js"></script>
</body>
</html>
🛠️ 10. How to Create a New Page (Admin)
Copy an existing page (e.g., about.html)

Change the data-page="about" attribute

Create a new CSS file in /assets/css/

Create a new JS engine in /assets/js/ (optional)

Add your content inside <main id="page-content">

That’s it.

🔮 11. Why This System Works
No duplication

No broken pages

No missing header/footer

No missing background layers

No CSS drift

No JS conflicts

Easy to maintain

Easy to extend

Easy to debug

Admin‑only control

This is the EVOLVE‑OS architecture for Crown Creatives.