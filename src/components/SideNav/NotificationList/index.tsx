import moment from "moment";

import NotificationItem from "./NotificationItem";

const NOTIFICATION_CATEGORIES = [
  {
    label: "New",
    filter: (notification: any) => !notification.read,
  },
  {
    label: "Today",
    filter: (notification: any) =>
      moment().isSame(notification.createdAt, "day"),
  },
  {
    label: "Yesterday",
    filter: (notification: any) =>
      moment().subtract(1, "days").isSame(notification.createdAt, "day"),
  },
  {
    label: "Last 7 days",
    filter: (notification: any) =>
      moment().diff(notification.createdAt, "days") <= 7,
  },
  {
    label: "Last 30 days",
    filter: (notification: any) =>
      moment().diff(notification.createdAt, "days") <= 30,
  },
  { label: "Older", filter: () => true },
];

const categorizeNotifications = (
  notifications: any[],
) => {
  const categorizedNotifications = NOTIFICATION_CATEGORIES.map(({ label }) => ({
    label,
    items: [] as any[],
  }));

  notifications.forEach((notification) => {
    const category = NOTIFICATION_CATEGORIES.find(({ filter }) =>
      filter(notification),
    );
    if (category) {
      categorizedNotifications
        .find(({ label }) => label === category.label)
        ?.items.push(notification);
    }
  });

  return categorizedNotifications.filter(({ items }) => items.length > 0);
};

type Props = {
  notifications: any[];
  hasNextPage: number | boolean;
  fetchNextPage: () => void;
};

export default function NotificationList({
  notifications,
  hasNextPage,
  fetchNextPage,
}: Props) {
  const categorizedNotifications = categorizeNotifications(notifications);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
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
        <div className="pb-6 pl-6 pt-3 text-2xl font-semibold text-primary-text">
          Notifications
        </div>
        <div className="relative">
          {categorizedNotifications.map(({ label, items }) => {
            if (!items.length) return null;

            return (
              <div key={label} className="border-b border-separator pb-4">
                <div className="px-6 py-2 font-bold text-primary-text">
                  {label}
                </div>
                {items.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
