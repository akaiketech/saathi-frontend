import { useState } from "react";

import { Message, Question, Answer } from "@/app/types";

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (
    question: Question,
    answer: Answer,
    role: "user" | "ai"
  ) => {
    // setMessages([...messages, { question, answer }]);
  };

  return { messages, addMessage };
};
