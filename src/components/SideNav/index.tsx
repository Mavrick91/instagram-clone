"use client";

import { AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { useModal } from "@/providers/ModalProvider";
import { useSideNav } from "@/providers/SideNavProvider";
import { useUserInfo } from "@/providers/UserInfoProvider";

import { NotificationCountProps } from "../NotificationBadge";
import UploadPostDialog from "../UploadPostDialog";
import DropdownMore from "./DropdownMore";
import NotificationList from "./NotificationList";
import { getNavigationItems } from "./sideNavConfig";
import SideNavItem from "./SideNavItem";
import SideNavLogo from "./SideNavLogo";
import SideNavOverlay from "./SideNavOverlay";
import UsernameSearch from "./UsernameSearch";

const SideNav = () => {
  const user = useUserInfo();
  const {
    isSearchVisible,
    toggleSearch,
    isNotificationVisible,
    toggleNotification,
    isNewPostVisible,
    toggleNewPost,
    displaySmallNav,
  } = useSideNav();
  const { showModal } = useModal();

  // const { notifications, fetchNextPage, hasNextPage, setAllNotifications } =
  //   useInfiniteNotifications();

  // useNotificationAdded(user.id, setAllNotifications);

  // const [markNotifAsRead] = useMarkNotificationsAsRead(setAllNotifications);
  const markNotifAsRead = 10;

  const navigationItems = getNavigationItems(
    user,
    toggleSearch,
    () => {
      return showModal("UploadPostDialog", {
        buttonSubmitText: "Share",
        title: "Create new post",
      });
    },
    toggleNotification,
  );

  const notificationsCount: NotificationCountProps[] = [].reduce(
    (acc, currentValue) => {
      // if (currentValue.read) return acc;

      // if (currentValue.type === "LIKE") {
      //   acc[0].count.push(currentValue.id);
      // } else if (currentValue.type === "COMMENT") {
      //   acc[1].count.push(currentValue.id);
      // } else if (currentValue.type === "FOLLOW") {
      //   acc[2].count.push(currentValue.id);
      // }
      return acc;
    },
    [
      { id: "like", count: [] as number[] },
      { id: "comment", count: [] as number[] },
      { id: "follow", count: [] as number[] },
    ],
  );

  const handleToggleNotification = () => {
    // const newNotifications = notificationsCount.flatMap((item) => item.count);
    // if (newNotifications?.length)
    // markNotifAsRead({
    //   variables: { notificationIds: newNotifications },
    // });
    // toggleNotification();
  };

  return (
    <header className="fixed z-50 flex h-screen shrink-0 flex-col bg-white">
      <nav
        className={cn(
          `bg-primary-background h-full z-20 absolute py-2.5 transition-all px-3 border-r border-separator`,
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
              {navigationItems.map((item) => {
                return (
                  <SideNavItem
                    key={item.name}
                    item={item}
                    isSmall={displaySmallNav}
                    isSearchVisible={isSearchVisible}
                    isNotificationVisible={isNotificationVisible}
                    notificationsCount={notificationsCount}
                  />
                );
              })}
            </ul>

            <DropdownMore displaySmallNav={displaySmallNav} />
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isSearchVisible && (
          <SideNavOverlay key="search" toggle={toggleSearch}>
            <UsernameSearch />
          </SideNavOverlay>
        )}
        {isNotificationVisible && (
          <SideNavOverlay key="notification" toggle={handleToggleNotification}>
            <NotificationList
              notifications={[]}
              hasNextPage={false}
              // fetchNextPage={fetchNextPage}
              fetchNextPage={() => {
                return null;
              }}
            />
          </SideNavOverlay>
        )}
      </AnimatePresence>

      {isNewPostVisible && (
        <UploadPostDialog
          onClose={toggleNewPost}
          buttonSubmitText="Share"
          title="Create new post"
          backButton={<ArrowLeft />}
        />
      )}
    </header>
  );
};

export default SideNav;
