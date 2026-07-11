// ============================================================
// AdminGate.jsx — Password Gate for Crown Creatives Editor OS
// ============================================================

import { useState } from "react";
import { useAdmin } from "./AdminContext";

export default function AdminGate() {
  const { enterAdmin } = useAdmin();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    if (password === "Crown26") {
      setError(false);
      enterAdmin();       // ⭐ Unlock Admin Mode + Pause Everything
      setPassword("");    // Clear field
    } else {
      setError(true);
    }
  }

  return (
    <div className="admin-gate">
      <form className="admin-gate-form" onSubmit={handleSubmit}>
        <h3 className="admin-gate-title">Admin Access</h3>

        <input
          type="password"
          className="admin-gate-input"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <div className="admin-gate-error">
            Incorrect password
          </div>
        )}

        <button type="submit" className="admin-gate-button">
          Enter Editor OS
        </button>
      </form>
    </div>
  );
}
