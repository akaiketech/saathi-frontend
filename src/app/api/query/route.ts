import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { hindiQuery, englishQuery, sessionId } = await req.json();

    const response = await fetch("https://saathi.akaike.ai/user_query/", {
      body: JSON.stringify({
        hindi_query: hindiQuery,
        english_query: englishQuery,
        session_id: sessionId,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const data = await response.json();
    console.log("🚀 ~ file: route.ts:20 ~ POST ~ data:", data);

    if (response.ok) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ error: data });
    }
  } catch (error) {
    return NextResponse.json(error);
  }
};
