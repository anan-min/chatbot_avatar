export const sendAudioToApi = async (
  audioBlob,
  sttProvider,
  ttsProvider,
  queryProvider
) => {
  const formData = new FormData();
  formData.append("audio_file", audioBlob);
  formData.append("stt_provider", sttProvider);
  formData.append("tts_provider", ttsProvider);
  formData.append("query_provider", queryProvider); // Query Provider

  try {
    console.log("response sended", formData);

    const response = await fetch("http://127.0.0.1:5000", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    console.log("response recieved", response);
    const audioBlobFromApi = await response.blob();
    return URL.createObjectURL(audioBlobFromApi); // Return the audio URL
  } catch (error) {
    console.error("Error sending audio to API:", error);
    throw error;
  }
};
