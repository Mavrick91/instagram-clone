"use server";

import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
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

  const currentUser = await prisma.user.findUnique({
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
    const user = await prisma.user.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      const accessToken = jwt.sign(result, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });
      const refreshToken = jwt.sign(result, process.env.JWT_REFRESH_SECRET!, {
        expiresIn: "7d",
      });

      setCookie({ name: "accessToken", value: accessToken, maxAge: 60 * 60 });
      setCookie({
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
  setCookie({ name: "accessToken", value: "", maxAge: 0 });
  setCookie({ name: "refreshToken", value: "", maxAge: 0 });
  redirect("/login");
};

export const getMockedUser = async (): Promise<User[]> => {
  return prisma.user.findMany({
    where: {
      isMock: true,
    },
  });
};

export const getAllUsers = async (): Promise<User[]> => {
  const currentUser = await getCurrentUser();

  return prisma.user.findMany({ where: { id: { not: currentUser.id } } });
};

export const getUserByUsername = async (username: string): Promise<User[]> => {
  const currentUser = await getCurrentUser();

  return prisma.user.findMany({
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
  return prisma.user.findFirstOrThrow({
    where: {
      username,
    },
    select: userProfileSelect,
  });
};

export const updateUserProfile = async (
  username: string,
  updateUserInput: {
    firstName: string;
    lastName: string;
    bio?: string;
    avatar?: string;
    avatarName?: string;
  },
  options?: RevalidatePath,
) => {
  await prisma.user.update({
    where: {
      username,
    },
    data: updateUserInput,
  });

  options && revalidatePath(options.originalPath, options?.type);
};
