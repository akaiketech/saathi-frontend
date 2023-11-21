import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    console.log("🚀 ~ file: route.ts:14 ~ POST ~ body:", body);
    const { conversationId, sessionId, vote } = body;

    const response = await fetch(
      `${process.env.BACKEND_BASE_URL}/api/v1/start_session/`,
      {
        body: JSON.stringify({
          query_id: conversationId,
          session_id: sessionId,
          vote: vote,
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
      return NextResponse.json({ ...responseData });
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
