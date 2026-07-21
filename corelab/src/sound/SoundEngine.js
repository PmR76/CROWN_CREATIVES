// ============================================================
// SoundEngine.js — Global Audio Runtime (GR1 Stable)
// ============================================================

class SoundEngine {
  constructor() {
    this.manifestUrl = "/manifests/sound-manifest.json";

    this.files = [];
    this.playlist = [];
    this.pointer = 0;
    this.lastTrack = null;

    this.audio = null;
    this.isMuted = true;

    // Prevent autoplay violations
    this._unlockAttempted = false;
  }

  // ------------------------------------------------------------
  // LOAD MANIFEST SAFELY
  // ------------------------------------------------------------
  async loadManifest() {
    try {
      const res = await fetch(this.manifestUrl);
      if (!res.ok) throw new Error("Manifest fetch failed");

      const data = await res.json();

      if (!Array.isArray(data.tracks)) throw new Error("Invalid manifest");

      this.files = data.tracks.map(f => `/sounds/${f}`);
      return true;
    } catch (err) {
      console.error("Sound manifest missing or invalid:", err);
      this.files = [];
      return false;
    }
  }

  // ------------------------------------------------------------
  // SHUFFLE PLAYLIST
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
  // BUILD PLAYLIST SAFELY
  // ------------------------------------------------------------
  buildPlaylist() {
    if (!this.files.length) return [];

    let list = this.shuffle(this.files);

    if (this.lastTrack && list[0] === this.lastTrack && list.length > 1) {
      [list[0], list[1]] = [list[1], list[0]];
    }

    this.pointer = 0;
    return list;
  }

  // ------------------------------------------------------------
  // PLAY NEXT TRACK SAFELY
  // ------------------------------------------------------------
  async playNext() {
    if (this.isMuted) return;

    try {
      // Load manifest if needed
      if (!this.playlist.length) {
        const ok = await this.loadManifest();
        if (!ok) return;

        this.playlist = this.buildPlaylist();
        if (!this.playlist.length) return;
      }

      const track = this.playlist[this.pointer];
      this.lastTrack = track;

      this.pointer = (this.pointer + 1) % this.playlist.length;

      // Create audio element if needed
      if (!this.audio) {
        this.audio = new Audio(track);

        this.audio.addEventListener("ended", () => {
          try {
            this.playNext();
          } catch (err) {
            console.warn("playNext failed:", err);
          }
        });
      } else {
        this.audio.src = track;
      }

      this.audio.volume = 0.9;

      // Attempt playback safely
      this.audio.play().catch(err => {
        console.warn("Audio playback blocked:", err);
      });
    } catch (err) {
      console.warn("SoundEngine playNext failed:", err);
    }
  }

  // ------------------------------------------------------------
  // TOGGLE SOUND SAFELY
  // ------------------------------------------------------------
  toggle() {
    try {
      this.isMuted = !this.isMuted;

      if (this.isMuted) {
        this.audio?.pause();
      } else {
        this.playNext();
      }
    } catch (err) {
      console.warn("SoundEngine toggle failed:", err);
    }
  }
}

export default new SoundEngine();
