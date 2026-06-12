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
      const res = await fetch(manifestPath + "?v=" + Date.now());
      if (!res.ok) throw new Error("Manifest missing");

      const data = await res.json();
      TRACKS = (data.sounds || []).map(name => `/assets/sounds/${name}`);

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
    const toggle = document.getElementById("soundToggle");
    if (!toggle) {
      console.warn("Sound toggle not found in header.");
      return;
    }

    toggle.addEventListener("click", togglePlayback);
  }

  /* ------------------------------------------------------------
     INIT — called by master.js AFTER header loads
  ------------------------------------------------------------ */
  window.initSoundEngine = async function () {
    await loadTracks();   // ← CRITICAL: load autoscan list first
    bindToggle();         // ← Now bind toggle
  };

})();
