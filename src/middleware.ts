import { NextRequest, NextResponse } from "next/server";

import { NO_AUTH_PATHS } from "./constants/route";
import { getErrorMessage } from "./utils";

const verifyToken = async (accessToken: string, url: string) => {
  const VERIFY_TOKEN_URL = "http://localhost:3000/api/auth/verifyToken";

  try {
    const response = await fetch(new URL(VERIFY_TOKEN_URL, url), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.status === 200;
  } catch (error: unknown) {
    getErrorMessage(error);

    return false;
  }
};

const clearTokenAndRedirect = (url: string, search: string) => {
  const clearResponse = NextResponse.redirect(new URL(`/${search}`, url));
  clearResponse.cookies.set("accessToken", "", {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: -1,
  });
  clearResponse.cookies.set("refreshToken", "", {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: -1,
  });
  return clearResponse;
};

export const middleware = async (request: NextRequest) => {
  const accessToken = request.cookies.get("accessToken")?.value;
  const { pathname, search } = request.nextUrl;

  if (accessToken) {
    try {
      if (NO_AUTH_PATHS.includes(pathname)) {
        return NextResponse.redirect(new URL(`/${search}`, request.url));
      }

      const isTokenValid = await verifyToken(accessToken, request.url);
      if (isTokenValid) {
        return NextResponse.next();
      } else {
        return clearTokenAndRedirect(request.url, search);
      }
    } catch (error) {
      console.log("🚀 ~ middleware ~ error:", error);
      return clearTokenAndRedirect(request.url, search);
    }
  } else {
    if (NO_AUTH_PATHS.includes(pathname)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL(`/login${search}`, request.url));
  }
};

export const config = {
  matcher: [
    "/((?!api|_next/static/|_next/image/|images/|videos/|favicon.ico).*)",
  ],
};
