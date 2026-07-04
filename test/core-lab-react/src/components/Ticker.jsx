import { useEffect } from "react";
import "../styles/ticker.css";

export default function Ticker() {
  const message = "CREATIVITY IS COURAGE • IMAGINATION IS POWER • ART IS FREEDOM •CREATIVITY IS COURAGE • IMAGINATION IS POWER • ART IS FREEDOM •";

  useEffect(() => {
    const track = document.querySelector('.ticker-track');
    if (!track) return;

    const anim = track.getAnimations()[0];

    setInterval(() => {
      console.log({
        currentTime: anim?.currentTime,
        playState: anim?.playState,
        duration: anim?.effect?.getComputedTiming()?.duration,
        transform: getComputedStyle(track).transform,
        width: track.scrollWidth,
        parentWidth: track.parentElement.offsetWidth
      });
    }, 1000);
  }, []);

  return (
    <div className="ticker">
      <div className="ticker-track">
        {/* Track A */}
        <span>{message}</span>
        <span>{message}</span>
        <span>{message}</span>

        {/* Track B (duplicate for seamless loop) */}
        <span>{message}</span>
        <span>{message}</span>
        <span>{message}</span>
      </div>
    </div>
  );
}
