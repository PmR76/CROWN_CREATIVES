(async function () {
  const manifestURL = "/assets/sounds/sound-manifest.json";
  const trackList = document.getElementById("tracks");
  const playButton = document.getElementById("play");

  let TRACKS = [];
  let audio = new Audio();

  try {
    const res = await fetch(manifestURL);
    const data = await res.json();

    // Support array format
    TRACKS = Array.isArray(data) ? data : data.sounds || [];

    TRACKS.forEach(name => {
      const div = document.createElement("div");
      div.className = "track";
      div.textContent = name;
      trackList.appendChild(div);
    });

  } catch (e) {
    trackList.innerHTML = "Sound manifest failed to load.";
    console.error(e);
  }

  playButton.addEventListener("click", () => {
    if (TRACKS.length === 0) return;

    const next = TRACKS[Math.floor(Math.random() * TRACKS.length)];
    audio.src = `/assets/sounds/${next}`;
    audio.play();
  });
})();
