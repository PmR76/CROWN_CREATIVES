// ============================================================
// SoundEngine — Crown Creatives Unified Playback Engine
// No repeats • Manifest support • Folder scan fallback
// ============================================================

class SoundEngine {
  constructor() {
    this.manifestUrl = "/assets/sounds/sound-manifest.json";

    this.files = [];        // raw file list
    this.playlist = [];     // shuffled playlist
    this.pointer = 0;       // current index
    this.lastTrack = null;  // avoid immediate repeat

    this.audio = null;
    this.isPlaying = false;
    this.isMuted = true;
  }

  // ------------------------------------------------------------
  // Load manifest if available
  // ------------------------------------------------------------
  async loadManifest() {
    try {
      const res = await fetch(this.manifestUrl);
      if (!res.ok) throw new Error("Manifest missing");

      const data = await res.json();
      this.files = Object.values(data.tracks).map(
        file => `/assets/sounds/${file}`
      );

      return true;
    } catch (err) {
      console.warn("Manifest not found, falling back to folder scan.");
      return false;
    }
  }

  // ------------------------------------------------------------
  // Fallback: scan folder for .mp3 files
  // ------------------------------------------------------------
  async scanFolder() {
    try {
      const res = await fetch("/assets/sounds/");
      const text = await res.text();

      const matches = [...text.matchAll(/href="([^"]+\.mp3)"/g)];
      this.files = matches.map(m => "/assets/sounds/" + m[1]);
    } catch (err) {
      console.error("Folder scan failed:", err);
      this.files = [];
    }
  }

  // ------------------------------------------------------------
  // Shuffle helper
  // ------------------------------------------------------------
  shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ------------------------------------------------------------
  // Build playlist with no immediate repeat
  // ------------------------------------------------------------
  buildPlaylist() {
    if (!this.files || this.files.length === 0) return [];

    let list = this.shuffle(this.files);

    if (this.lastTrack && list.length > 1 && list[0] === this.lastTrack) {
      [list[0], list[1]] = [list[1], list[0]];
    }

    this.pointer = 0;
    return list;
  }

  // ------------------------------------------------------------
  // Play next track in playlist
  // ------------------------------------------------------------
  async playNext() {
    if (this.isMuted) return;

    if (!this.playlist || this.playlist.length === 0) {
      const hasManifest = await this.loadManifest();
      if (!hasManifest) await this.scanFolder();

      this.playlist = this.buildPlaylist();
    }

    if (this.playlist.length === 0) {
      console.warn("No sound files found.");
      return;
    }

    const track = this.playlist[this.pointer];
    this.lastTrack = track;

    this.pointer++;
    if (this.pointer >= this.playlist.length) {
      this.playlist = this.buildPlaylist();
    }

    if (!this.audio) {
      this.audio = new Audio(track);
      this.audio.addEventListener("ended", () => this.playNext());
    } else {
      this.audio.src = track;
    }

    this.audio.volume = 0.9;

    try {
      await this.audio.play();
      this.isPlaying = true;
      this.updateToggleVisual(true);
    } catch (err) {
      console.error("SoundEngine play error:", err);
      this.isPlaying = false;
      this.updateToggleVisual(false);
    }
  }

  // ------------------------------------------------------------
  // Stop playback
  // ------------------------------------------------------------
  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.isPlaying = false;
    this.updateToggleVisual(false);
  }

  // ------------------------------------------------------------
  // Toggle playback
  // ------------------------------------------------------------
  toggle() {
    this.isMuted = !this.isMuted;

    const toggle = document.getElementById("soundToggle");
    if (toggle) {
      toggle.classList.add("cc-toggle-pulse");
      setTimeout(() => toggle.classList.remove("cc-toggle-pulse"), 250);
    }

    if (this.isMuted) {
      this.stop();
    } else {
      this.playNext();
    }
  }

  // ------------------------------------------------------------
  // Update button visual
  // ------------------------------------------------------------
  updateToggleVisual(active) {
    const toggle = document.getElementById("soundToggle");
    if (!toggle) return;

    if (active) {
      toggle.classList.add("cc-toggle-active");
    } else {
      toggle.classList.remove("cc-toggle-active");
    }
  }

  // ------------------------------------------------------------
  // Bind toggle button
  // ------------------------------------------------------------
  bindToggle() {
    const toggle = document.getElementById("soundToggle");
    if (!toggle) {
      console.warn("Sound toggle not found.");
      return;
    }
    toggle.addEventListener("click", () => this.toggle());
  }

  // ------------------------------------------------------------
  // Init
  // ------------------------------------------------------------
  init() {
    this.bindToggle();
  }
}

const soundEngine = new SoundEngine();
export default soundEngine;
