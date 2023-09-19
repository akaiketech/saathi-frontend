import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { toast } from "react-toastify";

export const queryApi = async ({
  hindiQuery,
  englishQuery,
  sessionId,
  audio,
}: any) => {
  const res = await fetch("/api/v1/user_query", {
    method: "POST",
    body: JSON.stringify({
      hindiQuery,
      englishQuery,
      sessionId,
      audio: uint8ArrayToBase64(audio),
    }),
  });

  const data = await res.json();

  if (data.error) {
    toast.error(data.error, {
      autoClose: 5000,
      position: "top-right",
    });
  } else {
    return data;
  }
};

export const uint8ArrayToBase64 = (bytes: Uint8Array) => {
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

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
  const audioConfig = sdk.AudioConfig.fromSpeakerOutput(player);
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

  let estimatedDuration = text.length * 90;

  synthesizer.synthesisStarted = (_s, _e) => {
    onStart();
    setTimeout(() => {
      onEnd();
    }, estimatedDuration);
  };
  synthesizer.speakTextAsync(text);

  return player;
};

export const feedBackApi = async (sessionId: string, rating: number) => {
  const res = await fetch("/api/v1/session_feedback", {
    method: "POST",
    body: JSON.stringify({
      rating,
      sessionId,
    }),
  });

  const data = await res.json();

  if (data.error) {
    toast.error(data.error, {
      autoClose: 5000,
      position: "top-right",
    });
  } else {
    return data;
  }
};
