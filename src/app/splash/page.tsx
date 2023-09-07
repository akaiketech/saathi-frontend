import React from "react";
import QuestionBubble from "../components/QuestionBubble";
import styles from "../components/styles.module.css";

const QuestionsPage: React.FC = () => {
  return (
    <div className={styles.bubble}>
      <h1>Animated Bubble with Questions</h1>
      <QuestionBubble />
    </div>
  );
};

export default QuestionsPage;
