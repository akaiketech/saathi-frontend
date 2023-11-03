"use client";

import { FC, useState } from "react";
import Image from "next/image";

import { useGlobalContext } from "@/app/context";

import { FeedbackDialog } from "@/app/chat/components/FeedbackDialog";

import { useChatContext } from "@/app/chat/contexts/ChatContext";

interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
  const { language } = useGlobalContext();

  // const { isAudioPlaying } = useChatContext();

  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);

  const closeFeedbackDialog = () => {
    setIsFeedbackDialogOpen(false);
    // handleEndConversation();
  };

  return (
    <header className="flex">
      <h2 className="text-[#DC493A] text-[64px] not-italic font-bold leading-[normal] ">
        SAATHI
      </h2>

      <button
        className="ml-auto text-2xl flex items-center"
        onClick={closeFeedbackDialog}
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
        <FeedbackDialog toggleDialog={setIsFeedbackDialogOpen} />
      )}
    </header>
  );
};

export { Header };
