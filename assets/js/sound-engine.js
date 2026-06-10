/* ============================================================
   SOUND ENGINE v3.5 — Reactive + Manifest Mode
   Crown Creatives
============================================================ */

const SoundEngine = {
    audio: null,
    enabled: false,
    sounds: [],
    manifestPath: "/assets/sounds/sound-manifest.json",
    reactiveInterval: null,

    async init() {
        this.enabled = localStorage.getItem("soundEnabled") === "true";

        await this.loadManifest();

        this.audio = new Audio();
        this.audio.loop = true;
        this.audio.volume = 0;

        const toggle = document.getElementById("soundToggle");
        if (!toggle) return;

        toggle.addEventListener("click", () => this.toggle());

        this.updateIcon();

        if (this.enabled && this.sounds.length > 0) {
            this.playRandom();
            this.fadeIn();
            this.startReactiveMode();
        }
    },

    async loadManifest() {
        try {
            const res = await fetch(this.manifestPath, { cache: "no-store" });
            if (!res.ok) throw new Error("Manifest not found");
            const data = await res.json();
            this.sounds = (data.sounds || []).map(name => `/assets/sounds/${name}`);
        } catch (e) {
            console.warn("Sound manifest load failed, using fallback.", e);
            this.sounds = [
                "/assets/sounds/forest.mp3",
                "/assets/sounds/soft-wind.mp3",
                "/assets/sounds/stream.mp3",
                "/assets/sounds/soft-rain.mp3"
            ];
        }
    },

    playRandom() {
        if (this.sounds.length === 0) return;
        const pick = this.sounds[Math.floor(Math.random() * this.sounds.length)];
        this.audio.src = pick;
    },

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem("soundEnabled", this.enabled);

        this.updateIcon();

        if (this.enabled) {
            this.playRandom();
            this.fadeIn();
            this.startReactiveMode();
        } else {
            this.fadeOut();
            this.stopReactiveMode();
        }
    },

    updateIcon() {
        const toggle = document.getElementById("soundToggle");
        if (!toggle) return;

        toggle.classList.remove("sound-on", "sound-off", "sound-reactive");

        if (this.enabled) {
            toggle.classList.add("sound-on");
        } else {
            toggle.classList.add("sound-off");
        }
    },

    fadeIn() {
        this.audio.volume = 0;
        this.audio.muted = true;

        this.audio.play().then(() => {
            this.audio.muted = false;
            let vol = 0;

            const fade = setInterval(() => {
                if (vol < 0.5) {
                    vol += 0.02;
                    this.audio.volume = vol;
                } else {
                    clearInterval(fade);
                }
            }, 120);
        }).catch(err => {
            console.warn("Autoplay blocked until user interacts.", err);
        });
    },

    fadeOut() {
        let vol = this.audio.volume;

        const fade = setInterval(() => {
            if (vol > 0) {
                vol -= 0.02;
                this.audio.volume = vol;
            } else {
                clearInterval(fade);
                this.audio.pause();
            }
        }, 120);
    },

    startReactiveMode() {
        const toggle = document.getElementById("soundToggle");
        if (!toggle) return;

        toggle.classList.add("sound-reactive");

        this.reactiveInterval = setInterval(() => {
            const level = this.audio.volume || 0;
            toggle.style.transform = `scale(${1 + level * 0.1})`;
        }, 120);
    },

    stopReactiveMode() {
        const toggle = document.getElementById("soundToggle");
        if (!toggle) return;

        toggle.classList.remove("sound-reactive");
        toggle.style.transform = "scale(1)";

        if (this.reactiveInterval) {
            clearInterval(this.reactiveInterval);
            this.reactiveInterval = null;
        }
    }
};

window.addEventListener("DOMContentLoaded", () => SoundEngine.init());
