// ============================================================
// SoundEngine — Crown Creatives
// Central audio manager using sound-manifest.json
// ============================================================

class SoundEngine {
  constructor() {
    this.manifest = null;
    this.tracks = {};
    this.isMuted = false;
    this.currentTrack = null;
    this.manifestUrl = "/assets/sounds/sound-manifest.json";
  }

  async loadManifest() {
    if (this.manifest) return this.manifest;

    try {
      const res = await fetch(this.manifestUrl);
      if (!res.ok) throw new Error(`Manifest load failed: ${res.status}`);
      this.manifest = await res.json();

      // Pre-create Audio objects
      Object.entries(this.manifest.tracks || {}).forEach(([key, file]) => {
        const audio = new Audio(`/assets/sounds/${file}`);
        audio.preload = "auto";
        this.tracks[key] = audio;
      });

      return this.manifest;
    } catch (err) {
      console.error("[SoundEngine] Failed to load manifest:", err);
      this.manifest = { tracks: {} };
      return this.manifest;
    }
  }

  async play(trackKey) {
    await this.loadManifest();

    if (this.isMuted) return;

    const audio = this.tracks[trackKey];
    if (!audio) {
      console.warn(`[SoundEngine] Track not found: ${trackKey}`);
      return;
    }

    // Stop current track
    if (this.currentTrack && this.currentTrack !== audio) {
      this.currentTrack.pause();
      this.currentTrack.currentTime = 0;
    }

    this.currentTrack = audio;
    this.currentTrack.volume = 0.9;
    this.currentTrack.loop = true;

    try {
      await this.currentTrack.play();
    } catch (err) {
      console.error("[SoundEngine] Play error:", err);
    }
  }

  stop() {
    if (this.currentTrack) {
      this.currentTrack.pause();
      this.currentTrack.currentTime = 0;
      this.currentTrack = null;
    }
  }

  mute() {
    this.isMuted = true;
    this.stop();
  }

  unmute() {
    this.isMuted = false;
  }

  toggle(trackKey = "default") {
    if (this.isMuted) {
      this.unmute();
      this.play(trackKey);
    } else {
      this.mute();
    }
  }
}

const soundEngine = new SoundEngine();
export default soundEngine;
