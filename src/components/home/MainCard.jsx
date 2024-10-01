import * as React from "react";
import { Button } from "@/components/ui/button";
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

import ThreeScene from "@/components/ThreeScene";

const MainCard = () => {
  return (
    <Card className="w-2/3 h-2/3 max-w-[700px] dark:dark-shadow">
      <CardHeader>
        <CardTitle>Chat with SCG</CardTitle>
        <CardDescription className="mb-4">
          Choose providers and hit record.
        </CardDescription>
      </CardHeader>
      <div className="w-full h-full flex justify-center items-center">
        <Card className="w-2/3 aspect-square ">
          <ThreeScene />
        </Card>
      </div>
      <CardContent className="mt-4">
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="stt-provider">STT Provider</Label>
              <Select>
                <SelectTrigger id="stt-provider">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="openai_stt">OpenAI Whisper</SelectItem>
                  <SelectItem value="aws_stt">AWS Transcribe</SelectItem>
                  <SelectItem value="google_stt">
                    Google Speech-to-Text
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="tts-provider">TTS Provider</Label>
              <Select>
                <SelectTrigger id="tts-provider">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="openai_tts">OpenAI TTS</SelectItem>
                  <SelectItem value="aws_tts">AWS Polly</SelectItem>
                  <SelectItem value="google_tts">
                    Google Text-to-Speech
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="query-provider">Query Provider</Label>
              <Select>
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
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  );
};

export default MainCard;
