import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { hindiQuery, englishQuery, sessionId } = await req.json();

    const reqBody = {
      hindi_query: hindiQuery,
      english_query: englishQuery,
      session_id: sessionId,
    };
    console.log("🚀 ~ file: route.ts:13 ~ POST ~ reqBody:", reqBody);

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
    console.log("🚀 ~ file: route.ts:38 ~ POST ~ responseData:", responseData);

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
