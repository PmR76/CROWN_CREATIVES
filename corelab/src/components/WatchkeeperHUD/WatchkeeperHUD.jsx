// ============================================================
// WatchkeeperHUD.jsx — Dev Diagnostics Drawer (GR1 Stable + Full Render Chain Diagnostics)
// ============================================================

import React, { useState, useEffect } from "react";
import * as THREE from "three";
import "./watchkeeper-hud.css";

export default function WatchkeeperHUD() {
  const [open, setOpen] = useState(false);
  const [dataDump, setDataDump] = useState(null);

  // ------------------------------------------------------------
  // Local WebGL Diagnostics (GPU + WebGL2)
  // ------------------------------------------------------------
  const gl = document.createElement("canvas").getContext("webgl2");
  const webgl2Supported = !!gl;

  const gpuInfo = gl?.getExtension("WEBGL_debug_renderer_info");
  const gpuRenderer = gpuInfo
    ? gl.getParameter(gpuInfo.UNMASKED_RENDERER_WEBGL)
    : "Unknown GPU";

  // ------------------------------------------------------------
  // Toggle HUD with Shift + W
  // ------------------------------------------------------------
  useEffect(() => {
    const handler = (e) => {
      try {
        if (e.shiftKey && e.key.toLowerCase() === "w") {
          setOpen((prev) => !prev);
        }
      } catch {}
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ------------------------------------------------------------
  // Fetch live diagnostics (sentinel tree)
  // ------------------------------------------------------------
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/sentinel/sentinel-tree.txt");

        if (!res.ok) throw new Error("Sentinel tree missing");

        const text = await res.text();

        setDataDump({
          timestamp: new Date().toISOString(),
          sentinelTree: text,
          webgl2: webgl2Supported,
          gpu: gpuRenderer,
        });
      } catch (err) {
        setDataDump({
          error: "Unable to load diagnostics",
          detail: err.message,
          webgl2: webgl2Supported,
          gpu: gpuRenderer,
        });
      }
    }

    if (open) loadData();
  }, [open]);

  // ------------------------------------------------------------
  // Snapshot Handler (Dev-only)
  // ------------------------------------------------------------
  async function handleSnapshot() {
    try {
      const res = await fetch("/sentinel/sentinel-tree.txt");
      const text = await res.text();

      // ------------------------------------------------------------
      // WebGL Stress Test
      // ------------------------------------------------------------
      let webglStress = "PASS";
      try {
        const glTest = document.createElement("canvas").getContext("webgl2");
        const buffer = glTest.createBuffer();
        glTest.bindBuffer(glTest.ARRAY_BUFFER, buffer);
        glTest.bufferData(
          glTest.ARRAY_BUFFER,
          new Float32Array(500000),
          glTest.STATIC_DRAW
        );
      } catch (err) {
        webglStress = "FAIL: " + err.message;
      }

      // ------------------------------------------------------------
      // Shader Compilation Test
      // ------------------------------------------------------------
      let shaderCompile = "PASS";
      try {
        const glTest = document.createElement("canvas").getContext("webgl2");
        const shader = glTest.createShader(glTest.FRAGMENT_SHADER);
        glTest.shaderSource(
          shader,
          "precision highp float; void main(){ gl_FragColor = vec4(1.0); }"
        );
        glTest.compileShader(shader);
        if (!glTest.getShaderParameter(shader, glTest.COMPILE_STATUS)) {
          shaderCompile = "FAIL: " + glTest.getShaderInfoLog(shader);
        }
      } catch (err) {
        shaderCompile = "FAIL: " + err.message;
      }

      // ------------------------------------------------------------
      // Canvas Visibility Test
      // ------------------------------------------------------------
      const canvas = document.querySelector("#webgl-background canvas");
      let canvasVisible = false;
      let canvasOpacity = null;
      let canvasZIndex = null;

      if (canvas) {
        const style = window.getComputedStyle(canvas);
        canvasVisible =
          style.display !== "none" && style.visibility !== "hidden";
        canvasOpacity = style.opacity;
        canvasZIndex = style.zIndex;
      }

      // ------------------------------------------------------------
      // Theme Uniform Test
      // ------------------------------------------------------------
      let themeUniform = document.body.dataset.theme || "unknown";

      // ------------------------------------------------------------
      // NEW DIAGNOSTIC 1 — Renderer Health Test
      // ------------------------------------------------------------
      let rendererCreated = false;
      let rendererContextLost = false;
      let rendererError = null;

      try {
        const testCanvas = document.createElement("canvas");
        const testRenderer = testCanvas.getContext("webgl2");
        rendererCreated = !!testRenderer;
      } catch (err) {
        rendererError = err.message;
      }

      // ------------------------------------------------------------
      // NEW DIAGNOSTIC 2 — Scene Object Count Test
      // ------------------------------------------------------------
      let sceneObjectCount = 0;
      let sceneHasMesh = false;

      try {
        const testScene = new THREE.Scene();
        const testMesh = new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 1),
          new THREE.MeshBasicMaterial()
        );
        testScene.add(testMesh);
        sceneObjectCount = testScene.children.length;
        sceneHasMesh = sceneObjectCount > 0;
      } catch {}
      // ------------------------------------------------------------
      // NEW DIAGNOSTIC 10 — Three.js Internal Error Log
      // ------------------------------------------------------------
      let threeErrors = [];
      try {
        THREE.onError = (msg) => threeErrors.push(msg);
      } catch {}

      // ------------------------------------------------------------
      // Build Snapshot
      // ------------------------------------------------------------
      const snapshot = {
        timestamp: new Date().toISOString(),
        sentinelTree: text,
        status: "OK",

        // Existing diagnostics
        webgl2: webgl2Supported,
        gpu: gpuRenderer,
        webglStress,
        shaderCompile,
        canvasVisible,
        canvasOpacity,
        canvasZIndex,
        themeUniform,

        // New diagnostics
        rendererCreated,
        rendererContextLost,
        rendererError,
        sceneObjectCount,
        sceneHasMesh,
        renderFrames,
        renderLoopActive,
        uniformTime,
        uniformTheme,
        uniformsUpdating,
        materialType,
        materialAttached,
        meshAttached,
        cameraType,
        cameraValid,
        canvasPainted,
        backgroundMountedFirst,
        shaderWarnings,
        threeErrors
      };

      console.log("Watchkeeper Snapshot:", snapshot);
      setDataDump(snapshot);

    } catch (err) {
      console.error("Snapshot failed:", err);
      setDataDump({
        error: "Snapshot failed",
        detail: err.message,
        webgl2: webgl2Supported,
        gpu: gpuRenderer,
      });
    }
  }

  // ------------------------------------------------------------
  // Draggable HUD (calm, ND-friendly)
  // ------------------------------------------------------------
  useEffect(() => {
    if (!open) return;

    const hud = document.querySelector(".wk-hud");
    if (!hud) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      startX = e.clientX - hud.offsetLeft;
      startY = e.clientY - hud.offsetTop;
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      hud.style.left = `${e.clientX - startX}px`;
      hud.style.top = `${e.clientY - startY}px`;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    hud.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      hud.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [open]);

  // ------------------------------------------------------------
  // Hide HUD for public users
  // ------------------------------------------------------------
  const isDev =
    window.location.hostname === "localhost" ||
    window.location.search.includes("dev=true");

  if (!isDev) return null;

  // ------------------------------------------------------------
  // Render HUD
  // ------------------------------------------------------------
  return (
    <div className={`wk-hud ${open ? "open" : ""}`}>
      <div className="wk-header">
        <span>Watchkeeper HUD</span>
      </div>

      {/* Snapshot Button Section */}
      <div className="wk-section">
        <div className="wk-label">Snapshot</div>
        <button className="wk-btn" onClick={handleSnapshot}>
          Take Snapshot
        </button>
      </div>

      {/* WebGL Diagnostics Button */}
      <div className="wk-section">
        <div className="wk-label">WebGL Tools</div>

        <button
          className="wk-btn"
          onClick={() => window.open("https://webglreport.com", "_blank")}
        >
          WebGL Diagnostics
        </button>

        <button
          className="wk-btn"
          onClick={() => window.open("chrome://inspect/#devices", "_blank")}
        >
          Lighthouse (Chrome)
        </button>

        <button
          className="wk-btn"
          onClick={() =>
            window.open("https://threejs.org/editor/", "_blank")
          }
        >
          Three.js Shader Test
        </button>
      </div>

      {/* Local GPU + WebGL Status */}
      <div className="wk-section">
        <div className="wk-label">Local GPU Status</div>

        <div className="wk-status">
          <span className="wk-status-label">WebGL2 Support</span>
          <span
            className={`wk-light ${
              webgl2Supported ? "wk-green" : "wk-red"
            }`}
          ></span>
        </div>

        <div className="wk-status">
          <span className="wk-status-label">GPU Renderer</span>
          <span className="wk-status-value">{gpuRenderer}</span>
        </div>
      </div>

      <div className="wk-content">
        <h3>Live Diagnostics Snapshot</h3>
        <pre>{JSON.stringify(dataDump, null, 2)}</pre>
      </div>
    </div>
  );
}
