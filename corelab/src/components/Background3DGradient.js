export const GradientShader = {
  uniforms: {
    uTheme: { value: 0 } // 0 = day, 1 = night
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTheme;

    void main() {
      vec3 dayTop = vec3(0.95, 0.85, 1.0);
      vec3 dayBottom = vec3(0.85, 0.95, 1.0);

      vec3 nightTop = vec3(0.05, 0.05, 0.15);
      vec3 nightBottom = vec3(0.10, 0.0, 0.25);

      vec3 topColor = mix(dayTop, nightTop, uTheme);
      vec3 bottomColor = mix(dayBottom, nightBottom, uTheme);

      vec3 color = mix(bottomColor, topColor, vUv.y);
      gl_FragColor = vec4(color, 1.0);
    }
  `
};
