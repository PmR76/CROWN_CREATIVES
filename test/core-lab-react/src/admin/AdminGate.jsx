// ============================================================
// AdminGate.jsx — Draggable Password Window (Shift + A)
// ============================================================

import React, { useState, useEffect, useRef } from "react";
import { useAdmin } from "./AdminContext";

export default function AdminGate() {
  const { isAdmin, setIsAdmin } = useAdmin();
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState("");

  const gateRef = useRef(null);
  const dragHandleRef = useRef(null);

  // ------------------------------------------------------------
  // SHOW PASSWORD WINDOW ON SHIFT + A
  // ------------------------------------------------------------
  useEffect(() => {
    function onKey(e) {
      if (e.key === "A" && e.shiftKey && !isAdmin) {
        setVisible(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isAdmin]);

  // ------------------------------------------------------------
  // DRAG LOGIC — ONLY DRAG HANDLE IS DRAGGABLE
  // ------------------------------------------------------------
  useEffect(() => {
    const el = gateRef.current;
    const handle = dragHandleRef.current;
    if (!el || !handle) return;

    let pos = { x: 0, y: 0 };

    function onMouseDown(e) {
      e.preventDefault();
      pos.x = e.clientX;
      pos.y = e.clientY;

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    }

    function onMouseMove(e) {
      const dx = e.clientX - pos.x;
      const dy = e.clientY - pos.y;

      pos.x = e.clientX;
      pos.y = e.clientY;

      el.style.left = el.offsetLeft + dx + "px";
      el.style.top = el.offsetTop + dy + "px";
    }

    function onMouseUp() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }

    handle.addEventListener("mousedown", onMouseDown);

    return () => handle.removeEventListener("mousedown", onMouseDown);
  }, [visible]);

  // ------------------------------------------------------------
  // LOGIN HANDLER
  // ------------------------------------------------------------
  function handleLogin() {
    if (password === "Crown26") {
      setIsAdmin(true);
      setVisible(false);
    } else {
      alert("Incorrect password");
    }
  }

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------
  if (!visible || isAdmin) return null;

  return (
    <div
      ref={gateRef}
      className="admin-gate-window"
      style={{
        position: "fixed",
        top: "30%",
        left: "30%",
        zIndex: 999999,
        background: "rgba(20,20,30,0.92)",
        padding: "0",
        borderRadius: "12px",
        backdropFilter: "blur(14px)",
        boxShadow: "0 0 30px rgba(0,0,0,0.6)",
      }}
    >
      {/* ⭐ DRAG HANDLE */}
      <div
        ref={dragHandleRef}
        style={{
          padding: "12px",
          background: "rgba(255,255,255,0.08)",
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
          cursor: "move",
          fontWeight: "600",
          letterSpacing: "1px",
        }}
      >
        Admin Login
      </div>

      {/* ⭐ CONTENT AREA (NOT DRAGGABLE) */}
      <div style={{ padding: "20px" }}>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "none",
            marginBottom: "12px",
            background: "rgba(255,255,255,0.1)",
            color: "#fff",
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "none",
            background: "#4a90e2",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Unlock Admin Mode
        </button>
      </div>
    </div>
  );
}
