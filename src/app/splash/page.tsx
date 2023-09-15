"use client";

import React from "react";
import QuestionBubble from "./components/QuestionBubble";
import styles from "./components/styles.module.css";

const QuestionsPage: React.FC = () => {
  return (
    <div className={styles.bubble}>
      <QuestionBubble />
    </div>
  );
};

export default QuestionsPage;
