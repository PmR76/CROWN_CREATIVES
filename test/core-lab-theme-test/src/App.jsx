import React from "react";
import Header from "./components/Header.jsx";
import Background3D from "./components/Background3D.jsx";
import HeroCrown from "./components/HeroCrown.jsx";
import ThemePanel from "./components/ThemePanel.jsx";
import useThemeEngine from "./hooks/useThemeEngine.js";


export default function App() {
  useThemeEngine(); // mount theme engine once

  return (
    <>
      <Header />
      <Background3D />
      <HeroCrown />
      <ThemePanel />
    </>
  );
}
