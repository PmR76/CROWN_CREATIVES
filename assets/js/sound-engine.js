/* ============================================================
   SOUND ENGINE v1 — Calming Ambient Audio
   Crown Creatives
============================================================ */

const SoundEngine = {
    audio: null,
    enabled: false,
    sounds: [
        "/assets/sounds/forest.mp3",
        "/assets/sounds/soft-wind.mp3",
        "/assets/sounds/stream.mp3",
        "/assets/sounds/soft-rain.mp3"
    ],

    init() {
        // Load saved state
        this.enabled = localStorage.getItem("soundEnabled") === "true";

        // Prepare audio element
        this.audio = new Audio();
        this.audio.loop = true;
        this.audio.volume = 0;

        // Pick a random calming sound
        this.audio.src = this.sounds[Math.floor(Math.random() * this.sounds.length)];

        // If previously enabled, fade in
        if (this.enabled) {
            this.fadeIn();
        }

        // Bind toggle button
        const toggle = document.getElementById("soundToggle");
        if (toggle) {
            toggle.addEventListener("click", () => this.toggle());
        }
    },

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem("soundEnabled", this.enabled);

        if (this.enabled) {
            this.fadeIn();
        } else {
            this.fadeOut();
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
    }
};

window.addEventListener("DOMContentLoaded", () => SoundEngine.init());
