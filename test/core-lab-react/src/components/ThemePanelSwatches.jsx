import "../styles/theme-panel.css";

export default function ThemePanelSwatches({ onSelect }) {
  const swatches = [
    // DAY
    "sunrise", "warm-daylight", "soft-sky", "sunset-glow",
    "ocean-mist", "royal-ember", "solar-bloom", "crown-platinum",
    "sunrise-blush", "peach-horizon", "coral-bloom", "apricot-sky",
    "golden-hour", "sherbet-glow", "ember-mist", "radiant-dawn",

    // NIGHT
    "midnight-indigo", "royal-night", "aurora", "deep-space",
    "deep-velvet", "cosmic-royal", "nebula-drift", "crown-nocturne",
    "nebula-violet", "midnight-royal", "cosmic-indigo", "ultraviolet-drift",
    "deep-abyss", "lunar-ice", "starlight-veil", "aurora-veil",

    // Seasonal
    "winter-frost", "winter-ice", "spring-bloom", "spring-meadow",
    "summer-sky", "summer-heat", "autumn-leaf", "autumn-harvest",

    // Sci-fi
    "xenon-core", "nebula-storm", "quantum-rift", "plasma-reactor",
    "cosmic-lattice", "void-energy", "astral-flare", "extraterrestrial"
  ];

  return (
    <div className="theme-swatch-grid">
      {swatches.map((key) => (
        <div
          key={key}
          className="theme-swatch"
          data-key={key}
          style={{ background: `var(--grad-${key})` }}
          onClick={() => onSelect(key)}
        />
      ))}
    </div>
  );
}
