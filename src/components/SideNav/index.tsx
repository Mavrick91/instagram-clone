"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import {
  Compass,
  Heart,
  Home,
  LucideIcon,
  Search,
  Send,
  SquarePlus,
} from "lucide-react";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

import {
  getAllNotifications,
  markNotificationsAsRead,
} from "@/actions/notification";
import UserAvatar from "@/components/UserAvatar";
import { useWebSocket } from "@/hooks/useWebSocket";
import { cn } from "@/lib/utils";
import { useModal } from "@/providers/ModalProvider";
import { useSideNav } from "@/providers/SideNavProvider";
import { useUserInfo } from "@/providers/UserInfoProvider";
import {
  NotificationsQueryData,
  NotificationType,
  PrismaNotification,
} from "@/types/notification";

import DropdownMore from "./DropdownMore";
import NotificationList from "./NotificationList";
import SideNavItem from "./SideNavItem";
import SideNavLogo from "./SideNavLogo";
import SideNavOverlay from "./SideNavOverlay";
import UsernameSearch from "./UsernameSearch";

export type IconType = LucideIcon | FC;

export type SideNavItemType = {
  name: string;
  path?: string;
  Icon: IconType;
  isActive?: (path: string) => boolean;
  onClick?: () => void;
  userAvatarProps?: {
    avatar?: string | null;
    width: number;
  };
};

const SideNav = () => {
  const user = useUserInfo();
  const queryClient = useQueryClient();
  const {
    isSearchVisible,
    toggleSearch,
    isNotificationVisible,
    toggleNotification,
    displaySmallNav,
  } = useSideNav();
  const { openModal } = useModal();
  const [sideNavRef, setSideNavRef] = useState<HTMLElement | null>(null);
  const {
    notifications: wsNotifications,
    resetNotifications: resetWSNotification,
  } = useWebSocket();
  const [unreadNotifications, setUnreadNotifications] = useState<Set<number>>(
    new Set(),
  );

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["notifications", user.id],
    queryFn: ({ pageParam = 1 }) => getAllNotifications(user.id, pageParam, 20),
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined,
    initialPageParam: 1,
  });

  const updateUnreadNotifications = useCallback(
    (notifications: PrismaNotification[]) => {
      setUnreadNotifications((prevUnread) => {
        const newUnread = new Set(prevUnread);
        notifications.forEach((notification) => {
          if (!notification.read) {
            newUnread.add(notification.id);
          } else {
            newUnread.delete(notification.id);
          }
        });
        return newUnread;
      });
    },
    [],
  );

  useEffect(() => {
    if (wsNotifications.length > 0) {
      updateUnreadNotifications(wsNotifications);

      queryClient.setQueryData<NotificationsQueryData>(
        ["notifications", user.id],
        (oldData) => {
          if (!oldData) return oldData;

          const newPages = oldData.pages.map((page, index) => {
            if (index === 0) {
              const updatedNotifications = [...page.notifications];
              wsNotifications.forEach((newNotification) => {
                const existingIndex = updatedNotifications.findIndex(
                  (n) => n.id === newNotification.id,
                );
                if (existingIndex !== -1) {
                  updatedNotifications[existingIndex] = newNotification;
                } else {
                  updatedNotifications.unshift(newNotification);
                }
              });
              return {
                ...page,
                notifications: updatedNotifications,
              };
            }
            return page;
          });
          return { ...oldData, pages: newPages };
        },
      );
    }
  }, [wsNotifications, queryClient, user.id, updateUnreadNotifications]);

  const allNotifications: PrismaNotification[] = useMemo(
    () => data?.pages.flatMap((page) => page.notifications) ?? [],
    [data],
  );

  useEffect(() => {
    updateUnreadNotifications(allNotifications);
  }, [allNotifications, updateUnreadNotifications]);

  const navigationItems: SideNavItemType[] = useMemo(
    () => [
      {
        name: "Home",
        path: "/",
        Icon: Home,
        isActive: (path) => path === "/",
      },
      {
        name: "Search",
        Icon: Search,
        onClick: toggleSearch,
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
        onClick: () =>
          openModal("uploadPostDialog", {
            buttonSubmitText: "Share",
            title: "Create new post",
          }),
      },
      {
        name: "Profile",
        path: `/${user.username}`,
        Icon: () => <UserAvatar avatar={user.avatar} width={24} />,
        isActive: (path) =>
          !["/", "/explore", "/direct", "/notifications"].includes(path),
      },
    ],
    [openModal, toggleNotification, toggleSearch, user.avatar, user.username],
  );

  const notificationsCount = Array.from(unreadNotifications).reduce<
    Record<NotificationType, number[]>
  >(
    (acc, notificationId) => {
      const notification = allNotifications.find(
        (n) => n.id === notificationId,
      );
      if (!notification) return acc;

      const type = notification.type as NotificationType;
      if (type in acc) {
        acc[type].push(notification.id);
      }

      return acc;
    },
    {
      LIKE: [],
      COMMENT: [],
      FOLLOW: [],
    } as Record<NotificationType, number[]>,
  );

  const handleToggleNotification = async () => {
    if (unreadNotifications.size > 0) {
      await markNotificationsAsRead(Array.from(unreadNotifications));
      setUnreadNotifications(new Set());
      resetWSNotification();

      // Invalidate and refetch the notifications query
      await queryClient.invalidateQueries({
        queryKey: ["notifications", user.id],
      });
    }
    toggleNotification();
  };

  return (
    <header className="fixed z-50 flex h-screen shrink-0 flex-col bg-white">
      <nav
        ref={setSideNavRef}
        className={cn(
          `bg-ig-primary-background h-full z-20 absolute py-2.5 transition-all px-3 border-r border-ig-separator`,
          {
            "w-nav-narrow-width": displaySmallNav,
            "w-nav-medium-width": !displaySmallNav,
          },
        )}
      >
        <div className="flex h-full flex-col justify-between">
          <SideNavLogo displaySmallNav={displaySmallNav} />

          <div className="flex h-full grow flex-col justify-between">
            <ul className="flex flex-col">
              {navigationItems.map((item) => (
                <SideNavItem
                  key={item.name}
                  isNotificationVisible={isNotificationVisible}
                  isSearchVisible={isSearchVisible}
                  isSmall={displaySmallNav}
                  item={item}
                  notificationsCount={Object.entries(notificationsCount).map(
                    ([type, count]) => ({
                      id: type.toLowerCase(),
                      count,
                    }),
                  )}
                />
              ))}
            </ul>

            <DropdownMore displaySmallNav={displaySmallNav} />
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isSearchVisible && (
          <SideNavOverlay
            key="search"
            toggle={toggleSearch}
            triggerRef={sideNavRef}
          >
            <UsernameSearch />
          </SideNavOverlay>
        )}
        {isNotificationVisible && (
          <SideNavOverlay
            key="notification"
            toggle={handleToggleNotification}
            triggerRef={sideNavRef}
          >
            <NotificationList
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
              notifications={allNotifications}
            />
          </SideNavOverlay>
        )}
      </AnimatePresence>
    </header>
  );
};

export default SideNav;
