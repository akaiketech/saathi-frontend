import {
  SpeechConfig,
  AudioConfig,
  SpeechSynthesizer,
  SpeechSynthesisResult,
} from "microsoft-cognitiveservices-speech-sdk";

export const queryApi = async (
  hindiQuery: string,
  englishQuery: string,
  sessionId: string
) => {
  const res = await fetch("/api/query", {
    method: "POST",
    body: JSON.stringify({ hindiQuery, englishQuery, sessionId }),
  });

  const data = await res.json();

  if (data.error) {
    console.log("🚀 ~ file: util.tsx:14 ~ data.error:", data.error);
    return null;
  } else {
    return data;
  }
};

export const textToSpeech = (text: string): Promise<SpeechSynthesisResult> => {
  return new Promise((resolve, reject) => {
    const speechKey = process.env.NEXT_PUBLIC_SPEECH_KEY;
    const serviceRegion = process.env.NEXT_PUBLIC_SPEECH_REGION;

    if (!speechKey || !serviceRegion) {
      reject(new Error("Speech key or region is not configured"));
      return;
    }

    const speechConfig = SpeechConfig.fromSubscription(
      speechKey,
      serviceRegion
    );
    speechConfig.speechRecognitionLanguage = "hi-IN";

    const audioConfig = AudioConfig.fromDefaultSpeakerOutput();
    const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);

    synthesizer.speakTextAsync(
      text,
      (result) => {
        console.log("Speech synthesis completed.");
        synthesizer.close();
        resolve(result);
      },
      (error) => {
        console.error("Error during speech synthesis:", error);
        synthesizer.close();
        reject(error);
      }
    );
  });
};
