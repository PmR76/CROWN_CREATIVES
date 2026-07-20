// ============================================================
// theme-rotation.js — 60 Gradient Swatches (Day + Night)
// ============================================================

const gradients = [
  // ============================================================
  // DAY THEMES (30)
  // ============================================================

  { id: "day-1",  preview: "linear-gradient(135deg, #ffecd2, #fcb69f)", type: "day" },
  { id: "day-2",  preview: "linear-gradient(135deg, #f6d365, #fda085)", type: "day" },
  { id: "day-3",  preview: "linear-gradient(135deg, #fdfbfb, #ebedee)", type: "day" },
  { id: "day-4",  preview: "linear-gradient(135deg, #fff1eb, #ace0f9)", type: "day" },
  { id: "day-5",  preview: "linear-gradient(135deg, #ff9a9e, #fecfef)", type: "day" },
  { id: "day-6",  preview: "linear-gradient(135deg, #a1c4fd, #c2e9fb)", type: "day" },
  { id: "day-7",  preview: "linear-gradient(135deg, #d4fc79, #96e6a1)", type: "day" },
  { id: "day-8",  preview: "linear-gradient(135deg, #84fab0, #8fd3f4)", type: "day" },
  { id: "day-9",  preview: "linear-gradient(135deg, #fccb90, #d57eeb)", type: "day" },
  { id: "day-10", preview: "linear-gradient(135deg, #f3e7e9, #e3eeff)", type: "day" },

  // NEW DAY THEMES (20 more)
  { id: "day-11", preview: "linear-gradient(135deg, #ffdde1, #ee9ca7)", type: "day" },
  { id: "day-12", preview: "linear-gradient(135deg, #fbc2eb, #a6c1ee)", type: "day" },
  { id: "day-13", preview: "linear-gradient(135deg, #fad0c4, #ffd1ff)", type: "day" },
  { id: "day-14", preview: "linear-gradient(135deg, #ffe29f, #ffa99f)", type: "day" },
  { id: "day-15", preview: "linear-gradient(135deg, #ff9a8b, #ff6a88)", type: "day" },
  { id: "day-16", preview: "linear-gradient(135deg, #ffecd2, #fcb69f)", type: "day" },
  { id: "day-17", preview: "linear-gradient(135deg, #ffefba, #ffffff)", type: "day" },
  { id: "day-18", preview: "linear-gradient(135deg, #fffbd5, #b20a2c)", type: "day" },
  { id: "day-19", preview: "linear-gradient(135deg, #fffcf7, #f3d1f4)", type: "day" },
  { id: "day-20", preview: "linear-gradient(135deg, #ffe6fa, #d4c1ec)", type: "day" },

  { id: "day-21", preview: "linear-gradient(135deg, #ffb199, #ff0844)", type: "day" },
  { id: "day-22", preview: "linear-gradient(135deg, #fffcf7, #f3d1f4)", type: "day" },
  { id: "day-23", preview: "linear-gradient(135deg, #fdfcfb, #e2d1c3)", type: "day" },
  { id: "day-24", preview: "linear-gradient(135deg, #f6f0c4, #f4d03f)", type: "day" },
  { id: "day-25", preview: "linear-gradient(135deg, #f9f7d9, #f7e8a4)", type: "day" },
  { id: "day-26", preview: "linear-gradient(135deg, #ffe8d6, #fcd2af)", type: "day" },
  { id: "day-27", preview: "linear-gradient(135deg, #ffe3e3, #f7d1d1)", type: "day" },
  { id: "day-28", preview: "linear-gradient(135deg, #fff5e4, #ffe3c8)", type: "day" },
  { id: "day-29", preview: "linear-gradient(135deg, #ffe8f0, #fcd2e0)", type: "day" },
  { id: "day-30", preview: "linear-gradient(135deg, #fff0f6, #ffd6e8)", type: "day" },

  // ============================================================
  // NIGHT THEMES (30)
  // ============================================================

  { id: "night-1",  preview: "linear-gradient(135deg, #2c3e50, #4ca1af)", type: "night" },
  { id: "night-2",  preview: "linear-gradient(135deg, #141e30, #243b55)", type: "night" },
  { id: "night-3",  preview: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)", type: "night" },
  { id: "night-4",  preview: "linear-gradient(135deg, #232526, #414345)", type: "night" },
  { id: "night-5",  preview: "linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b)", type: "night" },
  { id: "night-6",  preview: "linear-gradient(135deg, #000428, #004e92)", type: "night" },
  { id: "night-7",  preview: "linear-gradient(135deg, #1f1c2c, #928dab)", type: "night" },
  { id: "night-8",  preview: "linear-gradient(135deg, #2b5876, #4e4376)", type: "night" },
  { id: "night-9",  preview: "linear-gradient(135deg, #1e3c72, #2a5298)", type: "night" },
  { id: "night-10", preview: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)", type: "night" },

  // NEW NIGHT THEMES (20 more)
  { id: "night-11", preview: "linear-gradient(135deg, #0d0d0d, #434343)", type: "night" },
  { id: "night-12", preview: "linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)", type: "night" },
  { id: "night-13", preview: "linear-gradient(135deg, #000000, #434343)", type: "night" },
  { id: "night-14", preview: "linear-gradient(135deg, #1e1e1e, #383838)", type: "night" },
  { id: "night-15", preview: "linear-gradient(135deg, #2c3e50, #000000)", type: "night" },
  { id: "night-16", preview: "linear-gradient(135deg, #0f0f0f, #2d2d2d)", type: "night" },
  { id: "night-17", preview: "linear-gradient(135deg, #1b2735, #090a0f)", type: "night" },
  { id: "night-18", preview: "linear-gradient(135deg, #2c3e50, #4b79a1)", type: "night" },
  { id: "night-19", preview: "linear-gradient(135deg, #1c1c1c, #3a3a3a)", type: "night" },
  { id: "night-20", preview: "linear-gradient(135deg, #0f2027, #203a43)", type: "night" },

  { id: "night-21", preview: "linear-gradient(135deg, #1a1a1a, #333333)", type: "night" },
  { id: "night-22", preview: "linear-gradient(135deg, #2b2b2b, #1a1a1a)", type: "night" },
  { id: "night-23", preview: "linear-gradient(135deg, #1e1e1e, #111111)", type: "night" },
  { id: "night-24", preview: "linear-gradient(135deg, #0a0a0a, #1a1a1a)", type: "night" },
  { id: "night-25", preview: "linear-gradient(135deg, #1f1f1f, #2f2f2f)", type: "night" },
  { id: "night-26", preview: "linear-gradient(135deg, #000000, #1f1f1f)", type: "night" },
  { id: "night-27", preview: "linear-gradient(135deg, #090909, #2b2b2b)", type: "night" },
  { id: "night-28", preview: "linear-gradient(135deg, #1a1a1a, #4a4a4a)", type: "night" },
  { id: "night-29", preview: "linear-gradient(135deg, #0f0f0f, #3f3f3f)", type: "night" },
  { id: "night-30", preview: "linear-gradient(135deg, #000000, #2e2e2e)", type: "night" }
];

export default gradients;
