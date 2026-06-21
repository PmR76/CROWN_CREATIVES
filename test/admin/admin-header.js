/* ============================================================
   CROWN CREATIVES — ADMIN HEADER MODULE (Stub)
============================================================ */

(function () {

  const mod = {};

  mod.renderPanel = () => {
    CC.admin.panel.innerHTML = `
      <div class="cc-admin-header">Header Controls</div>

      <div class="cc-admin-section">
        <p>Header editing coming soon.</p>
      </div>

      <div class="cc-admin-section">
        <button data-panel="home">Back to Home</button>
      </div>
    `;
  };

  mod.onAction = () => {};
  mod.onEnable = () => {};
  mod.onDisable = () => {};
  mod.onDragEnd = () => {};

  CC.adminModules.header = mod;

})();
