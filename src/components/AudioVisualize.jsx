"use client";
import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const AudioVisualize = ({ audioData }) => {
  const mountRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    const { clientWidth, clientHeight } = mountRef.current;
    renderer.setSize(clientWidth, clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      clientWidth / clientHeight,
      0.1,
      1000
    );
    camera.position.z = 10;

    // Orbit controls for optional interaction
    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.update();

    // Use a neutral color that works in both light and dark themes
    const neutralColor = 0x888888; // Medium gray that works in both themes

    // Sphere geometry with reduced segments to lower line density
    const geometry = new THREE.SphereGeometry(5, 16, 16); // Lower segment count

    // Set material with neutral color and wireframe
    const material = new THREE.MeshStandardMaterial({
      color: neutralColor,
      wireframe: true,
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Lighting for visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10).normalize();
    scene.add(directionalLight);

    let analyser;
    let dataArray;
    let audioContext;
    let audioSource;

    // Set up audio analyser only if audioData is available
    if (audioData) {
      // Create audio context and analyser
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);

      // Connect audio stream
      audioSource = audioContext.createMediaElementSource(audioRef.current);
      audioSource.connect(analyser);
      analyser.connect(audioContext.destination);
    }

    let pulseTime = 0; // For tracking pulse animation time

    const animate = () => {
      // If no audio data is present, run a pulse animation
      if (!audioData) {
        pulseTime += 0.02;
        const scale = 1 + Math.sin(pulseTime) * 0.03; // Pulsing effect
        sphere.scale.set(scale, scale, scale);
      }

      // If audio is available, modify the sphere based on audio data
      if (audioData && analyser) {
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const averageFrequency = sum / dataArray.length;

        const scale = 1 + (averageFrequency / 255) * 0.5; // Scale between 1 and 1.5
        sphere.scale.set(scale, scale, scale);
      }

      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);

    const handleResize = () => {
      const { clientWidth, clientHeight } = mountRef.current;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current.removeChild(renderer.domElement);
      if (audioContext) {
        audioContext.close();
      }
      renderer.dispose();
    };
  }, [audioData]); // Re-run effect when audioData changes

  return (
    <div
      ref={mountRef}
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      {/* Audio element is rendered only when audioData is passed */}
      {audioData && (
        <audio
          ref={audioRef}
          src={audioData}
          autoPlay
          loop
          controls
          style={{ display: "none" }}
        />
      )}
    </div>
  );
};

export default AudioVisualize;
