// ============================================================
// useSoundEngine — React hook for SoundEngine
// ============================================================

import { useEffect, useState, useCallback } from "react";
import soundEngine from "../sound/SoundEngine";

export function useSoundEngine(defaultTrack = "default") {
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    // Preload manifest on mount
    soundEngine.loadManifest();
  }, []);

  const toggleSound = useCallback(() => {
    soundEngine.toggle(defaultTrack);
    setIsMuted((prev) => !prev);
  }, [defaultTrack]);

  const stopSound = useCallback(() => {
    soundEngine.stop();
    setIsMuted(true);
  }, []);

  return {
    isMuted,
    toggleSound,
    stopSound,
  };
}
