// ============================================================
// useSoundEngine.js — Final Working Version + Reactive Glow
// ============================================================

import { useEffect, useRef, useState } from "react";

export function useSoundEngine() {
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const audio = new Audio("/assets/audio/crown-theme.mp3");
    audio.loop = true;
    audio.volume = 0.6;
    audio.muted = true;

    audioRef.current = audio;

    // Unlock audio on first user gesture
    const unlockAudio = () => {
      audioRef.current?.play().catch(() => {});
    };

    window.addEventListener("click", unlockAudio, { once: true });

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const toggleSound = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const icon = document.querySelector(".sound-toggle-icon");

    if (isMuted) {
      audio.muted = false;
      audio.play().catch(() => {});
      icon?.classList.add("playing");
      setIsMuted(false);
    } else {
      audio.muted = true;
      icon?.classList.remove("playing");
      setIsMuted(true);
    }
  };

  return { isMuted, toggleSound };
}
