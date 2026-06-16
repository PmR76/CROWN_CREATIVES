/* ============================================================
   CROWN CREATIVES — SOUND ENGINE
   Playlist + Autoscan + No Repeats + Cinematic Pulse
============================================================ */

(function () {

  let TRACKS = []; 
  const manifestPath = "/assets/sounds/sound-manifest.json";

  let audio = null;
  let order = [];
  let orderIndex = -1;
  let isPlaying = false;
  let lastTrack = null;

  /* ------------------------------------------------------------
     Load manifest or fallback
  ------------------------------------------------------------ */
async function loadTracks() {
  try {
    const res = await fetch(manifestPath);
    if (!res.ok) throw new Error("Manifest missing");

    const data = await res.json();

    // FIX: support array OR object format
    TRACKS = Array.isArray(data)
      ? data.map(name => `/assets/sounds/${name}`)
      : (data.sounds || []).map(name => `/assets/sounds/${name}`);

    if (TRACKS.length === 0) throw new Error("Empty manifest");
  } catch (e) {
    console.warn("Using fallback track list.", e);
    TRACKS = [
      "/assets/sounds/alec_koff-carnaval-484622.mp3",
      "/assets/sounds/energysound-powerful-percussion-513717.mp3",
      "/assets/sounds/finley-chill-sunset-chill-nature-529994.mp3",
      "/assets/sounds/ikoliks_aj-acoustic-spring-mothers-day-music-320427.mp3",
      "/assets/sounds/kontraa-water-afro-pop-music-445661.mp3"
    ];
  }
}

  /* ------------------------------------------------------------
     Shuffle + playlist logic (Option A)
  ------------------------------------------------------------ */
  function shuffle(array) {
    const a = array.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function buildOrder() {
    const indices = TRACKS.map((_, i) => i);
    order = shuffle(indices);

    if (lastTrack !== null && order.length > 1 && order[0] === lastTrack) {
      [order[0], order[1]] = [order[1], order[0]];
    }

    orderIndex = 0;
  }

  function getNextTrackIndex() {
    if (!order || order.length === 0 || orderIndex < 0 || orderIndex >= order.length) {
      buildOrder();
    }
    const idx = order[orderIndex];
    orderIndex++;

    if (orderIndex >= order.length) {
      lastTrack = idx;
      buildOrder();
    } else {
      lastTrack = idx;
    }

    return idx;
  }

  /* ------------------------------------------------------------
     Playback
  ------------------------------------------------------------ */
  function playNext() {
    const idx = getNextTrackIndex();
    const src = TRACKS[idx];

    if (!audio) {
      audio = new Audio(src);
      audio.addEventListener("ended", playNext);
    } else {
      audio.src = src;
    }

    audio.volume = 0.9;
    audio.play().then(() => {
      isPlaying = true;
      updateToggleVisual(true);
    }).catch(err => {
      console.error("Sound engine play error:", err);
      isPlaying = false;
      updateToggleVisual(false);
    });
  }

  function stopPlayback() {
    if (audio) audio.pause();
    isPlaying = false;
    updateToggleVisual(false);
  }

  /* ------------------------------------------------------------
     Toggle + animation
  ------------------------------------------------------------ */
  function togglePlayback() {
    const toggle = document.getElementById("soundToggle");
    if (toggle) {
      toggle.classList.add("cc-toggle-pulse");
      setTimeout(() => toggle.classList.remove("cc-toggle-pulse"), 250);
    }

    if (!isPlaying) {
      playNext();
    } else {
      stopPlayback();
    }
  }

  function updateToggleVisual(active) {
    const toggle = document.getElementById("soundToggle");
    if (!toggle) return;

    if (active) {
      toggle.classList.add("cc-toggle-active");
    } else {
      toggle.classList.remove("cc-toggle-active");
    }
  }

 function bindToggle() {
  let attempts = 0;

  const tryBind = () => {
    const toggle = document.getElementById("soundToggle");

    if (toggle) {
      toggle.addEventListener("click", togglePlayback);
      console.log("Sound toggle bound successfully.");
      return;
    }

    attempts++;
    if (attempts < 50) {
      setTimeout(tryBind, 100);
    } else {
      console.warn("Sound toggle not found after waiting.");
    }
  };

  tryBind();
}

  /* ------------------------------------------------------------
     INIT — called by master.js AFTER header loads
  ------------------------------------------------------------ */
  window.initSoundEngine = async function () {
    await loadTracks();   // ← CRITICAL: load autoscan list first
    bindToggle();         // ← Now bind toggle
  };
/* ---------------------------------------------
   6. DRAGGABLE SOUND TOGGLE (SHIFT + S)
   --------------------------------------------- */
let soundAdmin = false;
let soundDragging = false;
let sx = 0;
let sy = 0;

window.addEventListener("keydown", e => {
  if (e.key === "S" && e.shiftKey) {
    soundAdmin = !soundAdmin;
    soundToggle.classList.toggle("sound-draggable", soundAdmin);
  }
});

soundToggle.addEventListener("mousedown", e => {
  if (!soundAdmin) return;

  soundDragging = true;
  soundToggle.classList.add("sound-dragging");

  sx = e.clientX - soundToggle.offsetLeft;
  sy = e.clientY - soundToggle.offsetTop;
});

window.addEventListener("mousemove", e => {
  if (!soundDragging) return;

  soundToggle.style.left = (e.clientX - sx) + "px";
  soundToggle.style.top = (e.clientY - sy) + "px";
  soundToggle.style.position = "absolute";
});

window.addEventListener("mouseup", () => {
  if (!soundDragging) return;

  soundDragging = false;
  soundToggle.classList.remove("sound-dragging");

  localStorage.setItem("soundTogglePos", JSON.stringify({
    x: soundToggle.offsetLeft,
    y: soundToggle.offsetTop
  }));
});

/* Restore saved position */
const savedSoundPos = localStorage.getItem("soundTogglePos");
if (savedSoundPos) {
  const pos = JSON.parse(savedSoundPos);
  soundToggle.style.left = pos.x + "px";
  soundToggle.style.top = pos.y + "px";
  soundToggle.style.position = "absolute";
}

})();
 