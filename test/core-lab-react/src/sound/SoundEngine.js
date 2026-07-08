// ============================================================
// SoundEngine — Shared Manifest Loader for Both React Labs
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
  }

  async loadManifest() {
    try {
      const res = await fetch(this.manifestUrl);
      const data = await res.json();
      this.files = data.tracks.map(f => `/sounds/${f}`);
      return true;
    } catch {
      console.error("Sound manifest missing");
      return false;
    }
  }

  shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  buildPlaylist() {
    if (!this.files.length) return [];
    let list = this.shuffle(this.files);
    if (this.lastTrack && list[0] === this.lastTrack && list.length > 1) {
      [list[0], list[1]] = [list[1], list[0]];
    }
    this.pointer = 0;
    return list;
  }

  async playNext() {
    if (this.isMuted) return;

    if (!this.playlist.length) {
      await this.loadManifest();
      this.playlist = this.buildPlaylist();
    }

    const track = this.playlist[this.pointer];
    this.lastTrack = track;
    this.pointer = (this.pointer + 1) % this.playlist.length;

    if (!this.audio) {
      this.audio = new Audio(track);
      this.audio.addEventListener("ended", () => this.playNext());
    } else {
      this.audio.src = track;
    }

    this.audio.volume = 0.9;
    this.audio.play().catch(console.error);
  }

  toggle() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.audio?.pause();
    } else {
      this.playNext();
    }
  }
}

export default new SoundEngine();
