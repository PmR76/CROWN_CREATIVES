// ============================================================
// useSoundEngine.js — Non-Conflicting Music Engine
// ============================================================

import { useEffect, useRef, useState } from "react";

export function useSoundEngine() {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio("/assets/audio/crown-theme.mp3");
    audio.loop = true;
    audio.volume = 0.6;
    audioRef.current = audio;

    // Autoplay attempt (user gesture usually required)
    const tryPlay = () => {
      audioRef.current
        ?.play()
        .catch(() => {
          // Ignore autoplay errors; user will trigger via toggle
        });
    };

    // Optional: start on first click anywhere
    window.addEventListener("click", tryPlay, { once: true });

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const toggleSound = () => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.muted = false;
      audioRef.current.play().catch(() => {});
      setIsMuted(false);
    } else {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  return { isMuted, toggleSound };
}
