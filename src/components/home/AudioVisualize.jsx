"use client";
import React, { useRef, useEffect} from "react";
import { Noise } from "noisejs";
import {
  configThreeJS,
  handleResize,
  AudioAnimate,
  staticAnimate,
} from "@/utils/AudioVisualUtils";

const noise = new Noise(Math.random());
const AudioVisualize = ({ processedAudioURL }) => {
  const mountRef = useRef(null);
  const audioRef = useRef(null); // For controlling the audio element
  const audioContextRef = useRef(null); // To potentially interact with AudioContext later
  const animationIdRef = useRef(null);

  const setupAudioVisualizer = (
    processedAudioURL,
    ball,
    scene,
    camera,
    renderer,
    noise,
    animationIdRef
  ) => {
    // Create AudioContext and load the audio
    const audioContext = new (window.AudioContext || window.AudioContext)();
    audioContextRef.current = audioContext; // Store it in a ref to interact later

    const audioElement = new Audio(processedAudioURL);

    // Connect the audio to the analyser
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;
    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Start the audio and begin animation
    audioElement.play();

    audioElement.addEventListener("ended", () => {
      staticAnimate(ball, scene, camera, renderer, noise);
    });

    // Start the animation loop
    AudioAnimate(
      ball,
      scene,
      camera,
      renderer,
      noise,
      analyser,
      dataArray,
      animationIdRef
    );
    // Return the necessary references for further control
    return {
      audioElement,
      analyser,
      dataArray,
    };
  };

  useEffect(() => {
    const { scene, camera, renderer, ball } = configThreeJS(mountRef);

    const onResize = () => handleResize(camera, renderer, mountRef);
    window.addEventListener("resize", onResize);
    if (!processedAudioURL) {
      staticAnimate(ball, scene, camera, renderer, noise);
    } else {
      console.log(noise);
      const { audioElement } = setupAudioVisualizer(
        processedAudioURL,
        ball,
        scene,
        camera,
        renderer,
        noise,
        animationIdRef
      );
      audioRef.current = audioElement; // Keep reference to audio element for further control
    }

    return () => {
      window.removeEventListener("resize", onResize);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
      if (audioRef.current) audioRef.current.pause(); // Pause the audio on unmount
    };
  }, [processedAudioURL]);

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

export default AudioVisualize;
