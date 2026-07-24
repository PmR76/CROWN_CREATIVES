import CoreHome from "../components/CoreHome/CoreHome.jsx";
import HeroCrown from "../components/HeroCrown.jsx";

export default function LabHome() {
  return (
    <div style={{ width: "100%", minHeight: "100vh" }}>
      {/* CLEAN LAB — no Header, no Footer, no Gallery */}
      <HeroCrown />
    </div>
  );
}
