"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  SpeechTranslationConfig,
  AudioConfig,
  TranslationRecognizer,
} from "microsoft-cognitiveservices-speech-sdk";

import { queryApi, textToSpeech } from "./util";
import { Message } from "../types";

const ChatPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognizer, setRecognizer] = useState<TranslationRecognizer>();
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [audioChunks, setAudioChunks] = useState<BlobPart[]>([]);
  console.log("🚀 ~ file: page.tsx:19 ~ ChatPage ~ audioChunks:", audioChunks);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  console.log("🚀 ~ file: page.tsx:20 ~ ChatPage ~ messages:", messages);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const initAudioCapture = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        console.log("Stream:", stream);

        const newMediaRecorder = new MediaRecorder(stream);
        setMediaRecorder(newMediaRecorder);

        newMediaRecorder.ondataavailable = (event) => {
          console.log("Data available:", event.data);

          setAudioChunks((prevAudioChunks) => {
            const newAudioChunks = [...prevAudioChunks, event.data];
            console.log("New audio chunks:", newAudioChunks);
            return newAudioChunks;
          });
        };

        newMediaRecorder.onstop = () => {
          console.log("Recorder stopped.");
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          const audioUrl = URL.createObjectURL(audioBlob);
          console.log("🚀 ~ file: page.tsx:55 ~ .then ~ audioUrl:", audioUrl);
        };

        newMediaRecorder.start();
      })
      .catch((err) => {
        console.error("Error initializing audio capture:", err);
      });
  };

  const stopAudioCapture = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  const getQueryResult = async (index: number) => {
    const messagesCopy = [...messages];
    messagesCopy[index].isLoading = true;

    const result = await queryApi(
      messagesCopy[index].question.hindiText ?? "",
      messagesCopy[index].question.englishText ?? "",
      "123456789"
    );

    messagesCopy[index].answer.hindiText = result.hindi_answer;
    messagesCopy[index].answer.englishText = result.english_answer;
    messagesCopy[index].isLoading = false;
    setMessages(messagesCopy);
  };

  const startRecognition = () => {
    const speechKey = process.env.NEXT_PUBLIC_SPEECH_KEY;
    const serviceRegion = process.env.NEXT_PUBLIC_SPEECH_REGION;

    const translationConfig = SpeechTranslationConfig.fromSubscription(
      speechKey || "",
      serviceRegion || ""
    );

    translationConfig.speechRecognitionLanguage = "hi-IN";
    translationConfig.addTargetLanguage("en");

    const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new TranslationRecognizer(
      translationConfig,
      audioConfig
    );

    const message: Message = {
      question: { englishText: "", hindiText: "", audio: new ArrayBuffer(0) },
      answer: { englishText: "", hindiText: "", audio: new ArrayBuffer(0) },
      isLoading: false,
    };

    initAudioCapture();

    recognizer.recognizing = (_, e) => {
      const hindiText = e.result.text;
      const englishText = e.result.translations.get("en");

      message.question.englishText += " " + englishText.trim();
      message.question.hindiText += " " + hindiText.trim();

      setMessages([...messages, message]);
    };

    recognizer.canceled = () => {
      stopAudioCapture();
      setIsRecording(false);
      console.log("Recognition Canceled");
    };

    setRecognizer(recognizer);
    recognizer.startContinuousRecognitionAsync();
    setIsRecording(true);
  };

  const stopRecognition = () => {
    if (recognizer) {
      stopAudioCapture();
      recognizer.stopContinuousRecognitionAsync();
      setIsRecording(false);
      getQueryResult(messages.length - 1);
    }
  };

  const playAudio = async (hindiText: string) => {
    try {
      await textToSpeech(hindiText);
    } catch (error) {
      console.error("Failed to convert text to speech", error);
    }
  };

  return (
    <main className="pt-6 pl-6 pr-6">
      <header>
        <h2 className="text-[#DC493A] text-[64px] not-italic font-bold leading-[normal] ">
          SAATHI
        </h2>
      </header>
      <div
        className="bg-[#f1f1f1] rounded-[40px] h-[800px] mt-6 overflow-y-scroll"
        ref={messagesEndRef}
      >
        {messages.length ? (
          messages.map((messageObj, index) => (
            <div key={index} className="w-full p-8 flex flex-col">
              <div className="w-1/2  p-3 rounded-[30px_30px_0px_30px] bg-[#ff725e] text-white text-[32px] not-italic font-semibold leading-[normal] ml-auto">
                {messageObj.question.hindiText}
              </div>
              {messageObj.isLoading ? (
                <div>Loading...</div>
              ) : (
                messageObj.answer.hindiText && (
                  <>
                    <div className="w-1/2  p-3 rounded-[30px_30px_30px_0px] bg-[#FFCBC366] text-black text-[32px] not-italic font-semibold leading-[normal]">
                      {messageObj.answer.hindiText}
                    </div>
                    <button
                      onClick={() => playAudio(messageObj.answer.hindiText)}
                    >
                      Play Audio
                    </button>
                  </>
                )
              )}
            </div>
          ))
        ) : (
          <div className="text-black bg-red flex justify-center flex-col items-center h-full">
            Please click on mike to start
          </div>
        )}
      </div>

      <footer>
        <div className="flex justify-center items-center mt-8">
          {isRecording ? (
            <div onClick={stopRecognition}>STOP RECORDING</div>
          ) : (
            <div onClick={startRecognition}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={188}
                height={188}
                viewBox="0 0 188 188"
                fill="none"
              >
                <path
                  d="M90.014 160.028c38.115 0 69.014-30.899 69.014-69.014C159.028 52.899 128.129 22 90.014 22 51.899 22 21 52.899 21 91.014c0 38.115 30.899 69.014 69.014 69.014z"
                  fill="#FF725E"
                />
                <g filter="url(#filter0_d_90_515)">
                  <path
                    d="M90 180c49.706 0 90-40.294 90-90S139.706 0 90 0 0 40.294 0 90s40.294 90 90 90z"
                    fill="url(#paint0_linear_90_515)"
                    shapeRendering="crispEdges"
                  />
                </g>
                <path
                  d="M90.574 70.059h-1.337a8.453 8.453 0 00-8.453 8.453v12.056a8.453 8.453 0 008.453 8.453h1.337a8.453 8.453 0 008.453-8.453V78.512a8.453 8.453 0 00-8.453-8.453z"
                  fill="#FAFAFA"
                />
                <path
                  d="M89.9 104.547a13.473 13.473 0 01-13.444-13.444.636.636 0 111.273 0 12.184 12.184 0 0012.17 12.171c1.619.074 3.235-.19 4.746-.776a11.65 11.65 0 006.658-6.65c.587-1.51.852-3.126.78-4.745a.637.637 0 111.273 0c0 7.906-5.538 13.431-13.457 13.444z"
                  fill="#FAFAFA"
                />
                <path
                  d="M76.62 75.33c-.076.165-1.043-.179-2.189-.663-1.146-.483-2.062-.954-2.011-1.133.05-.178 1.094 0 2.266.522 1.17.522 1.935 1.108 1.935 1.273zM81.713 68.505c-.14.115-.968-.763-1.846-1.947-.879-1.184-1.464-2.241-1.273-2.343.19-.102.967.764 1.846 1.948.878 1.184 1.4 2.24 1.273 2.343zM89.95 66.062c-.192 0-.319-1.108-.306-2.547.013-1.438.178-2.546.356-2.546a9.624 9.624 0 010 5.003l-.05.09zM100.542 64.266c.153.102-.242 1.044-.98 2.037-.739.993-1.553 1.63-1.68 1.503-.128-.128.42-.942 1.145-1.91.726-.968 1.349-1.719 1.515-1.63zM107.659 72.885c.089.166-.764.815-1.897 1.464-1.133.65-2.126 1.031-2.215.879-.09-.153.751-.815 1.884-1.464 1.133-.65 2.138-1.032 2.228-.879z"
                  fill="#fff"
                />
                <defs>
                  <filter
                    id="filter0_d_90_515"
                    x={0}
                    y={0}
                    width={188}
                    height={188}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dx={4} dy={4} />
                    <feGaussianBlur stdDeviation={2} />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <feBlend
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_90_515"
                    />
                    <feBlend
                      in="SourceGraphic"
                      in2="effect1_dropShadow_90_515"
                      result="shape"
                    />
                  </filter>
                  <linearGradient
                    id="paint0_linear_90_515"
                    x1={90}
                    y1={0}
                    x2={90}
                    y2={180}
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#FFB3A8" />
                    <stop offset={1} stopColor="#FF725E" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          )}
        </div>
      </footer>
    </main>
  );
};

export default ChatPage;
