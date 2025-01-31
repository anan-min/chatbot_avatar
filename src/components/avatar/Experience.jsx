import { Environment, useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Avatar } from "@/components/avatar/Avatar";
// import { Avatar2 } from "@/components/avatar/Avatar2";
import { useEffect } from "react";

export const Experience = ({ processedAudioURL, textResponse }) => {
  const texture = useTexture("/textures/background2.jpg");
  const viewPort = useThree((state) => state.viewport);

  useEffect(() => {
    if (textResponse) {
      console.log("Text Response at Experience:", textResponse);
    }
  }, [textResponse]);

  return (
    <>
      <Avatar
        position={[0, -5, 5]}
        scale={3}
        processedAudioURL={processedAudioURL}
        textResponse={textResponse}
      />
      <Environment preset="sunset" />
      <mesh>
        <planeGeometry args={[viewPort.width, viewPort.height]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    </>
  );
};
