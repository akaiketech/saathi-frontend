import { toast } from "react-toastify";

export const startSessionApi = async (
  language: string,
  onSuccess: (id: string) => void
) => {
  const res = await fetch("/api/v1/start_session", {
    method: "POST",
    body: JSON.stringify({ language }),
  });

  const data = await res.json();

  if (data.error) {
    toast.error(data.error, {
      autoClose: 5000,
      position: "top-right",
    });
  } else {
    onSuccess(data.sessionId);
  }
};
