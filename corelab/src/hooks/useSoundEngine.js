// ============================================================
// useSoundEngine.js — Unified Audio Hook (GR1 Stable)
// ============================================================

import { useEffect, useState } from "react";
import soundEngine from "../sound/SoundEngine.js";

export function useSoundEngine() {
  const [isMuted, setIsMuted] = useState(true);

  // ------------------------------------------------------------
  // INITIALISE SOUND ENGINE SAFELY
  // ------------------------------------------------------------
  useEffect(() => {
    try {
      // Ensure engine starts muted to avoid autoplay violations
      soundEngine.isMuted = true;

      // Attempt to unlock audio on first user gesture
      const unlock = () => {
        try {
          soundEngine.audio?.play().catch(() => {});
        } catch {}
      };

      window.addEventListener("click", unlock, { once: true });

      return () => {
        window.removeEventListener("click", unlock);
        soundEngine.audio?.pause();
      };
    } catch {
      // Prevent runtime crash if engine fails
      console.warn("SoundEngine failed to initialise.");
    }
  }, []);

  // ------------------------------------------------------------
  // TOGGLE SOUND SAFELY
  // ------------------------------------------------------------
  const toggleSound = () => {
    try {
      soundEngine.toggle();
      setIsMuted(soundEngine.isMuted);
    } catch {
      console.warn("SoundEngine toggle failed.");
    }
  };

  return { isMuted, toggleSound };
}
