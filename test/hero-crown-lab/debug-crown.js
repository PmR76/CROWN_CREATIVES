document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("hero-crown-container");
  const styles = getComputedStyle(el);

  console.log("HERO CROWN DEBUG:");
  console.log("position:", styles.position);
  console.log("top:", styles.top);
  console.log("left:", styles.left);
  console.log("transform:", styles.transform);
  console.log("margin-left:", styles.marginLeft);
  console.log("margin-right:", styles.marginRight);
});
