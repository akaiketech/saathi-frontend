"use client";

import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

import { Message } from "@/app/types";

interface ChatContextType {
  isLoading: boolean;
  isRecording: boolean;
  isAudioPlaying: boolean;
  messages: Message[];
  currentPlayingIndex: number | undefined;
  ttsController: sdk.SpeakerAudioDestination | null;
  timerId: NodeJS.Timeout | null;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setIsAudioPlaying: Dispatch<SetStateAction<boolean>>;
  setIsRecording: Dispatch<SetStateAction<boolean>>;
  setMessages: Dispatch<SetStateAction<Message[]>>;
  setCurrentPlayingIndex: Dispatch<SetStateAction<number | undefined>>;
  setTtsController: Dispatch<
    SetStateAction<sdk.SpeakerAudioDestination | null>
  >;
  setTimerId: Dispatch<SetStateAction<NodeJS.Timeout | null>>;
}

const ChatContext = createContext<ChatContextType>({} as ChatContextType);

interface Props {
  children: ReactNode;
}

export const ChatProvider: FC<Props> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number>();
  const [ttsController, setTtsController] =
    useState<sdk.SpeakerAudioDestination | null>(null);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  return (
    <ChatContext.Provider
      value={{
        isRecording,
        isAudioPlaying,
        isLoading,
        messages,
        currentPlayingIndex,
        ttsController,
        timerId,
        setIsLoading,
        setIsAudioPlaying,
        setIsRecording,
        setMessages,
        setCurrentPlayingIndex,
        setTtsController,
        setTimerId,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
