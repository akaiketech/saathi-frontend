"use client";

import { FC, useState, useEffect } from "react";
import Lottie from "react-lottie";

import { useGlobalContext } from "@/app/context";

import { getQuestions } from "../util";

import loadingData from "../../../../public/loading.json";

import styles from "./styles.module.css";
import { useRouter } from "next/navigation";

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
    if (questions.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      setQuestionOpacity(0); // Fade out

      setTimeout(() => {
        setCurrentQuestionIndex((prevIndex) =>
          prevIndex === questions.length - 1 ? 0 : prevIndex + 1
        );
        setQuestionOpacity(1); // Fade in
      }, 500); //
    }, 5000);

    return () => {
      clearInterval(interval); // Clear the interval when component unmounts
    };
  }, [questions]);

  const defaultOptionsForLoading = {
    loop: true,
    autoplay: true,
    animationData: loadingData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const router = useRouter();

  useEffect(() => {
    const resetMouseActivity = () => {
      router.push("/");
    };

    window.addEventListener("mousemove", resetMouseActivity);

    return () => {
      window.removeEventListener("mousemove", resetMouseActivity);
    };
  }, []);

  const [questionOpacity, setQuestionOpacity] = useState(1);

  return (
    <div className={styles.fullscreenText}>
      <div
        className={`${styles.question}`}
        style={{ opacity: questionOpacity }}
      >
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
