import { toast } from "react-toastify";

export const getQuestions = async (language: string, setQuestions: any) => {
  const res = await fetch(`api/v1/probe/?language=all`);

  const data = await res.json();

  if (data.error) {
    toast.error(data.error, {
      autoClose: 5000,
      position: "top-right",
    });
  } else {
    setQuestions(data.probing_questions);
  }
};
