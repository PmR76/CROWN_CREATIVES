// ============================================================
// AdminContext.jsx — Global Admin State
// ============================================================

import React, { createContext, useContext, useState } from "react";

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // ⭐ NEW: AdminPanel open/close toggle
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        setIsAdmin,
        isPaused,
        setIsPaused,
        isPanelOpen,
        setIsPanelOpen
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
