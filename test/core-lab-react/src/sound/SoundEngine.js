// ============================================================
// SoundEngine — Crown Creatives Random Playback Engine
// ============================================================

class SoundEngine {
  constructor() {
    this.manifest = null;
    this.tracks = {};
    this.isMuted = true;
    this.currentTrack = null;
    this.manifestUrl = "/assets/sounds/sound-manifest.json";
  }

  async loadManifest() {
    if (this.manifest) return this.manifest;

    const res = await fetch(this.manifestUrl);
    this.manifest = await res.json();

    Object.entries(this.manifest.tracks).forEach(([key, file]) => {
      const audio = new Audio(`/assets/sounds/${file}`);
      audio.preload = "auto";
      audio.loop = true;
      this.tracks[key] = audio;
    });

    return this.manifest;
  }

  getRandomTrackKey() {
    const keys = Object.keys(this.tracks);
    return keys[Math.floor(Math.random() * keys.length)];
  }

  async playRandom() {
    await this.loadManifest();
    if (this.isMuted) return;

    const key = this.getRandomTrackKey();
    const audio = this.tracks[key];

    if (this.currentTrack) {
      this.currentTrack.pause();
      this.currentTrack.currentTime = 0;
    }

    this.currentTrack = audio;
    this.currentTrack.volume = 0.9;

    try {
      await this.currentTrack.play();
    } catch (err) {
      console.error("SoundEngine play error:", err);
    }
  }

  toggle() {
    this.isMuted = !this.isMuted;

    if (this.isMuted) {
      if (this.currentTrack) {
        this.currentTrack.pause();
        this.currentTrack.currentTime = 0;
      }
    } else {
      this.playRandom();
    }
  }
}

const soundEngine = new SoundEngine();
export default soundEngine;
