"use client";

import { Dispatch, FC, SetStateAction, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import { useGlobalContext } from "@/app/context";

import { feedBackApi } from "@/app/chat/api";

interface FeedbackDialogProps {
  toggleDialog: Dispatch<SetStateAction<boolean>>;
}

const FeedbackDialog: FC<FeedbackDialogProps> = ({ toggleDialog }) => {
  const { sessionId } = useGlobalContext();
  const router = useRouter();

  const [starRating, setStarRating] = useState(0);

  const handleRatingClick = (rating: number) => {
    setStarRating(rating);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg w-96">
        <h3 className="text-xl mb-4 text-center">We'd love your feedback!</h3>
        <div className="flex my-6 justify-center">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              className={`p-2 text-4xl  ${
                starRating >= rating ? "text-yellow-500" : "text-gray-300"
              }`}
              onClick={() => handleRatingClick(rating)}
            >
              ★
            </button>
          ))}
        </div>
        <div className="flex justify-evenly">
          <button
            className="bg-red-500 text-white p-2 rounded mr-2"
            onClick={() => {
              setStarRating(0);
              toggleDialog(false);
            }}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white p-2 rounded"
            onClick={async () => {
              if (starRating === 0) {
                toast.info(
                  "please provide us with rating. so, that we will be able to help you better.",
                  {
                    autoClose: 5000,
                    position: "top-right",
                  }
                );
                return;
              }
              const data = await feedBackApi(sessionId, starRating);
              if (data) {
                toggleDialog(false);
                router.replace("/");
              }
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export { FeedbackDialog };
