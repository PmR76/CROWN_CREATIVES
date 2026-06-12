/* ============================================================
   SOUND ENGINE v3.6 — Reactive + Manifest Mode
   Crown Creatives — Corrected + Updated
============================================================ */

const SoundEngine = {
    audio: null,
    enabled: false,
    sounds: [],
    manifestPath: "/assets/sounds/sound-manifest.json",
    reactiveInterval: null,
    firstInteractionUnlocked: false,

    async init() {
        // Restore saved state
        this.enabled = localStorage.getItem("soundEnabled") === "true";

        // Load sound list
        await this.loadManifest();

        // Prepare audio element
        this.audio = new Audio();
        this.audio.loop = true;
        this.audio.volume = 0;

        const toggle = document.getElementById("soundToggle");
        if (!toggle) return;

        // Unlock audio on first click (mobile + browser autoplay rules)
        document.body.addEventListener("click", () => {
            if (!this.firstInteractionUnlocked) {
                this.firstInteractionUnlocked = true;
                this.audio.play().catch(() => {});
            }
        }, { once: true });

        // Toggle button
        toggle.addEventListener("click", () => this.toggle());

        // Update icon state
        this.updateIcon();

        // Auto‑start if previously enabled
        if (this.enabled && this.sounds.length > 0) {
            this.playRandom();
            this.fadeIn();
            this.startReactiveMode();
        }
    },

    /* ------------------------------------------------------------
       Load manifest or fallback
    ------------------------------------------------------------ */
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

    /* ------------------------------------------------------------
       Pick a random track
    ------------------------------------------------------------ */
    playRandom() {
        if (this.sounds.length === 0) return;
        const pick = this.sounds[Math.floor(Math.random() * this.sounds.length)];
        this.audio.src = pick;
    },

    /* ------------------------------------------------------------
       Toggle sound on/off
    ------------------------------------------------------------ */
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

    /* ------------------------------------------------------------
       Update icon state
    ------------------------------------------------------------ */
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

    /* ------------------------------------------------------------
       Fade in audio
    ------------------------------------------------------------ */
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

    /* ------------------------------------------------------------
       Fade out audio
    ------------------------------------------------------------ */
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

    /* ------------------------------------------------------------
       Reactive pulsing animation
    ------------------------------------------------------------ */
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
