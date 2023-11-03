"use client";

import { FC } from "react";
import Image from "next/image";

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
    setMessages,
    setIsRecording,
    setIsAudioPlaying,
    setCurrentPlayingIndex,
  } = useChatContext();

  return (
    <footer>
      <div className="flex justify-center items-center mt-8">
        {isRecording ? (
          <div>
            <ReactLottie options={defaultOptions} height={150} width={150} />
          </div>
        ) : (
          <div
            className={`${isAudioPlaying ? "opacity-50" : ""}`}
            onClick={() => {
              if (isAudioPlaying) return;
              setIsRecording(true);
              translationOnceFromMic(
                language,
                sessionId,
                voice,
                isAudioPlaying,
                messages,
                setIsAudioPlaying,
                setIsRecording,
                setMessages,
                setCurrentPlayingIndex
              ).catch((err) => console.error(err));
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
