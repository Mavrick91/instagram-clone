"use client";

import { AnimatePresence, motion } from "framer-motion";
import { HeartIcon, MessageCircle, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export interface NotificationCountProps {
  id: string;
  count: number[];
}

export interface NotificationBadgeProps {
  notificationsCount: NotificationCountProps[];
  isSmall: boolean;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  notificationsCount,
  isSmall,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const notificationIds = notificationsCount.flatMap((item) => {
    return item.count;
  });

  useEffect(() => {
    const displayTimer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 4000);

    return () => {
      clearTimeout(displayTimer);
      clearTimeout(hideTimer);
    };
  }, [notificationIds.length]);

  return (
    <>
      <div className="absolute -right-1 -top-0.5 size-3 rounded-full border-2 border-white bg-red-500" />
      <AnimatePresence>
        {isVisible && (
          <motion.button
            className={cn(
              "absolute -top-2 bg-badge rounded-lg p-3 py-1.5 before:content-[' '] before:top-1/2 before:transform before:-translate-y-1/2 before:size-4 before:rounded-sm before:rotate-45 before:absolute before:-left-1.5 before:bg-badge",
              {
                "left-40": !isSmall,
                "left-12": isSmall,
              },
            )}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              return setIsVisible(false);
            }}
          >
            <div className="flex space-x-3">
              {notificationsCount.map(({ id, count }, index) => {
                if (!count.length) return null;

                return (
                  <div key={index} className={`flex items-center text-white`}>
                    {id === "comment" ? (
                      <MessageCircle fill="white" stroke="none" size={20} />
                    ) : id === "like" ? (
                      <HeartIcon fill="white" stroke="none" size={20} />
                    ) : (
                      <UserRound fill="white" stroke="none" size={20} />
                    )}
                    <span className="ml-1">{count.length}</span>
                  </div>
                );
              })}
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default NotificationBadge;
