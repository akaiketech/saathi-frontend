import { NextRequest, NextResponse } from "next/server";

const generateSessionId = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    console.log("🚀 ~ file: route.ts:14 ~ POST ~ body:", body);
    const { language, deviceId } = body;

    const sessionId = generateSessionId();

    const response = await fetch(
      `${process.env.BACKEND_BASE_URL}/api/v1/start_session/`,
      {
        body: JSON.stringify({
          user_language: language,
          session_id: sessionId,
          // device_id: deviceId,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      const errorText = `Failed to start session: ${response.status} ${response.statusText}`;
      return NextResponse.json(
        { error: errorText },
        { status: response.status }
      );
    }

    if (responseData.error) {
      if (responseData.error === "Session already exists") {
        return NextResponse.json(
          { error: "Session already exists" },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { error: "Unknown error occurred" },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json({ ...responseData, sessionId });
    }
  } catch (error) {
    console.error("Error:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid JSON data" }, { status: 400 });
    } else {
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
};
