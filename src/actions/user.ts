"use server";

import { users } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import { RevalidatePath } from "@/types/global";
import {
  currentUserSelect,
  CurrentUserType,
  userProfileSelect,
  UserProfileType,
} from "@/types/user";
import { getErrorMessage } from "@/utils";

import { setCookie } from "./cookies";

export const getCurrentUser = async (): Promise<CurrentUserType> => {
  const accessToken = cookies().get("accessToken")?.value;

  if (!accessToken) {
    throw new Error("Access token is missing");
  }

  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!) as {
    email: string;
  };

  const currentUser = await prisma.users.findUnique({
    where: {
      email: decoded.email,
    },
    select: currentUserSelect,
  });

  if (!currentUser) {
    throw new Error("User not found");
  }

  return currentUser;
};

export const login = async (email: string, password: string) => {
  try {
    const user = await prisma.users.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      const accessToken = jwt.sign(result, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });
      const refreshToken = jwt.sign(result, process.env.JWT_REFRESH_SECRET!, {
        expiresIn: "7d",
      });

      await setCookie({
        name: "accessToken",
        value: accessToken,
        maxAge: 60 * 60,
      });
      await setCookie({
        name: "refreshToken",
        value: refreshToken,
        maxAge: 60 * 60 * 24 * 7,
      });

      return;
    }

    throw new Error("Email or password is incorrect");
  } catch (error) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }
};

export const logout = async () => {
  await setCookie({ name: "accessToken", value: "", maxAge: 0 });
  await setCookie({ name: "refreshToken", value: "", maxAge: 0 });
  redirect("/login");
};

export const getMockedUser = async (): Promise<users[]> => {
  return prisma.users.findMany({
    where: {
      is_mock: true,
    },
  });
};

export const getAllUsers = async (): Promise<users[]> => {
  const currentUser = await getCurrentUser();

  return prisma.users.findMany({ where: { id: { not: currentUser.id } } });
};

export const getUserByUsername = async (username: string): Promise<users[]> => {
  const currentUser = await getCurrentUser();

  return prisma.users.findMany({
    where: {
      username: {
        contains: username,
        mode: "insensitive",
      },
      id: { not: currentUser.id },
    },
  });
};

export const getUserProfile = async (
  username: string,
): Promise<UserProfileType> => {
  return prisma.users.findFirstOrThrow({
    where: {
      username,
    },
    select: userProfileSelect,
  });
};

export const updateUserProfile = async (
  username: string,
  updateUserInput: {
    first_name: string;
    last_name: string;
    bio?: string;
    avatar?: string;
    avatar_name?: string;
  },
  options?: RevalidatePath,
) => {
  await prisma.users.update({
    where: {
      username,
    },
    data: updateUserInput,
  });

  options && revalidatePath(options.originalPath, options?.type);
};
