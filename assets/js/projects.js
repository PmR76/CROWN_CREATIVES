/* ============================================================
   CROWN CREATIVES — PROJECT ENGINE v2.1 (Unified Build)
   Auto-play, tap-to-play, play button overlay, auto-thumbnails,
   provider-specific embeds, GitHub autoscan, zero config.
============================================================ */

document.addEventListener("DOMContentLoaded", async () => {

  /* ------------------------------------------------------------
     1. CONFIG — simplified into one object
  ------------------------------------------------------------ */
  const CFG = {
    autoPlayHover: true,
    tapToPlayMobile: true,
    showPlayButton: true,
    autoThumbnail: true,
    githubAutoScan: true,
    projectsFolder: "/assets/projects/"
  };

  /* ------------------------------------------------------------
     2. COLLECT PROJECTS (HTML + GitHub autoscan)
  ------------------------------------------------------------ */
  let lanes = [...document.querySelectorAll(".project-lane[data-project]")];

  if (CFG.githubAutoScan) {
    const auto = await autoScanGitHub(CFG.projectsFolder);
    lanes = [...lanes, ...auto];
  }

  /* ------------------------------------------------------------
     3. INITIALISE ALL LANES
  ------------------------------------------------------------ */
  lanes.forEach(lane => initLane(lane, CFG));
});

/* ============================================================
   INITIALISE A SINGLE PROJECT LANE
============================================================ */
function initLane(lane, CFG) {
  const reel = lane.querySelector(".project-reel");
  const url = reel?.dataset?.reelUrl;
  if (!url) return;

  const provider = detectProvider(url);
  const embedSrc = buildEmbedURL(url, provider);

  // Auto-thumbnail
  if (CFG.autoThumbnail) autoThumbnail(reel, provider, url);

  // Play button overlay
  if (CFG.showPlayButton) addPlayButton(reel);

  // Desktop hover auto-play
  if (CFG.autoPlayHover && !isMobile()) {
    reel.addEventListener("mouseenter", () => activateEmbed(reel, embedSrc));
    reel.addEventListener("mouseleave", () => deactivateEmbed(reel));
  }

  // Mobile tap-to-play
  if (CFG.tapToPlayMobile && isMobile()) {
    reel.addEventListener("click", () => activateEmbed(reel, embedSrc));
  }
}

/* ============================================================
   PROVIDER DETECTION
============================================================ */
function detectProvider(url) {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("instagram.com")) return "instagram";
  if (url.includes("tiktok.com")) return "tiktok";
  return null;
}

/* ============================================================
   EMBED URL BUILDER
============================================================ */
function buildEmbedURL(url, provider) {
  switch (provider) {
    case "youtube": {
      const id = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/)?.[1];
      return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}`;
    }
    case "instagram":
      return `${url}embed/`;
    case "tiktok":
      return `https://www.tiktok.com/embed/${extractTikTokID(url)}`;
    default:
      return null;
  }
}

function extractTikTokID(url) {
  return url.match(/video\/(\d+)/)?.[1] || "";
}

/* ============================================================
   AUTO-THUMBNAIL GENERATION
============================================================ */
function autoThumbnail(reel, provider, url) {
  const still = reel.querySelector(".project-reel-still");

  if (provider === "youtube") {
    const id = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/)?.[1];
    still.src = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  }

  if (provider === "instagram" || provider === "tiktok") {
    still.style.background = "rgba(255,255,255,0.1)";
  }
}

/* ============================================================
   PLAY BUTTON OVERLAY
============================================================ */
function addPlayButton(reel) {
  const btn = document.createElement("div");
  btn.className = "project-play-button";
  btn.innerHTML = "▶";
  reel.appendChild(btn);
}

/* ============================================================
   EMBED ACTIVATION / DEACTIVATION
============================================================ */
function activateEmbed(reel, embedSrc) {
  if (reel.dataset.active === "1") return;

  reel.dataset.active = "1";

  reel.querySelector(".project-reel-still")?.remove();
  reel.querySelector(".project-reel-motion")?.remove();

  const iframe = document.createElement("iframe");
  iframe.src = embedSrc;
  iframe.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;
  iframe.style.position = "absolute";
  iframe.style.inset = "0";
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";
  iframe.style.opacity = "0";
  iframe.style.transition = "opacity 0.4s ease";

  reel.appendChild(iframe);
  requestAnimationFrame(() => (iframe.style.opacity = "1"));
}

function deactivateEmbed(reel) {
  if (isMobile()) return;
  reel.dataset.active = "0";
  reel.querySelector("iframe")?.remove();
}

/* ============================================================
   GITHUB AUTOSCAN (magic.js style)
============================================================ */
async function autoScanGitHub(folder) {
  try {
    const res = await fetch(folder);
    const html = await res.text();

    const matches = [...html.matchAll(/href="([^"]+\/)"/g)];
    const dirs = matches.map(m => m[1]).filter(f => f !== "../");

    const lanes = [];

    for (const dir of dirs) {
      try {
        const config = await fetch(folder + dir + "config.json").then(r => r.json());
        lanes.push(buildAutoLane(config, folder + dir));
      } catch {}
    }

    return lanes;
  } catch {
    return [];
  }
}

function buildAutoLane(config, base) {
  const lane = document.createElement("section");
  lane.className = "project-lane";
  lane.dataset.project = "";

  lane.innerHTML = `
    <div class="project-reel" data-reel-url="${config.reel}">
      <img class="project-reel-still" src="${base + config.still}">
      <video class="project-reel-motion" muted loop playsinline>
        <source src="${base + config.motion}" type="video/mp4">
      </video>
      <div class="project-reel-shimmer"></div>
    </div>

    <div class="project-info">
      <h2 class="project-title">${config.title}</h2>
      <p class="project-desc">${config.description}</p>
      <div class="project-tags">
        ${config.tags.map(t => `<span class="project-tag">${t}</span>`).join("")}
      </div>
    </div>
  `;

  document.querySelector(".projects-wrapper").appendChild(lane);
  return lane;
}

/* ============================================================
   MOBILE DETECTION
============================================================ */
function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}
