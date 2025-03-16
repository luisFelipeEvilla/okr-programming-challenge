import { redirect_uri, token_url, client_id, client_secret, cc_access_token_cookie_name } from "@/config";
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("Missing code", { status: 400 });
  }

  try {
    const base64 = Buffer.from(`${client_id}:${client_secret}`).toString(
      "base64"
    );

    const tokenResponse = await axios.post(
      token_url,
      {
        code,
        redirect_uri,
        grant_type: "authorization_code",
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${base64}`,
        },
      }
    );

    const { access_token, expires_in } = tokenResponse.data;

    // Calculate expiration date (expires_in is in seconds)
    const expirationDate = new Date();
    expirationDate.setSeconds(expirationDate.getSeconds() + expires_in);

    // Create response with redirect
    const redirectUrl = new URL("/dashboard/contacts", request.url);
    const redirectResponse = NextResponse.redirect(redirectUrl);

    // Set the cookie in the response
    redirectResponse.cookies.set({
      name: cc_access_token_cookie_name,
      value: access_token,
      httpOnly: false,
      expires: expirationDate,
      path: "/",
    });

    return redirectResponse;
  } catch (error) {
    console.error(error);
    return new Response("Error fetching access token", { status: 500 });
  }
}
