"use client";
import React, { useRef, useEffect } from "react";
import { Noise } from "noisejs";
import {
  configThreeJS,
  handleResize,
  AudioAnimate,
  staticAnimate,
} from "@/utils/AudioVisualUtils";

const AudioVisualize = ({ processedAudioURL }) => {
  const mountRef = useRef(null);
  const noise = new Noise(Math.random());
  const audioRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    const { scene, camera, renderer, ball } = configThreeJS(mountRef);
    const onResize = () => handleResize(camera, renderer, mountRef);
    window.addEventListener("resize", onResize);

    const startStaticAnimation = () => {
      animateStatic(ball, scene, camera, renderer);
    };


    staticAnimate(ball, scene, camera, renderer, noise);

    return () => {
      window.removeEventListener("resize", handleResize);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  });

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
