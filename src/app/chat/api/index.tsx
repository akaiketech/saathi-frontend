import { toast } from "react-toastify";

import { uint8ArrayToBase64 } from "@/app/chat/util";

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
