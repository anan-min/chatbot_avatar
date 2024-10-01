export const sendAudioToApi = async (audioBlob) => {
  const formData = new FormData();
  formData.append("audio", audioBlob);

  try {
    console.log("response sended", formData);
    
    const response = await fetch("http://127.0.0.1:5000/upload", {
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
