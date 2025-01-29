"use client";
import { useState, useRef } from "react";
import { sendAudioToApi } from "./apiHandler";

const RecordButton = ({
  sttProvider,
  ttsProvider,
  queryProvider,
  setProcessedAudioURL,
  setTextResponse,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
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
        const { text, audioUrl: processedAudioUrl } = await sendAudioToApi(
          audioBlob,
          sttProvider,
          ttsProvider,
          queryProvider
        );
        console.log("text response at recordbutton", text);
        setProcessedAudioURL(processedAudioUrl);
        setTextResponse(text);
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

  const handleStop = () => {
    setIsRecording(false);
    audioChunksRef.current = []; // Clear recorded audio chunks
    setProcessedAudioURL(null);
  };

  return (
    <div>
      <button
        onClick={handleToggleRecording}
        className={`px-6 py-3 rounded-full font-semibold transition-colors duration-300
          ${
            isRecording
              ? "bg-gray-500 text-white cursor-not-allowed"
              : "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
          }`}
      >
        {isRecording ? "End" : "Start"}
      </button>

      <button
        onClick={handleStop}
        className="ml-4 px-6 py-3 rounded-full bg-teal-500 text-white font-semibold hover:bg-teal-700 dark:bg-teal-500 dark:text-black dark:hover:bg-teal-400"
        disabled={isRecording} // Disable reset while recording
      >
        Stop
      </button>
    </div>
  );
};

export default RecordButton;
