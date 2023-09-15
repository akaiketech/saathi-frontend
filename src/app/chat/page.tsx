"use client";

import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import {
  SpeechTranslationConfig,
  AudioConfig,
  TranslationRecognizer,
  SpeechSynthesizer,
} from "microsoft-cognitiveservices-speech-sdk";
import Lottie from "react-lottie";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

import { queryApi, textToSpeech } from "./util";
import { Message } from "../types";
import Image from "next/image";
import { useGlobalContext } from "../context";

import animationData from "./mike-animation.json";
import loadingData from "./loading.json";

const ChatPage = () => {
  const { language, sessionId, voice } = useGlobalContext();
  console.log("🚀 ~ file: page.tsx:21 ~ ChatPage ~ language:", language);
  const [isRecording, setIsRecording] = useState(false);
  const [recognizer, setRecognizer] = useState<TranslationRecognizer>();
  const [messages, setMessages] = useState<Message[]>([]);
  console.log("🚀 ~ file: page.tsx:25 ~ ChatPage ~ messages:", messages);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const messagesContainerRef = useRef<null | HTMLDivElement>(null);

  const [reload, setReload] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  console.log(
    "🚀 ~ file: page.tsx:33 ~ ChatPage ~ isAudioPlaying:",
    isAudioPlaying
  );

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
      // messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [JSON.stringify(messages)]);

  const translationOnceFromMic = async () => {
    const speechKey = process.env.NEXT_PUBLIC_SPEECH_KEY;
    const serviceRegion = process.env.NEXT_PUBLIC_SPEECH_REGION;

    const translationConfig = sdk.SpeechTranslationConfig.fromSubscription(
      speechKey ?? "",
      serviceRegion ?? ""
    );

    translationConfig.speechRecognitionLanguage =
      language === "hindi" ? "hi-IN" : "en-US";
    translationConfig.addTargetLanguage(language === "hindi" ? "en" : "hi");

    // Set silence timeout in milliseconds
    // translationConfig.setProperty(
    //   sdk.PropertyId[
    //     sdk.PropertyId.SpeechServiceConnection_EndSilenceTimeoutMs
    //   ],
    //   "5000"
    // );

    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();

    const recognizer = new sdk.TranslationRecognizer(
      translationConfig,
      audioConfig
    );

    console.log("Say something...");

    const message: Message = {
      question: { englishText: "", hindiText: "", audio: "" },
      answer: { englishText: "", hindiText: "", audio: "" },
      isLoading: false,
    };

    const recognizeOnceAsync = (): Promise<sdk.TranslationRecognitionResult> =>
      new Promise((resolve, reject) => {
        recognizer.recognizeOnceAsync(
          (result) => resolve(result as sdk.TranslationRecognitionResult),
          reject
        );
      });

    const result = await recognizeOnceAsync();

    if (result.reason === sdk.ResultReason.TranslatedSpeech) {
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
        sessionId,
        hindiQuery: message.question.hindiText,
        englishQuery: message.question.englishText,
      });
      if (data) {
        message.answer.hindiText = data.hindi_answer;
        message.answer.englishText = data.english_answer;
      }
      message.isLoading = false;

      setReload(!reload);
      setMessages((prevMsgs) => {
        const index = prevMsgs.length;
        let currentMsg = prevMsgs[index - 1];
        currentMsg = message;
        return prevMsgs;
      });
    }
  };

  const stopRecognition = () => {
    setIsRecording(false);

    if (recognizer) {
      recognizer.stopContinuousRecognitionAsync();
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const defaultOptionsForLoading = {
    loop: true,
    autoplay: true,
    animationData: loadingData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleEndConversation = () => {};

  return (
    <main className="pt-6 pl-6 pr-6">
      <header className="flex">
        <h2 className="text-[#DC493A] text-[64px] not-italic font-bold leading-[normal] ">
          SAATHI
        </h2>

        <button
          className="ml-auto text-2xl flex items-center"
          onClick={handleEndConversation}
        >
          End
          <Image
            src={"../logout.svg"}
            height={26}
            width={26}
            alt="logout.svg"
            className="ml-2"
          />
        </button>
      </header>
      <div
        className="bg-[#f9f6f6] rounded-[40px] h-[800px] mt-6 overflow-y-scroll"
        ref={messagesEndRef}
      >
        {messages.length ? (
          messages.map((messageObj, index) => (
            <div key={index} className="w-full p-8 flex flex-col">
              <div className="flex items-end ml-auto w-fit max-w-[50%]">
                <div className=" p-3 rounded-[30px_30px_0px_30px] bg-[#ff725e] ">
                  <div className="text-white text-[18px] not-italic font-semibold leading-[normal]  text-right">
                    {language === "hindi"
                      ? messageObj.question.hindiText
                      : messageObj.question.englishText}
                  </div>
                </div>
                <div className="ml-1">
                  <Image
                    src="/avatar.svg"
                    alt="avatar"
                    height={36}
                    width={36}
                  />
                </div>
              </div>
              {messageObj.isLoading ? (
                <div>
                  <Lottie
                    options={defaultOptionsForLoading}
                    height={200}
                    width={200}
                  />
                </div>
              ) : (
                (messageObj.answer.hindiText ||
                  messageObj.answer.englishText) && (
                  <>
                    <div className="flex items-end">
                      <div className="mr-1">
                        <Image
                          src="/avatar.svg"
                          alt="avatar"
                          height={36}
                          width={36}
                        />
                      </div>
                      <div className="w-1/2 p-3 rounded-[30px_30px_30px_0px] bg-[#FFCBC366] text-gray-700">
                        <div className="text-[18px] not-italic font-semibold leading-[normal]">
                          {language === "hindi"
                            ? messageObj.answer.hindiText
                            : messageObj.answer.englishText}
                        </div>
                      </div>
                    </div>
                    <div className="mt-1 ml-8 w-1/2 flex justify-end ">
                      <button
                        className="flex items-center"
                        onClick={() => {
                          const currentMesssage = messages[messages.length - 1];

                          textToSpeech(
                            language === "hindi"
                              ? currentMesssage.answer.hindiText
                              : currentMesssage.answer.englishText,
                            language,
                            voice,
                            () => setIsAudioPlaying(true),
                            () => setIsAudioPlaying(false)
                          );
                        }}
                      >
                        <Image
                          src="../replay.svg"
                          alt="avatar"
                          height={16}
                          width={16}
                          className="mr-1"
                        />
                        Replay
                      </button>
                    </div>
                  </>
                )
              )}
            </div>
          ))
        ) : (
          <div className="text-black bg-red flex justify-center flex-col items-center h-full text-2xl">
            Please click on mic{" "}
            <Image
              height={30}
              width={30}
              src="/microphone.svg"
              alt="microphone.svg"
              priority
              onClick={() => {
                toast.info(
                  "😅 you fell in our trap. kindly click on the bigger microphone 😂",
                  {
                    autoClose: 5000,
                    position: "top-right",
                  }
                );
              }}
              className="my-3"
            />
            to start
          </div>
        )}
      </div>

      <footer>
        <div className="flex justify-center items-center mt-8">
          {isRecording ? (
            <div onClick={stopRecognition}>
              <Lottie options={defaultOptions} height={200} width={200} />
            </div>
          ) : (
            <div
              className={`${isAudioPlaying ? "opacity-50" : ""}`}
              onClick={() => {
                if (isAudioPlaying) return;
                setIsRecording(true);
                translationOnceFromMic().catch((err) => console.error(err));
              }}
            >
              <Image
                src={"../chatMicrophone.svg"}
                height={200}
                width={200}
                alt="chatMicrophone.svg"
              />
            </div>
          )}
        </div>
      </footer>
    </main>
  );
};

export default ChatPage;
