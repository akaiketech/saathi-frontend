import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";

import { uint8ArrayToBase64 } from "@/app/chat/util";

interface QueryApiArgs {
  hindiQuery: string;
  englishQuery: string;
  sessionId: string;
  audio: Uint8Array;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export const queryApi = async ({
  hindiQuery,
  englishQuery,
  sessionId,
  audio,
  setIsLoading,
}: QueryApiArgs): Promise<any> => {
  try {
    setIsLoading(true);
    const res = await fetch("/api/v1/user_query", {
      method: "POST",
      body: JSON.stringify({
        hindiQuery,
        englishQuery,
        sessionId,
        audio: uint8ArrayToBase64(audio),
      }),
    });

    if (!res.ok) {
      toast.error(`Network response was not ok: ${res.statusText}`, {
        autoClose: 5000,
        position: "top-right",
      });

      return;
    }

    const data = await res.json();

    if (data.error) {
      toast.error(data.error, {
        autoClose: 5000,
        position: "top-right",
      });

      return;
    }

    return data;
  } catch (error) {
    const err = error as Error;
    toast.error(err.message, {
      autoClose: 5000,
      position: "top-right",
    });
  } finally {
    setIsLoading(false);
  }
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

export const votingApi = async (
  sessionId: string,
  conversationId: string,
  vote: 0 | 1
) => {
  const res = await fetch("/api/v1/report", {
    method: "POST",
    body: JSON.stringify({
      conversationId,
      sessionId,
      vote,
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
