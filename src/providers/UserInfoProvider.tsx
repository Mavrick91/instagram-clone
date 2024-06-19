"use client";

import { createContext, ReactNode, useContext } from "react";

import { CurrentUserType } from "@/types/user";

const UserInfoContext = createContext<CurrentUserType | undefined>(undefined);

type UserInfoProviderProps = {
  children: ReactNode;
  currentUser: CurrentUserType;
};

export const UserInfoProvider = ({
  children,
  currentUser,
}: UserInfoProviderProps) => {
  return (
    <UserInfoContext.Provider value={currentUser}>
      {children}
    </UserInfoContext.Provider>
  );
};

export const useUserInfo = (): CurrentUserType => {
  const context = useContext(UserInfoContext);
  if (!context) {
    throw new Error("useUserInfo must be used within a UserInfoProvider");
  }
  return context;
};
