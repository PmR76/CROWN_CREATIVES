// ============================================================
// useSoundEngine.js — Final Non-Conflicting Music Engine
// ============================================================

import { useEffect, useRef, useState } from "react";

export function useSoundEngine() {
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true); // start muted

  useEffect(() => {
    // Create audio instance
    const audio = new Audio("/assets/audio/crown-theme.mp3");
    audio.loop = true;
    audio.volume = 0.6;
    audio.muted = true; // start muted

    audioRef.current = audio;

    // Attempt autoplay after first user gesture
    const unlockAudio = () => {
      audioRef.current
        ?.play()
        .catch(() => {
          // Autoplay blocked — user will toggle manually
        });
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

    if (isMuted) {
      audio.muted = false;
      audio.play().catch(() => {});
      setIsMuted(false);
    } else {
      audio.muted = true;
      setIsMuted(true);
    }
  };

  return { isMuted, toggleSound };
}
