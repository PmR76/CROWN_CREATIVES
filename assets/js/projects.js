/* ============================================================
   CROWN CREATIVES — PROJECT REEL ENGINE v1.0
   Self‑scanning embed system for YouTube, Instagram, TikTok.
   Add a <div class="project-reel" data-reel-url="..."> and it works.
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const reels = document.querySelectorAll(".project-reel[data-reel-url]");

  reels.forEach(reel => {
    const url = reel.getAttribute("data-reel-url");
    if (!url) return;

    const provider = detectProvider(url);
    const embedSrc = buildEmbedURL(url, provider);

    // If provider unsupported, skip
    if (!embedSrc) return;

    // Create iframe (hidden until activated)
    const iframe = document.createElement("iframe");
    iframe.src = embedSrc;
    iframe.loading = "lazy";
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

    // On click → replace motion preview with iframe
    reel.addEventListener("click", () => {
      activateEmbed(reel, iframe);
    });
  });
});

/* ------------------------------------------------------------
   Detect provider from URL
------------------------------------------------------------ */
function detectProvider(url) {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("instagram.com")) return "instagram";
  if (url.includes("tiktok.com")) return "tiktok";
  return null;
}

/* ------------------------------------------------------------
   Build embed URL for each provider
------------------------------------------------------------ */
function buildEmbedURL(url, provider) {
  switch (provider) {
    case "youtube": {
      const idMatch = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
      if (!idMatch) return null;
      return `https://www.youtube.com/embed/${idMatch[1]}?rel=0&mute=1&controls=1`;
    }

    case "instagram":
      // Instagram requires their embed script, but iframe still works
      return `${url}embed/`;

    case "tiktok":
      // TikTok embed URL
      return `https://www.tiktok.com/embed/${extractTikTokID(url)}`;

    default:
      return null;
  }
}

/* Extract TikTok video ID */
function extractTikTokID(url) {
  const match = url.match(/video\/(\d+)/);
  return match ? match[1] : "";
}

/* ------------------------------------------------------------
   Activate embed on click
------------------------------------------------------------ */
function activateEmbed(reel, iframe) {
  // Remove motion preview
  const motion = reel.querySelector(".project-reel-motion");
  if (motion) motion.remove();

  // Remove still image
  const still = reel.querySelector(".project-reel-still");
  if (still) still.remove();

  // Add iframe if not already added
  if (!reel.contains(iframe)) {
    reel.appendChild(iframe);
    requestAnimationFrame(() => {
      iframe.style.opacity = "1";
    });
  }
}
