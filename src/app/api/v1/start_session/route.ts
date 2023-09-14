import { NextRequest } from "next/server";

const generateSessionId = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const POST = async (req: NextRequest) => {
  try {
    const { language } = await req.json();

    const sessionId = generateSessionId();

    const response = await fetch(
      `${process.env.BACKEND_BASE_URL}/api/v1/start_session/`,
      {
        body: JSON.stringify({ language, session_id: sessionId }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to start session: ${response.status} ${response.statusText}`
      );
    }

    // You can optionally handle the response data here, if needed
    const responseData = await response.json();

    return responseData; // Return the response data to the client
  } catch (error) {
    console.error("Error:", error);

    // Handle specific error cases here
    if (error instanceof SyntaxError) {
      // JSON parsing error
      return { error: "Invalid JSON data" };
    } else {
      // Generic error response
      return { error: "Internal Server Error" };
    }
  }
};
