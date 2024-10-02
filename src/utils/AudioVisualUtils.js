import * as THREE from "three";

export const configThreeJS = (mountRef) => {
  const scene = new THREE.Scene();

  // Camera setup
  const camera = new THREE.PerspectiveCamera(
    75,
    mountRef.current.clientWidth / mountRef.current.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 40;

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({
    alpha: true, // Enable transparency
    antialias: true,
  });
  renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
  renderer.setClearColor(0x000000, 0); // Fully transparent
  mountRef.current.appendChild(renderer.domElement);

  // ball setup
  const geometry = new THREE.IcosahedronGeometry(20, 1);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      color1: { value: new THREE.Color("#fff1eb") },
      color2: { value: new THREE.Color("#3d3d3d") },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
        `,
    fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec2 vUv;
        void main() {
          gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
          }
          `,
    wireframe: true,
  });
  const ball = new THREE.Mesh(geometry, material);
  scene.add(ball);

  return { scene, camera, renderer, ball };
};
export const staticAnimate = (ball, scene, camera, renderer) => {
  const animateFrame = () => {
    requestAnimationFrame(animateFrame);
    const pulseFactor = 1 + 0.05 * Math.sin(Date.now() * 0.005);
    ball.rotation.y += 0.001;
    ball.scale.set(pulseFactor, pulseFactor, pulseFactor);
    renderer.render(scene, camera);
  };

  animateFrame();
};

export const handleResize = (camera, renderer, mountRef) => {
  const width = mountRef.current.clientWidth;
  const height = mountRef.current.clientHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
};
export const WarpBall = (mesh, bassFr, treFr, noise) => {
  const geometry = mesh.geometry;
  console.log(noise);

  if (!(geometry instanceof THREE.BufferGeometry)) {
    console.error("WarpBall expects a BufferGeometry.");
    return;
  }
  const time = performance.now();
  const noiseTime = time * 0.0005;
  const positions = geometry.attributes.position;
  const vertex = new THREE.Vector3();
  const offset = geometry.parameters.radius || 20;
  const amp = 3; // Reduced amplitude for smoother warps

  for (let i = 0; i < positions.count; i++) {
    vertex.fromBufferAttribute(positions, i);
    vertex.normalize();

    // Calculate noise input using controlled noiseTime
    const noiseInputX = vertex.x + noiseTime * 0.003;
    const noiseInputY = vertex.y + noiseTime * 0.0035;
    const noiseInputZ = vertex.z + noiseTime * 0.004;

    const noiseValue = noise.perlin3(noiseInputX, noiseInputY, noiseInputZ);

    const distance = offset + bassFr + noiseValue * amp * treFr;

    vertex.multiplyScalar(distance);
    positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  positions.needsUpdate = true;
  geometry.computeVertexNormals();
};

export const AudioAnimate = (
  ball,
  scene,
  camera,
  renderer,
  noise,
  analyser,
  dataArray,
  animationIdRef
) => {
  const animateFrame = () => {
    const animationId = requestAnimationFrame(animateFrame);

    // Store the animation ID to cancel it later
    animationIdRef.current = animationId;

    // Get audio data
    analyser.getByteFrequencyData(dataArray);

    // Calculate some metrics (adjust for your needs)
    const lowerHalfArray = dataArray.slice(0, dataArray.length / 2);
    const upperHalfArray = dataArray.slice(dataArray.length / 2);

    const lowerMax = Math.max(...lowerHalfArray);
    const upperMax = Math.max(...upperHalfArray);

    // Modulate ball properties based on audio data
    WarpBall(ball, lowerMax / 128, upperMax / 128, noise); // Example modulation

    // Rotate the ball
    ball.rotation.y += 0.01;

    // Render the scene
    renderer.render(scene, camera);
  };
  animateFrame();
};
