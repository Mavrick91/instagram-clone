import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

import NotificationBadge, {
  NotificationCountProps,
} from "@/components/NotificationBadge";
import { SideNavItemType } from "@/components/SideNav";
import { cn } from "@/lib/utils";
import { useSideNav } from "@/providers/SideNavProvider";

type NavIconType = Omit<SideNavItemType, "isActive" | "name"> & {
  isVisible: boolean;
  isSmall: boolean;
  isActive: boolean;
};

const NavIcon = ({
  Icon,
  isActive,
  isSmall,
  isVisible,
  userAvatarProps,
}: NavIconType) => (
  <Icon
    className={cn(
      "size-6 transition-transform ease-out group-hover:scale-[1.1] text-ig-primary-text",
      {
        "scale-110": isActive,
        "mx-auto": isSmall,
      },
    )}
    strokeWidth={isActive || isVisible ? 2.3 : 1.5}
    {...userAvatarProps}
  />
);

const NavLabel = ({ name, isSmall }: { name: string; isSmall: boolean }) =>
  !isSmall && (
    <motion.span
      animate={{ opacity: isSmall ? 0 : 1 }}
      className="ml-4 text-ig-primary-text transition-colors duration-200 ease-out"
      initial={{ opacity: 0 }}
      transition={{ delay: 0.2 }}
    >
      {name}
    </motion.span>
  );

const isItemActive = (
  isActive: ((path: string) => boolean) | undefined,
  pathname: string,
) => {
  return isActive ? isActive(pathname) : false;
};

const hasAnyNotifications = (notificationsCount: NotificationCountProps[]) => {
  return notificationsCount.some(({ count }) => count.length > 0);
};

interface SideNavItemProps {
  item: SideNavItemType;
  isSmall: boolean;
  isSearchVisible: boolean;
  isNotificationVisible: boolean;
  notificationsCount: NotificationCountProps[];
}

const SideNavItem = ({
  item,
  isSmall,
  isSearchVisible,
  isNotificationVisible,
  notificationsCount,
}: SideNavItemProps) => {
  const { sideNavOpen } = useSideNav();
  const pathname = usePathname();
  const { name, path, Icon, isActive, onClick, userAvatarProps } = item;

  const isActiveItem = isItemActive(isActive, pathname);
  const hasNotifications = hasAnyNotifications(notificationsCount);

  const content = (
    <div className={cn("flex items-center", { "font-bold": isActiveItem })}>
      <div className="relative">
        <NavIcon
          Icon={Icon}
          isActive={isActiveItem && sideNavOpen}
          isSmall={isSmall}
          isVisible={
            (name === "Search" && isSearchVisible) ||
            (name === "Notifications" && isNotificationVisible)
          }
          userAvatarProps={userAvatarProps}
        />
        {name === "Notifications" && hasNotifications && (
          <NotificationBadge
            isSmall={isSmall}
            notificationsCount={notificationsCount}
          />
        )}
      </div>
      <NavLabel isSmall={isSmall} name={name} />
    </div>
  );

  const commonProps = {
    className: cn(
      "flex items-center group my-1 p-3 rounded-lg transition-colors duration-200 ease-out hover:bg-ig-hover-overlay",
      { relative: name === "Search" },
    ),
    children: content,
  };

  if (path) {
    return <Link href={path} {...commonProps} />;
  } else if (onClick) {
    return <button onClick={onClick} {...commonProps} />;
  }

  return null;
};

export default SideNavItem;
