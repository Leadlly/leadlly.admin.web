import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const rawUrl = request.nextUrl.searchParams.get("url");
    if (!rawUrl) {
      return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
    }

    // Basic allowlist for safety; only http/https URLs are accepted.
    let parsed: URL;
    try {
      parsed = new URL(rawUrl);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return NextResponse.json({ error: "Unsupported protocol" }, { status: 400 });
    }

    const upstream = await fetch(parsed.toString(), {
      method: "GET",
      cache: "no-store",
    });

    if (!upstream.ok) {
      return NextResponse.json({ error: "Unable to fetch image" }, { status: 502 });
    }

    const contentType = upstream.headers.get("content-type") || "application/octet-stream";
    const buffer = await upstream.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch {
    return NextResponse.json({ error: "Proxy error" }, { status: 500 });
  }
}

