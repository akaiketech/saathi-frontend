"use client";
import { FC, useState, useEffect } from "react";
import Lottie from "react-lottie";

import { useGlobalContext } from "@/app/context";

import { getQuestions } from "../util";

import loadingData from "../../chat/loading.json";

import styles from "./styles.module.css";

const QuestionBubble: FC = () => {
  const { language } = useGlobalContext();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const getQues = async () => {
    setLoading(true);
    await getQuestions(language, setQuestions);
    setLoading(false);
  };

  useEffect(() => {
    getQues();
  }, [language]);

  useEffect(() => {
    if (questions.length === 0) return;

    const interval = setInterval(() => {
      setCurrentQuestionIndex((prevIndex) =>
        prevIndex === questions.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [questions]);

  const defaultOptionsForLoading = {
    loop: true,
    autoplay: true,
    animationData: loadingData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className={styles.fullscreenText}>
      <div className={styles.question}>
        {loading ? (
          <Lottie options={defaultOptionsForLoading} height={200} width={200} />
        ) : (
          questions[currentQuestionIndex]
        )}
      </div>
    </div>
  );
};

export default QuestionBubble;
