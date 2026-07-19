import React from "react";
import useSentinelManifestScanner from "../hooks/useSentinelManifestScanner";

export default function SentinelPanel() {
  const results = useSentinelManifestScanner();

  if (!results) {
    return (
      <div className="sentinel-panel">
        <h2>Sentinel Diagnostics</h2>
        <p>Running scan…</p>
      </div>
    );
  }

  return (
    <div className="sentinel-panel">
      <h2>Sentinel Diagnostics</h2>

      {results.map(lab => (
        <div key={lab.lab} className="sentinel-lab">
          <h3>{lab.lab}</h3>

          <div className="sentinel-section">
            <h4>Folders</h4>
            {Object.entries(lab.folders).map(([key, value]) => (
              <p key={key} className={value === "OK" ? "ok" : "missing"}>
                {key}: {value}
              </p>
            ))}
          </div>

          <div className="sentinel-section">
            <h4>Manifests</h4>
            {Object.entries(lab.manifests).map(([key, value]) => (
              <p key={key} className={value === "OK" ? "ok" : "missing"}>
                {key}: {value}
              </p>
            ))}
          </div>

          <div className="sentinel-section">
            <h4>Sound Files</h4>
            <p className={lab.soundFiles === "None" ? "missing" : "ok"}>
              {lab.soundFiles === "None"
                ? "None"
                : `${lab.soundFiles.length} files`}
            </p>
          </div>

          <div className="sentinel-section">
            <h4>Gallery Files</h4>
            <p className={lab.galleryFiles === "None" ? "missing" : "ok"}>
              {lab.galleryFiles === "None"
                ? "None"
                : `${lab.galleryFiles.length} files`}
            </p>
          </div>

          <div className="sentinel-section">
            <h4>Manifest Mismatch</h4>
            {Object.entries(lab.manifestMismatch).map(([key, value]) => (
              <p key={key} className={value === "OK" ? "ok" : "missing"}>
                {key}: {value}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
