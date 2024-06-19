"use client";

import { Compass, Heart, Home, Search, Send, SquarePlus } from "lucide-react";

import UserAvatar from "@/components/UserAvatar";
import { CurrentUserType } from "@/types/user";

export interface SideNavItem {
  name: string;
  path?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: React.ComponentType<any>;
  isActive?: (path: string) => boolean;
  onClick?: () => void;
  userAvatarProps?: {
    avatar?: string | null;
    username: string;
    size: string;
  };
}

export const getNavigationItems = (
  user: CurrentUserType,
  openSearch: () => void,
  openCreate: () => void,
  toggleNotification: () => void,
): SideNavItem[] => [
  {
    name: "Home",
    path: "/",
    Icon: Home,
    isActive: (path) => path === "/",
  },
  {
    name: "Search",
    Icon: Search,
    onClick: openSearch,
  },
  {
    name: "Explore",
    path: "/explore",
    Icon: Compass,
    isActive: (path) => path === "/explore",
  },
  {
    name: "Messages",
    path: "/direct/inbox",
    Icon: Send,
    isActive: (path) => path === "/direct/inbox",
  },
  {
    name: "Notifications",
    Icon: Heart,
    onClick: toggleNotification,
  },
  {
    name: "Create",
    Icon: SquarePlus,
    onClick: openCreate,
  },
  {
    name: "Profile",
    path: `/${user.username}`,
    Icon: UserAvatar,
    onClick: () => null,
    userAvatarProps: {
      avatar: user.avatar,
      username: user.username,
      size: "size-6",
    },
    isActive: (path) =>
      !["/", "/explore", "/direct", "/notifications"].includes(path),
  },
];
