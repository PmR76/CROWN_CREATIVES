// ============================================================
// useSoundEngine — React Hook Unified with SoundEngine
// ============================================================

import { useState } from "react";
import soundEngine from "../sound/SoundEngine";

export function useSoundEngine() {
  const [isMuted, setMuted] = useState(true);

  const toggleSound = () => {
    soundEngine.toggle();
    setMuted(soundEngine.isMuted);
  };

  return { isMuted, toggleSound };
}
