import { useEffect, useState } from "react";
import soundEngine from "../sound/SoundEngine.js";

export function useSoundEngine() {
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    soundEngine.isMuted = true;
    return () => soundEngine.audio?.pause();
  }, []);

  const toggleSound = () => {
    soundEngine.toggle();
    setIsMuted(soundEngine.isMuted);
  };

  return { isMuted, toggleSound };
}
