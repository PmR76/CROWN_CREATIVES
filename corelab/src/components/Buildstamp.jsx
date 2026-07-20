import React from "react";
import "./buildstamp.css";

export default function Buildstamp() {
  const isDev =
    window.location.hostname === "localhost" ||
    window.location.search.includes("dev=true");

  const stamp = {
    version: "v1.0.0",
    built: new Date().toLocaleString(),
    env: isDev ? "dev" : "prod",
  };

  return (
    <div className="buildstamp">
      Crown Creatives · {stamp.version} · {stamp.built}
      {isDev && (
        <span className="dev-info"> · env:{stamp.env}</span>
      )}
    </div>
  );
}
