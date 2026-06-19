/* =========================================
   GLOBAL ADMIN MODE CONTROLLER
   ========================================= */

window.CC = window.CC || {};
CC.admin = {
  active: false,
  toggle() {
    this.active = !this.active;
    document.body.classList.toggle("admin-active", this.active);
  }
};

/* SHIFT + A toggles admin mode */
document.addEventListener("keydown", (e) => {
  if (e.shiftKey && e.key.toLowerCase() === "a") {
    CC.admin.toggle();
  }
});
