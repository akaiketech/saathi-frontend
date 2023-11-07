"use client";

import { FC, useEffect, useRef, useState } from "react";
import Image from "next/image";

import { useGlobalContext } from "@/app/context";
import { useChatContext } from "@/app/chat/contexts/ChatContext";

import { votingApi } from "@/app/chat/api";

import { ReactLottie } from "@/app/chat/components/ReactLottie";

import loadingData from "../../../../public/loading.json";

interface MessagesListProps {}

const loadingOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const MessagesList: FC<MessagesListProps> = ({}) => {
  const { language, voice, sessionId } = useGlobalContext();
  const {
    messages,
    currentPlayingIndex,
    setMessages,
    replayAudio,
    stopPlayingAudio,
  } = useChatContext();

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [JSON.stringify(messages)]);

  const handleStopReplay = () => stopPlayingAudio();

  const handleReplayClick = (index: number) =>
    replayAudio(index, language, voice);

  const handleUpVote = () => {
    setMessages((prevMsgs) => {
      const index = prevMsgs.length - 1;
      const newMsgs = [...prevMsgs];
      const currentMsg = newMsgs[index];
      currentMsg.answer.vote = 1;
      votingApi(sessionId, currentMsg.id, 1);
      return newMsgs;
    });
  };

  const handleDownVote = () => {
    setMessages((prevMsgs) => {
      const index = prevMsgs.length - 1;
      const newMsgs = [...prevMsgs];
      const currentMsg = newMsgs[index];
      currentMsg.answer.vote = 1;
      votingApi(sessionId, currentMsg.id, 0);
      return newMsgs;
    });
  };

  return (
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
                <Image src="/avatar.svg" alt="avatar" height={36} width={36} />
              </div>
            </div>
            {messageObj.isLoading ? (
              <div>
                <ReactLottie
                  options={loadingOptions}
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
                    {!messageObj.answer.vote ? (
                      <div className="flex w-full justify-evenly text-4xl">
                        <div onClick={handleUpVote}>👍</div>
                        <div onClick={handleDownVote}>👎</div>
                      </div>
                    ) : null}
                    {currentPlayingIndex === index ? (
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
                        onClick={() => handleReplayClick(index)}
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
              <Image src="/chatBot.png" alt="chatBot" height={36} width={36} />
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
  );
};

export { MessagesList };
