"use client";

import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Lottie from "react-lottie";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

import { feedBackApi, queryApi, textToSpeech } from "./util";
import { Message } from "../types";
import Image from "next/image";
import { useGlobalContext } from "../context";

import animationData from "./mike-animation.json";
import loadingData from "./loading.json";

const ChatPage = () => {
  const router = useRouter();
  const { language, sessionId, voice } = useGlobalContext();
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [starRating, setStarRating] = useState(0);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [ttsController, setTtsController] =
    useState<sdk.SpeechSynthesizer | null>(null);

  const [reload, setReload] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
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

    const wavFragments: { [id: number]: ArrayBuffer; } = {};
    let wavFragmentCount = 0;

    const con: sdk.Connection = sdk.Connection.fromRecognizer(recognizer);
    con.messageSent = (args: sdk.ConnectionMessageEventArgs): void => {
      // Only record outbound audio mesages that have data in them.
      if (args.message.path === "audio" && args.message.isBinaryMessage && args.message.binaryMessage !== null) {
        wavFragments[wavFragmentCount++] = args.message.binaryMessage;
      }
    };
    const recognizeOnceAsync = (): Promise<sdk.TranslationRecognitionResult> =>
      new Promise((resolve, reject) => {
        recognizer.recognizeOnceAsync(
          (result) => {
            resolve(result as sdk.TranslationRecognitionResult);
            // Find the length of the audio sent.
            let byteCount: number = 0;
            for (let i: number = 0; i < wavFragmentCount; i++) {
              byteCount += wavFragments[i].byteLength;
            }

            // Output array.
            const sentAudio: Uint8Array = new Uint8Array(byteCount);

            byteCount = 0;
            for (let i: number = 0; i < wavFragmentCount; i++) {
              sentAudio.set(new Uint8Array(wavFragments[i]), byteCount);
              byteCount += wavFragments[i].byteLength;
            }

            // Set the file size in the wave header:
            const view = new DataView(sentAudio.buffer);
            view.setUint32(4, byteCount, true);
            view.setUint32(40, byteCount, true);


            const postAudio = () => {
              // Post audio as form data upload
              const formData = new FormData();
              formData.append("csrf", "zgoJl1yFgA");
              formData.append("files", new Blob([sentAudio], { type: "audio/wav" }), "file.wav");


              fetch("http://localhost:8081/?csrf=zgoJl1yFgA", {
                method: "POST",
                body: formData,
              }).then(console.log)
            }
            postAudio();

          },
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

      const controller = textToSpeech(
        language === "hindi"
          ? message.answer.hindiText
          : message.answer.englishText,
        language,
        voice,
        () => setIsAudioPlaying(true),
        () => setIsAudioPlaying(false)
      );
      setTtsController(controller);
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

  const handleEndConversation = () => {
    setIsFeedbackDialogOpen(true);
  };

  const handleRatingClick = (rating: number) => {
    setStarRating(rating);
  };

  const handleStopReplay = () => {
    if (ttsController) {
      ttsController.close();
    }
    setIsAudioPlaying(false);
    setTtsController(null);
  };

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
          {language === "hindi" ? "अंत" : "End"}
          <Image
            src={"../logout.svg"}
            height={26}
            width={26}
            alt="logout.svg"
            className="ml-2"
          />
        </button>
        {isFeedbackDialogOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg w-96">
              <h3 className="text-xl mb-4 text-center">
                We'd love your feedback!
              </h3>
              <div className="flex my-6 justify-center">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    className={`p-2 text-4xl  ${starRating >= rating ? "text-yellow-500" : "text-gray-300"
                      }`}
                    onClick={() => handleRatingClick(rating)}
                  >
                    ★
                  </button>
                ))}
              </div>
              <div className="flex justify-evenly">
                <button
                  className="bg-red-500 text-white p-2 rounded mr-2"
                  onClick={() => {
                    setStarRating(0);
                    setIsFeedbackDialogOpen(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white p-2 rounded"
                  onClick={async () => {
                    if (starRating === 0) {
                      toast.info(
                        "please provide us with rating. so, that we will be able to help you better.",
                        {
                          autoClose: 5000,
                          position: "top-right",
                        }
                      );
                      return;
                    }
                    const data = await feedBackApi(sessionId, starRating);
                    if (data) {
                      setIsFeedbackDialogOpen(false);
                      router.replace("/");
                    }
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
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
                          src="/chatBot.png"
                          alt="chatBot"
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
                      {isAudioPlaying ? (
                        <button
                          className="flex items-center"
                          onClick={handleStopReplay}
                        >
                          <Image
                            src="../replay.svg" // Add your stop icon here
                            alt="Stop"
                            height={16}
                            width={16}
                            className="mr-1"
                          />
                          Stop
                        </button>
                      ) : (
                        <button
                          className="flex items-center"
                          onClick={() => {
                            if (isAudioPlaying) return;

                            const currentMesssage = messages[index];
                            const controller = textToSpeech(
                              language === "hindi"
                                ? currentMesssage.answer.hindiText
                                : currentMesssage.answer.englishText,
                              language,
                              voice,
                              () => setIsAudioPlaying(true),
                              () => setIsAudioPlaying(false)
                            );
                            setTtsController(controller);
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
                      )}
                    </div>
                  </>
                )
              )}
            </div>
          ))
        ) : (
          <div className="mt-2 ml-2">
            <div className="flex items-end">
              <div className="mr-1">
                <Image
                  src="/chatBot.png"
                  alt="chatBot"
                  height={36}
                  width={36}
                />
              </div>
              <div className="w-1/2 p-3 rounded-[30px_30px_30px_0px] bg-[#FFCBC366] text-gray-700">
                <div className="text-[18px] not-italic font-semibold leading-[normal]">
                  {language === "hindi"
                    ? "साथी में आपका स्वागत है, मैं एक ध्वनि आधारित वित्तीय योजना सलाहकार हूं। कृपया कोई भी सवाल पूछें, और मैं आपको स्पष्ट उत्तर दूंगा! "
                    : "Welcome to Saathi, your friendly financial scheme advisor through voice. Feel free to ask any questions, and I'll provide you with clear answers!"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer>
        <div className="flex justify-center items-center mt-8">
          {isRecording ? (
            <div>
              <Lottie options={defaultOptions} height={150} width={150} />
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
                height={150}
                width={150}
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
