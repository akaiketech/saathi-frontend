"use client";

import { useState } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

import { textToSpeech } from "./util";

type AudioStateType = {
  isPlaying: boolean;
  player: sdk.SpeakerAudioDestination | null;
};

const Test = () => {
  const [audioState, setAudioState] = useState<AudioStateType>({
    isPlaying: false,
    player: null,
  });

  const textsToTest = [
    "The resource <URL> was preloaded using link preload but not used within a few seconds from the window's load event. Please make sure it has an appropriate `as` value and it is preloaded intentionally.",
    "A quick brown fox jumps over the lazy dog.",
    "Welcome to our website. We hope you enjoy your visit.",
    "Error 404: The page you are looking for does not exist.",
    "Your transaction has been completed successfully.",
  ];

  const handleStart = (player: sdk.SpeakerAudioDestination) => {
    setAudioState({ isPlaying: true, player });
  };

  const handleEnd = () => {
    setAudioState({ isPlaying: false, player: null });
  };

  const handleClick = (text: string) => {
    textToSpeech(text, "english", "female", handleStart, handleEnd);
  };

  const handleStopClick = () => {
    audioState.player?.pause();
    audioState.player?.close();
    handleEnd(); // Update the state to reflect that audio has stopped
  };

  return (
    <div>
      {textsToTest.map((text, index) => (
        <button key={index} onClick={() => handleClick(text)}>
          Test {index + 1}
        </button>
      ))}
      {audioState.isPlaying && (
        <>
          <div>Playing</div>
          <button onClick={handleStopClick}>Stop</button>
        </>
      )}
    </div>
  );
};

export default Test;
