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
      votingApi(sessionId, currentMsg.id, -1);
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
                      <div className="mt-1 w-full flex justify-end ">
                        {!messageObj.answer.vote ? (
                          <div className="flex w-full justify-evenly text-4xl">
                            <div onClick={handleUpVote}>
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M7 22V11M2 13V20C2 21.1046 2.89543 22 4 22H17.4262C18.907 22 20.1662 20.9197 20.3914 19.4562L21.4683 12.4562C21.7479 10.6389 20.3418 9 18.5032 9H15C14.4477 9 14 8.55228 14 8V4.46584C14 3.10399 12.896 2 11.5342 2C11.2093 2 10.915 2.1913 10.7831 2.48812L7.26394 10.4061C7.10344 10.7673 6.74532 11 6.35013 11H4C2.89543 11 2 11.8954 2 13Z"
                                  stroke="#161E2E"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            </div>
                            <div onClick={handleDownVote}>
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M17.001 2V13M22.001 9.8V5.2C22.001 4.07989 22.001 3.51984 21.783 3.09202C21.5913 2.71569 21.2853 2.40973 20.909 2.21799C20.4812 2 19.9211 2 18.801 2H8.11904C6.65756 2 5.92682 2 5.33661 2.26743C4.81643 2.50314 4.37433 2.88242 4.06227 3.36072C3.7082 3.90339 3.59709 4.62564 3.37486 6.07012L2.85178 9.47012C2.55867 11.3753 2.41212 12.3279 2.69483 13.0691C2.94297 13.7197 3.40968 14.2637 4.01495 14.6079C4.70456 15 5.66836 15 7.59596 15H8.40103C8.96108 15 9.24111 15 9.45502 15.109C9.64318 15.2049 9.79616 15.3578 9.89204 15.546C10.001 15.7599 10.001 16.0399 10.001 16.6V19.5342C10.001 20.896 11.105 22 12.4669 22C12.7917 22 13.086 21.8087 13.218 21.5119L16.5787 13.9502C16.7316 13.6062 16.808 13.4343 16.9288 13.3082C17.0356 13.1967 17.1668 13.1115 17.312 13.0592C17.4763 13 17.6645 13 18.0408 13H18.801C19.9211 13 20.4812 13 20.909 12.782C21.2853 12.5903 21.5913 12.2843 21.783 11.908C22.001 11.4802 22.001 10.9201 22.001 9.8Z"
                                  stroke="#161E2E"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            </div>
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
                            />
                            Replay
                          </button>
                        )}
                      </div>
                    </div>
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
