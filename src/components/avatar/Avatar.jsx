import React from "react";
import { useEffect, useRef, useState } from "react";
import { useGraph } from "@react-three/fiber";
import { useGLTF, useFBX, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";

export function Avatar(props) {
  const { position, scale, processedAudioURL, textResponse } = props;
  props = { position, scale };
  const { scene } = useGLTF("/models/avatar.glb");
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);

  // animation controls
  const { animations: standingAnimation } = useFBX("/animations/standing.fbx");
  const { animations: laughingAnimation } = useFBX("/animations/laughing.fbx");
  const { animations: runningAnimation } = useFBX("/animations/running.fbx");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const letterToAnimation = {
    // Vowels
    อะ: "mouthOpen", // Short vowel "a" (อะ)
    อา: "mouthOpen", // Long vowel "a" (อา)
    อิ: "mouthNarrow", // Short vowel "i" (อิ)
    อี: "mouthNarrow", // Long vowel "i" (อี)
    อุ: "mouthRound", // Short vowel "u" (อุ)
    อู: "mouthRound", // Long vowel "u" (อู)
    เอะ: "mouthWide", // Short vowel "e" (เอะ)
    เอ: "mouthWide", // Long vowel "e" (เอ)
    แอ: "mouthWide", // "ae" sound (แอ)
    โอะ: "mouthRound", // "o" sound (โอะ)
    โอ: "mouthRound", // "o" sound (โอ)
    อัว: "mouthRound", // "ua" sound (อัว)
    อู: "mouthRound", // "oo" sound (อู)

    // Consonants (simplified)
    ก: "mouthOpen", // "k" sound (ก)
    ข: "mouthWide", // "kh" sound (ข)
    ค: "mouthOpen", // "kh" sound (ค)
    ง: "mouthNeutral", // "ng" sound (ง)
    จ: "mouthClose", // "ch" sound (จ)
    ฉ: "mouthWide", // "ch" sound (ฉ)
    ช: "mouthWide", // "ch" sound (ช)
    ซ: "mouthNeutral", // "s" sound (ซ)
    ฌ: "mouthNeutral", // "ch" sound (ฌ)
    ญ: "mouthWide", // "y" sound (ญ)
    ด: "mouthClose", // "d" sound (ด)
    ต: "mouthClose", // "t" sound (ต)
    ถ: "mouthWide", // "th" sound (ถ)
    ท: "mouthWide", // "th" sound (ท)
    ธ: "mouthWide", // "th" sound (ธ)
    น: "mouthNeutral", // "n" sound (น)
    บ: "mouthClose", // "b" sound (บ)
    ป: "mouthClose", // "p" sound (ป)
    ผ: "mouthWide", // "ph" sound (ผ)
    ฝ: "mouthWide", // "f" sound (ฝ)
    ฟ: "mouthWide", // "f" sound (ฟ)
    ภ: "mouthWide", // "ph" sound (ภ)
    ม: "mouthClose", // "m" sound (ม)
    ย: "mouthWide", // "y" sound (ย)
    ร: "mouthWide", // "r" sound (ร)
    ล: "mouthNeutral", // "l" sound (ล)
    ว: "mouthRound", // "w" sound (ว)
    ศ: "mouthWide", // "s" sound (ศ)
    ษ: "mouthWide", // "s" sound (ษ)
    ส: "mouthWide", // "s" sound (ส)
    ห: "mouthWide", // "h" sound (ห)
    ฬ: "mouthWide", // "l" sound (ฬ)
    อ: "mouthOpen", // "o" sound (อ)
    ฮ: "mouthWide", // "h" sound (ฮ)
  };

  standingAnimation[0].name = "standing";
  laughingAnimation[0].name = "laughing";
  runningAnimation[0].name = "running";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [animation, setAnimation] = useState("standing");
  const group = useRef();
  const { actions } = useAnimations(
    [standingAnimation[0], laughingAnimation[0], runningAnimation[0]],
    group
  );

  useEffect(() => {
    actions[animation].reset().fadeIn(0.5).play();
    return () => {
      actions[animation].fadeOut(0.5);
    };
  }, [animation, actions]);

  useEffect(() => {
    if (textResponse) {
      console.log("Avatar Text Response:", textResponse);
      console.log("Avatar Audio URL:", processedAudioURL);

      const audio = new Audio(processedAudioURL);
      audio.play();
    }
  }, [textResponse, processedAudioURL]);

  return (
    <group {...props} dispose={null} ref={group}>
      <primitive object={nodes.Hips} />
      <skinnedMesh
        geometry={nodes.Wolf3D_Hair.geometry}
        material={materials.Wolf3D_Hair}
        skeleton={nodes.Wolf3D_Hair.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Glasses.geometry}
        material={materials.Wolf3D_Glasses}
        skeleton={nodes.Wolf3D_Glasses.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
    </group>
  );
}

useGLTF.preload("/models/avatar.glb");
