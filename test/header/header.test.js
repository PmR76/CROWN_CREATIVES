// Load the header HTML into the test root
fetch("header.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("header-test-root").innerHTML = html;
    runHeaderDiagnostics();
  })
  .catch(err => console.error("Header load failed:", err));


// ------------------------------------------------------------
// HEADER DIAGNOSTICS
// ------------------------------------------------------------
function runHeaderDiagnostics() {
  const results = [];

  function check(name, testFn) {
    try {
      results.push({ name, ok: testFn() });
    } catch {
      results.push({ name, ok: false });
    }
  }

  check("Header exists", () =>
    document.querySelector("header") !== null
  );

  check("Crown icon present", () =>
    document.querySelector(".crown-logo, .header-crown") !== null
  );

  check("Theme toggle exists", () =>
    document.getElementById("themeToggle") !== null
  );

  check("Navigation exists", () =>
    document.querySelector("nav") !== null
  );

  console.table(results);
}
