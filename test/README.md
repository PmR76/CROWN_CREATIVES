# Crown Creatives – Lab Architecture

This directory contains **isolated labs** used to develop, test, and verify Crown Creatives components (HTML, CSS, JS, SVG) before they are considered stable for live use.

Each lab is **self-contained**, **traceable**, and **non-interfering** with production code.

---

## 1. Lab Folder Structure

Each lab folder (e.g. `cards-lab`, `hero-crown-lab`, `footer-lab`) follows this pattern:

```text
<lab-name>/
  <lab-name>.html      ← lab-only HTML (not index.html)
  <lab-name>.css       ← lab-only CSS
  <lab-name>.js        ← lab-only JS
  lab-harness.js       ← shared diagnostics harness
  /assets-under-test   ← Crown Creatives files being tested (index, css, js, svg, etc.)
