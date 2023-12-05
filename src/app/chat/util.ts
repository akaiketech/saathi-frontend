import { Dispatch, SetStateAction } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { v4 as uuidv4 } from "uuid";

import { Message } from "@/app/types";

import { queryApi } from "@/app/chat/api";

interface TranslationOnceFromMicProps {
  language: string;
  sessionId: string;
  voice: string;
  isAudioPlaying: boolean;
  messages: Message[];
  setIsAudioPlaying: Dispatch<SetStateAction<boolean>>;
  setIsRecording: Dispatch<SetStateAction<boolean>>;
  setMessages: Dispatch<SetStateAction<Message[]>>;
  setCurrentPlayingIndex: Dispatch<SetStateAction<number | undefined>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setTtsController: Dispatch<
    SetStateAction<sdk.SpeakerAudioDestination | null>
  >;
}

export const uint8ArrayToBase64 = (bytes: Uint8Array) => {
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

let timeoutId: NodeJS.Timeout;

export const textToSpeech = (
  text: string,
  language: string,
  voice: string,
  onStart: any,
  onEnd: any
) => {
  const speechKey = process.env.NEXT_PUBLIC_SPEECH_KEY;
  const serviceRegion = process.env.NEXT_PUBLIC_SPEECH_REGION;

  const speechConfig = sdk.SpeechConfig.fromSubscription(
    speechKey ?? "",
    serviceRegion ?? ""
  );

  const voiceMap: Record<string, Record<string, string>> = {
    hindi: {
      female: "hi-IN-SwaraNeural",
      male: "hi-IN-MadhurNeural",
    },
    english: {
      female: "en-IN-NeerjaNeural",
      male: "en-IN-PrabhatNeural",
    },
  };

  speechConfig.speechRecognitionLanguage =
    language === "hindi" ? "hi-IN" : "en-IN";
  speechConfig.speechSynthesisVoiceName = voiceMap[language]?.[voice];

  const player = new sdk.SpeakerAudioDestination();
  // player.onAudioStart = () => {
  //   console.log("audio started playing");
  //   onStart();
  // };
  // player.onAudioEnd = () => {
  //   console.log("audio finished playing");
  //   onEnd();
  // };

  const audioConfig = sdk.AudioConfig.fromSpeakerOutput(player);
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

  let estimatedDuration = text.length * 90;

  synthesizer.synthesisStarted = (_s, _e) => {
    onStart();
    timeoutId = setTimeout(() => {
      onEnd();
    }, estimatedDuration);
  };

  synthesizer.speakTextAsync(text);

  return { player };
};

export const translationOnceFromMic = ({
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
}: TranslationOnceFromMicProps) => {
  const speechKey = process.env.NEXT_PUBLIC_SPEECH_KEY;
  const serviceRegion = process.env.NEXT_PUBLIC_SPEECH_REGION;

  const translationConfig = sdk.SpeechTranslationConfig.fromSubscription(
    speechKey ?? "",
    serviceRegion ?? ""
  );

  translationConfig.speechRecognitionLanguage =
    language === "hindi" ? "hi-IN" : "en-US";
  translationConfig.addTargetLanguage(language === "hindi" ? "en" : "hi");

  const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();

  const recognizer = new sdk.TranslationRecognizer(
    translationConfig,
    audioConfig
  );

  console.log("Say something...");

  const message: Message = {
    id: uuidv4(),
    question: { englishText: "", hindiText: "", audio: "" },
    answer: { englishText: "", hindiText: "", audio: "" },
    isLoading: false,
  };

  const wavFragments: { [id: number]: ArrayBuffer } = {};
  let wavFragmentCount = 0;

  const con: sdk.Connection = sdk.Connection.fromRecognizer(recognizer);

  con.messageSent = (args: sdk.ConnectionMessageEventArgs): void => {
    if (
      args.message.path === "audio" &&
      args.message.isBinaryMessage &&
      args.message.binaryMessage !== null
    ) {
      wavFragments[wavFragmentCount++] = args.message.binaryMessage;
    }
  };

  const recognizeOnceAsync = (): Promise<sdk.TranslationRecognitionResult> =>
    new Promise((resolve, reject) => {
      recognizer.recognizeOnceAsync(async (result) => {
        resolve(result as sdk.TranslationRecognitionResult);

        let byteCount: number = 0;
        for (let i: number = 0; i < wavFragmentCount; i++) {
          byteCount += wavFragments[i].byteLength;
        }

        const sentAudio: Uint8Array = new Uint8Array(byteCount);

        byteCount = 0;
        for (let i: number = 0; i < wavFragmentCount; i++) {
          sentAudio.set(new Uint8Array(wavFragments[i]), byteCount);
          byteCount += wavFragments[i].byteLength;
        }

        if (language === "hindi") {
          message.question.hindiText = result.text;
          message.question.englishText = result.translations.get("en");
        } else {
          message.question.englishText = result.text;
          message.question.hindiText = result.translations.get("hi");
        }
        message.isLoading = true;

        setMessages((prevMsgs) => [...prevMsgs, message]);
        setIsRecording(false);

        const data = await queryApi({
          queryId: message.id,
          sessionId,
          hindiQuery: message.question.hindiText,
          englishQuery: message.question.englishText,
          audio: sentAudio,
          setIsLoading,
        });
        if (data) {
          message.answer.hindiText = data.hindi_answer;
          message.answer.englishText = data.english_answer;
        }
        message.isLoading = false;

        setMessages((prevMsgs) => {
          const index = prevMsgs.length - 1;
          const newMsgs = [...prevMsgs];
          newMsgs[index] = { ...message };
          return newMsgs;
        });

        const textToSpeak =
          language === "hindi"
            ? message.answer.hindiText
            : message.answer.englishText;

        const controller = textToSpeech(
          textToSpeak,
          language,
          voice,
          () => {
            setIsAudioPlaying(true);
          },
          () => {
            setIsAudioPlaying(false);
            setCurrentPlayingIndex(undefined);
          }
        );

        setCurrentPlayingIndex(messages.length);
        setTtsController(controller.player);
      }, reject);
    });

  recognizeOnceAsync();

  return recognizer;
};
