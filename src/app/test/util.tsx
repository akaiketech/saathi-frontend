import * as sdk from "microsoft-cognitiveservices-speech-sdk";

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

  synthesizer.synthesisStarted = (_s, _e) => {
    onStart(player);
  };

  synthesizer.synthesisCompleted = (_s, _e) => {
    // onEnd();
  };

  synthesizer.speakTextAsync(text);

  return { player };
};
