import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const language = url.searchParams.get("language");

    const response = await fetch(
      `${process.env.BACKEND_BASE_URL}/api/v1/probe/?language=${language}`,
      {
        headers: {
          Accept: "application/json",
        },
        method: "GET",
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

export const dynamic = "force-dynamic";
