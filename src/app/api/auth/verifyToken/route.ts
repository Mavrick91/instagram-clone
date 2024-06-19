import jwt from "jsonwebtoken";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const authorization = headers().get("Authorization");
  const accessToken = authorization?.split("Bearer ")[1];

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET!);

    return NextResponse.json(
      { message: "Token is valid", decodedToken },
      { status: 200 },
    );
  } catch (error) {
    const response = NextResponse.json(
      { message: "Invalid token" },
      { status: 401 },
    );
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: -1,
    });
    return response;
  }
}
