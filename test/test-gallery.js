(async function () {
  const manifestURL = "/assets/images/gallery/manifest.json";
  const container = document.getElementById("gallery");

  try {
    const res = await fetch(manifestURL);
    const data = await res.json();

    data.forEach(name => {
      const img = document.createElement("img");
      img.src = `/assets/images/gallery/${name}`;
      container.appendChild(img);
    });

  } catch (e) {
    container.innerHTML = "Gallery manifest failed to load.";
    console.error(e);
  }
})();
