import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { toast } from "react-toastify";

const blobToBase64 = (audioChunks: BlobPart[]) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result as string;

      if (result) {
        resolve(result);
      } else {
        reject("Failed to read Blob data as Base64.");
      }
    };

    reader.readAsDataURL(new Blob(audioChunks));
  });
};

export const queryApi = async ({
  hindiQuery,
  englishQuery,
  sessionId,
}: any) => {
  const res = await fetch("/api/v1/user_query", {
    method: "POST",
    body: JSON.stringify({
      hindiQuery,
      englishQuery,
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

export const textToSpeech = (text: string, language: string, voice: string) => {
  console.log("🚀 ~ file: util.ts:49 ~ textToSpeech ~ voice:", voice);
  console.log("🚀 ~ file: util.ts:49 ~ textToSpeech ~ language:", language);
  const speechKey = process.env.NEXT_PUBLIC_SPEECH_KEY;
  const serviceRegion = process.env.NEXT_PUBLIC_SPEECH_REGION;

  const speechConfig = sdk.SpeechConfig.fromSubscription(
    speechKey ?? "",
    serviceRegion ?? ""
  );

  if (language === "hindi") {
    speechConfig.speechRecognitionLanguage = "hi-IN";
    if (voice === "female") {
      speechConfig.speechSynthesisVoiceName = "hi-IN-SwaraNeural";
    } else {
      speechConfig.speechSynthesisVoiceName = "hi-IN-MadhurNeural";
    }
  } else {
    speechConfig.speechRecognitionLanguage = "en-IN";
    if (voice === "female") {
      speechConfig.speechSynthesisVoiceName = "en-IN-NeerjaNeural";
    } else {
      speechConfig.speechSynthesisVoiceName = "en-IN-PrabhatNeural";
    }
  }

  const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

  synthesizer.speakTextAsync(
    text,
    (result) => {
      if (result) {
        synthesizer.close();
        return result.audioData;
      }
    },
    (error) => {
      console.log(error);
      synthesizer.close();
    }
  );
};
