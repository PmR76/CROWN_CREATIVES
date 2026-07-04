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
        toggleFooterTextEdit();
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

    const glass = document.querySelector(".footer-glass");
    if (glass) {
      glass.dataset.adminDraggable = "true";
      glass.dataset.adminModule = "footer";
    }

    const backToTop = document.getElementById("back-to-top");
    if (backToTop) {
      backToTop.dataset.adminDraggable = "true";
      backToTop.dataset.adminModule = "footer";
    }

    loadSavedFooterText();
    loadSavedLayout();
  };

  mod.onDisable = () => {
    document.querySelectorAll("[data-admin-module='footer']")
      .forEach(el => {
        delete el.dataset.adminDraggable;
        delete el.dataset.adminModule;
      });

    disableFooterTextEdit();
  };

  /* ------------------------------------------------------------
     TEXT EDIT
  ------------------------------------------------------------ */
  let editingText = false;

  function toggleFooterTextEdit() {
    editingText ? disableFooterTextEdit() : enableFooterTextEdit();
  }

  function enableFooterTextEdit() {
    editingText = true;
    const copy = document.querySelector(".footer-copy");
    copy.contentEditable = "true";
    copy.style.outline = "2px dashed #4af";
  }

  function disableFooterTextEdit() {
    editingText = false;
    const copy = document.querySelector(".footer-copy");
    if (!copy) return;

    copy.contentEditable = "false";
    copy.style.outline = "none";

    localStorage.setItem("cc-footer-copy", copy.innerHTML);
  }

  function loadSavedFooterText() {
    const saved = localStorage.getItem("cc-footer-copy");
    if (!saved) return;

    const copy = document.querySelector(".footer-copy");
    if (copy) copy.innerHTML = saved;
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

        <button id="back-to-top" class="back-to-top" 
                data-admin-draggable="true" 
                data-admin-module="footer">▲</button>

        <div class="footer-copy">
          © 2026 Crown Creatives — All Rights Reserved<br>
          Royalty‑Free Music Provided by Pixabay
        </div>

      </div>
    `;

    loadSavedFooterText();
    loadSavedLayout();
  }

  /* ------------------------------------------------------------
     LOAD SAVED LAYOUT
  ------------------------------------------------------------ */
  function loadSavedLayout() {
    const saved = localStorage.getItem("cc-footer-layout");
    if (!saved) return;

    const layout = JSON.parse(saved);

    layout.forEach(item => {
      const el = document.querySelector(`.footer-icon[data-id="${item.id}"]`);
      if (!el) return;

      el.style.position = "absolute";
      el.style.left = item.left;
      el.style.top = item.top;
    });
  }

  /* ------------------------------------------------------------
     REGISTER MODULE
  ------------------------------------------------------------ */
  CC.adminModules.footer = mod;

})();
