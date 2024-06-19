"use server";

import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

export const setCookie = ({ name, value, ...options }: ResponseCookie) => {
  cookies().set(name, value, options);
};
