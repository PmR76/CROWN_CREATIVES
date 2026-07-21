// ============================================================
// AdminContext.jsx — Core Lab Admin State (GR1 Stable)
// ============================================================

import React, { createContext, useContext, useState } from "react";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const value = {
    isAdmin,
    setIsAdmin,
    isPanelOpen,
    setIsPanelOpen
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);

  // Safety: prevent null-context crash
  if (!ctx) {
    console.error("❌ useAdmin() used outside <AdminProvider>");
    return {
      isAdmin: false,
      setIsAdmin: () => {},
      isPanelOpen: false,
      setIsPanelOpen: () => {}
    };
  }

  return ctx;
}
