useEffect(() => {
  window.__MODULE_STREAMER_ACTIVE = true;
  window.__GR3_ACTIVE = true;

  const handler = (e) => {
    const detail = e.detail;

    if (detail === "clear") {
      setActiveModules([]);
      return;
    }

    if (detail === "all") {
      setActiveModules(Object.keys(modules));
      return;
    }

    setActiveModules((prev) =>
      prev.includes(detail) ? prev : [...prev, detail]
    );
  };

  window.addEventListener("stream-module", handler);

  return () => {
    window.removeEventListener("stream-module", handler);
    window.__MODULE_STREAMER_ACTIVE = false;
    window.__GR3_ACTIVE = false;
  };
}, []);
