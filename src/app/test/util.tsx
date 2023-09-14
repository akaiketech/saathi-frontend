export const queryApi = async (
  hindiQuery: string,
  englishQuery: string,
  sessionId: string
) => {
  const res = await fetch("/api/query", {
    method: "POST",
    body: JSON.stringify({ hindiQuery, englishQuery, sessionId }),
  });

  const data = await res.json();

  if (data.error) {
    console.log("🚀 ~ file: util.tsx:14 ~ data.error:", data.error);
    return null;
  } else {
    return data;
  }
};
