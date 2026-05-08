import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    message: "Logout success",
  });

  response.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0, // Clear the cookie
  });

  return response;
}
