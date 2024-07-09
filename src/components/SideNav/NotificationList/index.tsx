import moment from "moment";
import { UIEvent } from "react";

import { PrismaNotification } from "@/types/notification";

import NotificationItem from "./NotificationItem";

const NOTIFICATION_CATEGORIES = [
  {
    label: "New",
    filter: (notification: PrismaNotification) => {
      return !notification.read;
    },
  },
  {
    label: "Today",
    filter: (notification: PrismaNotification) => {
      return moment().isSame(notification.created_at, "day");
    },
  },
  {
    label: "Yesterday",
    filter: (notification: PrismaNotification) => {
      return moment()
        .subtract(1, "days")
        .isSame(notification.created_at, "day");
    },
  },
  {
    label: "Last 7 days",
    filter: (notification: PrismaNotification) => {
      return moment().diff(notification.created_at, "days") <= 7;
    },
  },
  {
    label: "Last 30 days",
    filter: (notification: PrismaNotification) => {
      return moment().diff(notification.created_at, "days") <= 30;
    },
  },
  {
    label: "Older",
    filter: () => {
      return true;
    },
  },
];

const categorizeNotifications = (notifications: PrismaNotification[]) => {
  const categorizedNotifications = NOTIFICATION_CATEGORIES.map(({ label }) => {
    return {
      label,
      items: [] as PrismaNotification[],
    };
  });

  notifications.forEach((notification) => {
    const category = NOTIFICATION_CATEGORIES.find(({ filter }) => {
      return filter(notification);
    });
    if (category) {
      categorizedNotifications
        .find(({ label }) => {
          return label === category.label;
        })
        ?.items.push(notification);
    }
  });

  return categorizedNotifications.filter(({ items }) => {
    return items.length > 0;
  });
};

type Props = {
  notifications: PrismaNotification[];
  hasNextPage: number | boolean;
  fetchNextPage: () => void;
};

const NotificationList = ({
  notifications,
  hasNextPage,
  fetchNextPage,
}: Props) => {
  const categorizedNotifications = categorizeNotifications(notifications);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 20 && hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <div className="flex flex-col">
      <div
        className="max-h-screen min-h-0 grow overflow-y-auto"
        onScroll={handleScroll}
      >
        <div className="pb-6 pl-6 pt-3 text-2xl font-semibold text-ig-primary-text">
          Notifications
        </div>
        <div className="relative">
          {categorizedNotifications.map(({ label, items }) => {
            if (!items.length) return null;

            return (
              <div key={label} className="border-b border-ig-separator pb-4">
                <div className="px-6 py-2 font-bold text-ig-primary-text">
                  {label}
                </div>
                {items.map((notification) => {
                  return (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NotificationList;
