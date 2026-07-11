// ============================================================
// AdminContext.jsx — Crown Creatives Editor OS Global State
// ============================================================

import { createContext, useContext, useState } from "react";

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const enterAdmin = () => {
    setIsAdmin(true);
    setIsPaused(true);
  };

  const exitAdmin = () => {
    setIsAdmin(false);
    setIsPaused(false);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, isPaused, enterAdmin, exitAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
