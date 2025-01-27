import React from "react";
import { Canvas } from "@react-three/fiber";
import { Experience } from "@/components/avatar/Experience";

export const Canva = () => {
  return (
    <Canvas shadows camera={{ position: [0, 0, 8], fov: 42 }}>
      <color attach="background" args={["#ffffff"]} />
      <Experience />
    </Canvas>
  );
};
