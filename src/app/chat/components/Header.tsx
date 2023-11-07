"use client";

import { FC, useEffect, useState } from "react";
import Image from "next/image";

import { useGlobalContext } from "@/app/context";

import { FeedbackDialog } from "@/app/chat/components/FeedbackDialog";

import { useChatContext } from "@/app/chat/contexts/ChatContext";
import { useRouter } from "next/navigation";

interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
  const { language } = useGlobalContext();

  const { stopPlayingAudio } = useChatContext();

  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);

  const openFeedbackDialog = () => {
    setIsFeedbackDialogOpen(true);
    stopPlayingAudio();
  };

  const router = useRouter();

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const setMouseInactive = () => {
      router.push("/splash");
    };

    const resetMouseActivity = () => {
      clearTimeout(timeout);
      timeout = setTimeout(setMouseInactive, 120000);
    };

    window.addEventListener("mousemove", resetMouseActivity);
    resetMouseActivity();

    return () => {
      window.removeEventListener("mousemove", resetMouseActivity);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <header className="flex">
      <h2 className="text-[#DC493A] text-[64px] not-italic font-bold leading-[normal] ">
        SAATHI
      </h2>

      <button
        className="ml-auto text-2xl flex items-center"
        onClick={openFeedbackDialog}
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
