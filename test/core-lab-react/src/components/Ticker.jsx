import { useEffect } from "react";
import "../styles/core.css";

export default function Ticker() {
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
  <span>CREATIVITY IS COURAGE • IMAGINATION IS POWER • ART IS FREEDOM •</span>
  <span>CREATIVITY IS COURAGE • IMAGINATION IS POWER • ART IS FREEDOM •</span>
  <span>CREATIVITY IS COURAGE • IMAGINATION IS POWER • ART IS FREEDOM •</span>

</div>

    </div>
  );
}
