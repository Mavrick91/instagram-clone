"use client";

import { Bookmark, Grid3X3, SquareUser } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useUserInfo } from "@/providers/UserInfoProvider";

type UserProfileTabProps = {
  username: string;
  userProfileId: number;
};

const UserProfileTab = ({ username, userProfileId }: UserProfileTabProps) => {
  const currentUser = useUserInfo();
  const pathname = usePathname().split("/").reverse()[0];

  const tabs = [
    { name: "Posts", path: "posts", icon: <Grid3X3 size={12} /> },
    {
      name: "Tags",
      path: "tagged",
      icon: <SquareUser size={12} />,
    },
  ];

  if (currentUser.id === userProfileId) {
    tabs.splice(1, 0, {
      name: "Saved",
      path: "saved",
      icon: <Bookmark size={12} />,
    });
  }

  const activeTab = tabs.find((tab) => {
    return pathname === tab.path;
  }) || {
    name: "Posts",
  };

  return (
    <div className="relative flex cursor-pointer justify-center gap-14 border-t border-ig-separator">
      {activeTab &&
        tabs.map((tab) => {
          return (
            <Link
              key={tab.name}
              prefetch
              className={cn(
                "py-4 flex text-ig-primary-text gap-2 items-center",
                {
                  "border-t border-ig-primary-text":
                    activeTab.name === tab.name,
                  "text-ig-secondary-text": activeTab.name !== tab.name,
                },
              )}
              href={`/${username}/${tab.path}`}
            >
              {tab.icon}
              <div className="text-sm font-semibold">{tab.name}</div>
            </Link>
          );
        })}
    </div>
  );
};

export default UserProfileTab;
