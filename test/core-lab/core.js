document.addEventListener("DOMContentLoaded", () => {
  const health   = document.getElementById("lab-health");
  const htmlEl   = document.getElementById("lab-html");
  const cssEl    = document.getElementById("lab-css");
  const jsEl     = document.getElementById("lab-js");
  const tickerEl = document.getElementById("lab-ticker");
  const footerEl = document.getElementById("lab-footer");

  const hasTickerHtml  = !!document.querySelector(".ticker-track");
  const hasFooterHtml  = !!document.getElementById("cc-footer");

  const styles  = [...document.querySelectorAll("link[rel='stylesheet']")].map(l => l.href);
  const scripts = [...document.querySelectorAll("script")].map(s => s.src);

  const coreCssOk    = styles.some(href => href.includes("core.css"));
  const tickerCssOk  = styles.some(href => href.includes("ticker-lab/ticker.css"));
  const footerCssOk  = styles.some(href => href.includes("footer-lab/footer.css"));

  const coreJsOk     = scripts.some(src => src.includes("core.js"));
  const tickerJsOk   = scripts.some(src => src.includes("ticker-lab/ticker.js"));
  const footerJsOk   = scripts.some(src => src.includes("footer-lab/footer.js"));

  if (health) {
    const clean = coreCssOk && coreJsOk;
    health.textContent = `LAB HEALTH: ${clean ? "✓ Clean" : "⚠ Check imports"}`;
  }

  if (htmlEl) {
    htmlEl.textContent = `HTML: ticker=${hasTickerHtml ? "✓" : "✗"}, footer=${hasFooterHtml ? "✓" : "✗"}`;
  }

  if (cssEl) {
    cssEl.textContent = `CSS: core=${coreCssOk ? "✓" : "✗"}, ticker=${tickerCssOk ? "✓" : "✗"}, footer=${footerCssOk ? "✓" : "✗"}`;
  }

  if (jsEl) {
    jsEl.textContent = `JS: core=${coreJsOk ? "✓" : "✗"}, ticker=${tickerJsOk ? "✓" : "✗"}, footer=${footerJsOk ? "✓" : "✗"}`;
  }

  if (tickerEl) {
    tickerEl.textContent = `Ticker: HTML=${hasTickerHtml ? "✓" : "✗"}, CSS=${tickerCssOk ? "✓" : "✗"}, JS=${tickerJsOk ? "✓" : "✗"}`;
  }

  if (footerEl) {
    footerEl.textContent = `Footer: HTML=${hasFooterHtml ? "✓" : "✗"}, CSS=${footerCssOk ? "✓" : "✗"}, JS=${footerJsOk ? "✓" : "✗"}`;
  }
});
