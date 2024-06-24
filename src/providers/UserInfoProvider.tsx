"use client";

import { useQuery } from "@tanstack/react-query";
import { createContext, ReactNode, useContext } from "react";

import { getCurrentUser } from "@/actions/user";
import { CurrentUserType } from "@/types/user";

const UserInfoContext = createContext<CurrentUserType | undefined>(undefined);

type UserInfoProviderProps = {
  children: ReactNode;
  initialCurrentUser: CurrentUserType;
};

export const UserInfoProvider = ({
  children,
  initialCurrentUser,
}: UserInfoProviderProps) => {
  const { data: currentUser } = useQuery({
    queryKey: ["user", "currentUser"],
    queryFn: getCurrentUser,
    initialData: initialCurrentUser,
  });

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
