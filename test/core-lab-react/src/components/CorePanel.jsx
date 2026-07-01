import { useDiagnostics } from "../hooks/useDiagnostics";

export default function CorePanel() {
  const diag = useDiagnostics();

  return (
    <div className="core-panel">
      <div className="lab-header">CORE‑LAB PANEL</div>

      <div>LAB HEALTH: {diag.health}</div>
      <div>Cards: {diag.cards}</div>
      <div>Ticker: {diag.ticker}</div>
      <div>Footer: {diag.footer}</div>
      <div>FPS: {diag.fps}</div>
      <div>Errors: {diag.errors.length}</div>
    </div>
  );
}
