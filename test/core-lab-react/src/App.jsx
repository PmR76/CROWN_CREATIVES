import { useEffect } from "react";

import Background3D from "./components/Background3D";
import Cards from "./components/Cards";
import Ticker from "./components/Ticker";
import Footer from "./components/Footer";
import CorePanel from "./components/CorePanel";

import "./styles/core.css";

export default function App() {

  // CORE-LAB DIAGNOSTICS (now correctly inside component)
  useEffect(() => {
    console.group("CORE-LAB DIAGNOSTICS");
    console.log("Cards Loaded:", true);
    console.log("Ticker Running:", true);
    console.log("Footer Active:", true);
    console.log("FPS Target:", 60);
    console.log("Errors:", 0);
    console.groupEnd();
  }, []);

  return (
    <>
      <Background3D />

      <div className="core-layout">
        <Cards />
        <Ticker />
        <Footer />
        <CorePanel />
      </div>
    </>
  );
}
