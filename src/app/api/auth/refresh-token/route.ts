import { auth } from "@/auth";
import { NextResponse } from "next/server";

const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const clientId = process.env.SPOTIFY_CLIENT_ID;
const secret = process.env.SPOTIFY_CLIENT_SECRET;

if (!clientId || !secret) {
  throw new Error("Invalid Spotify credentials");
}

const basic = Buffer.from(`${clientId}:${secret}`).toString("base64");

export async function POST() {
  try {
    const session = await auth();

    if (!session || !session.token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { refresh_token, expires_at } = session.token;

    if (!refresh_token) {
      return NextResponse.json({ error: "No refresh token available" }, { status: 400 });
    }

    // Check if token is actually expired
    if (Date.now() < expires_at * 1000) {
      // Token is still valid, return current access token
      return NextResponse.json({
        access_token: session.token.access_token,
        expires_at: session.token.expires_at,
      });
    }

    // Token is expired, refresh it
    const response = await fetch(TOKEN_ENDPOINT, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basic}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refresh_token,
      }),
      cache: "no-cache",
      method: "POST",
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Token refresh failed:", errorData);
      return NextResponse.json({ error: "Token refresh failed" }, { status: response.status });
    }

    const responseTokens = await response.json();

    const newExpiresAt = Math.floor(Date.now() / 1000 + (responseTokens.expires_in as number));

    return NextResponse.json({
      access_token: responseTokens.access_token,
      expires_at: newExpiresAt,
      refresh_token: responseTokens.refresh_token ?? refresh_token,
    });
  } catch (error) {
    console.error("Error in refresh-token endpoint:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
