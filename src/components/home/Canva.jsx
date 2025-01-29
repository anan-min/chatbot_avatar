import React, { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Experience } from "@/components/avatar/Experience";

export const Canva = ({ processedAudioURL, textResponse }) => {
  useEffect(() => {
    if (textResponse) {
      console.log("Text Response from Canva:", textResponse);
    }
  }, [textResponse]);

  return (
    <Canvas shadows camera={{ position: [0, 0, 8], fov: 42 }}>
      <color attach="background" args={["#ffffff"]} />
      <Experience
        processedAudioURL={processedAudioURL}
        textResponse={textResponse}
      />
    </Canvas>
  );
};
