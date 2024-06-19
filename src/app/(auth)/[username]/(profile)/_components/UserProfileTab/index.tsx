"use client";

import { Bookmark, Grid3X3, SquareUser } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type UserProfileTabProps = {
  username: string;
  currentUserId: number;
  userProfileId: number;
};

const UserProfileTab = ({
  username,
  currentUserId,
  userProfileId,
}: UserProfileTabProps) => {
  const pathname = usePathname().split("/").reverse()[0];

  const tabs = [
    { name: "Posts", path: "posts", icon: <Grid3X3 size={12} /> },
    {
      name: "Tags",
      path: "tagged",
      icon: <SquareUser size={12} />,
    },
  ];

  if (currentUserId === userProfileId) {
    tabs.splice(1, 0, {
      name: "Saved",
      path: "saved",
      icon: <Bookmark size={12} />,
    });
  }

  const activeTab = tabs.find((tab) => pathname === tab.path) || {
    name: "Posts",
  };

  return (
    <div className="relative flex cursor-pointer justify-center gap-14 border-t border-separator">
      {activeTab &&
        tabs.map((tab) => (
          <Link
            href={`/${username}/${tab.path}`}
            prefetch
            key={tab.name}
            className={cn("py-4 flex text-primary-text gap-2 items-center", {
              "border-t border-primary-text": activeTab.name === tab.name,
              "text-secondary": activeTab.name !== tab.name,
            })}
          >
            {tab.icon}
            <div className="text-sm font-semibold">{tab.name}</div>
          </Link>
        ))}
    </div>
  );
};

export default UserProfileTab;
