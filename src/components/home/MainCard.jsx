"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import RecordButton from "@/components/home/RecordButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// import AudioVisualize from "@/components/home/AudioVisualize";
import { Canva } from "@/components/home/Canva";

const MainCard = () => {
  const [sttProvider, setSttProvider] = useState("openai_stt");
  const [ttsProvider, setTtsProvider] = useState("openai_tts");
  const [queryProvider, setQueryProvider] = useState("chatgpt");
  const [processedAudioURL, setProcessedAudioURL] = useState(null);
  const [textResponse, setTextResponse] = useState(null);

  useEffect(() => {
    console.log("sttProvider", sttProvider);
    console.log("ttsProvider", ttsProvider);
    console.log("queryProvider", queryProvider);
    console.log("textResponse", textResponse);
  }, [sttProvider, ttsProvider, queryProvider, textResponse]);

  return (
    <Card className="w-2/3 h-2/3 max-w-[700px] dark:dark-shadow">
      <CardHeader>
        <CardTitle>
          Chat with
          <span className="text-teal-600 font-bold"> SCG</span>
        </CardTitle>
        <CardDescription className="mb-4">
          Choose providers and hit record.
        </CardDescription>
      </CardHeader>
      <div className="w-full h-full flex justify-center items-center">
        <Card className="w-2/3 aspect-square overflow-hidden">
          {/* <AudioVisualize processedAudioURL={processedAudioURL} /> */}
          <Canva
            processedAudioURL={processedAudioURL}
            textResponse={textResponse}
          />
        </Card>
      </div>
      <CardContent className="mt-4">
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="stt-provider">STT Provider</Label>
              <Select
                value={sttProvider}
                onValueChange={(value) => setSttProvider(value)}
              >
                <SelectTrigger id="stt-provider">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="google_stt">
                    Google Speech-to-Text
                  </SelectItem>
                  <SelectItem value="openai_stt">OpenAI Whisper</SelectItem>
                  <SelectItem value="aws_stt">AWS Transcribe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="tts-provider">TTS Provider</Label>
              <Select
                value={ttsProvider}
                onValueChange={(value) => setTtsProvider(value)}
              >
                <SelectTrigger id="tts-provider">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="google_tts">
                    Google Text-to-Speech
                  </SelectItem>
                  <SelectItem value="openai_tts">OpenAI TTS</SelectItem>
                  <SelectItem value="aws_tts">AWS Polly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="query-provider">Query Provider</Label>
              <Select
                value={queryProvider}
                onValueChange={(value) => setQueryProvider(value)}
              >
                <SelectTrigger id="query-provider">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="chatgpt">ChatGPT</SelectItem>
                  <SelectItem value="gemini">Gemini AI</SelectItem>
                  <SelectItem value="llama">Llama AI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <RecordButton
          sttProvider={sttProvider}
          ttsProvider={ttsProvider}
          queryProvider={queryProvider}
          setProcessedAudioURL={setProcessedAudioURL}
          setTextResponse={setTextResponse}
        />
      </CardFooter>
    </Card>
  );
};

export default MainCard;
