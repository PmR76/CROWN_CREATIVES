/* ============================================================
   CROWN CREATIVES — ADMIN TICKER MODULE
============================================================ */

(function () {

  const mod = {};
  let editing = false;
  let speedMode = false;

  const container = document.getElementById("ticker-container");
  const text = document.getElementById("ticker-text");

  /* ------------------------------------------------------------
     PANEL UI
  ------------------------------------------------------------ */
  mod.renderPanel = () => {
    CC.admin.panel.innerHTML = `
      <div class="cc-admin-header">Ticker Controls</div>

      <div class="cc-admin-section">
        <button data-action="ticker-edit">Edit Ticker</button>
        <button data-action="ticker-speed">Adjust Speed</button>
        <button data-action="ticker-reset">Reset Ticker</button>
      </div>

      <div class="cc-admin-section">
        <button data-panel="home">Back to Home</button>
      </div>
    `;
  };

  /* ------------------------------------------------------------
     ACTION HANDLER
  ------------------------------------------------------------ */
  mod.onAction = (action) => {
    switch (action) {
      case "ticker-edit":
        toggleEdit();
        break;

      case "ticker-speed":
        toggleSpeedMode();
        break;

      case "ticker-reset":
        resetTicker();
        break;
    }
  };

  /* ------------------------------------------------------------
     DRAG END SAVE
  ------------------------------------------------------------ */
  mod.onDragEnd = () => {
    const pos = {
      left: container.style.left,
      top: container.style.top
    };
    localStorage.setItem("cc-ticker-pos", JSON.stringify(pos));
  };

  /* ------------------------------------------------------------
     ENABLE / DISABLE
  ------------------------------------------------------------ */
  mod.onEnable = () => {
    container.dataset.adminDraggable = "true";
    container.dataset.adminModule = "ticker";
  };

  mod.onDisable = () => {
    delete container.dataset.adminDraggable;
    delete container.dataset.adminModule;

    if (editing) disableEdit();
    if (speedMode) disableSpeedMode();
  };

  /* ------------------------------------------------------------
     EDIT MODE
  ------------------------------------------------------------ */
  function toggleEdit() {
    editing ? disableEdit() : enableEdit();
  }

  function enableEdit() {
    editing = true;
    text.contentEditable = "true";
    text.classList.add("ticker-glow");
    text.style.animationPlayState = "paused";
  }

  function disableEdit() {
    editing = false;
    text.contentEditable = "false";
    text.classList.remove("ticker-glow");
    text.style.animationPlayState = "running";
    localStorage.setItem("cc-ticker-text", text.innerText);
  }

  /* Load saved text */
  const savedText = localStorage.getItem("cc-ticker-text");
  if (savedText) text.innerText = savedText;

  /* ------------------------------------------------------------
     SPEED MODE
  ------------------------------------------------------------ */
  let speed = parseInt(localStorage.getItem("cc-ticker-speed") || "18", 10);

  function applySpeed() {
    text.style.animationDuration = `${speed}s`;
  }

  applySpeed();

  function toggleSpeedMode() {
    speedMode ? disableSpeedMode() : enableSpeedMode();
  }

  function enableSpeedMode() {
    speedMode = true;
    document.body.classList.add("ticker-speed-mode");
  }

  function disableSpeedMode() {
    speedMode = false;
    document.body.classList.remove("ticker-speed-mode");
  }

  document.addEventListener("wheel", (e) => {
    if (!speedMode) return;

    if (e.deltaY < 0) speed = Math.max(6, speed - 1);
    if (e.deltaY > 0) speed = Math.min(40, speed + 1);

    localStorage.setItem("cc-ticker-speed", speed);
    applySpeed();
  });

  /* ------------------------------------------------------------
     RESET
  ------------------------------------------------------------ */
  function resetTicker() {
    text.innerText = "Welcome to Crown Creatives — Creativity Without Limits.";
    localStorage.removeItem("cc-ticker-text");

    speed = 18;
    localStorage.removeItem("cc-ticker-speed");
    applySpeed();

    container.style.left = "";
    container.style.top = "";
    localStorage.removeItem("cc-ticker-pos");
  }

  /* ------------------------------------------------------------
     REGISTER MODULE
  ------------------------------------------------------------ */
  CC.adminModules.ticker = mod;

})();
