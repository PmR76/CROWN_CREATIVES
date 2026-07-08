// ============================================================
// useSoundEngine.js — React Hook Wrapper for SoundEngine
// ============================================================

import { useEffect, useState } from "react";
import soundEngine from "../sound/SoundEngine.js";

export function useSoundEngine() {
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    // Initialise engine once
    soundEngine.init();

    // Start muted by default
    soundEngine.isMuted = true;

    return () => {
      soundEngine.stop();
    };
  }, []);

  const toggleSound = () => {
    const icon = document.querySelector(".sound-toggle-icon");

    soundEngine.toggle();
    const nowMuted = soundEngine.isMuted;

    if (!nowMuted) {
      icon?.classList.add("playing");
    } else {
      icon?.classList.remove("playing");
    }

    setIsMuted(nowMuted);
  };

  return { isMuted, toggleSound };
}
