export const vertexShader = `
  varying vec2 vUv;

  void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = `
  varying vec2 vUv;

  uniform vec3 color;

  void main() {
      gl_FragColor = vec4(color, 1.0);
  }
`;
