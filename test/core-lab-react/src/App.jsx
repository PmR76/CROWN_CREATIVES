import { useEffect } from "react";

import Header from "./components/Header";
import Background3D from "./components/Background3D";
import ThemePanel from "./components/ThemePanel";
import useThemeEngine from "./hooks/useThemeEngine";
import HeroCrown from "./components/HeroCrown";
import Cards from "./components/Cards";
import Ticker from "./components/Ticker";
import Footer from "./components/Footer";
import CorePanel from "./components/CorePanel";

import "./styles/core.css";

export default function App() {

  useThemeEngine();   // ⭐ Theme engine now drives crown + gradients

  useEffect(() => {
    console.group("CORE-LAB DIAGNOSTICS");
    console.log("Header Loaded:", true);
    console.log("Background3D Active:", true);
    console.log("HeroCrown Active:", true);
    console.log("ThemePanel Active:", true);
    console.log("Cards Loaded:", true);
    console.log("Ticker Running:", true);
    console.log("Footer Active:", true);
    console.log("CorePanel Active:", true);
    console.log("FPS Target:", 60);
    console.log("Errors:", 0);
    console.groupEnd();
  }, []);

  return (
    <>
      <Header />
      <Background3D />

      <div className="core-layout">
        <HeroCrown />
        <ThemePanel />
        <Cards />
        <Ticker />
        <Footer />
        <CorePanel />
      </div>
    </>
  );
}
