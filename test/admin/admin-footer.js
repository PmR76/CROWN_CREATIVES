/* ============================================================
   CROWN CREATIVES — ADMIN FOOTER MODULE
============================================================ */

(function () {

  const mod = {};

  /* ------------------------------------------------------------
     PANEL UI
  ------------------------------------------------------------ */
  mod.renderPanel = () => {
    CC.admin.panel.innerHTML = `
      <div class="cc-admin-header">Footer Controls</div>

      <div class="cc-admin-section">
        <button data-action="footer-edit-text">Edit Text</button>
        <button data-action="footer-restore">Restore Footer</button>
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
      case "footer-edit-text":
        enableFooterTextEdit();
        break;

      case "footer-restore":
        restoreFooter();
        break;
    }
  };

  /* ------------------------------------------------------------
     DRAG END SAVE
  ------------------------------------------------------------ */
  mod.onDragEnd = (el) => {
    if (!el.classList.contains("footer-icon")) return;

    const layout = [...document.querySelectorAll(".footer-icon")].map(icon => ({
      id: icon.dataset.id,
      left: icon.style.left,
      top: icon.style.top
    }));

    localStorage.setItem("cc-footer-layout", JSON.stringify(layout));
  };

  /* ------------------------------------------------------------
     ENABLE / DISABLE
  ------------------------------------------------------------ */
  mod.onEnable = () => {
    document.querySelectorAll(".footer-icon").forEach(icon => {
      icon.dataset.adminDraggable = "true";
      icon.dataset.adminModule = "footer";
    });

    document.querySelector(".footer-glass").dataset.adminDraggable = "true";
    document.querySelector(".footer-glass").dataset.adminModule = "footer";
  };

  mod.onDisable = () => {
    document.querySelectorAll("[data-admin-module='footer']")
      .forEach(el => {
        delete el.dataset.adminDraggable;
        delete el.dataset.adminModule;
      });
  };

  /* ------------------------------------------------------------
     TEXT EDIT
  ------------------------------------------------------------ */
  function enableFooterTextEdit() {
    const copy = document.querySelector(".footer-copy");
    copy.contentEditable = "true";
    copy.style.outline = "2px dashed #4af";
  }

  /* ------------------------------------------------------------
     RESTORE FOOTER
  ------------------------------------------------------------ */
  function restoreFooter() {
    const footer = document.getElementById("cc-footer");
    footer.innerHTML = `
      <div class="footer-glass" data-admin-draggable="true" data-admin-module="footer">
        <div class="footer-icons" id="footer-icons">
          <img src="../assets/icons/facebook-magic.svg" class="footer-icon" data-id="facebook" data-admin-draggable="true" data-admin-module="footer">
          <img src="../assets/icons/instagram-magic.svg" class="footer-icon" data-id="instagram" data-admin-draggable="true" data-admin-module="footer">
          <img src="../assets/icons/email-magic.svg" class="footer-icon" data-id="email" data-admin-draggable="true" data-admin-module="footer">
          <img src="../assets/icons/copilot-magic.svg" class="footer-icon" data-id="copilot" data-admin-draggable="true" data-admin-module="footer">
        </div>
        <button id="back-to-top" class="back-to-top">▲</button>
        <div class="footer-copy">
          © 2026 Crown Creatives — All Rights Reserved<br>
          Royalty‑Free Music Provided by Pixabay
        </div>
      </div>
    `;
  }

  /* ------------------------------------------------------------
     REGISTER MODULE
  ------------------------------------------------------------ */
  CC.adminModules.footer = mod;

})();
