// ============================================================
// SentinelDashboard.jsx — v2.0 Dashboard Root
// ============================================================

import StatusPanel from "../panels/StatusPanel";
import HandshakePanel from "../panels/HandshakePanel";
import CloudflarePanel from "../panels/CloudflarePanel";
import UIConflictsPanel from "../panels/UIConflictsPanel";

import "../styles/sentinel-dashboard.css";

export default function SentinelDashboard() {
  return (
    <div className="sentinel-dashboard">
      <StatusPanel />
      <HandshakePanel />
      <CloudflarePanel />
      <UIConflictsPanel />
    </div>
  );
}
