"use client";
import { useState, useRef } from "react";
import { sendAudioToApi } from "./apiHandler"; // Assuming your API function is in apiHandler.js

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null); // State to store the audio URL
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);

  const startRecording = async () => {
    try {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause(); 
        audioRef.current.currentTime = 0; 
        setAudioURL(null); 
      }
  
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone", err);
      alert("Could not access your microphone. Please check permissions.");
    }
  };

  const stopRecording = async () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });

      try {
        const processedAudioUrl = await sendAudioToApi(audioBlob);
        setAudioURL(processedAudioUrl);

        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play();
          }
        }, 500);
      } catch (error) {
        console.error("Error handling audio:", error);
      }
      audioChunksRef.current = [];
    };
  };

  const handleToggleRecording = async () => {
    if (isRecording) {
      stopRecording(); 
    } else {
      startRecording(); 
    }
  };

  return (
    <div>
      <button
        onClick={handleToggleRecording}
        className={`px-4 py-2 rounded ${
          isRecording ? "bg-red-500" : "bg-green-500"
        } text-white`}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      {audioURL && (
        <audio
          ref={audioRef}
          src={audioURL}
          style={{ display: "none" }} // Hides the audio player
        ></audio>
      )}
    </div>
  );
};

export default AudioRecorder;
