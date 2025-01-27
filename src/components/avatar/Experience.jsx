import { OrbitControls, Environment, useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Avatar } from "@/components/avatar/Avatar";

export const Experience = () => {
  const texture = useTexture("/textures/background2.jpg");
  const viewPort = useThree((state) => state.viewport);

  return (
    <>
      <Avatar position={[0, -5, 5]} scale={3} />
      <Environment preset="sunset" />
      <mesh>
        <planeGeometry args={[viewPort.width, viewPort.height]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    </>
  );
};
