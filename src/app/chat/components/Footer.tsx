"use client";

import { FC, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { TranslationRecognizer } from "microsoft-cognitiveservices-speech-sdk";

import { useGlobalContext } from "@/app/context";
import { useChatContext } from "@/app/chat/contexts/ChatContext";

import { ReactLottie } from "@/app/chat/components/ReactLottie";

import { translationOnceFromMic } from "@/app/chat/util";

import animationData from "../../../../public/mike-animation.json";

interface FooterProps {}

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const Footer: FC<FooterProps> = () => {
  const { language, sessionId, voice } = useGlobalContext();
  const {
    isRecording,
    isAudioPlaying,
    messages,
    isLoading,
    setMessages,
    setIsRecording,
    setIsAudioPlaying,
    setCurrentPlayingIndex,
    setIsLoading,
    setTtsController,
    defaultMsgPlayer,
    setDefaultMsgIsPlaying,
  } = useChatContext();

  const [recognizer, setRecognizer] = useState<TranslationRecognizer>();

  const stopRecognition = () => {
    recognizer?.stopContinuousRecognitionAsync();
    setIsRecording(false);
  };

  if (isRecording) {
    defaultMsgPlayer?.pause();
    setDefaultMsgIsPlaying(false);
  }

  return (
    <footer>
      <div className="flex justify-center items-center mt-8">
        {isRecording ? (
          <div onClick={stopRecognition}>
            <ReactLottie options={defaultOptions} height={150} width={150} />
          </div>
        ) : (
          <div
            className={`${isAudioPlaying || isLoading ? "opacity-50" : ""}`}
            onClick={() => {
              if (isAudioPlaying || isLoading) return;
              setIsRecording(true);
              const rec = translationOnceFromMic({
                language,
                sessionId,
                voice,
                isAudioPlaying,
                messages,
                setIsAudioPlaying,
                setIsRecording,
                setMessages,
                setCurrentPlayingIndex,
                setIsLoading,
                setTtsController,
              });
              setRecognizer(rec);
            }}
          >
            <Image
              src={"../chatMicrophone.svg"}
              height={150}
              width={150}
              alt="chatMicrophone.svg"
            />
          </div>
        )}
      </div>
    </footer>
  );
};

export { Footer };
