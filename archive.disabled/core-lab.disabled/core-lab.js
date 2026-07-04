// Auto‑timestamp core-lab
(function () {
  const ts = document.createElement("div");
  ts.style.position = "fixed";
  ts.style.bottom = "10px";
  ts.style.left = "10px";
  ts.style.background = "rgba(0,0,0,0.7)";
  ts.style.color = "#b0ffb0";
  ts.style.padding = "6px 8px";
  ts.style.fontFamily = "monospace";
  ts.style.fontSize = "11px";
  ts.style.borderRadius = "6px";
  ts.style.zIndex = 9999;
  ts.textContent = `Core Lab refreshed: ${new Date().toLocaleString()}`;
  document.body.appendChild(ts);
})();
