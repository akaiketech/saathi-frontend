"use client";

import React, { useState, useEffect } from "react";
import {
  SpeechTranslationConfig,
  AudioConfig,
  TranslationRecognizer,
  ResultReason,
} from "microsoft-cognitiveservices-speech-sdk";
import { queryApi } from "./util";

function App() {
  const [queryInHindi, setQueryInHindi] = useState("");
  const [queryInEnglish, setQueryInEnglish] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recognizer, setRecognizer] = useState<TranslationRecognizer>();
  const [silenceTimer, setSilenceTimer] = useState<NodeJS.Timeout>();
  const [shouldQueryApi, setShouldQueryApi] = useState(false);

  const getQueryResult = async () => {
    console.log(
      "🚀 ~ file: page.tsx:18 ~ getQueryResult ~ queryInHindi:",
      queryInHindi
    );
    console.log(
      "🚀 ~ file: page.tsx:18 ~ getQueryResult ~ queryInEnglish:",
      queryInEnglish
    );
    const result = await queryApi(queryInHindi, queryInEnglish, "123456789");
    console.log("API Result:", result);
  };

  const startRecognition = () => {
    setQueryInHindi("");
    setQueryInEnglish("");

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

    let isSpeaking = false;

    setShouldQueryApi(true);

    recognizer.recognizing = (_, e) => {
      const hindiText = e.result.text;
      const englishText = e.result.translations.get("en");

      setQueryInHindi((prevText) => prevText + " " + hindiText.trim());
      setQueryInEnglish((prevText) => prevText + " " + englishText.trim());

      // Reset the silence timer
      if (!isSpeaking) {
        isSpeaking = true;
        if (silenceTimer) {
          clearTimeout(silenceTimer);
        }
      }

      isSpeaking = false;

      // Set a timer to stop recognition if there's silence for more than 5 seconds
      if (silenceTimer) {
        clearTimeout(silenceTimer);
      }
      setSilenceTimer(
        setTimeout(() => {
          stopRecognition();
        }, 5000)
      );
    };

    recognizer.recognized = (_, e) => {
      if (e.result.reason === ResultReason.NoMatch) {
      }
    };

    recognizer.canceled = () => {
      setIsRecording(false);
      console.log("Recognition Canceled");
    };

    setRecognizer(recognizer);
    recognizer.startContinuousRecognitionAsync();
    setIsRecording(true);
  };
  const stopRecognition = () => {
    if (recognizer) {
      recognizer.stopContinuousRecognitionAsync();
      setIsRecording(false);
      if (shouldQueryApi) {
        getQueryResult();
      }
      setShouldQueryApi(false); // Reset the flag
    }
  };

  return (
    <div className="App">
      <button onClick={isRecording ? stopRecognition : startRecognition}>
        {isRecording ? "Stop Recognition" : "Start Recognition"}
      </button>
      <div>{isRecording ? "Recording..." : "Not Recording"}</div>
      <div>Recognized Text: {queryInHindi}</div>
    </div>
  );
}

export default App;
