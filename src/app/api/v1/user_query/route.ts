import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    console.log("🚀 ~ file: route.ts:6 ~ POST ~ body:", body);
    const { hindiQuery, englishQuery, sessionId, audio, queryId } = body;

    const reqBody = {
      hindi_query: hindiQuery,
      english_query: englishQuery,
      session_id: sessionId,
      user_audio: audio,
      query_id: queryId,
    };

    const response = await fetch(
      `${process.env.BACKEND_BASE_URL}/api/v1/user_query/`,
      {
        body: JSON.stringify(reqBody),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      const errorText = `Failed to fetch the result: ${response.status} ${response.statusText}`;
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
