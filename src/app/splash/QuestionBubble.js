import React, { useState, useEffect } from "react";

const questions = [
  "Do you know question 1?",
  "Do you know question 2?",
  "Do you know question 3?",
  // Add more questions here
];

const QuestionBubble = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Change the question index after a fixed interval
      setCurrentQuestionIndex((prevIndex) =>
        prevIndex === questions.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change the question every 5 seconds (5000 milliseconds)

    return () => clearInterval(interval); // Cleanup the interval on unmount
  }, []);

  return (
    <div className="bubble">
      <p className="question">{questions[currentQuestionIndex]}</p>
    </div>
  );
};

export default QuestionBubble;
