// ============================================================
// UIConflictsPanel.jsx — Sentinel v2.0 UI Conflict Viewer
// ============================================================

import { useEffect, useState } from "react";
import "../styles/sentinel-panels.css";

export default function UIConflictsPanel() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5175/sentinel/ui-conflicts")
      .then(res => res.json())
      .then(json => setData(json))
      .catch(() => setData({ error: true }));
  }, []);

  if (!data) return <div className="sentinel-panel loading">Loading...</div>;

  if (data.error) {
    return (
      <div className="sentinel-panel status-red">
        <h2>UI Conflicts</h2>
        <p>Error loading UI conflict data.</p>
      </div>
    );
  }

  const { legacyActive, labActive, coreActive, cssConflicts, componentConflicts } = data;

  return (
    <div className="sentinel-panel">
      <h2>UI Conflicts</h2>

      <div className="row">
        <span>Legacy Active:</span>
        <strong>{legacyActive.length}</strong>
      </div>

      <div className="row">
        <span>Lab Active:</span>
        <strong>{labActive.length}</strong>
      </div>

      <div className="row">
        <span>Core Active:</span>
        <strong>{coreActive.length}</strong>
      </div>

      <div className="row">
        <span>CSS Conflicts:</span>
        <strong>{cssConflicts.length}</strong>
      </div>

      <div className="row">
        <span>Component Conflicts:</span>
        <strong>{componentConflicts.length}</strong>
      </div>

      {/* Detailed lists */}
      {legacyActive.length > 0 && (
        <div className="detail-block">
          <h3>Legacy Active</h3>
          {legacyActive.map((item, i) => (
            <div className="row" key={i}>{item}</div>
          ))}
        </div>
      )}

      {labActive.length > 0 && (
        <div className="detail-block">
          <h3>Lab Active</h3>
          {labActive.map((item, i) => (
            <div className="row" key={i}>{item}</div>
          ))}
        </div>
      )}

      {cssConflicts.length > 0 && (
        <div className="detail-block">
          <h3>CSS Conflicts</h3>
          {cssConflicts.map((item, i) => (
            <div className="row" key={i}>{item}</div>
          ))}
        </div>
      )}

      {componentConflicts.length > 0 && (
        <div className="detail-block">
          <h3>Component Conflicts</h3>
          {componentConflicts.map((item, i) => (
            <div className="row" key={i}>{item}</div>
          ))}
        </div>
      )}
    </div>
  );
}
