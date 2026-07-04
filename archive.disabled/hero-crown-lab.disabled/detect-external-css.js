document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("hero-crown-container");
  const styles = getComputedStyle(el);

  console.log("=== HERO CROWN EXTERNAL CSS DETECTOR ===");

  const props = [
    "position",
    "top",
    "left",
    "right",
    "bottom",
    "margin",
    "padding",
    "transform",
    "translate",
    "scale",
    "rotate",
    "display",
    "zIndex",
    "pointerEvents"
  ];

  props.forEach(prop => {
    console.log(prop + ":", styles[prop]);
  });

  console.log("=== COMPUTED BOUNDING BOX ===");
  console.log(el.getBoundingClientRect());
});
