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

    const responseData = await response.json();
    console.log("Response received:", responseData);

    const { text, audio_base64, mime_type } = responseData;
    console.log(text, audio_base64, mime_type);

    const audioUrl = `data:${mime_type};base64,${audio_base64}`;
    const audio = new Audio(audioUrl);
    audio.play();

    return { text, audioUrl };
  } catch (error) {
    console.error("Error sending audio to API:", error);
    throw error;
  }
};
