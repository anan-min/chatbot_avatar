"use client";
import React, { useRef, useEffect } from "react";
import * as THREE from "three";

// Function to configure Three.js scene, camera, renderer, and cube
const configThreeJS = (mountRef) => {
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

  // Cube setup
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
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  return { scene, camera, renderer, cube };
};

// Function to handle the animation loop
const animate = (cube, scene, camera, renderer) => {
  const animateFrame = () => {
    requestAnimationFrame(animateFrame);

    // Rotate Cube
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
  };

  animateFrame();
};

const handleResize = (camera, renderer, mountRef) => {
  const width = mountRef.current.clientWidth;
  const height = mountRef.current.clientHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
};

const ThreeScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const { scene, camera, renderer, cube } = configThreeJS(mountRef);

    const onResize = () => handleResize(camera, renderer, mountRef);
    window.addEventListener("resize", onResize);

    animate(cube, scene, camera, renderer);

    return () => {
      window.removeEventListener("resize", handleResize);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
};

export default ThreeScene;
