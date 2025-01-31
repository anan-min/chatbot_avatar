import React from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useGraph } from "@react-three/fiber";
import { useGLTF, useFBX, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";

export function Avatar(props) {
  const { position, scale, processedAudioURL, textResponse } = props;
  props = { position, scale };
  const { scene } = useGLTF("/models/avatar.glb");
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);
  const audioRef = useRef(null);

  // ref for libsync
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationFrameRef = useRef(null);

  // animation controls
  const { animations: standingAnimation } = useFBX("/animations/standing.fbx");
  const { animations: laughingAnimation } = useFBX("/animations/laughing.fbx");
  const { animations: runningAnimation } = useFBX("/animations/running.fbx");
  // animation names
  standingAnimation[0].name = "standing";
  laughingAnimation[0].name = "laughing";
  runningAnimation[0].name = "running";

  const updateMouthMorph = useCallback(() => {
    if (analyserRef.current) {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      // Split frequencies into bands
      const lowFreq = dataArrayRef.current.slice(
        0,
        dataArrayRef.current.length / 3
      );
      const midFreq = dataArrayRef.current.slice(
        dataArrayRef.current.length / 3,
        (2 * dataArrayRef.current.length) / 3
      );
      const highFreq = dataArrayRef.current.slice(
        (2 * dataArrayRef.current.length) / 3
      );

      // Calculate average volume for each band
      const lowVolume =
        lowFreq.reduce((sum, value) => sum + value, 0) / lowFreq.length;
      const midVolume =
        midFreq.reduce((sum, value) => sum + value, 0) / midFreq.length;
      const highVolume =
        highFreq.reduce((sum, value) => sum + value, 0) / highFreq.length;

      // Normalize volumes (0 to 1)
      const normalizedLow = Math.min(lowVolume / 128, 1);
      const normalizedMid = Math.min(midVolume / 128, 1);
      const normalizedHigh = Math.min(highVolume / 128, 1);

      // Update morph targets
      nodes.Wolf3D_Head.morphTargetInfluences[
        nodes.Wolf3D_Head.morphTargetDictionary["mouthOpen"]
      ] = normalizedLow; // Jaw movement
      nodes.Wolf3D_Head.morphTargetInfluences[
        nodes.Wolf3D_Head.morphTargetDictionary["mouthWide"]
      ] = normalizedMid; // Lips spreading
      nodes.Wolf3D_Head.morphTargetInfluences[
        nodes.Wolf3D_Head.morphTargetDictionary["mouthNarrow"]
      ] = normalizedHigh; // Lips puckering

      // Continue updating on the next frame
      animationFrameRef.current = requestAnimationFrame(updateMouthMorph);
    }
  }, [
    nodes.Wolf3D_Head.morphTargetDictionary,
    nodes.Wolf3D_Head.morphTargetInfluences,
  ]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [animation, setAnimation] = useState("standing");
  const group = useRef();
  const { actions } = useAnimations(
    [standingAnimation[0], laughingAnimation[0], runningAnimation[0]],
    group
  );

  // standby animations
  useEffect(() => {
    actions[animation].reset().fadeIn(0.5).play();
    return () => {
      // actions[animation].fadeOut(0.5);
    };
  }, [animation, actions]);

  useEffect(() => {
    if (processedAudioURL) {
      console.log("Avatar Text Response:", textResponse);
      console.log("Avatar Audio URL:", processedAudioURL);

      // Clean up any existing audio and audio context
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }

      // Initialize audio and Web Audio API
      audioRef.current = new Audio(processedAudioURL);
      audioContextRef.current = new (window.AudioContext ||
        window.AudioContext)();
      const source = audioContextRef.current.createMediaElementSource(
        audioRef.current
      );
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256; // Adjust for frequency resolution
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      // Connect the audio source to the analyser and destination
      source.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);

      // Start the audio
      audioRef.current.play();

      // Start the animation loop for updating the mouth morph
      updateMouthMorph();
    } else {
      // Stop the audio and cleanup if processedAudioURL is null
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    // Cleanup on component unmount or URL change
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [textResponse, processedAudioURL, updateMouthMorph]);

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
