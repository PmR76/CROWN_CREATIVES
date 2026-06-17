// ADMIN-ONLY DRAGGABLE THEME TOGGLE
(function() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  // Only enable dragging for admin
  const isAdmin = true; // later we can tie this to login
  if (!isAdmin) return;

  let offsetX = 0;
  let offsetY = 0;
  let dragging = false;

  toggle.addEventListener('mousedown', (e) => {
    dragging = true;
    offsetX = e.clientX - toggle.offsetLeft;
    offsetY = e.clientY - toggle.offsetTop;
    toggle.style.transition = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    toggle.style.position = 'fixed';
    toggle.style.left = `${e.clientX - offsetX}px`;
    toggle.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener('mouseup', () => {
    if (dragging) {
      dragging = false;
      toggle.style.transition = '';
      localStorage.setItem('themeTogglePosition', JSON.stringify({
        left: toggle.style.left,
        top: toggle.style.top
      }));
    }
  });

  // Restore saved position
  const saved = localStorage.getItem('themeTogglePosition');
  if (saved) {
    const pos = JSON.parse(saved);
    toggle.style.position = 'fixed';
    toggle.style.left = pos.left;
    toggle.style.top = pos.top;
  }
})();
// ADMIN-ONLY RESIZE
toggle.addEventListener('wheel', (e) => {
  if (!isAdmin) return;

  e.preventDefault();
  let size = parseInt(toggle.style.width || 38);

  size += e.deltaY < 0 ? 2 : -2;
  size = Math.max(24, Math.min(80, size));

  toggle.style.width = `${size}px`;
  toggle.style.height = `${size}px`;

  localStorage.setItem('themeToggleSize', size);
});

// Restore size
const savedSize = localStorage.getItem('themeToggleSize');
if (savedSize) {
  toggle.style.width = `${savedSize}px`;
  toggle.style.height = `${savedSize}px`;
}
